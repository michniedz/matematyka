import { LineFigure } from './LineFigure.jsx'
import { makeOptions } from './utils.js'

function ok(message) {
  return { ok: true, message }
}

function wrong(message) {
  return { ok: false, tone: 'warn', message }
}

function choiceStep({
  id,
  title,
  prompt,
  hint,
  answer,
  options,
  figure,
  success,
  retry,
  revealMessage,
  solvedVisual,
}) {
  return {
    id,
    kind: 'choice',
    title,
    prompt,
    hint,
    answer,
    options,
    visual: (choiceNode) => (
      <div className="lines-step">
        <div className="lines-step__figure">
          <LineFigure {...figure} />
        </div>
        <span className="lines-step__question">{prompt}</span>
        {choiceNode}
      </div>
    ),
    solvedVisual: solvedVisual ?? <span className="solved-words">{answer}</span>,
    check: (choice) =>
      choice === answer ? ok(success) : wrong(retry),
    revealMessage,
  }
}

function numberStep({
  id,
  title,
  prompt,
  hint,
  answer,
  figure,
  label,
  unit = '°',
  success,
  retry,
  revealMessage,
}) {
  return {
    id,
    kind: 'number',
    title,
    prompt,
    hint,
    answer,
    visual: (input) => (
      <div className="lines-step">
        <div className="lines-step__figure">
          <LineFigure {...figure} />
        </div>
        <div className="lines-calc">
          <span className="lines-calc__label">{label}</span>
          <span className="equals">=</span>
          {input}
          <span className="lines-calc__unit">{unit}</span>
        </div>
      </div>
    ),
    solvedVisual: (
      <span className="solved-line">
        <span>{label}</span>
        <span className="solved-sign">=</span>
        <strong>
          {answer}
          {unit}
        </strong>
      </span>
    ),
    check: (input) => (input === answer ? ok(success) : wrong(retry)),
    revealMessage: revealMessage ?? `${label} = ${answer}${unit}.`,
  }
}

function basicsSteps(task) {
  return [
    choiceStep({
      id: 'basics-answer',
      title: task.title,
      prompt: task.prompt,
      hint: task.hint,
      answer: task.answerId,
      options: task.options,
      figure: task.figure,
      success: `Dobrze! ${task.explanation}`,
      retry: `Jeszcze nie. ${task.hint}`,
      revealMessage: task.explanation,
      solvedVisual: <span className="solved-words">{task.answer}</span>,
    }),
  ]
}

function alphaBetaSteps(task) {
  return [
    choiceStep({
      id: 'alpha-beta-answer',
      title: task.title,
      prompt: task.prompt,
      hint: task.hint,
      answer: task.answerId,
      options: task.options,
      figure: task.figure,
      success: `Dobrze! ${task.explanation}`,
      retry: `Jeszcze nie. ${task.hint}`,
      revealMessage: task.explanation,
      solvedVisual: <span className="solved-words">{task.answer}</span>,
    }),
  ]
}

