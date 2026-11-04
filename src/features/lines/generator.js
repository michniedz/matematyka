import {
  ALPHA_BETA_TASKS,
  BASIC_TASKS,
  GIVEN_ANGLES,
  QUADRILATERAL_ANGLE_SETS,
  TRIANGLE_ANGLE_SETS,
} from './lines.js'
import { makeChoiceOptions, pick, shuffle } from './utils.js'

let nextTaskId = 1

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function makeBasicsTask() {
  const source = pick(BASIC_TASKS)
  const { options, answerId } = makeChoiceOptions(
    source.answer,
    source.distractors,
  )

  return {
    id: `lines-${nextTaskId++}`,
    kind: 'basics',
    title: source.title,
    prompt: source.prompt,
    figure: { type: source.diagram },
    answer: source.answer,
    options,
    answerId,
    hint: source.hint,
    explanation: source.explanation,
  }
}

function makeAlphaBetaTask() {
  const source = pick(ALPHA_BETA_TASKS)
  const { options, answerId } = makeChoiceOptions(
    source.answer,
    source.distractors,
  )

  return {
    id: `lines-${nextTaskId++}`,
    kind: 'alpha-beta',
    title: source.title,
    prompt: source.prompt,
    figure: source.figure,
    answer: source.answer,
    options,
    answerId,
    hint: source.hint,
    explanation: source.explanation,
  }
}

function makeIntersectionTask() {
  const given = pick(GIVEN_ANGLES)
  const beta = 180 - given
  const segments = Math.random() < 0.5
  const figureType = segments ? 'crossing-segments' : 'crossing-lines'

  return {
    id: `lines-${nextTaskId++}`,
    kind: 'intersection',
    title: segments ? 'Przecięcie odcinków' : 'Przecięcie prostych',
    prompt: `Kąt α ma miarę ${given}°. Oblicz miary kątów β, γ i δ.`,
    given,
    beta,
    gamma: given,
    delta: beta,
    figure: {
      type: figureType,
      givenAngle: given,
      labels: {
        alpha: `α=${given}°`,
        beta: 'β',
        gamma: 'γ',
        delta: 'δ',
      },
    },
    hint: 'Kąty przyległe dają razem 180°, a kąty wierzchołkowe są równe.',
    explanation: `Kąty α i β są przyległe, więc β = 180° − ${given}° = ${beta}°. Kąty α i γ są wierzchołkowe, więc γ = ${given}°. Kąt δ ma także ${beta}°.`,
  }
}

function makePolygonTask() {
  const shape = Math.random() < 0.5 ? 'triangle' : 'quadrilateral'
  const angleSets =
    shape === 'triangle' ? TRIANGLE_ANGLE_SETS : QUADRILATERAL_ANGLE_SETS
  const angles = shuffle(pick(angleSets))
  const missingIndex = randomInt(0, angles.length - 1)
  const knownValues = angles.filter((_, index) => index !== missingIndex)
  const knownSum = knownValues.reduce((sum, value) => sum + value, 0)
  const sum = shape === 'triangle' ? 180 : 360
  const missing = sum - knownSum
  const names = shape === 'triangle' ? ['α', 'β', 'γ'] : ['α', 'β', 'γ', 'δ']
  const labels = angles.map((value, index) =>
    index === missingIndex ? 'x' : `${value}°`,
  )

  return {
    id: `lines-${nextTaskId++}`,
    kind: 'polygon',
    title: shape === 'triangle' ? 'Kąty w trójkącie' : 'Kąty w czworokącie',
    prompt: `Oblicz miarę brakującego kąta w ${
      shape === 'triangle' ? 'trójkącie' : 'czworokącie'
    }.`,
    shape,
    angles,
    names,
    missingIndex,
    knownValues,
    knownSum,
    missing,
    sum,
    figure: {
      type: shape === 'triangle' ? 'triangle-angles' : 'quadrilateral-angles',
      labels,
    },
    hint:
      shape === 'triangle'
        ? 'Suma kątów w trójkącie wynosi 180°.'
        : 'Suma kątów w czworokącie wynosi 360°.',
    explanation: `Suma kątów wewnętrznych ${
      shape === 'triangle' ? 'trójkąta' : 'czworokąta'
    } wynosi ${sum}°. Znane kąty dają ${knownSum}°, więc brakujący kąt ma ${
      missing
    }°.`,
  }
}

export function generateTask(mode = 'mixed') {
  if (mode === 'basics') return makeBasicsTask()
  if (mode === 'alpha-beta') return makeAlphaBetaTask()
  if (mode === 'intersections') return makeIntersectionTask()
  if (mode === 'polygons') return makePolygonTask()

  return pick([
    makeBasicsTask,
    makeAlphaBetaTask,
    makeIntersectionTask,
    makePolygonTask,
  ])()
}
