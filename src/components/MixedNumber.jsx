import { Fraction } from './Fraction.jsx'

const SIZE_CLASS = {
  sm: 'mixed-number--sm',
  md: 'mixed-number--md',
  lg: 'mixed-number--lg',
  xl: 'mixed-number--xl',
}

export function MixedNumber({ whole, n, d, size = 'md', tone }) {
  const classes = [
    'mixed-number',
    SIZE_CLASS[size] ?? SIZE_CLASS.md,
    tone ? `mixed-number--${tone}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={classes}
      role="img"
      aria-label={`${whole} i ${n} przez ${d}`}
    >
      <span className="mixed-number__whole">{whole}</span>
      <Fraction n={n} d={d} size={size} tone={tone} />
    </span>
  )
}
