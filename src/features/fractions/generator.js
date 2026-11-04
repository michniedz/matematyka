import { gcd, lcm, simplify } from '../../lib/math.js'

const DENOMINATORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]

let nextTaskId = 1

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

/** Losowy ułamek właściwy w najprostszej postaci. */
function randomFraction(maxDenominator = 10) {
  const possible = DENOMINATORS.filter((d) => d <= maxDenominator)
  const denominator = pick(possible)
  const numerator = randomInt(1, denominator - 1)
  return simplify({ n: numerator, d: denominator })
}

function baseTask(op, left, right) {
  return {
    id: `task-${nextTaskId++}`,
    op,
    left,
    right,
  }
}

function makeAddSubTask(op, left, right) {
  const commonDenominator = lcm(left.d, right.d)
  const scaledLeft = left.n * (commonDenominator / left.d)
  const scaledRight = right.n * (commonDenominator / right.d)
  const numerator =
    op === 'add' ? scaledLeft + scaledRight : scaledLeft - scaledRight
  const answer = simplify({ n: numerator, d: commonDenominator })

  return {
    ...baseTask(op, left, right),
    lcd: commonDenominator,
    scaledLeft,
    scaledRight,
    resN: numerator,
    answer,
    needsSimplify: gcd(numerator, commonDenominator) > 1,
  }
}

function makeMulTask(left, right) {
  const g1 = gcd(left.n, right.d)
  const g2 = gcd(right.n, left.d)

  const workLeft = { n: left.n / g1, d: left.d / g2 }
  const workRight = { n: right.n / g2, d: right.d / g1 }
  const product = {
    n: workLeft.n * workRight.n,
    d: workLeft.d * workRight.d,
  }

  return {
    ...baseTask('mul', left, right),
    g1,
    g2,
    workLeft,
    workRight,
    answer: simplify(product),
  }
}

function makeDivTask(left, right) {
  const reciprocal = { n: right.d, d: right.n }
  const g1 = gcd(left.n, right.n)
  const g2 = gcd(right.d, left.d)

  const workLeft = { n: left.n / g1, d: left.d / g2 }
  const workRight = { n: right.d / g2, d: right.n / g1 }
  const product = {
    n: workLeft.n * workRight.n,
    d: workLeft.d * workRight.d,
  }

  return {
    ...baseTask('div', left, right),
    reciprocal,
    g1,
    g2,
    workLeft,
    workRight,
    answer: simplify(product),
  }
}

function generateAddSub(op) {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const left = randomFraction(10)
    const right = randomFraction(10)

    if (left.d === right.d) continue
    if (left.n * right.d === right.n * left.d) continue

    const commonDenominator = lcm(left.d, right.d)
    if (commonDenominator > 30) continue

    const scaledLeft = left.n * (commonDenominator / left.d)
    const scaledRight = right.n * (commonDenominator / right.d)
    const numerator =
      op === 'add' ? scaledLeft + scaledRight : scaledLeft - scaledRight

    // Wynik ma być ułamkiem właściwym i dodatnim.
    if (numerator <= 0 || numerator >= commonDenominator) continue

    return makeAddSubTask(op, left, right)
  }

  return op === 'add'
    ? makeAddSubTask('add', { n: 1, d: 2 }, { n: 1, d: 3 })
    : makeAddSubTask('sub', { n: 3, d: 4 }, { n: 1, d: 2 })
}

function generateMul() {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const left = randomFraction(10)
    const right = randomFraction(10)

    if (left.n * right.d === right.n * left.d) continue

    const hasCrossCancellation =
      gcd(left.n, right.d) > 1 || gcd(right.n, left.d) > 1

    if (!hasCrossCancellation) continue

    return makeMulTask(left, right)
  }

  return makeMulTask({ n: 2, d: 3 }, { n: 3, d: 4 })
}

function generateDiv() {
  for (let attempt = 0; attempt < 700; attempt += 1) {
    const left = randomFraction(10)
    const right = randomFraction(10)

    // Wynik dzielenia ma być ułamkiem właściwym.
    if (left.n * right.d >= left.d * right.n) continue

    const hasCrossCancellation =
      gcd(left.n, right.n) > 1 || gcd(right.d, left.d) > 1

    if (!hasCrossCancellation) continue

    return makeDivTask(left, right)
  }

  return makeDivTask({ n: 1, d: 2 }, { n: 3, d: 4 })
}

export function generateTask(mode) {
  const operation =
    mode === 'mixed' ? pick(['add', 'sub', 'mul', 'div']) : mode

  switch (operation) {
    case 'sub':
      return generateAddSub('sub')
    case 'mul':
      return generateMul()
    case 'div':
      return generateDiv()
    case 'add':
    default:
      return generateAddSub('add')
  }
}
