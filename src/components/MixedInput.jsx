import { useEffect, useRef } from 'react'

function cleanNumber(raw) {
  return raw.replace(/[^\d]/g, '').slice(0, 3)
}

export function MixedInput({
  value,
  onChange,
  disabled = false,
  autoFocus = true,
}) {
  const wholeRef = useRef(null)

  useEffect(() => {
    if (autoFocus && !disabled) wholeRef.current?.focus()
  }, [autoFocus, disabled])

  const update = (field) => (event) => {
    onChange({ ...value, [field]: cleanNumber(event.target.value) })
  }

  return (
    <span className="mixed-number mixed-number--md mixed-number--input">
      <input
        ref={wholeRef}
        className="mixed-number__whole fraction__field"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        spellCheck={false}
        value={value.whole}
        onChange={update('whole')}
        disabled={disabled}
        aria-label="Całości"
        placeholder="?"
      />
      <span className="fraction fraction--md fraction--input">
        <input
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
          placeholder="?"
        />
      </span>
    </span>
  )
}
