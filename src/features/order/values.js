import { simplify } from '../../lib/math.js'

/**
 * Liczby w zadaniach trzymamy jako dokładne ułamki { n, d }.
 * Pole `kind` mówi tylko, jaką postać warto pokazać uczniowi:
 * liczbę całkowitą, dziesiętną albo ułamek zwykły.
 */

export function valueFromRational(n, d, kindHint = 'frac') {
  const rational = simplify({ n, d })

  if (rational.d === 1) {
    return { ...rational, kind: 'int' }
  }

  return { ...rational, kind: kindHint === 'dec' ? 'dec' : 'frac' }
}

export function intValue(n) {
  return { n, d: 1, kind: 'int' }
}

export function fractionValue(n, d) {
  return valueFromRational(n, d, 'frac')
}

export function decimalValue(number) {
  const text = String(number)
  const [whole, fraction = ''] = text.split('.')
  return valueFromRational(
    Number(`${whole}${fraction}`),
    10 ** fraction.length,
    'dec',
  )
}

function mergeKind(a, b) {
  return a.kind === 'dec' || b.kind === 'dec' ? 'dec' : 'frac'
}

export function addValues(a, b, kindHint) {
  return valueFromRational(
    a.n * b.d + b.n * a.d,
    a.d * b.d,
    kindHint ?? mergeKind(a, b),
  )
}

export function subtractValues(a, b, kindHint) {
  return valueFromRational(
    a.n * b.d - b.n * a.d,
    a.d * b.d,
    kindHint ?? mergeKind(a, b),
  )
}

export function multiplyValues(a, b, kindHint) {
  return valueFromRational(
    a.n * b.n,
    a.d * b.d,
    kindHint ?? mergeKind(a, b),
  )
}

export function divideValues(a, b, kindHint) {
  return valueFromRational(
    a.n * b.d,
    a.d * b.n,
    kindHint ?? mergeKind(a, b),
  )
}

export function valuesEqual(a, b) {
  return a.n * b.d === b.n * a.d
}

/** Zamienia ułamek niewłaściwy na liczbę mieszaną, np. 13/4 → 3 i 1/4. */
export function toMixed(value) {
  if (value.d === 1 || value.n <= value.d) return null

  const whole = Math.floor(value.n / value.d)
  const n = value.n % value.d

  if (n === 0) return null

  return { whole, n, d: value.d }
}

export function mixedToText(parts) {
  return `${parts.whole} i ${parts.n}/${parts.d}`
}

export function isPositive(value) {
  return value.n > 0
}

/** Ile miejsc po przecinku potrzeba do dokładnego zapisu liczby. */
export function decimalPlaces(value) {
  if (value.d === 1) return 0

  let rest = value.d
  for (const prime of [2, 5]) {
    while (rest % prime === 0) rest /= prime
  }

  if (rest !== 1) return Infinity

  for (let places = 1; places <= 6; places += 1) {
    if (10 ** places % value.d === 0) return places
  }

  return Infinity
}

/** Zapis z przecinkiem, np. 2,5. Dla niekończących się ułamków zwraca null. */
export function formatDecimal(value) {
  const places = decimalPlaces(value)
  if (!Number.isFinite(places)) return null

  if (places === 0) return String(value.n)

  const scaled = value.n * (10 ** places / value.d)
  const digits = String(scaled).padStart(places + 1, '0')
  const whole = digits.slice(0, -places)
  const fraction = digits.slice(-places).replace(/0+$/, '')

  return fraction ? `${whole},${fraction}` : whole
}

export function valueToText(value) {
  if (value.kind === 'dec') {
    return formatDecimal(value) ?? `${value.n}/${value.d}`
  }

  if (value.kind === 'frac' && value.d !== 1) {
    return `${value.n}/${value.d}`
  }

  return String(value.n)
}
