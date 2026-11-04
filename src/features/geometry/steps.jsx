import { AngleFigure } from './AngleFigure.jsx'
import { DimensionList, Figure } from './Figure.jsx'
import { formatNumber, rationalFromNumber } from './values.js'

const PHASES = {
  parentheses: {
    label: 'Działanie w nawiasie',
    short: 'nawias',
    success: 'Dobrze! Działanie w nawiasie wykonujemy jako pierwsze.',
    reveal: 'Najpierw wykonujemy działanie w nawiasie.',
  },
  muldiv: {
    label: 'Mnożenie lub dzielenie',
    short: 'mnożenie lub dzielenie',
    success:
      'Dobrze! Mnożenie i dzielenie wykonujemy przed dodawaniem i odejmowaniem.',
    reveal: 'Teraz wykonujemy mnożenie lub dzielenie.',
  },
  addsub: {
    label: 'Dodawanie lub odejmowanie',
    short: 'dodawanie lub odejmowanie',
    success:
      'Dobrze! Zostały tylko dodawanie i odejmowanie — liczymy od lewej do prawej.',
    reveal: 'Na końcu wykonujemy dodawanie lub odejmowanie.',
  },
}

const PHASE_OPTIONS = Object.entries(PHASES).map(([id, phase]) => ({
  id,
  label: phase.label,
}))

const ORDER_HINT =
  'Kolejność: najpierw nawiasy, potem mnożenie i dzielenie, a na końcu dodawanie i odejmowanie. W obrębie tego samego poziomu liczymy od lewej do prawej.'

function ok(message) {
  return { ok: true, message }
}

function wrong(message) {
  return { ok: false, tone: 'warn', message }
}

function sameRational(a, b) {
  return a.n * b.d === b.n * a.d
}

function phaseCheck(expected) {
  return (choice) => {
    if (choice === expected) return ok(PHASES[expected].success)

    if (choice === 'parentheses') {
      return wrong(
        'W tym wyrażeniu nie ma już działania w nawiasie. Spójrz na znaki między liczbami.',
      )
    }

    if (choice === 'muldiv') {
      if (expected === 'parentheses') {
        return wrong(
          'Najpierw trzeba obliczyć działanie w nawiasie — nawiasy mają pierwszeństwo.',
        )
      }

      return wrong(
        'Mnożenia ani dzielenia już nie ma. Zostały dodawanie i odejmowanie.',
      )
    }

    if (expected === 'parentheses') {
      return wrong(
        'Najpierw obliczamy to, co jest w nawiasie. Dopiero potem resztę wyrażenia.',
      )
    }

    return wrong(
      'Mnożenie i dzielenie mają pierwszeństwo przed dodawaniem i odejmowaniem.',
    )
  }
}

function isLetter(char) {
  return char != null && /[a-z]/i.test(char)
}

/**
 * Dzieli wzór na tekst i pojedyncze litery oznaczające dane figury.
 * Dzięki temu litery można zastąpić polami do wpisania, a np. „Obw” nie
 * zostanie potraktowane jako zmienna „b”.
 */
function tokenizeFormula(formula, dims) {
  const tokens = []
  let textStart = 0

  for (let index = 0; index < formula.length; index += 1) {
    const char = formula[index]

    if (!Object.hasOwn(dims, char)) continue
    if (isLetter(formula[index - 1]) || isLetter(formula[index + 1])) continue

    if (textStart < index) {
      tokens.push({ type: 'text', value: formula.slice(textStart, index) })
    }

    tokens.push({ type: 'field', id: char })
    textStart = index + 1
  }

  if (textStart < formula.length) {
    tokens.push({ type: 'text', value: formula.slice(textStart) })
  }

  return tokens
}

function substituteFormula(formula, dims) {
  return tokenizeFormula(formula, dims)
    .map((token) =>
      token.type === 'text' ? token.value : formatNumber(dims[token.id]),
    )
    .join('')
}

function formulaStep(task) {
  const question =
    task.quantity === 'area'
      ? 'Który wzór pozwoli obliczyć pole tej figury?'
      : 'Który wzór pozwoli obliczyć obwód tej figury?'

  return {
    id: 'formula',
    kind: 'choice',
    title: 'Wybierz wzór',
    prompt: question,
    hint: task.formulaHint,
    answer: task.formulaAnswerId,
    options: task.formulaOptions,
    visual: (choiceNode) => (
      <div className="geometry-step">
        <div className="geometry-step__figure">
          <Figure
            type={task.figureId}
            dims={task.dims}
            approxKeys={task.approxKeys}
            name={task.figure.name}
          />
        </div>
        <DimensionList dims={task.dims} approxKeys={task.approxKeys} />
        <span className="geometry-step__question">{question}</span>
        {choiceNode}
      </div>
    ),
    solvedVisual: (
      <span className="solved-words">
        Wzór: <strong>{task.formula}</strong>
      </span>
    ),
    check: (choice) =>
      choice === task.formulaAnswerId
        ? ok(`Dobrze! Użyjemy wzoru ${task.formula}.`)
        : wrong(`Jeszcze nie. ${task.formulaHint}`),
    revealMessage: `Poprawny wzór to ${task.formula}.`,
  }
}

