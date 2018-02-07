import { fake } from 'faker'
import * as utils from './utils'

export function makeMocks(query, cnt) {
  return Array.from({length: cnt}, () => fake(query))
}

export function randomNumber(min, max, cnt) {
  return Array.from({length: cnt}, () => utils.getRandomArbitrary(min, max))
}

export function range(a, b) {
  const [min, max] = utils.minmax(a, b)

  let i = min
  const length = Math.abs(max - min) + 1
  const arr = Array.from({length}, () => i++)

  if (a > b) arr.reverse()
  return arr
}

export function fakeQuery(query, cnt) {
  if (/{{\w+\.\w+}}:(\d)/.test(query)) {
    const regexp = new RegExp(/({{\w+\.\w+}}):(\d)/g)
    let m, q = query;
    const mocks = []
    while ((m = regexp.exec(query))) {
      q = q.replace(m[0], '%s')
      mocks.push((() => {
        const len = parseInt(m[2], 10)
        const items = makeMocks(m[1], len)
        return () => items[utils.getRandomArbitrary(0, len)]
      })())
    }
    const results = []
    while (cnt -- > 0) {
      results.push(mocks.reduce((str, mock) => str.replace('%s', mock), fake(q)))
    }
    return results
  } else {
    return makeMocks(query, cnt)
  }
}
