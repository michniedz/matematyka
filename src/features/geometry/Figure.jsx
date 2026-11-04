import { formatDimension } from './values.js'

function Label({ children, x, y, anchor = 'middle' }) {
  return (
    <text
      className="figure-svg__label"
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
    >
      {children}
    </text>
  )
}

function shapeProps(className = 'figure-svg__shape') {
  return { className }
}

function RightAngle({ points }) {
  return <polyline className="figure-svg__right-angle" points={points} />
}

function renderSquare(dims) {
  return (
    <>
      <rect {...shapeProps()} x="70" y="35" width="110" height="110" rx="4" />
      {dims.a !== undefined && <Label x="125" y="165">a</Label>}
    </>
  )
}

function renderRectangle(dims) {
  return (
    <>
      <rect {...shapeProps()} x="55" y="45" width="130" height="90" rx="4" />
      {dims.a !== undefined && <Label x="120" y="158">a</Label>}
      {dims.b !== undefined && <Label x="42" y="90" anchor="end">b</Label>}
    </>
  )
}

function renderTriangle(dims) {
  return (
    <>
      <polygon
        {...shapeProps()}
        points="60,145 180,145 120,40"
      />
      {dims.h !== undefined && (
        <>
          <line className="figure-svg__dash" x1="120" y1="40" x2="120" y2="145" />
          <Label x="130" y="95">h</Label>
        </>
      )}
      {dims.a !== undefined && <Label x="120" y="166">a</Label>}
      {dims.b !== undefined && <Label x="82" y="98">b</Label>}
      {dims.c !== undefined && <Label x="158" y="98">c</Label>}
    </>
  )
}

function renderRightTriangle(dims) {
  return (
    <>
      <polygon {...shapeProps()} points="60,145 180,145 60,45" />
      <RightAngle points="60,130 75,130 75,145" />
      {dims.a !== undefined && <Label x="120" y="166">a</Label>}
      {dims.b !== undefined && <Label x="46" y="95" anchor="end">b</Label>}
      {dims.c !== undefined && <Label x="130" y="88">c</Label>}
    </>
  )
}

function renderEquilateralTriangle(dims) {
  return (
    <>
      <polygon {...shapeProps()} points="120,30 55,145 185,145" />
      {dims.h !== undefined && (
        <>
          <line className="figure-svg__dash" x1="120" y1="30" x2="120" y2="145" />
          <Label x="130" y="92">h</Label>
        </>
      )}
      {dims.a !== undefined && <Label x="120" y="166">a</Label>}
    </>
  )
}

function renderIsoscelesTriangle(dims) {
  return (
    <>
      <polygon {...shapeProps()} points="120,30 60,145 180,145" />
      {dims.h !== undefined && (
        <>
          <line className="figure-svg__dash" x1="120" y1="30" x2="120" y2="145" />
          <Label x="130" y="92">h</Label>
        </>
      )}
      {dims.a !== undefined && <Label x="120" y="166">a</Label>}
      {dims.b !== undefined && <Label x="84" y="92">b</Label>}
    </>
  )
}

function renderRhombus(dims) {
  return (
    <>
      <polygon {...shapeProps()} points="120,25 200,95 120,165 40,95" />
      {dims.e !== undefined && (
        <>
          <line className="figure-svg__dash" x1="40" y1="95" x2="200" y2="95" />
          <Label x="120" y="84">e</Label>
        </>
      )}
      {dims.f !== undefined && (
        <>
          <line className="figure-svg__dash" x1="120" y1="25" x2="120" y2="165" />
          <Label x="130" y="68">f</Label>
        </>
      )}
      {dims.a !== undefined && <Label x="170" y="55">a</Label>}
    </>
  )
}

function renderParallelogram(dims) {
  return (
    <>
      <polygon {...shapeProps()} points="50,145 150,145 190,50 90,50" />
      {dims.h !== undefined && (
        <>
          <line className="figure-svg__dash" x1="90" y1="50" x2="90" y2="145" />
          <Label x="100" y="98">h</Label>
        </>
      )}
      {dims.a !== undefined && <Label x="100" y="166">a</Label>}
      {dims.b !== undefined && <Label x="58" y="102" anchor="end">b</Label>}
    </>
  )
}

