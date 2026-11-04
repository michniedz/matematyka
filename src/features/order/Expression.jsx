import { Fraction } from '../../components/Fraction.jsx'
import { OP_META, nodeToText } from './expression.js'
import { formatDecimal } from './values.js'

export function NumberToken({ value, size = 'md', tone = '' }) {
  if (value.kind === 'frac' && value.d !== 1) {
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
