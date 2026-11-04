/**
 * Podstawowe działania na liczbach całkowitych i ułamkach.
 * Wszystkie funkcje zakładają dodatni mianownik.
 */

export function gcd(a, b) {
  let x = Math.abs(Math.trunc(a))
  let y = Math.abs(Math.trunc(b))

  while (y) {
    const rest = x % y
    x = y
    y = rest
  }

  return x
}

export function lcm(a, b) {
  if (a === 0 || b === 0) return 0
  return Math.abs(a * b) / gcd(a, b)
}

export function simplify({ n, d }) {
  const divisor = gcd(n, d) || 1
  return { n: n / divisor, d: d / divisor }
}

export function isEquivalent(a, b) {
  return a.n * b.d === b.n * a.d
}

export function denominators(n, count = 6) {
  return Array.from({ length: count }, (_, index) => n * (index + 1))
}

export function divisors(n) {
  const result = []

  for (let i = 1; i <= n; i += 1) {
    if (n % i === 0) result.push(i)
  }

  return result
}