function renderTrapezoid(dims, isosceles = false) {
  const points = isosceles
    ? '40,145 200,145 160,50 80,50'
    : '40,145 200,145 180,50 80,50'

  return (
    <>
      <polygon {...shapeProps()} points={points} />
      {dims.h !== undefined && (
        <>
          <line className="figure-svg__dash" x1="120" y1="50" x2="120" y2="145" />
          <Label x="130" y="98">h</Label>
        </>
      )}
      {dims.a !== undefined && <Label x="120" y="166">a</Label>}
      {dims.b !== undefined && (
        <Label x={isosceles ? 120 : 130} y="38">
          b
        </Label>
      )}
      {dims.c !== undefined && (
        <Label x={isosceles ? 58 : 56} y="98" anchor="end">
          c
        </Label>
      )}
      {!isosceles && dims.d !== undefined && <Label x="186" y="98">d</Label>}
    </>
  )
}

function renderRightTrapezoid(dims) {
  return (
    <>
      <polygon {...shapeProps()} points="40,145 200,145 160,50 40,50" />
      <RightAngle points="40,65 55,65 55,50" />
      <RightAngle points="40,130 55,130 55,145" />
      {dims.a !== undefined && <Label x="120" y="166">a</Label>}
      {dims.b !== undefined && <Label x="100" y="38">b</Label>}
      {dims.h !== undefined && <Label x="30" y="98" anchor="end">h</Label>}
      {dims.c !== undefined && <Label x="184" y="98">c</Label>}
    </>
  )
}

function renderCircle(dims) {
  return (
    <>
      <circle {...shapeProps()} cx="120" cy="95" r="60" />
      <line className="figure-svg__radius" x1="120" y1="95" x2="180" y2="95" />
      <circle className="figure-svg__center" cx="120" cy="95" r="3.5" />
      {dims.r !== undefined && <Label x="150" y="84">r</Label>}
    </>
  )
}

function drawShape(type, dims) {
  switch (type) {
    case 'square':
      return renderSquare(dims)
    case 'rectangle':
      return renderRectangle(dims)
    case 'triangle':
      return renderTriangle(dims)
    case 'right-triangle':
      return renderRightTriangle(dims)
    case 'equilateral-triangle':
      return renderEquilateralTriangle(dims)
    case 'isosceles-triangle':
      return renderIsoscelesTriangle(dims)
    case 'rhombus':
      return renderRhombus(dims)
    case 'parallelogram':
      return renderParallelogram(dims)
    case 'trapezoid':
      return renderTrapezoid(dims)
    case 'isosceles-trapezoid':
      return renderTrapezoid(dims, true)
    case 'right-trapezoid':
      return renderRightTrapezoid(dims)
    case 'circle':
      return renderCircle(dims)
    default:
      return null
  }
}

function describeDims(dims, approxKeys = []) {
  return Object.entries(dims)
    .filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => formatDimension(key, value, approxKeys.includes(key)))
    .join(', ')
}

export function Figure({
  type,
  dims = {},
  approxKeys = [],
  name = 'Figura geometryczna',
  className = '',
}) {
  const description = describeDims(dims, approxKeys)

  return (
    <svg
      className={`figure-svg${className ? ` ${className}` : ''}`}
      viewBox="0 0 240 190"
      role="img"
      aria-label={description ? `${name}: ${description}` : name}
    >
      {drawShape(type, dims)}
    </svg>
  )
}

export function DimensionList({ dims, approxKeys = [] }) {
  const entries = Object.entries(dims).filter(
    ([, value]) => typeof value === 'number',
  )

  if (!entries.length) return null

  return (
    <ul className="figure-dims" aria-label="Dane figury">
      {entries.map(([key, value]) => (
        <li key={key} className="figure-dim">
          {formatDimension(key, value, approxKeys.includes(key))}
        </li>
      ))}
    </ul>
  )
}
