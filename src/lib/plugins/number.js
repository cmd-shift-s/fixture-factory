import * as utils from '@/lib/utils'

/**
 * start부터 end 까지 inc 씩 증가 시킨 값들을 리턴한다.
 *
 * @param {function} fn - return array
 * @return {Array}
 */
export function range(fn) {
  const [start, end, inc = 1] = fn()
  const [min, max] = utils.minmax(start, end)

  let i = min - inc
  const length = Math.abs(max - min) + 1
  const arr = Array.from({length}, () => i += inc)

  if (start > end) arr.reverse()
  return arr
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
