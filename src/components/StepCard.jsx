import { useRef, useState } from 'react'
import { simplify } from '../lib/math.js'
import { FractionInput } from './FractionInput.jsx'
import { FractionPartInput } from './FractionPartInput.jsx'
import { MixedInput } from './MixedInput.jsx'
import { NumberInput } from './NumberInput.jsx'

function emptyValue(step) {
  if (step.kind === 'parts' || step.kind === 'fields') {
    return Object.fromEntries(step.fields.map((field) => [field.id, '']))
  }

  if (step.kind === 'mixed') {
    return { whole: '', n: '', d: '' }
  }

  return step.kind === 'fraction' ? { n: '', d: '' } : ''
}

function parseInteger(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return null
  const parsed = Number(text)
  return Number.isInteger(parsed) ? parsed : null
}

function parseDecimal(raw) {
  const text = String(raw ?? '').trim().replace(',', '.')
  if (!/^\d+(?:\.\d{0,4})?$/.test(text)) return null

  const [whole, fraction = ''] = text.split('.')
  return simplify({
    n: Number(whole + fraction),
    d: 10 ** fraction.length,
  })
}

const FEEDBACK_ICON = {
  success: '✓',
  error: '!',
  warn: '!',
  info: 'i',
}

export function StepCard({ step, index, total, isLast, onSolved, onNext }) {
  const [value, setValue] = useState(() => emptyValue(step))
  const [choice, setChoice] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const solvedRef = useRef(false)

  const inputNode = (() => {
    if (step.kind === 'choice' || step.kind === 'parts' || step.kind === 'fields') {
      return null
    }

    if (step.kind === 'fraction') {
      return (
        <FractionInput
          value={value}
          onChange={setValue}
          disabled={solved}
          denominatorPlaceholder={
            step.denominatorOptional
              ? step.answer.d === 1
                ? '1'
                : '?'
              : '?'
          }
        />
      )
    }

    if (step.kind === 'mixed') {
      return (
        <MixedInput value={value} onChange={setValue} disabled={solved} />
      )
    }

    return (
      <NumberInput
        value={value}
        onChange={setValue}
        disabled={solved}
        decimal={step.kind === 'decimal'}
      />
    )
  })()

  const inputNodes =
    step.kind === 'parts'
      ? Object.fromEntries(
          step.fields.map((field, fieldIndex) => [
            field.id,
            <FractionPartInput
              key={field.id}
              value={value[field.id] ?? ''}
              onChange={(next) =>
                setValue((current) => ({
                  ...current,
                  [field.id]: next,
                }))
              }
              disabled={solved}
              autoFocus={fieldIndex === 0}
              label={field.label}
              part={field.part}
            />,
          ]),
        )
      : null

  const fieldNode =
    step.kind === 'fields'
      ? (fieldId, { autoFocus = false } = {}) => {
          const field = step.fields.find((item) => item.id === fieldId)

          return (
            <NumberInput
              value={value[fieldId] ?? ''}
              onChange={(next) =>
                setValue((current) => ({
                  ...current,
                  [fieldId]: next,
                }))
              }
              disabled={solved}
              autoFocus={autoFocus}
              decimal={field.decimal}
              label={field.label}
              placeholder={field.placeholder}
              className="geometry-formula-field"
            />
          )
        }
      : null

  const choiceNode =
    step.kind === 'choice' ? (
      <div className="choice-grid" role="group" aria-label="Wybierz odpowiedź">
        {step.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`choice${choice === option.id ? ' is-selected' : ''}`}
            aria-pressed={choice === option.id}
            disabled={solved}
            onClick={() => {
              setChoice(option.id)
              setFeedback(null)
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    ) : null

  const finishStep = (message, wasRevealed) => {
    if (solvedRef.current) return
    solvedRef.current = true
    setSolved(true)
    setRevealed(wasRevealed)
    setShowHint(false)
    setFeedback({
      tone: wasRevealed ? 'info' : 'success',
      text:
        message ??
        (wasRevealed
          ? 'To poprawne rozwiązanie. Przeanalizuj je i spróbuj kolejne zadanie samodzielnie.'
          : 'Świetnie! Dobrze Ci idzie.'),
    })
    onSolved({
      id: step.id,
      title: step.title,
      visual: step.solvedVisual,
      revealed: wasRevealed,
    })
  }

  const handleResult = (result) => {
    if (result.ok) {
      finishStep(result.message, false)
      return
    }

    const nextWrong = wrongCount + 1
    setWrongCount(nextWrong)
    setFeedback({ tone: result.tone ?? 'error', text: result.message })
    if (nextWrong >= 2) setShowHint(true)
  }

  const checkAnswer = () => {
    if (solved) {
      onNext()
      return
    }

    if (step.kind === 'choice') {
      if (choice === null) {
        setFeedback({ tone: 'error', text: 'Wybierz jedną z odpowiedzi.' })
        return
      }

      handleResult(step.check(choice))
      return
    }

    if (step.kind === 'parts') {
      const values = {}

      for (const field of step.fields) {
        const parsed = parseInteger(value[field.id])

        if (parsed === null) {
          setFeedback({
            tone: 'error',
            text: step.emptyMessage ?? 'Uzupełnij wszystkie zaznaczone liczby.',
          })
          return
        }

        values[field.id] = parsed
      }

      handleResult(step.check(values))
      return
    }

    if (step.kind === 'fields') {
      const values = {}

      for (const field of step.fields) {
        const parsed = field.decimal
          ? parseDecimal(value[field.id])
          : parseInteger(value[field.id])

        if (parsed === null) {
          setFeedback({
            tone: 'error',
            text: step.emptyMessage ?? 'Uzupełnij wszystkie pola.',
          })
          return
        }

        values[field.id] = parsed
      }

      handleResult(step.check(values))
      return
    }

    if (step.kind === 'fraction') {
      const numerator = parseInteger(value.n)
      const hasDenominator = String(value.d ?? '').trim() !== ''
      const denominator = hasDenominator ? parseInteger(value.d) : 1

      if (numerator === null || denominator === null) {
        setFeedback({
          tone: 'error',
          text: step.denominatorOptional
            ? 'Wpisz licznik. Mianownik możesz zostawić pusty, jeśli wynik jest liczbą całkowitą.'
            : 'Wpisz liczbę w licznik i mianownik.',
        })
        return
      }

      if (!hasDenominator && !step.denominatorOptional) {
        setFeedback({ tone: 'error', text: 'Wpisz mianownik.' })
        return
      }

      if (denominator === 0) {
        setFeedback({
          tone: 'error',
          text: 'Mianownik nie może być zerem. Spróbuj jeszcze raz.',
        })
        return
      }

      handleResult(step.check({ n: numerator, d: denominator }))
      return
    }

    if (step.kind === 'mixed') {
      const whole = parseInteger(value.whole)
      const numerator = parseInteger(value.n)
      const denominator = parseInteger(value.d)

      if (whole === null || numerator === null || denominator === null) {
        setFeedback({
          tone: 'error',
          text: 'Uzupełnij całości, licznik i mianownik.',
        })
        return
      }

      if (denominator === 0) {
        setFeedback({
          tone: 'error',
          text: 'Mianownik nie może być zerem. Spróbuj jeszcze raz.',
        })
        return
      }

      handleResult(step.check({ whole, n: numerator, d: denominator }))
      return
    }

    if (step.kind === 'decimal') {
      const parsed = parseDecimal(value)

      if (!parsed) {
        setFeedback({
          tone: 'error',
          text: 'Wpisz liczbę, np. 12 lub 0,5. Użyj przecinka albo kropki.',
        })
        return
      }

      handleResult(step.check(parsed))
      return
    }

    const parsed = parseInteger(value)

    if (parsed === null) {
      setFeedback({ tone: 'error', text: 'Wpisz liczbę.' })
      return
    }

    handleResult(step.check(parsed))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    checkAnswer()
  }

  const reveal = () => {
    if (solved) return

    if (step.kind === 'choice') {
      setChoice(step.answer)
    } else if (step.kind === 'parts') {
      setValue(
        Object.fromEntries(
          step.fields.map((field) => [field.id, String(field.answer)]),
        ),
      )
    } else if (step.kind === 'fields') {
      setValue(
        Object.fromEntries(
          step.fields.map((field) => [
            field.id,
            field.answerText ?? String(field.answer),
          ]),
        ),
      )
    } else if (step.kind === 'fraction') {
      setValue({
        n: String(step.answer.n),
        d:
          step.denominatorOptional && step.answer.d === 1
            ? ''
            : String(step.answer.d),
      })
    } else if (step.kind === 'mixed') {
      setValue({
        whole: String(step.answer.whole),
        n: String(step.answer.n),
        d: String(step.answer.d),
      })
    } else if (step.kind === 'decimal') {
      setValue(String(step.answerText ?? ''))
    } else {
      setValue(String(step.answer))
    }

    finishStep(
      step.revealMessage ??
        'To poprawne rozwiązanie. Przeanalizuj je i spróbuj kolejne zadanie samodzielnie.',
      true,
    )
  }

  const canReveal = wrongCount >= 2 || showHint

  return (
    <section className={`step-card${solved ? ' is-solved' : ''}`}>
      <div className="step-card__head">
        <div className="step-card__topline">
          <span className="step-pill">
            Krok {index + 1} z {total}
          </span>
          <span className="step-card__title">{step.title}</span>
        </div>
        <p className="step-card__prompt">{step.prompt}</p>
      </div>

      <form className="step-card__form" onSubmit={handleSubmit}>
        <div className="step-card__formula">
          {step.kind === 'choice'
            ? step.visual
              ? step.visual(choiceNode)
              : choiceNode
            : step.kind === 'parts'
              ? step.visual(inputNodes)
              : step.kind === 'fields'
                ? step.visual(fieldNode)
                : step.visual(inputNode)}
        </div>

        <div className="step-card__actions">
          <button type="submit" className="btn btn--primary">
            {solved ? (isLast ? 'Zobacz wynik' : 'Dalej') : 'Sprawdź'}
            {solved ? <span aria-hidden="true"> →</span> : null}
          </button>

          {!solved && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setShowHint((current) => !current)}
              aria-expanded={showHint}
            >
              💡 {showHint ? 'Ukryj podpowiedź' : 'Podpowiedź'}
            </button>
          )}

          {solved && revealed && (
            <span className="solved-tag solved-tag--shown">
              pokazane rozwiązanie
            </span>
          )}

          {solved && !revealed && (
            <span className="solved-tag">✓ krok zaliczony</span>
          )}
        </div>

        {showHint && !solved && (
          <div className="hint-box">
            <strong>Podpowiedź</strong>
            <p>{step.hint}</p>
          </div>
        )}

        {feedback && (
          <div
            className={`feedback feedback--${feedback.tone}`}
            role="status"
            aria-live="polite"
          >
            <span className="feedback__icon" aria-hidden="true">
              {FEEDBACK_ICON[feedback.tone]}
            </span>
            <span>{feedback.text}</span>
          </div>
        )}

        {!solved && canReveal && (
          <button type="button" className="reveal-link" onClick={reveal}>
            Nie wiem — pokaż rozwiązanie tego kroku
          </button>
        )}
      </form>
    </section>
  )
}
