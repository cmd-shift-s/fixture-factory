import faker from 'faker'
import * as plugins from './plugins'
import * as utils from './utils'

// install addons
require('./extensions')(faker)

/**
 * 파라메터로 넘어온 query를 cnt 개수 만큼의 fake 결과를 리턴한다.
 *
 * @param {string} query - Fake query
 * @param {number} cnt - Array length
 * @return {Array}
 */
export function makeMocks(query, cnt) {
  return Array.from({length: cnt}, () => faker.fake(query))
}

/**
 * Query를 파싱해서 cnt 개수 만큼의 결과를 배열로 리턴한다.
 *
 * @param {string} query - Fake query
 * @param {number} count - Array length
 * @return {Array}
 */
export function fake(query, count) {

  // @exception Invalid plugin
  const result = parseQuery(query)

  const fn = result
    // @exception Invalid module or method
    ? () => result.map(q => typeof q === 'function'?q():q).join('')
    : () => query // result가 없을 경우

  return Array.from({length: count}, fn)
}

/**
 * query에서 fake query를 찾아서
 * 일반 문자열과 분리한 결과를 배열로 리턴한다.
 *
 * @exception InvalidPlugin
 * @param {string} query
 * @return {Array}
 */
function parseQuery(query) {

  let start = query.search('{{')
  let end = query.search('}}')

  if (!~start || !~end) {
    return
  }

  // Query 파싱 결과를 저장
  const result = []

  if (start !== 0) {
    // {{ 로 시작하지 않을 경우
    // 앞 문자열을 저장
    result.push(query.substr(0, start))
  }

  while(~end) {
    // {{ }} 는 제거된 fake query만 보냄
    result.push(parseFake(query.substring(start + 2, end).trim()))

    // }} 까지 계산하기 위해서
    end += 2

    start = query.indexOf('{{', end)
    if (start !== -1 && start !== end) {
      // 다음 fake 사이의 문자열 저장
      result.push(query.substring(end, start))
    } else if (start === -1 && end < query.length) {
      // 더 이상 시작 값이 없을 경우 남은 문자열 저장
      result.push(query.substring(end))
      break;
    }

    end = query.indexOf('}}', end)
  }

  // 시작 값이 있는데 종료 된 경우 남은 문자열 저장
  if (~start) {
    result.push(query.substring(start))
  }

  return result
}

/**
 * fake method를 파싱해서 함수를 리턴한다.
 *
 * - 문자열: 문자열을 그대로 리턴한다.
 * - 배열: 아이템을 순차적으로 하나씩 리턴한다.
 * - 나머지는 fake함수를 호출한다.
 *
 * @param {string} method
 * @return {function}
 */
function parseFakeMethod(method) {
  let fn
  if (/^(\'|\").*(\'|\")$/.test(method)) {
    // string
    const str = method.replace(/^[\'\"]/, '').replace(/[\'\"]$/, '')
    fn = () => str
  } else if (/^\[.*\]$/.test(method)) {
    // array
    // 하나씩 순차적으로 리턴한다.
    let i = 0;
    const arr = JSON.parse(method)
    fn = () => {
      if (i >= arr.length) i = 0
      return arr[i++]
    }
  } else {
    // fake method
    fn = () => faker.fake(`{{${method}}}`)
  }
  return fn
}

/**
 * fake query에서 plugin을 찾아서 적용한 함수를 리턴한다.
 *
 * @param {string} query
 * @return {function}
 */
function parseFake(query) {

  // plugin이 있는지 검사
  let idx = query.indexOf('|')
  if (!~idx) {
    // plugin이 없을 경우 fake로 리턴
    return parseFakeMethod(query) // () => faker.fake(`{{${query}}}`)
  }

  // fake string과 plugin을 분리
  const pluginMehotds = query.substring(idx + 1)

  // fake method
  let fn = parseFakeMethod(query.substring(0, idx).trim())

  const matchers = pluginMehotds.split('|')
  for (const matcher of matchers) {
    const method = /([^\(]+)/.exec(matcher)[1].trim()
    const params = /\((.*)\)/.exec(matcher)[1].split(',').map(str => {
      // trim과 앞/뒤 \'\" 제거
      const s = str.trim().replace(/^[\'\"]/, '').replace(/[\'\"]$/, '')
      if (/\d+/.test(s)) {
        // Number
        return parseInt(s, 10)
      } else if (/^\[.*\]$/.test(s)) {
        // Array
        return JSON.parse(s)
      } else if (/^\/(.*?)\/[gimy]*$/.test(s)) {
        // Regexp
        const match = s.match(new RegExp('^/(.*?)/([gimy]*)$'));
        return new RegExp(match[1], match[2]);
      } else {
        return s
      }
    })

    // 알 수 없는 method일 경우 예외 발생
    if (!plugins.hasOwnProperty(method)) {
      throw new Error(`Invalid plugin: ${method}`)
    }
    fn = plugins[method](fn, ...params)
  }

  return fn
}
