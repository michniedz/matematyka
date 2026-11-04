import { simplify } from '../../lib/math.js'

/**
 * Liczby w zadaniach geometrycznych są dodatnie i mają najwyżej dwa miejsca
 * po przecinku. Trzymamy je jako zwykłe liczby, a do sprawdzania odpowiedzi
 * zamieniamy na dokładne ułamki.
 */

export function formatNumber(value) {
  const rounded = Math.round(value * 100) / 100
  return String(rounded).replace('.', ',')
}

export function rationalFromNumber(value) {
  const scaled = Math.round(value * 100)
  return simplify({ n: scaled, d: 100 })
}

export function rationalToText(value) {
  return formatNumber(value.n / value.d)
}

export function formatDimension(key, value, approx = false) {
  return `${key} ${approx ? '≈' : '='} ${formatNumber(value)} cm`
}
