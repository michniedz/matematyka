import { useEffect, useRef } from 'react'

function cleanNumber(raw) {
  return raw.replace(/[^\d]/g, '').slice(0, 3)
}

export function FractionPartInput({
  value,
  onChange,
  disabled = false,
  autoFocus = false,
  label = 'Liczba',
  part = 'num',
  placeholder = '?',
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus && !disabled) inputRef.current?.focus()
  }, [autoFocus, disabled])

  return (
    <input
      ref={inputRef}
      className={`fraction__${part} fraction__field`}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      spellCheck={false}
      value={value}
      onChange={(event) => onChange(cleanNumber(event.target.value))}
      disabled={disabled}
      aria-label={label}
      placeholder={placeholder}
    />
  )
}