function intersectionSteps(task) {
  const betaFigure = { ...task.figure, highlight: 'beta' }
  const gammaFigure = { ...task.figure, highlight: 'gamma' }
  const betaRelation = makeOptions('adjacent', [
    {
      id: 'adjacent',
      label: 'Są kątami przyległymi — razem dają 180°',
    },
    {
      id: 'vertical',
      label: 'Są kątami wierzchołkowymi — są równe',
    },
    {
      id: 'full',
      label: 'Razem dają 360°',
    },
  ])
  const gammaRelation = makeOptions('vertical', [
    {
      id: 'vertical',
      label: 'Są kątami wierzchołkowymi — mają równe miary',
    },
    {
      id: 'adjacent',
      label: 'Są kątami przyległymi — razem dają 180°',
    },
    {
      id: 'full',
      label: 'Razem dają 360°',
    },
  ])

  return [
    choiceStep({
      id: 'intersection-relation-beta',
      title: 'Kąty przyległe',
      prompt: 'Jaki związek ma kąt β z kątem α?',
      hint: 'Popatrz na kąty po tej samej stronie jednej z prostych.',
      answer: betaRelation.answer,
      options: betaRelation.options,
      figure: betaFigure,
      success: 'Dobrze! Kąty α i β są przyległe, więc razem dają 180°.',
      retry:
        'Nie. Kąty α i β leżą obok siebie przy jednej prostej — są przyległe.',
      revealMessage: 'Kąty α i β są przyległe: α + β = 180°.',
      solvedVisual: (
        <span className="solved-words">
          β jest przyległy do α
        </span>
      ),
    }),
    numberStep({
      id: 'intersection-beta',
      title: 'Miara kąta beta',
      prompt: 'Ile wynosi β?',
      hint: `α + β = 180°, a α = ${task.given}°.`,
      answer: task.beta,
      figure: betaFigure,
      label: 'β',
      success: `Dobrze! β = ${task.beta}°.`,
      retry: 'Jeszcze nie. Odejmij miarę α od 180°.',
    }),
    choiceStep({
      id: 'intersection-relation-gamma',
      title: 'Kąty wierzchołkowe',
      prompt: 'Jaki związek ma kąt γ z kątem α?',
      hint: 'Kąty γ i α leżą naprzeciw siebie.',
      answer: gammaRelation.answer,
      options: gammaRelation.options,
      figure: gammaFigure,
      success: 'Dobrze! Kąty wierzchołkowe mają równe miary.',
      retry:
        'Nie. Kąty γ i α leżą naprzeciw siebie — są wierzchołkowe.',
      revealMessage: 'Kąty γ i α są wierzchołkowe, więc mają równe miary.',
      solvedVisual: (
        <span className="solved-words">
          γ jest wierzchołkowy do α
        </span>
      ),
    }),
    numberStep({
      id: 'intersection-gamma',
      title: 'Miara kąta gamma',
      prompt: 'Ile wynosi γ?',
      hint: 'Kąty wierzchołkowe są równe.',
      answer: task.gamma,
      figure: gammaFigure,
      label: 'γ',
      success: `Dobrze! γ = ${task.gamma}°.`,
      retry:
        'Jeszcze nie. Kąt γ jest wierzchołkowy do α, więc ma taką samą miarę.',
    }),
    numberStep({
      id: 'intersection-delta',
      title: 'Miara kąta delta',
      prompt: 'Ile wynosi δ?',
      hint: 'Kąt δ jest wierzchołkowy do β, więc ma taką samą miarę.',
      answer: task.delta,
      figure: { ...task.figure, highlight: 'delta' },
      label: 'δ',
      success: `Dobrze! δ = ${task.delta}°.`,
      retry:
        'Jeszcze nie. Kąt δ jest wierzchołkowy do β, więc ma tyle samo.',
    }),
  ]
}

function polygonSteps(task) {
  const shapeName = task.shape === 'triangle' ? 'trójkąta' : 'czworokąta'
  const sumOptions = makeOptions('correct', [
    { id: 'correct', label: `${task.sum}°` },
    {
      id: 'wrong-1',
      label: task.shape === 'triangle' ? '360°' : '180°',
    },
    {
      id: 'wrong-2',
      label: task.shape === 'triangle' ? '90°' : '540°',
    },
  ])

  return [
    choiceStep({
      id: 'polygon-sum',
      title: 'Suma kątów',
      prompt: `Ile wynosi suma kątów wewnętrznych tego ${shapeName}?`,
      hint: task.hint,
      answer: sumOptions.answer,
      options: sumOptions.options,
      figure: task.figure,
      success: `Dobrze! Suma kątów ${shapeName} wynosi ${task.sum}°.`,
      retry: `Jeszcze nie. ${task.hint}`,
      revealMessage: `Suma kątów ${shapeName} wynosi ${task.sum}°.`,
      solvedVisual: (
        <span className="solved-words">
          suma = {task.sum}°
        </span>
      ),
    }),
    numberStep({
      id: 'polygon-known-sum',
      title: 'Suma znanych kątów',
      prompt: 'Ile wynosi suma podanych kątów?',
      hint: `Dodaj podane miary: ${task.knownValues.join(' + ')}.`,
      answer: task.knownSum,
      figure: task.figure,
      label: 'suma znanych',
      success: `Dobrze! ${task.knownValues.join(' + ')} = ${task.knownSum}°.`,
      retry: 'Jeszcze nie. Dodaj wszystkie podane kąty.',
    }),
    numberStep({
      id: 'polygon-missing',
      title: 'Brakujący kąt',
      prompt: 'Ile wynosi brakujący kąt?',
      hint: `Od ${task.sum}° odejmij ${task.knownSum}°.`,
      answer: task.missing,
      figure: { ...task.figure, highlight: task.missingIndex },
      label: 'x',
      success: `Dobrze! x = ${task.missing}°.`,
      retry: `Jeszcze nie. Suma kątów to ${task.sum}°, a znane kąty dają ${task.knownSum}°.`,
    }),
  ]
}

export function buildSteps(task) {
  if (task.kind === 'basics') return basicsSteps(task)
  if (task.kind === 'alpha-beta') return alphaBetaSteps(task)
  if (task.kind === 'intersection') return intersectionSteps(task)
  return polygonSteps(task)
}
