import moment from 'moment'

/**
 * date format
 *
 * @param {function} fn
 * @param {string} format
 */
export function date(fn, format) {
  const str = fn()
  const date = moment(new Date(str))
  return date.isValid()
    ? date.format(format)
    : str
}
