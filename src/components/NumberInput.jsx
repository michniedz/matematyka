import { useEffect, useRef } from 'react'

function cleanNumber(raw, decimal) {
  if (!decimal) return raw.replace(/[^\d]/g, '').slice(0, 3)

  const filtered = raw.replace(/[^\d.,]/g, '')
  const separatorIndex = filtered.search(/[.,]/)

  if (separatorIndex === -1) return filtered.slice(0, 5)

  const whole = filtered.slice(0, separatorIndex).slice(0, 5)
  const separator = filtered[separatorIndex]
  const fraction = filtered
    .slice(separatorIndex + 1)
    .replace(/[.,]/g, '')
    .slice(0, 4)

  return `${whole}${separator}${fraction}`
}

export function NumberInput({
  value,
  onChange,
  disabled = false,
  label = 'Odpowiedź',
  autoFocus = true,
  decimal = false,
  className = '',
  placeholder = '?',
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus && !disabled) inputRef.current?.focus()
  }, [autoFocus, disabled])

  return (
    <input
      ref={inputRef}
      className={`number-input${decimal ? ' number-input--decimal' : ''}${
        className ? ` ${className}` : ''
      }`}
      type="text"
      inputMode={decimal ? 'decimal' : 'numeric'}
      pattern={decimal ? '[0-9.,]*' : '[0-9]*'}
      autoComplete="off"
      spellCheck={false}
      value={value}
      onChange={(event) => onChange(cleanNumber(event.target.value, decimal))}
      disabled={disabled}
      aria-label={label}
      placeholder={placeholder}
    />
  )
}
