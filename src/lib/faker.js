import faker from 'faker'
import * as plugins from './plugins'
import * as utils from './utils'

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
 * min과 max 사이의 숫자를 랜덤하게
 * cnt 개수 만큼 배열을 생성해서 리턴한다.
 *
 * @param {number} min - minimum
 * @param {number} max - maximum
 * @param {number} cnt - Array length
 * @return {Array}
 */
export function randomNumber(min, max, cnt) {
  return Array.from({length: cnt}, () => utils.getRandomArbitrary(min, max))
}

/**
 * Query를 파싱해서 cnt 개수 만큼의 결과를 배열로 리턴한다.
 *
 * @param {string} query - Fake query
 * @param {number} cnt - Array length
 * @return {Array}
 */
export function fake(query, cnt) {

  const result = parseQuery(query)
  if (!result) return [query]

  return Array.from({length: cnt}, () => result.map(q => typeof q === 'function'?q():q).join(''))
}

/**
 * query에서 fake query를 찾아서
 * 일반 문자열과 분리한 결과를 배열로 리턴한다.
 *
 * @param {string} query
 * @return {Array}
 */
function parseQuery(query) {

  let start = query.search('{{')
  let end = query.search('}}')

  if (!~start && !~end) {
    return
  }

  // Query 파싱 결과를 저장
  const result = []

  if (start !== 0) {
    // {{ 로 시작하지 않을 경우
    // 앞 문자열을 저장
    result.push(query.substr(0, start))
  }

  while(start !== end) {
    // }} 까지 계산하기 위해서
    end += 2

    // fake
    result.push(parseFake(query.substring(start, end)))

    start = query.indexOf('{{', end)
    if (start !== -1) {
      // 다음 fake 사이의 문자열 저장
      result.push(query.substring(end, start))
    }

    end = query.indexOf('}}', end)
  }

  return result
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
    return () => faker.fake(query)
  }

  // fake string과 plugin을 분리
  const pluginMehotds = query.substring(idx, query.length - 2)

  // fake function
  const fakeMethod = query.replace(pluginMehotds, '')

  let fn
  const fakeStr = fakeMethod.slice(2, -2).trim()
  if (/^(\'|\").*(\'|\")$/.test(fakeStr)) {
    // string
    const str = fakeStr.replace(/^[\'\"]/, '').replace(/[\'\"]$/, '')
    fn = () => str
  // } else if (/^\[.*\]$/.test(fakeStr)) {
  //   // array
  //   const arr = JSON.parse(fakeStr)
  //   fn = () => arr
  } else {
    // fake method
    fn = () => faker.fake(fakeMethod)
  }

  // 첫번째 문자가 '|' 라서 빈문자열로 된 첫번째 아이템을 버린다.
  const matchers = pluginMehotds.split('|').slice(1)
  for (const matcher of matchers) {
    const method = /([^\(]+)/.exec(matcher)[1].trim()
    const params = /\((.*)\)/g.exec(matcher)[1].split(',').map(str => {
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
        var match = s.match(new RegExp('^/(.*?)/([gimy]*)$'));
        return new RegExp(match[1], match[2]);
      } else {
        return s
      }
    })
    fn = plugins[method](fn, ...params)
  }

  return fn
}
