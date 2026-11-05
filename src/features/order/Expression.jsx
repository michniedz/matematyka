import { Fraction } from '../../components/Fraction.jsx'
import { MixedNumber } from '../../components/MixedNumber.jsx'
import { OP_META, nodeToText } from './expression.js'
import { formatDecimal, toMixed } from './values.js'

export function NumberToken({ value, size = 'md', tone = '' }) {
  if (value.kind === 'frac' && value.d !== 1) {
    const mixed = toMixed(value)

    if (mixed) {
      return (
        <MixedNumber
          whole={mixed.whole}
          n={mixed.n}
          d={mixed.d}
          size={size}
          tone={tone || undefined}
        />
      )
    }

    return <Fraction n={value.n} d={value.d} size={size} tone={tone || undefined} />
  }

  const text =
    value.kind === 'dec'
      ? formatDecimal(value) ?? `${value.n}/${value.d}`
      : String(value.n)
  const classes = [
    'expr__num',
    `expr__num--${size}`,
    tone ? `expr__num--${tone}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{text}</span>
}

/**
 * Ułamek bez zamiany na liczbę mieszaną. Używamy go w mnożeniu przez
 * odwrotność, gdzie wygodniej zostać przy ułamkach niewłaściwych.
 */
export function FractionTerm({ value, size = 'md', tone = '' }) {
  if (value.d === 1) {
    return <NumberToken value={value} size={size} tone={tone} />
  }

  return <Fraction n={value.n} d={value.d} size={size} tone={tone || undefined} />
}

function renderNode(node, highlightId, size, tone) {
  if (node.type === 'num') {
    return <NumberToken value={node.value} size={size} tone={tone} />
  }

  const meta = OP_META[node.op]
  const isTarget = node.id === highlightId

  return (
    <span className={`expr__group${isTarget ? ' is-target' : ''}`}>
      {node.group && (
        <span className="expr__paren" aria-hidden="true">
          (
        </span>
      )}
      {renderNode(node.left, highlightId, size, tone)}
      <span className="expr__op">{meta.sign}</span>
      {renderNode(node.right, highlightId, size, tone)}
      {node.group && (
        <span className="expr__paren" aria-hidden="true">
          )
        </span>
      )}
    </span>
  )
}

export function Expression({
  node,
  size = 'md',
  highlightId = null,
  tone = '',
  className = '',
}) {
  return (
    <span
      className={`expr expr--${size}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={nodeToText(node)}
    >
      {renderNode(node, highlightId, size, tone)}
    </span>
  )
}
