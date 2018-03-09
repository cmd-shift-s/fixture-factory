/**
 * String generic methods
 *
 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String
 */
const methods = [
  'substring', 'toLowerCase', 'toUpperCase', 'charAt',
  'charCodeAt', 'indexOf', 'lastIndexOf', 'startsWith', 'endsWith',
  'trim', 'trimLeft', 'trimRight', 'toLocaleLowerCase',
  'toLocaleUpperCase', 'localeCompare', 'match', 'search',
  'replace', 'split', 'substr', 'concat', 'slice',
  'padStart', 'padEnd', 'includes', 'repeat'
]

let str = {}

for (const method of methods) {
  str[method] = (fn, ...args) => String.prototype[method].apply(fn(), args)
}

module.exports = str
