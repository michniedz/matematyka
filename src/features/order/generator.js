import {
  collectCandidates,
  countOperations,
  detectPhase,
  evaluateNode,
  numNode,
  opNode,
  pickCandidate,
  reduceNode,
} from './expression.js'
import {
  decimalPlaces,
  decimalValue,
  fractionValue,
  intValue,
} from './values.js'

const FRACTION_POOL = [
  [1, 2],
  [1, 3],
  [2, 3],
  [1, 4],
  [3, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
  [1, 6],
  [5, 6],
  [1, 8],
  [3, 8],
  [5, 8],
  [7, 8],
]
const DECIMAL_POOL = [
  0.5, 1.5, 2.5, 3.5, 0.2, 0.4, 0.6, 0.8, 1.2, 2.4, 0.25, 0.75, 1.25, 1.75,
]

const SHAPES = [
  // Dwa działania
  { size: 3, build: ([a, b, c]) => opNode('+', a, opNode('*', b, c)) },
  { size: 3, build: ([a, b, c]) => opNode('+', opNode('*', a, b), c) },
  { size: 3, build: ([a, b, c]) => opNode('-', a, opNode('*', b, c)) },
  { size: 3, build: ([a, b, c]) => opNode('-', opNode('*', a, b), c) },
  { size: 3, build: ([a, b, c]) => opNode('+', a, opNode('/', b, c)) },
  { size: 3, build: ([a, b, c]) => opNode('+', opNode('/', a, b), c) },
  { size: 3, build: ([a, b, c]) => opNode('/', opNode('*', a, b), c) },
  { size: 3, build: ([a, b, c]) => opNode('*', opNode('/', a, b), c) },
  { size: 3, build: ([a, b, c]) => opNode('+', opNode('+', a, b), c) },
  { size: 3, build: ([a, b, c]) => opNode('+', opNode('-', a, b), c) },
  { size: 3, build: ([a, b, c]) => opNode('-', opNode('+', a, b), c) },
  {
    size: 3,
    build: ([a, b, c]) =>
      opNode('*', opNode('+', a, b, { group: true }), c),
  },
  {
    size: 3,
    build: ([a, b, c]) =>
      opNode('*', opNode('-', a, b, { group: true }), c),
  },
  {
    size: 3,
    build: ([a, b, c]) =>
      opNode('*', a, opNode('+', b, c, { group: true })),
  },
  {
    size: 3,
    build: ([a, b, c]) =>
      opNode('*', a, opNode('-', b, c, { group: true })),
  },
  {
    size: 3,
    build: ([a, b, c]) =>
      opNode('/', opNode('+', a, b, { group: true }), c),
  },
  {
    size: 3,
    build: ([a, b, c]) =>
      opNode('/', a, opNode('+', b, c, { group: true })),
  },
  {
    size: 3,
    build: ([a, b, c]) =>
      opNode('/', a, opNode('-', b, c, { group: true })),
  },
  {
    size: 3,
    build: ([a, b, c]) =>
      opNode('-', a, opNode('+', b, c, { group: true })),
  },
  {
    size: 3,
    build: ([a, b, c]) =>
      opNode('+', a, opNode('-', b, c, { group: true })),
  },

  // Trzy działania
  {
    size: 4,
    build: ([a, b, c, d]) =>
      opNode('+', opNode('*', a, b), opNode('*', c, d)),
  },
  {
    size: 4,
    build: ([a, b, c, d]) =>
      opNode('-', opNode('*', a, b), opNode('*', c, d)),
  },
  {
    size: 4,
    build: ([a, b, c, d]) =>
      opNode('-', opNode('+', a, opNode('*', b, c)), d),
  },
  {
    size: 4,
    build: ([a, b, c, d]) =>
      opNode('+', opNode('*', opNode('+', a, b, { group: true }), c), d),
  },
  {
    size: 4,
    build: ([a, b, c, d]) =>
      opNode('-', opNode('*', opNode('+', a, b, { group: true }), c), d),
  },
  {
    size: 4,
    build: ([a, b, c, d]) =>
      opNode('-', opNode('*', a, opNode('+', b, c, { group: true })), d),
  },
  {
    size: 4,
    build: ([a, b, c, d]) =>
      opNode('+', opNode('/', a, b), opNode('*', c, d)),
  },
  {
    size: 4,
    build: ([a, b, c, d]) =>
      opNode('+', opNode('/', opNode('+', a, b, { group: true }), c), d),
  },
  {
    size: 4,
    build: ([a, b, c, d]) =>
      opNode('-', a, opNode('/', opNode('+', b, c, { group: true }), d)),
  },
]

let nextTaskId = 1

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomInt(max) {
  return 1 + Math.floor(Math.random() * max)
}

function randomValue(style) {
  if (style === 'fractions') {
    if (Math.random() < 0.62) {
      const [n, d] = pick(FRACTION_POOL)
      return fractionValue(n, d)
    }
    return intValue(randomInt(8))
  }

  if (Math.random() < 0.48) {
    return decimalValue(pick(DECIMAL_POOL))
  }
  return intValue(randomInt(12))
}

function ensureStyle(values, style) {
  const hasExpected =
    style === 'fractions'
      ? values.some((value) => value.kind === 'frac')
      : values.some((value) => value.kind === 'dec')

  if (hasExpected) return values

  const index = Math.floor(Math.random() * values.length)
  values[index] =
    style === 'fractions'
      ? fractionValue(...pick(FRACTION_POOL))
      : decimalValue(pick(DECIMAL_POOL))

  return values
}

function traceSolution(ast, style) {
  const steps = []
  let current = ast

  for (let guard = 0; guard < 12; guard += 1) {
    if (current.type === 'num') {
      return { steps, answer: current.value }
    }

    const candidates = collectCandidates(current)
    if (!candidates.length) return null

    const phase = detectPhase(candidates)
    const target = pickCandidate(candidates, phase)
    const value = evaluateNode(target.node, style)

    steps.push({ node: target.node, phase, value })
    current = reduceNode(current, target.node.id)
  }

  return null
}

function acceptedValue(value, style) {
  if (value.n <= 0) return false

  if (style === 'fractions') {
    return value.d <= 24 && value.n <= 120
  }

  return Number.isFinite(decimalPlaces(value)) && decimalPlaces(value) <= 2
}

function hasTrivialOperation(node) {
  if (node.type === 'num') return false

  const left = evaluateNode(node.left)
  const right = evaluateNode(node.right)
  const leftIsOne = left.d === 1 && left.n === 1
  const rightIsOne = right.d === 1 && right.n === 1

  if (node.op === '*' && (leftIsOne || rightIsOne)) return true
  if (node.op === '/' && rightIsOne) return true

  return hasTrivialOperation(node.left) || hasTrivialOperation(node.right)
}

function validate(ast, style) {
  if (hasTrivialOperation(ast)) return false

  const solution = traceSolution(ast, style)
  if (!solution || !solution.steps.length) return false

  if (!solution.steps.every((step) => acceptedValue(step.value, style))) {
    return false
  }

  const { answer } = solution
  if (!acceptedValue(answer, style)) return false

  if (style === 'fractions') {
    if (answer.n > 4 * answer.d) return false
  } else if (answer.n / answer.d > 200) {
    return false
  }

  return true
}

function makeTask(style, ast, answer) {
  return {
    id: `order-${nextTaskId++}`,
    style,
    ast,
    answer,
    opCount: countOperations(ast),
  }
}

function fallbackTask(style) {
  const ast =
    style === 'fractions'
      ? opNode(
          '+',
          numNode(intValue(2)),
          opNode('*', numNode(fractionValue(1, 2)), numNode(intValue(4))),
        )
      : opNode(
          '+',
          numNode(decimalValue(2.5)),
          opNode('*', numNode(decimalValue(1.5)), numNode(intValue(2))),
        )

  const solution = traceSolution(ast, style)
  return makeTask(style, ast, solution.answer)
}

export function generateTask(mode = 'mixed') {
  const style =
    mode === 'fractions' || mode === 'decimals'
      ? mode
      : pick(['fractions', 'decimals'])

  for (let attempt = 0; attempt < 600; attempt += 1) {
    const shape = pick(SHAPES)
    const values = ensureStyle(
      Array.from({ length: shape.size }, () => randomValue(style)),
      style,
    )
    const ast = shape.build(values.map(numNode))
    const solution = traceSolution(ast, style)

    if (!solution || !validate(ast, style)) continue

    return makeTask(style, ast, solution.answer)
  }

  return fallbackTask(style)
}
