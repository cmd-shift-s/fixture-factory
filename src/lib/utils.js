export function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function minmax(a, b) {
  return [
    Math.min(a, b),
    Math.max(a, b)
  ]
}

export function splitNumbers(args, delim = ',') {
  return typeof args === 'string'
    ? args.split(delim).map(n => parseInt(n.trim(), 10))
    : [args]
}
