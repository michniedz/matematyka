import { ANGLES } from './angles.js'
import { FIGURES } from './figures.js'
import { formatNumber, rationalFromNumber } from './values.js'

const TRIANGLE_AREA_PAIRS = [
  { a: 6, h: 4 },
  { a: 8, h: 5 },
  { a: 10, h: 6 },
  { a: 12, h: 7 },
  { a: 14, h: 5 },
  { a: 5, h: 6 },
  { a: 7, h: 8 },
  { a: 9, h: 4 },
  { a: 11, h: 6 },
  { a: 13, h: 8 },
]

const TRIANGLE_SIDES = [
  { a: 5, b: 6, c: 7 },
  { a: 6, b: 8, c: 10 },
  { a: 7, b: 8, c: 11 },
  { a: 9, b: 10, c: 12 },
  { a: 8, b: 11, c: 14 },
]

const RIGHT_TRIANGLES = [
  { a: 3, b: 4, c: 5 },
  { a: 6, b: 8, c: 10 },
  { a: 5, b: 12, c: 13 },
  { a: 9, b: 12, c: 15 },
  { a: 8, b: 15, c: 17 },
]

const EQUILATERAL_SIDES = [4, 6, 8, 10]

const ISOSCELES_TRIANGLES = [
  { a: 6, b: 5, h: 4 },
  { a: 8, b: 5, h: 3 },
  { a: 10, b: 13, h: 12 },
]

const RHOMBUS_DIAGONALS = [
  { e: 6, f: 8 },
  { e: 8, f: 10 },
  { e: 10, f: 12 },
  { e: 6, f: 10 },
  { e: 12, f: 16 },
  { e: 8, f: 12 },
]

const TRAPEZOIDS = [
  { a: 10, b: 6, h: 4 },
  { a: 12, b: 4, h: 6 },
  { a: 14, b: 8, h: 5 },
  { a: 9, b: 5, h: 6 },
  { a: 16, b: 10, h: 4 },
  { a: 11, b: 7, h: 8 },
]

const ISOSCELES_TRAPEZOIDS = [
  { a: 10, b: 4, h: 4, c: 5 },
  { a: 12, b: 6, h: 4, c: 5 },
  { a: 14, b: 4, h: 12, c: 13 },
  { a: 16, b: 8, h: 3, c: 5 },
]

const RIGHT_TRAPEZOIDS = [
  { a: 8, b: 5, h: 4, c: 5 },
  { a: 12, b: 6, h: 8, c: 10 },
  { a: 9, b: 4, h: 12, c: 13 },
  { a: 12, b: 4, h: 6, c: 10 },
]