function substitutionStep(task) {
  const quantityName = task.quantity === 'area' ? 'Pole' : 'Obwód'
  const fields = Object.entries(task.dims).map(([id, value]) => ({
    id,
    answer: value,
    answerText: formatNumber(value),
    decimal: !Number.isInteger(value),
    rational: rationalFromNumber(value),
    label: `Wartość ${id}`,
    placeholder: id,
  }))
  const tokens = tokenizeFormula(task.formula, task.dims)
  const firstFieldIndex = tokens.findIndex((token) => token.type === 'field')
  const substituted = substituteFormula(task.formula, task.dims)
  const dimsText = Object.entries(task.dims)
    .map(
      ([key, value]) =>
        `${key} ${task.approxKeys.includes(key) ? '≈' : '='} ${formatNumber(value)} cm`,
    )
    .join(', ')

  return {
    id: 'substitute',
    kind: 'fields',
    title: 'Podstaw dane',
    prompt: 'Wpisz dane w miejsce liter we wzorze.',
    hint: dimsText,
    fields,
    emptyMessage: 'Uzupełnij wszystkie pola we wzorze.',
    visual: (fieldNode) => (
      <div className="geometry-substitution">
        <div className="geometry-calc__formula">
          <span className="geometry-calc__label">{quantityName}</span>
          <span className="geometry-calc__formula-text geometry-substitution__formula">
            {tokens.map((token, index) =>
              token.type === 'text' ? (
                <span key={`text-${index}`}>{token.value}</span>
              ) : (
                <span
                  key={`field-${token.id}-${index}`}
                  className="geometry-substitution__slot"
                >
                  {fieldNode(token.id, {
                    autoFocus: index === firstFieldIndex,
                  })}
                </span>
              ),
            )}
          </span>
        </div>
        <p className="geometry-substitution__note">
          Wpisz same liczby. Po podstawieniu obliczaj zgodnie z kolejnością
          działań.
        </p>
      </div>
    ),
    solvedVisual: (
      <span className="solved-words">
        Po podstawieniu: <strong>{substituted}</strong>
      </span>
    ),
    check: (values) => {
      const incorrect = fields.filter((field) =>
        field.decimal
          ? !sameRational(values[field.id], field.rational)
          : values[field.id] !== field.answer,
      )

      if (incorrect.length === 0) {
        return ok('Dobrze! Wszystkie dane są podstawione do wzoru.')
      }

      return wrong(
        `Sprawdź, jaką długość ma ${incorrect[0].id}. Zobacz dane figury pod rysunkiem.`,
      )
    },
    revealMessage: `Do wzoru ${task.formula} podstawiamy: ${dimsText}.`,
  }
}

function formulaAfterCalculation(formula, calculation) {
  if (calculation.phase === 'parentheses') {
    return formula.replace(/\([^)]*\)/, calculation.valueText)
  }

  if (formula.includes(calculation.expression)) {
    return formula.replace(calculation.expression, calculation.valueText)
  }

  return formula
}

function phaseStep(task, calculation, formula, first, index) {
  const phase = calculation.phase
  const quantityName = task.quantity === 'area' ? 'Pole' : 'Obwód'

  return {
    id: `phase-${phase}-${index}`,
    kind: 'choice',
    title: first ? 'Co wykonujemy najpierw?' : 'Co wykonujemy teraz?',
    prompt: 'Które działanie ma teraz pierwszeństwo?',
    hint: ORDER_HINT,
    answer: phase,
    options: PHASE_OPTIONS,
    visual: (choiceNode) => (
      <div className="geometry-phase">
        <div className="geometry-calc__formula">
          <span className="geometry-calc__label">{quantityName}</span>
          <span className="geometry-calc__formula-text">{formula}</span>
        </div>
        <span className="geometry-step__question">Co wykonujemy teraz?</span>
        {choiceNode}
      </div>
    ),
    solvedVisual: (
      <span className="solved-words">
        Teraz: <strong>{PHASES[phase].short}</strong>
      </span>
    ),
    check: phaseCheck(phase),
    revealMessage: PHASES[phase].reveal,
  }
}

