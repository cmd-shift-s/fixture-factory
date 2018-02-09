import moment from 'moment'

/**
 * date format
 *
 * @param {function} fn
 * @param {string} format
 */
export function date(fn, format) {
  return () => moment(new Date(fn())).format(format)
}