let nextTaskId = 1

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function shuffle(list) {
  const result = [...list]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

function round1(value) {
  return Math.round(value * 10) / 10
}

function makeFormulaOptions(correct, distractors) {
  const labels = shuffle([correct, ...distractors]).filter(
    (label, index, all) => all.indexOf(label) === index,
  )
  const options = labels.map((label, index) => ({
    id: `formula-${index}`,
    label,
  }))

  return {
    options,
    answerId: options.find((option) => option.label === correct).id,
  }
}

function calc(expression, value, title, prompt, hint) {
  const rounded = Math.round(value * 100) / 100

  return {
    expression,
    value: rounded,
    valueText: formatNumber(rounded),
    rational: rationalFromNumber(rounded),
    kind: Number.isInteger(rounded) ? 'number' : 'decimal',
    title,
    prompt,
    hint,
  }
}

function buildArea(figure) {
  switch (figure.id) {
    case 'square': {
      const a = randomInt(3, 12)
      return {
        dims: { a },
        calculations: [
          calc(
            `${a} · ${a}`,
            a * a,
            'Pole kwadratu',
            'Ile wynosi pole?',
            'Pole kwadratu to bok pomnożony przez ten sam bok.',
          ),
        ],
      }
    }

    case 'rectangle': {
      let a = randomInt(4, 12)
      let b = randomInt(3, 9)
      if (a === b) b = b === 3 ? 4 : b - 1

      return {
        dims: { a, b },
        calculations: [
          calc(
            `${a} · ${b}`,
            a * b,
            'Pole prostokąta',
            'Ile wynosi pole?',
            'Pomnóż długość przez szerokość.',
          ),
        ],
      }
    }

    case 'triangle': {
      const { a, h } = pick(TRIANGLE_AREA_PAIRS)
      const product = a * h

      return {
        dims: { a, h },
        calculations: [
          calc(
            `${a} · ${h}`,
            product,
            'Podstawa razy wysokość',
            `Ile wynosi ${a} · ${h}?`,
            'Pomnóż podstawę przez wysokość.',
          ),
          calc(
            `${product} : 2`,
            product / 2,
            'Pole trójkąta',
            'Ile wynosi pole?',
            'Pole trójkąta to połowa iloczynu podstawy i wysokości.',
          ),
        ],
      }
    }

    case 'right-triangle': {
      const { a, b } = pick(RIGHT_TRIANGLES)
      const product = a * b

      return {
        dims: { a, b },
        calculations: [
          calc(
            `${a} · ${b}`,
            product,
            'Przyprostokątne',
            `Ile wynosi ${a} · ${b}?`,
            'Przyprostokątne są podstawą i wysokością. Pomnóż je.',
          ),
          calc(
            `${product} : 2`,
            product / 2,
            'Pole trójkąta prostokątnego',
            'Ile wynosi pole?',
            'Pole to połowa iloczynu przyprostokątnych.',
          ),
        ],
      }
    }

    case 'equilateral-triangle': {
      const a = pick(EQUILATERAL_SIDES)
      const h = round1((a * Math.sqrt(3)) / 2)
      const product = round1(a * h)

      return {
        dims: { a, h },
        approxKeys: ['h'],
        calculations: [
          calc(
            `${a} · ${formatNumber(h)}`,
            product,
            'Bok razy wysokość',
            `Ile wynosi ${a} · ${formatNumber(h)}?`,
            'Pomnóż bok przez wysokość. Wysokość jest podana w przybliżeniu.',
          ),
          calc(
            `${formatNumber(product)} : 2`,
            product / 2,
            'Pole trójkąta równobocznego',
            'Ile wynosi pole?',
            'Pole trójkąta to połowa iloczynu podstawy i wysokości.',
          ),
        ],
      }
    }

    case 'isosceles-triangle': {
      const { a, h } = pick(ISOSCELES_TRIANGLES)
      const product = a * h

      return {
        dims: { a, h },
        calculations: [
          calc(
            `${a} · ${h}`,
            product,
            'Podstawa razy wysokość',
            `Ile wynosi ${a} · ${h}?`,
            'Pomnóż podstawę przez wysokość.',
          ),
          calc(
            `${product} : 2`,
            product / 2,
            'Pole trójkąta równoramiennego',
            'Ile wynosi pole?',
            'Pole to połowa iloczynu podstawy i wysokości.',
          ),
        ],
      }
    }

    case 'rhombus': {
      const { e, f } = pick(RHOMBUS_DIAGONALS)
      const product = e * f

      return {
        dims: { e, f },
        calculations: [
          calc(
            `${e} · ${f}`,
            product,
            'Iloczyn przekątnych',
            `Ile wynosi ${e} · ${f}?`,
            'Pomnóż długości obu przekątnych.',
          ),
          calc(
            `${product} : 2`,
            product / 2,
            'Pole rombu',
            'Ile wynosi pole?',
            'Pole rombu to połowa iloczynu przekątnych.',
          ),
        ],
      }
    }

    case 'parallelogram': {
      const a = randomInt(4, 14)
      const h = randomInt(3, 9)

      return {
        dims: { a, h },
        calculations: [
          calc(
            `${a} · ${h}`,
            a * h,
            'Pole równoległoboku',
            'Ile wynosi pole?',
            'Pomnóż podstawę przez wysokość.',
          ),
        ],
      }
    }

    case 'trapezoid':
    case 'isosceles-trapezoid':
    case 'right-trapezoid': {
      const source =
        figure.id === 'trapezoid'
          ? TRAPEZOIDS
          : figure.id === 'isosceles-trapezoid'
            ? ISOSCELES_TRAPEZOIDS
            : RIGHT_TRAPEZOIDS
      const { a, b, h } = pick(source)
      const sum = a + b
      const product = sum * h

      return {
        dims: { a, b, h },
        calculations: [
          calc(
            `${a} + ${b}`,
            sum,
            'Suma podstaw',
            `Ile wynosi ${a} + ${b}?`,
            'Dodaj długości obu podstaw.',
          ),
          calc(
            `${sum} · ${h}`,
            product,
            'Podstawy razy wysokość',
            `Ile wynosi ${sum} · ${h}?`,
            'Pomnóż sumę podstaw przez wysokość.',
          ),
          calc(
            `${product} : 2`,
            product / 2,
            'Pole trapezu',
            'Ile wynosi pole?',
            'Pole trapezu to połowa iloczynu sumy podstaw i wysokości.',
          ),
        ],
      }
    }

    case 'circle': {
      const r = randomInt(1, 10)
      const square = r * r
      const area = (314 * square) / 100

      return {
        dims: { r },
        calculations: [
          calc(
            `${r} · ${r}`,
            square,
            'Kwadrat promienia',
            `Ile wynosi ${r} · ${r}?`,
            'Pomnóż promień przez niego samego.',
          ),
          calc(
            `${square} · 3,14`,
            area,
            'Pole koła',
            'Ile wynosi pole? (π ≈ 3,14)',
            'Pomnóż kwadrat promienia przez 3,14.',
          ),
        ],
      }
    }

    default:
      throw new Error(`Nieznana figura: ${figure.id}`)
  }
}

function buildPerimeter(figure) {
  switch (figure.id) {
    case 'square': {
      const a = randomInt(3, 12)
      return {
        dims: { a },
        calculations: [
          calc(
            `4 · ${a}`,
            4 * a,
            'Obwód kwadratu',
            'Ile wynosi obwód?',
            'Kwadrat ma cztery równe boki.',
          ),
        ],
      }
    }

    case 'rectangle': {
      let a = randomInt(4, 12)
      let b = randomInt(3, 9)
      if (a === b) b = b === 3 ? 4 : b - 1
      const sum = a + b

      return {
        dims: { a, b },
        calculations: [
          calc(
            `${a} + ${b}`,
            sum,
            'Długość i szerokość',
            `Ile wynosi ${a} + ${b}?`,
            'Dodaj długość i szerokość.',
          ),
          calc(
            `2 · ${sum}`,
            2 * sum,
            'Obwód prostokąta',
            'Ile wynosi obwód?',
            'Dodaj długość i szerokość, a potem pomnóż przez 2.',
          ),
        ],
      }
    }

    case 'triangle': {
      const { a, b, c } = pick(TRIANGLE_SIDES)

      return {
        dims: { a, b, c },
        calculations: [
          calc(
            `${a} + ${b} + ${c}`,
            a + b + c,
            'Obwód trójkąta',
            'Ile wynosi obwód?',
            'Dodaj długości wszystkich trzech boków.',
          ),
        ],
      }
    }

    case 'right-triangle': {
      const { a, b, c } = pick(RIGHT_TRIANGLES)

      return {
        dims: { a, b, c },
        calculations: [
          calc(
            `${a} + ${b} + ${c}`,
            a + b + c,
            'Obwód trójkąta prostokątnego',
            'Ile wynosi obwód?',
            'Dodaj obie przyprostokątne i przeciwprostokątną.',
          ),
        ],
      }
    }

    case 'equilateral-triangle': {
      const a = randomInt(3, 12)

      return {
        dims: { a },
        calculations: [
          calc(
            `3 · ${a}`,
            3 * a,
            'Obwód trójkąta równobocznego',
            'Ile wynosi obwód?',
            'Trójkąt równoboczny ma trzy równe boki.',
          ),
        ],
      }
    }

    case 'isosceles-triangle': {
      const { a, b } = pick(ISOSCELES_TRIANGLES)
      const arms = 2 * b

      return {
        dims: { a, b },
        calculations: [
          calc(
            `2 · ${b}`,
            arms,
            'Dwa ramiona',
            `Ile wynosi 2 · ${b}?`,
            'Pomnóż długość ramienia przez 2.',
          ),
          calc(
            `${a} + ${arms}`,
            a + arms,
            'Obwód trójkąta równoramiennego',
            'Ile wynosi obwód?',
            'Dodaj podstawę i dwa ramiona.',
          ),
        ],
      }
    }

    case 'rhombus': {
      const a = randomInt(3, 10)

      return {
        dims: { a },
        calculations: [
          calc(
            `4 · ${a}`,
            4 * a,
            'Obwód rombu',
            'Ile wynosi obwód?',
            'Romb ma cztery równe boki.',
          ),
        ],
      }
    }

    case 'parallelogram': {
      let a = randomInt(4, 12)
      let b = randomInt(3, 8)
      if (a === b) b = b === 3 ? 4 : b - 1
      const sum = a + b

      return {
        dims: { a, b },
        calculations: [
          calc(
            `${a} + ${b}`,
            sum,
            'Dwa sąsiednie boki',
            `Ile wynosi ${a} + ${b}?`,
            'Dodaj dwa sąsiednie boki.',
          ),
          calc(
            `2 · ${sum}`,
            2 * sum,
            'Obwód równoległoboku',
            'Ile wynosi obwód?',
            'Dodaj dwa sąsiednie boki i pomnóż przez 2.',
          ),
        ],
      }
    }

    case 'trapezoid': {
      const { a, b } = pick(TRAPEZOIDS)
      const c = randomInt(4, 8)
      const d = randomInt(4, 8)

      return {
        dims: { a, b, c, d },
        calculations: [
          calc(
            `${a} + ${b} + ${c} + ${d}`,
            a + b + c + d,
            'Obwód trapezu',
            'Ile wynosi obwód?',
            'Dodaj wszystkie cztery boki.',
          ),
        ],
      }
    }

    case 'isosceles-trapezoid': {
      const { a, b, c } = pick(ISOSCELES_TRAPEZOIDS)
      const arms = 2 * c

      return {
        dims: { a, b, c },
        calculations: [
          calc(
            `2 · ${c}`,
            arms,
            'Dwa ramiona',
            `Ile wynosi 2 · ${c}?`,
            'Pomnóż długość ramienia przez 2.',
          ),
          calc(
            `${a} + ${b} + ${arms}`,
            a + b + arms,
            'Obwód trapezu równoramiennego',
            'Ile wynosi obwód?',
            'Dodaj obie podstawy i dwa ramiona.',
          ),
        ],
      }
    }

    case 'right-trapezoid': {
      const { a, b, h, c } = pick(RIGHT_TRAPEZOIDS)

      return {
        dims: { a, b, h, c },
        calculations: [
          calc(
            `${a} + ${b} + ${h} + ${c}`,
            a + b + h + c,
            'Obwód trapezu prostokątnego',
            'Ile wynosi obwód?',
            'Dodaj obie podstawy, wysokość i drugie ramię.',
          ),
        ],
      }
    }

    case 'circle': {
      const r = randomInt(1, 10)
      const diameter = 2 * r
      const circumference = (628 * r) / 100

      return {
        dims: { r },
        calculations: [
          calc(
            `2 · ${r}`,
            diameter,
            'Średnica',
            `Ile wynosi 2 · ${r}?`,
            'Podwojony promień to średnica.',
          ),
          calc(
            `${diameter} · 3,14`,
            circumference,
            'Obwód koła',
            'Ile wynosi obwód? (π ≈ 3,14)',
            'Pomnóż średnicę przez 3,14.',
          ),
        ],
      }
    }

    default:
      throw new Error(`Nieznana figura: ${figure.id}`)
  }
}

function makeFigureTask(figure, quantity) {
  const data = quantity === 'area' ? buildArea(figure) : buildPerimeter(figure)
  const formulaMeta = figure[quantity]
  const { options, answerId } = makeFormulaOptions(
    formulaMeta.formula,
    formulaMeta.distractors,
  )
  const final = data.calculations[data.calculations.length - 1]

  return {
    id: `geometry-${nextTaskId++}`,
    kind: 'figure',
    figure,
    figureId: figure.id,
    quantity,
    dims: data.dims,
    approxKeys: data.approxKeys ?? [],
    formula: formulaMeta.formula,
    formulaHint: formulaMeta.hint,
    formulaOptions: options,
    formulaAnswerId: answerId,
    calculations: data.calculations,
    answer: final.value,
    answerText: final.valueText,
    answerRational: final.rational,
    answerKind: final.kind,
    unit: quantity === 'area' ? 'cm²' : 'cm',
    prompt: quantity === 'area' ? 'Oblicz pole tej figury.' : 'Oblicz obwód tej figury.',
    explanation: figure.explanation,
  }
}

function makeAngleTask() {
  const angle = pick(ANGLES)
  const otherAngles = shuffle(ANGLES.filter((item) => item.id !== angle.id)).slice(
    0,
    2,
  )

  const typeOptions = shuffle([angle, ...otherAngles]).map((item) => ({
    id: item.id,
    label: item.name,
  }))

  const descriptionOptions = shuffle([angle, ...otherAngles]).map((item) => ({
    id: item.id,
    label: item.descriptionOption,
  }))

  return {
    id: `geometry-${nextTaskId++}`,
    kind: 'angle',
    angle,
    typeOptions,
    descriptionOptions,
    prompt: 'Jaki to kąt?',
  }
}

export function generateTask(mode = 'mixed') {
  if (mode === 'angles' || (mode === 'mixed' && Math.random() < 0.25)) {
    return makeAngleTask()
  }

  const quantity =
    mode === 'area'
      ? 'area'
      : mode === 'perimeter'
        ? 'perimeter'
        : pick(['area', 'perimeter'])

  return makeFigureTask(pick(FIGURES), quantity)
}