function calcStep(task, calculation, index, formula) {
  const isFinal = index === task.calculations.length - 1
  const quantityName = task.quantity === 'area' ? 'Pole' : 'Obwód'

  return {
    id: `calc-${index}`,
    kind: calculation.kind,
    title: calculation.title,
    prompt: calculation.prompt,
    hint: calculation.hint,
    answer:
      calculation.kind === 'number' ? calculation.value : calculation.rational,
    answerText: calculation.valueText,
    visual: (input) => (
      <div className="geometry-calc">
        <div className="geometry-calc__formula">
          <span className="geometry-calc__label">
            {task.quantity === 'area' ? 'Pole' : 'Obwód'}
          </span>
          <span className="geometry-calc__formula-text">{formula}</span>
        </div>

        <div className="geometry-calc__row">
          <span className="geometry-calc__expr">
            {calculation.expression}
          </span>
          <span className="equals">=</span>
          {input}
        </div>

        {isFinal && (
          <span className="geometry-calc__unit">wynik w {task.unit}</span>
        )}
      </div>
    ),
    solvedVisual: (
      <span className="solved-line">
        <span>{calculation.expression}</span>
        <span className="solved-sign">=</span>
        <strong>
          {calculation.valueText}
          {isFinal ? ` ${task.unit}` : ''}
        </strong>
      </span>
    ),
    check: (input) => {
      const value = calculation.kind === 'number' ? { n: input, d: 1 } : input

      if (sameRational(value, calculation.rational)) {
        return ok(
          isFinal
            ? `Dobrze! ${quantityName} wynosi ${calculation.valueText} ${task.unit}.`
            : `Dobrze! ${calculation.expression} = ${calculation.valueText}.`,
        )
      }

      return wrong(
        `Jeszcze nie. Policz uważnie ${calculation.expression}. ${calculation.hint}`,
      )
    },
    revealMessage: `${calculation.expression} = ${calculation.valueText}${
      isFinal ? ` ${task.unit}` : ''
    }.`,
  }
}

function angleTypeStep(task) {
  return {
    id: 'angle-type',
    kind: 'choice',
    title: 'Rozpoznaj kąt',
    prompt: 'Jaki to kąt?',
    hint: task.angle.hint,
    answer: task.angle.id,
    options: task.typeOptions,
    visual: (choiceNode) => (
      <div className="geometry-angle">
        <div className="geometry-angle__figure">
          <AngleFigure type={task.angle.id} />
        </div>
        <span className="geometry-step__question">Jaki to kąt?</span>
        {choiceNode}
      </div>
    ),
    solvedVisual: (
      <span className="solved-words">
        To <strong>{task.angle.name.toLowerCase()}</strong>.
      </span>
    ),
    check: (choice) =>
      choice === task.angle.id
        ? ok(task.angle.success)
        : wrong(task.angle.retry),
    revealMessage: `${task.angle.name}: ${task.angle.description}`,
  }
}

function angleMeasureStep(task) {
  return {
    id: 'angle-measure',
    kind: 'choice',
    title: 'Miara kąta',
    prompt: 'Który opis pasuje do tego kąta?',
    hint: 'Kąt prosty ma 90°, półpełny 180°, a pełny 360°.',
    answer: task.angle.id,
    options: task.descriptionOptions,
    visual: (choiceNode) => (
      <div className="geometry-angle">
        <div className="geometry-angle__figure">
          <AngleFigure type={task.angle.id} />
        </div>
        <span className="geometry-step__question">
          Który opis pasuje do tego kąta?
        </span>
        {choiceNode}
      </div>
    ),
    solvedVisual: (
      <span className="solved-words">
        {task.angle.name}: <strong>{task.angle.range}</strong>
      </span>
    ),
    check: (choice) =>
      choice === task.angle.id
        ? ok(task.angle.measureSuccess)
        : wrong(task.angle.measureRetry),
    revealMessage: `${task.angle.name} — ${task.angle.range}. ${task.angle.description}`,
  }
}

function calculationSteps(task) {
  const steps = []
  let formula = substituteFormula(task.formula, task.dims)

  task.calculations.forEach((calculation, index) => {
    if (index < task.calculations.length - 1) {
      steps.push(phaseStep(task, calculation, formula, index === 0, index))
    }

    steps.push(calcStep(task, calculation, index, formula))
    formula = formulaAfterCalculation(formula, calculation)
  })

  return steps
}

export function buildSteps(task) {
  if (task.kind === 'angle') {
    return [angleTypeStep(task), angleMeasureStep(task)]
  }

  return [
    formulaStep(task),
    substitutionStep(task),
    ...calculationSteps(task),
  ]
}
