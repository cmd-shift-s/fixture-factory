import moment from 'moment'

export function date(fn, format) {
  return () => moment(new Date(fn())).format(format)
}
