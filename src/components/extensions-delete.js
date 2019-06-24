export const isNumber = val => !isNaN(val)

export const coalesce = (...params) => {
  for (let param of params) {
    if (param !== undefined && param !== null && param !== NaN) {
      return param
    }
  }
}

export const numFunc = {
  toCurrency: (number, n = 2) => {
    if (number !== 0 && !number) { return NaN }
    var re = '\\d(?=(\\d{3})+' + (n > 0 ? '\\.' : '$') + ')'
    return '$ ' + number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,')
  },
  toFixed: (number, n = 2) => {
    if (number !== 0 && !number) { return NaN }
    var re = '\\d(?=(\\d{3})+' + (n > 0 ? '\\.' : '$') + ')'
    return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,')
  }
}

export const momentExt = {
  isSame: (d1, d2) => (!d1 && !d2) || (d1 && d2 && d1.isSame(d2, 'day')),
  isBefore: (d1, d2) => (!d1 || !d2) ? undefined : d1.isBefore(d2),
  isAfter: (d1, d2) => (!d1 || !d2) ? undefined : d1.isAfter(d2),
}