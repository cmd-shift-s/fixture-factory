import * as utils from '@/lib/utils'

/**
 * 시작값으로 부터 차례대로 증가값을 더한 값을 리턴한다.
 *
 * @example num.range(start, length, inc)
 * @return {Array}
 */
export function range(args) {
  let [start, length, inc = 1] = utils.splitNumbers(args)
  if (!length) {
    length = start
    start = 1
  }

  // 시작값 부터 시작하기 위해서 빼고 시작
  start -= inc
  return Array.from({length}, () => start += inc).join(',')
}

/**
 * min과 max 사이의 숫자를 랜덤하게
 * cnt 개수 만큼 배열을 생성해서 리턴한다.
 *
 * @example num.random(min, max)
 * @return {string}
 */
export function random(args) {
  let [min, max] = utils.splitNumbers(args)
  if (!max) {
    max = min
    min = 0
  }

  // max값 까지 포함하기 위해서 추가
  if (max > 0) {
    max++
  } else {
    max--
  }

  return utils.getRandomArbitrary(min, max)
}
