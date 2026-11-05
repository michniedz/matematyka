import { gcd } from '../../lib/math.js'
import {
  addValues,
  divideValues,
  multiplyValues,
  subtractValues,
  valueToDisplayText,
} from './values.js'

export const OP_META = {
  '+': { sign: '+', name: 'dodawanie', priority: 1 },
  '-': { sign: '−', name: 'odejmowanie', priority: 1 },
  '*': { sign: '×', name: 'mnożenie', priority: 2 },
  '/': { sign: '÷', name: 'dzielenie', priority: 2 },
}

let nextNodeId = 1

export function numNode(value) {
  return { type: 'num', value, id: `v${nextNodeId++}` }
}

export function opNode(op, left, right, { group = false, id } = {}) {
  return {
    type: 'op',
    op,
    left,
    right,
    group,
    id: id ?? `o${nextNodeId++}`,
  }
}

export function evaluateNode(node, style) {
  if (node.type === 'num') return node.value

  const kindHint =
    style === 'decimals' ? 'dec' : style === 'fractions' ? 'frac' : undefined
  const left = evaluateNode(node.left, style)
  const right = evaluateNode(node.right, style)

  switch (node.op) {
    case '-':
      return subtractValues(left, right, kindHint)
    case '*':
      return multiplyValues(left, right, kindHint)
    case '/':
      return divideValues(left, right, kindHint)
    case '+':
    default:
      return addValues(left, right, kindHint)
  }
}

export function countOperations(node) {
  if (node.type === 'num') return 0
  return 1 + countOperations(node.left) + countOperations(node.right)
}

function containsOperation(node) {
  return node.type === 'op'
}

/** Lista działań, które można wykonać teraz (oba argumenty są już liczbami). */
export function collectCandidates(root) {
  const candidates = []
  let order = 0

  function walk(node, depth) {
    if (node.type === 'num') return

    walk(
      node.left,
      depth + (node.left.type === 'op' && node.left.group ? 1 : 0),
    )

    const currentOrder = order
    order += 1

    if (node.left.type === 'num' && node.right.type === 'num') {
      candidates.push({
        node,
        depth,
        priority: OP_META[node.op].priority,
        order: currentOrder,
      })
    }

    walk(
      node.right,
      depth + (node.right.type === 'op' && node.right.group ? 1 : 0),
    )
  }

  walk(root, 0)
  return candidates
}

export function detectPhase(candidates) {
  if (candidates.some((candidate) => candidate.depth > 0)) {
    return 'parentheses'
  }

  if (candidates.some((candidate) => candidate.priority === 2)) {
    return 'muldiv'
  }

  return 'addsub'
}

export function pickCandidate(candidates, phase) {
  let pool = candidates

  if (phase === 'parentheses') {
    const grouped = candidates.filter((candidate) => candidate.depth > 0)
    if (grouped.length) pool = grouped
  } else if (phase === 'muldiv') {
    pool = candidates.filter((candidate) => candidate.priority === 2)
  } else {
    pool = candidates.filter((candidate) => candidate.priority === 1)
  }

  return [...pool].sort((a, b) => {
    if (phase === 'parentheses' && a.depth !== b.depth) {
      return b.depth - a.depth
    }
    if (a.priority !== b.priority) return b.priority - a.priority
    return a.order - b.order
  })[0]
}

/** Podmienia wybrane działanie na jego wynik. */
export function reduceNode(node, targetId) {
  if (node.type === 'num') return node

  if (node.id === targetId) {
    return numNode(evaluateNode(node))
  }

  return opNode(
    node.op,
    reduceNode(node.left, targetId),
    reduceNode(node.right, targetId),
    { group: node.group, id: node.id },
  )
}

export function nodeToText(node) {
  if (node.type === 'num') return valueToDisplayText(node.value)

  const left = nodeToText(node.left)
  const right = nodeToText(node.right)
  const sign = OP_META[node.op].sign

  if (node.group) return `(${left} ${sign} ${right})`

  return `${left} ${sign} ${right}`
}

/** Sprawdza, czy w wyrażeniu jest jeszcze jakieś działanie do wykonania. */
export function hasOperations(node) {
  return containsOperation(node)
}

/** Największy wspólny dzielnik licznika i mianownika — do komunikatów. */
export function commonDivisor(value) {
  return gcd(value.n, value.d)
}
