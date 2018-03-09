import { getRandomArbitrary } from '@/lib/utils'

export function pick(fn, length) {
  const items = Array.from({length}, fn)
  return items[getRandomArbitrary(0, length)]
}
