import { useEffect, useRef } from 'react'

function cleanNumber(raw) {
  return raw.replace(/[^\d]/g, '').slice(0, 3)
}

export function FractionInput({
  value,
  onChange,
  disabled = false,
  autoFocus = true,
  denominatorPlaceholder = '?',
}) {
  const numeratorRef = useRef(null)

  useEffect(() => {
    if (autoFocus && !disabled) numeratorRef.current?.focus()
  }, [autoFocus, disabled])

  const update = (field) => (event) => {
    onChange({ ...value, [field]: cleanNumber(event.target.value) })
  }

  return (
    <span className="fraction fraction--md fraction--input">
      <input
        ref={numeratorRef}
        className="fraction__num fraction__field"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        spellCheck={false}
        value={value.n}
        onChange={update('n')}
        disabled={disabled}
        aria-label="Licznik"
        placeholder="?"
      />
      <span className="fraction__line" aria-hidden="true" />
      <input
        className="fraction__den fraction__field"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        spellCheck={false}
        value={value.d}
        onChange={update('d')}
        disabled={disabled}
        aria-label="Mianownik"
        placeholder={denominatorPlaceholder}
      />
    </span>
  )
}
