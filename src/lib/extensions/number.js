import * as utils from '@/lib/utils'

/**
 * start부터 end 까지 inc 씩 증가 시킨 값들을 리턴한다.
 *
 * @param {Array} args
 * @return {string}
 */
export function range(args) {
  let [start, end, inc = 1] = utils.splitNumbers(args)

  if(!end) {
    end = start
    start = 1
  }

  const [min, max] = utils.minmax(start, end)

  let i = min - inc
  const length = Math.abs(max - min)/inc + 1
  const arr = Array.from({length}, () => i += inc)

  if (start > end) arr.reverse()
  return arr.join(',')
}

/**
 * min과 max 사이의 숫자를 랜덤하게
 * cnt 개수 만큼 배열을 생성해서 리턴한다.
 *
 * @param {Array} args
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
