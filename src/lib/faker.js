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
 * a부터 b 까지 inc 씩 증가 시킨 값들을 리턴한다.
 *
 * @param {number} a
 * @param {number} b
 * @return {Array}
 */
export function range(a, b, inc = 1) {
  const [min, max] = utils.minmax(a, b)

  let i = min - inc
  const length = Math.abs(max - min) + 1
  const arr = Array.from({length}, () => i += inc)

  if (a > b) arr.reverse()
  return arr
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

  //
  const result = []

  if (start !== 0) {
    // {{ 로 시작하지 않을 경우
    // 앞 문자열을 저장
    result.push(query.substr(0, start))
  }

  //
  const fakes = []

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
 * @return {Function}
 */
function parseFake(query) {

  // plugin이 있는지 검사
  let idx = query.indexOf('|')
  if (!~idx) {
    // plugin이 없을 경우 fake로 리턴
    return () => faker.fake(query)
  }

  // fake string과 plugin을 분리
  const pluginStr = query.substring(idx, query.length - 2)

  // fake function
  let fn = () => faker.fake(query.replace(pluginStr, ''))

  // 첫번째 문자가 '|' 라서 빈문자열로 된 첫번째 아이템을 버린다.
  const matchers = pluginStr.split('|').slice(1)
  for (const matcher of matchers) {
    const method = /([^\(]+)/.exec(matcher)[1]
    const params = /\((.*)\)/g.exec(matcher)[1].split(',').map(s => s.trim())
    fn = plugins[method](fn, ...params)
  }

  return fn
}
