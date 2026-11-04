export function FractionBar({ n, d, tone = 'a' }) {
  return (
    <span
      className={`frac-bar frac-bar--${tone}`}
      style={{ '--parts': d }}
      aria-hidden="true"
    >
      {Array.from({ length: d }, (_, index) => (
        <span
          key={index}
          className={index < n ? 'frac-bar__part is-filled' : 'frac-bar__part'}
        />
      ))}
    </span>
  )
}
