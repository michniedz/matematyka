const SIZE_CLASS = {
  sm: 'fraction--sm',
  md: 'fraction--md',
  lg: 'fraction--lg',
  xl: 'fraction--xl',
}

export function Fraction({
  n,
  d,
  size = 'md',
  tone,
  highlightN = false,
  highlightD = false,
  className = '',
}) {
  const classes = [
    'fraction',
    SIZE_CLASS[size] ?? SIZE_CLASS.md,
    tone ? `fraction--${tone}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} role="img" aria-label={`${n} przez ${d}`}>
      <span className={`fraction__num${highlightN ? ' is-marked' : ''}`}>
        {n}
      </span>
      <span className="fraction__line" aria-hidden="true" />
      <span className={`fraction__den${highlightD ? ' is-marked' : ''}`}>
        {d}
      </span>
    </span>
  )
}
