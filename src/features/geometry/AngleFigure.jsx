import { ANGLE_BY_ID } from './angles.js'

const VERTEX_X = 110
const VERTEX_Y = 100
const RAY_LENGTH = 85
const ARC_RADIUS = 45

function pointAt(angle, radius) {
  const radians = (angle * Math.PI) / 180
  return {
    x: VERTEX_X + radius * Math.cos(radians),
    y: VERTEX_Y - radius * Math.sin(radians),
  }
}

function Ray({ angle }) {
  const end = pointAt(angle, RAY_LENGTH)
  return (
    <line
      className="angle-svg__ray"
      x1={VERTEX_X}
      y1={VERTEX_Y}
      x2={end.x}
      y2={end.y}
    />
  )
}

function Sector({ measure }) {
  const start = pointAt(0, ARC_RADIUS)
  const end = pointAt(measure, ARC_RADIUS)
  const largeArc = measure > 180 ? 1 : 0

  return (
    <path
      className="angle-svg__arc"
      d={`M ${VERTEX_X} ${VERTEX_Y} L ${start.x} ${start.y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y} Z`}
    />
  )
}

function FullAngle() {
  return (
    <>
      <circle
        className="angle-svg__full"
        cx={VERTEX_X}
        cy={VERTEX_Y}
        r="60"
      />
      <line
        className="angle-svg__ray"
        x1={VERTEX_X}
        y1={VERTEX_Y}
        x2={VERTEX_X + 60}
        y2={VERTEX_Y}
      />
      <polygon
        className="angle-svg__arrow"
        points={`${VERTEX_X},34 ${VERTEX_X + 9},40 ${VERTEX_X},46`}
      />
    </>
  )
}

function drawAngle(type) {
  if (type === 'full') return <FullAngle />

  if (type === 'right') {
    return (
      <>
        <Ray angle={0} />
        <Ray angle={90} />
        <polyline
          className="angle-svg__right-angle"
          points={`${VERTEX_X},${VERTEX_Y - 15} ${VERTEX_X + 15},${VERTEX_Y - 15} ${VERTEX_X + 15},${VERTEX_Y}`}
        />
      </>
    )
  }

  const measure = ANGLE_BY_ID[type]?.measure ?? 50

  return (
    <>
      <Sector measure={measure} />
      <Ray angle={0} />
      <Ray angle={measure} />
    </>
  )
}

export function AngleFigure({ type, label = 'Rysunek kąta', className = '' }) {
  return (
    <svg
      className={`angle-svg${className ? ` ${className}` : ''}`}
      viewBox="0 0 240 190"
      role="img"
      aria-label={label}
    >
      {drawAngle(type)}
      <circle
        className="angle-svg__vertex"
        cx={VERTEX_X}
        cy={VERTEX_Y}
        r="4"
      />
    </svg>
  )
}
