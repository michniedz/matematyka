import { AngleFigure } from './AngleFigure.jsx'
import { DimensionList, Figure } from './Figure.jsx'

function ok(message) {
  return { ok: true, message }
}

function wrong(message) {
  return { ok: false, tone: 'warn', message }
}

function sameRational(a, b) {
  return a.n * b.d === b.n * a.d
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

function calcStep(task, calculation, index) {
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
          <span className="geometry-calc__formula-text">{task.formula}</span>
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

export function buildSteps(task) {
  if (task.kind === 'angle') {
    return [angleTypeStep(task), angleMeasureStep(task)]
  }

  return [
    formulaStep(task),
    ...task.calculations.map((calculation, index) =>
      calcStep(task, calculation, index),
    ),
  ]
}
