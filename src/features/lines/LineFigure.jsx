const DEG = Math.PI / 180

function pointAt(cx, cy, angle, radius) {
  return {
    x: cx + radius * Math.cos(angle * DEG),
    y: cy - radius * Math.sin(angle * DEG),
  }
}

function arcPoints(cx, cy, from, to, radius) {
  const steps = 24

  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = from + ((to - from) * index) / steps
    const point = pointAt(cx, cy, angle, radius)
    return `${point.x},${point.y}`
  }).join(' ')
}

function AngleArc({
  cx,
  cy,
  from,
  to,
  radius = 26,
  label,
  labelRadius = 44,
  highlighted = false,
}) {
  const mid = (from + to) / 2
  const labelPoint = pointAt(cx, cy, mid, labelRadius)

  return (
    <g>
      <polyline className="line-svg__arc" points={arcPoints(cx, cy, from, to, radius)} />
      {label ? (
        <text
          className={`line-svg__angle-label${highlighted ? ' is-highlighted' : ''}`}
          x={labelPoint.x}
          y={labelPoint.y}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  )
}

function ArrowHead({ x, y, direction }) {
  const points =
    direction === 'right'
      ? `${x},${y} ${x - 15},${y - 6} ${x - 15},${y + 6}`
      : `${x},${y} ${x + 15},${y - 6} ${x + 15},${y + 6}`

  return <polygon className="line-svg__arrow" points={points} />
}

function BasicLineFigure({ type }) {
  if (type === 'line') {
    return (
      <svg className="line-svg" viewBox="0 0 240 190" role="img" aria-label="Prosta">
        <line className="line-svg__line" x1="48" y1="95" x2="192" y2="95" />
        <ArrowHead x={35} y={95} direction="left" />
        <ArrowHead x={205} y={95} direction="right" />
      </svg>
    )
  }

  if (type === 'segment') {
    return (
      <svg className="line-svg" viewBox="0 0 240 190" role="img" aria-label="Odcinek">
        <line className="line-svg__line" x1="50" y1="95" x2="190" y2="95" />
        <circle className="line-svg__dot" cx="50" cy="95" r="4" />
        <circle className="line-svg__dot" cx="190" cy="95" r="4" />
      </svg>
    )
  }

  if (type === 'ray') {
    return (
      <svg className="line-svg" viewBox="0 0 240 190" role="img" aria-label="Półprosta">
        <line className="line-svg__line" x1="55" y1="95" x2="192" y2="95" />
        <circle className="line-svg__dot" cx="55" cy="95" r="4" />
        <ArrowHead x={205} y={95} direction="right" />
      </svg>
    )
  }

  if (type === 'perpendicular') {
    return (
      <svg
        className="line-svg"
        viewBox="0 0 240 190"
        role="img"
        aria-label="Proste prostopadłe"
      >
        <line className="line-svg__line" x1="35" y1="100" x2="205" y2="100" />
        <line className="line-svg__line" x1="120" y1="25" x2="120" y2="175" />
        <polyline
          className="line-svg__right-angle"
          points="120,80 140,80 140,100"
        />
        <text className="line-svg__angle-label" x="150" y="72">
          90°
        </text>
      </svg>
    )
  }

  return (
    <svg
      className="line-svg"
      viewBox="0 0 240 190"
      role="img"
      aria-label="Proste równoległe"
    >
      <line className="line-svg__line" x1="48" y1="68" x2="192" y2="68" />
      <line className="line-svg__line" x1="48" y1="125" x2="192" y2="125" />
      <ArrowHead x={35} y={68} direction="left" />
      <ArrowHead x={205} y={68} direction="right" />
      <ArrowHead x={35} y={125} direction="left" />
      <ArrowHead x={205} y={125} direction="right" />
    </svg>
  )
}

export function IntersectionFigure({
  givenAngle = 40,
  labels = {},
  highlight = null,
  segments = false,
}) {
  const cx = 120
  const cy = 95
  const half = segments ? 72 : 102
  const diagonalA = pointAt(cx, cy, givenAngle, half)
  const diagonalB = pointAt(cx, cy, givenAngle + 180, half)
  const labelRadius = 62
  const endLabels = {
    alpha: labels.alpha ?? 'α',
    beta: labels.beta ?? 'β',
    gamma: labels.gamma ?? 'γ',
    delta: labels.delta ?? 'δ',
  }

  return (
    <svg
      className="line-svg"
      viewBox="0 0 240 190"
      role="img"
      aria-label={segments ? 'Odcinki przecinające się' : 'Proste przecinające się'}
    >
      <line className="line-svg__line" x1={cx - half} y1={cy} x2={cx + half} y2={cy} />
      <line
        className="line-svg__line"
        x1={diagonalB.x}
        y1={diagonalB.y}
        x2={diagonalA.x}
        y2={diagonalA.y}
      />

      <AngleArc
        cx={cx}
        cy={cy}
        from={0}
        to={givenAngle}
        label={endLabels.alpha}
        labelRadius={labelRadius}
        highlighted={highlight === 'alpha'}
      />
      <AngleArc
        cx={cx}
        cy={cy}
        from={givenAngle}
        to={180}
        label={endLabels.beta}
        labelRadius={labelRadius}
        highlighted={highlight === 'beta'}
      />
      <AngleArc
        cx={cx}
        cy={cy}
        from={180}
        to={180 + givenAngle}
        label={endLabels.gamma}
        labelRadius={labelRadius}
        highlighted={highlight === 'gamma'}
      />
      <AngleArc
        cx={cx}
        cy={cy}
        from={180 + givenAngle}
        to={360}
        label={endLabels.delta}
        labelRadius={labelRadius}
        highlighted={highlight === 'delta'}
      />

      {segments && (
        <>
          <circle className="line-svg__dot" cx={cx - half} cy={cy} r="4" />
          <circle className="line-svg__dot" cx={cx + half} cy={cy} r="4" />
          <circle className="line-svg__dot" cx={diagonalA.x} cy={diagonalA.y} r="4" />
          <circle className="line-svg__dot" cx={diagonalB.x} cy={diagonalB.y} r="4" />
        </>
      )}

      <circle className="line-svg__dot" cx={cx} cy={cy} r="4" />
    </svg>
  )
}

function AngleNotationFigure({ type, label = 'α' }) {
  if (type === 'adjacent-angles') {
    return (
      <svg
        className="line-svg"
        viewBox="0 0 240 190"
        role="img"
        aria-label="Kąty przyległe alfa i beta"
      >
        <line className="line-svg__line" x1="25" y1="125" x2="215" y2="125" />
        <line className="line-svg__line" x1="120" y1="125" x2="184" y2="16" />
        <AngleArc cx={120} cy={125} from={0} to={60} radius={32} label="α" labelRadius={62} />
        <AngleArc cx={120} cy={125} from={60} to={180} radius={32} label="β" labelRadius={62} />
        <circle className="line-svg__dot" cx="120" cy="125" r="4" />
      </svg>
    )
  }

  return (
    <svg className="line-svg" viewBox="0 0 240 190" role="img" aria-label="Kąt alfa">
      <line className="line-svg__line" x1="110" y1="120" x2="210" y2="120" />
      <line className="line-svg__line" x1="110" y1="120" x2="167" y2="38" />
      <AngleArc cx={110} cy={120} from={0} to={55} radius={38} label={label} labelRadius={60} />
      <circle className="line-svg__dot" cx="110" cy="120" r="4" />
      <text className="line-svg__caption" x="98" y="138" textAnchor="end">
        O
      </text>
    </svg>
  )
}

function interiorArc(cx, cy, previous, next) {
  const normalize = (angle) => {
    let value = angle % (2 * Math.PI)
    if (value < 0) value += 2 * Math.PI
    return value
  }
  const first = normalize(
    Math.atan2(-(previous.y - cy), previous.x - cx),
  )
  const second = normalize(Math.atan2(-(next.y - cy), next.x - cx))
  const delta = normalize(second - first)

  if (delta <= Math.PI) {
    return {
      from: first / DEG,
      to: (first + delta) / DEG,
    }
  }

  return {
    from: second / DEG,
    to: (second + (2 * Math.PI - delta)) / DEG,
  }
}

const TRIANGLE_POINTS = [
  { x: 60, y: 150 },
  { x: 180, y: 150 },
  { x: 120, y: 38 },
]

const QUADRILATERAL_POINTS = [
  { x: 60, y: 55 },
  { x: 190, y: 65 },
  { x: 175, y: 160 },
  { x: 50, y: 145 },
]

function PolygonAnglesFigure({ shape = 'triangle', labels = [], highlight = null }) {
  const points = shape === 'triangle' ? TRIANGLE_POINTS : QUADRILATERAL_POINTS
  const polygonPoints = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <svg
      className="line-svg"
      viewBox="0 0 240 190"
      role="img"
      aria-label={shape === 'triangle' ? 'Trójkąt z kątami' : 'Czworokąt z kątami'}
    >
      <polygon className="line-svg__polygon" points={polygonPoints} />
      {points.map((point, index) => {
        const previous = points[(index - 1 + points.length) % points.length]
        const next = points[(index + 1) % points.length]
        const arc = interiorArc(point.x, point.y, previous, next)

        return (
          <AngleArc
            key={index}
            cx={point.x}
            cy={point.y}
            from={arc.from}
            to={arc.to}
            radius={25}
            label={labels[index]}
            labelRadius={42}
            highlighted={highlight === index}
          />
        )
      })}
    </svg>
  )
}

export function LineFigure({ type, ...props }) {
  if (
    type === 'line' ||
    type === 'segment' ||
    type === 'ray' ||
    type === 'perpendicular' ||
    type === 'parallel'
  ) {
    return <BasicLineFigure type={type} />
  }

  if (type === 'crossing-lines') {
    return <IntersectionFigure {...props} />
  }

  if (type === 'crossing-segments') {
    return <IntersectionFigure {...props} segments />
  }

  if (type === 'angle' || type === 'adjacent-angles') {
    return <AngleNotationFigure type={type} {...props} />
  }

  if (type === 'triangle-angles' || type === 'quadrilateral-angles') {
    return (
      <PolygonAnglesFigure
        shape={type === 'triangle-angles' ? 'triangle' : 'quadrilateral'}
        {...props}
      />
    )
  }

  return null
}
