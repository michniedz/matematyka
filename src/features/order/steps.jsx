import { divisors, gcd, lcm } from '../../lib/math.js'
import { Fraction } from '../../components/Fraction.jsx'
import { MixedNumber } from '../../components/MixedNumber.jsx'
import { Expression, FractionTerm, NumberToken } from './Expression.jsx'
import {
  OP_META,
  collectCandidates,
  detectPhase,
  evaluateNode,
  nodeToText,
  pickCandidate,
  reduceNode,
} from './expression.js'
import {
  formatDecimal,
  fractionValue,
  mixedToText,
  toMixed,
  valueToText,
} from './values.js'

export const PHASES = {
  parentheses: {
    id: 'parentheses',
    option: 'Działanie w nawiasie',
    short: 'nawias',
    title: 'Nawiasy mają pierwszeństwo',
    success: 'Dobrze! Działanie w nawiasie wykonujemy jako pierwsze.',
  },
  muldiv: {
    id: 'muldiv',
    option: 'Mnożenie lub dzielenie',
    short: 'mnożenie i dzielenie',
    title: 'Mnożenie i dzielenie przed dodawaniem',
    success:
      'Dobrze! Mnożenie i dzielenie wykonujemy przed dodawaniem i odejmowaniem.',
  },
  addsub: {
    id: 'addsub',
    option: 'Dodawanie lub odejmowanie',
    short: 'dodawanie i odejmowanie',
    title: 'Dodawanie i odejmowanie na końcu',
    success:
      'Dobrze! Zostały tylko dodawanie i odejmowanie — liczymy od lewej do prawej.',
  },
}

const PHASE_OPTIONS = [
  { id: 'parentheses', label: 'Działanie w nawiasie' },
  { id: 'muldiv', label: 'Mnożenie lub dzielenie' },
  { id: 'addsub', label: 'Dodawanie lub odejmowanie' },
]

const ORDER_HINT =
  'Kolejność: najpierw nawiasy, potem mnożenie i dzielenie, a na końcu dodawanie i odejmowanie. W obrębie tego samego poziomu liczymy od lewej do prawej.'

function ok(message) {
  return { ok: true, message }
}

function wrong(message, tone = 'error') {
  return { ok: false, tone, message }
}

function phaseCheck(expected) {
  return (choice) => {
    if (choice === expected) return ok(PHASES[expected].success)

    if (choice === 'parentheses') {
      return wrong(
        'W tym wyrażeniu nie ma już działania w nawiasie. Spójrz na znaki między liczbami.',
        'warn',
      )
    }

    if (choice === 'muldiv') {
      if (expected === 'parentheses') {
        return wrong(
          'Najpierw trzeba obliczyć działanie w nawiasie — nawiasy mają pierwszeństwo.',
          'warn',
        )
      }
      return wrong(
        'Mnożenia ani dzielenia już nie ma. Zostały dodawanie i odejmowanie.',
        'warn',
      )
    }

    if (expected === 'parentheses') {
      return wrong(
        'Najpierw obliczamy to, co jest w nawiasie. Dopiero potem resztę wyrażenia.',
        'warn',
      )
    }

    return wrong(
      'Mnożenie i dzielenie mają pierwszeństwo przed dodawaniem i odejmowaniem.',
      'warn',
    )
  }
}

function buildPhaseStep({ id, phase, current, first }) {
  return {
    id,
    kind: 'choice',
    title: first ? 'Co wykonujemy najpierw?' : 'Jaka kolejność teraz?',
    prompt: 'Które działanie ma teraz pierwszeństwo?',
    hint: ORDER_HINT,
    answer: phase,
    options: PHASE_OPTIONS,
    visual: (choiceNode) => (
      <div className="order-phase">
        <span className="order-phase__caption">Wyrażenie</span>
        <Expression node={current} size="md" />
        <span className="order-phase__question">Co wykonujemy teraz?</span>
        {choiceNode}
      </div>
    ),
    solvedVisual: (
      <span className="solved-words">
        Teraz: <strong>{PHASES[phase].short}</strong>
      </span>
    ),
    check: phaseCheck(phase),
    revealMessage:
      phase === 'parentheses'
        ? 'Najpierw wykonujemy działanie w nawiasie.'
        : phase === 'muldiv'
          ? 'Teraz wykonujemy mnożenie lub dzielenie.'
          : 'Na końcu wykonujemy dodawanie lub odejmowanie.',
  }
}

function buildFractionHint(node) {
  const a = evaluateNode(node.left)
  const b = evaluateNode(node.right)

  if (node.op === '+' || node.op === '-') {
    const common = lcm(a.d, b.d)
    return `Sprowadź ułamki do wspólnego mianownika ${common}, a potem ${
      node.op === '+' ? 'dodaj' : 'odejmij'
    } liczniki. Mianownik zostaje bez zmian.`
  }

  if (node.op === '*') {
    return 'Pomnóż licznik przez licznik, a mianownik przez mianownik. Na końcu skróć wynik.'
  }

  return `Dzielenie przez ułamek to mnożenie przez jego odwrotność. Odwrotność ${b.n}/${b.d} to ${b.d}/${b.n}. Potem pomnóż i skróć.`
}

function buildRawHint(node) {
  if (node.op === '*') {
    return 'Pomnóż licznik przez licznik, a mianownik przez mianownik. Zapisz wynik bez skracania — skrócimy go w następnym kroku.'
  }

  const a = evaluateNode(node.left)
  const b = evaluateNode(node.right)
  const common = lcm(a.d, b.d)

  return `Sprowadź ułamki do wspólnego mianownika ${common}, a potem ${
    node.op === '+' ? 'dodaj' : 'odejmij'
  } liczniki. Zapisz wynik bez skracania — skrócimy go w następnym kroku.`
}

/**
 * Wynik działania przed skróceniem. Dla mnożenia to iloczyn liczników
 * i mianowników, a dla dodawania i odejmowania licznik na wspólnym
 * mianowniku. Dzielenie ma własne kroki skracania na krzyż, więc tam
 * od razu korzystamy z gotowego wyniku.
 */
function rawCalcValue(target) {
  const node = target.node
  const left = evaluateNode(node.left, 'fractions')
  const right = evaluateNode(node.right, 'fractions')

  if (node.op === '*') {
    return { n: left.n * right.n, d: left.d * right.d, kind: 'frac' }
  }

  const common = lcm(left.d, right.d)
  const leftN = left.n * (common / left.d)
  const rightN = right.n * (common / right.d)

  return {
    n: node.op === '+' ? leftN + rightN : leftN - rightN,
    d: common,
    kind: 'frac',
  }
}

function buildDecimalHint(node) {
  const a = evaluateNode(node.left)
  const b = evaluateNode(node.right)

  if (node.op === '+' || node.op === '-') {
    return 'Ustaw liczby jedna pod drugą tak, aby przecinki były w jednej linii, a potem policz.'
  }

  if (node.op === '*') {
    return 'Pomnóż jak na liczbach całkowitych, a w wyniku wstaw przecinek — tyle miejsc po przecinku, ile jest w obu czynnikach razem.'
  }

  if (b.d !== 1) {
    return `Dzielnik ma przecinek. Pomnóż obie liczby przez 10 (lub 100), aby dzielnik był liczbą całkowitą, i podziel.`
  }

  return `Sprawdź, ile razy liczba ${valueToText(b)} mieści się w ${valueToText(a)}.`
}

function buildDivisionInfo(target) {
  const left = evaluateNode(target.node.left, 'fractions')
  const right = evaluateNode(target.node.right, 'fractions')
  const reciprocal = fractionValue(right.d, right.n)
  const g1 = gcd(left.n, reciprocal.d)
  const g2 = gcd(reciprocal.n, left.d)
  const workLeft = fractionValue(left.n / g1, left.d / g2)
  const workRight = fractionValue(reciprocal.n / g2, reciprocal.d / g1)

  return {
    left,
    right,
    reciprocal,
    g1,
    g2,
    workLeft,
    workRight,
    reduced: g1 > 1 || g2 > 1,
  }
}

function buildReciprocalStep({ id, target, current, division }) {
  const { left, right, reciprocal } = division
  const reciprocalText =
    reciprocal.d === 1
      ? `${reciprocal.n}/1, czyli ${reciprocal.n}`
      : valueToText(reciprocal)

  return {
    id,
    kind: 'fraction',
    title: 'Zamień na mnożenie',
    prompt: 'Uzupełnij odwrotność drugiego ułamka.',
    hint: `Dzielenie przez ułamek to mnożenie przez jego odwrotność. Odwrotność ${valueToText(
      right,
    )} to ${reciprocalText} — wystarczy zamienić miejscami licznik i mianownik.`,
    answer: reciprocal,
    denominatorOptional: reciprocal.d === 1,
    visual: (input) => (
      <div className="order-calc">
        <div className="order-calc__context">
          <span className="order-phase__caption">Całe wyrażenie</span>
          <Expression node={current} size="sm" highlightId={target.node.id} />
        </div>
        <span className="order-calc__arrow" aria-hidden="true">
          ↓
        </span>
        <div className="order-calc__row">
          <Expression node={target.node} size="md" />
          <span className="equals">=</span>
          <FractionTerm value={left} size="md" />
          <span className="op-sign">×</span>
          {input}
        </div>
      </div>
    ),
    solvedVisual: (
      <span className="solved-line">
        <Expression node={target.node} size="sm" />
        <span className="solved-sign">=</span>
        <FractionTerm value={left} size="sm" />
        <span className="solved-sign">×</span>
        <Fraction n={reciprocal.n} d={reciprocal.d} size="sm" />
      </span>
    ),
    check: (value) => {
      if (value.n === reciprocal.n && value.d === reciprocal.d) {
        return ok('Dobrze! Dzielenie zamieniliśmy na mnożenie.')
      }

      if (value.n > 0 && value.n * reciprocal.d === value.d * reciprocal.n) {
        return wrong(
          'To ta sama wartość, ale zapisz odwrotność dokładnie — zamień licznik z mianownikiem.',
          'warn',
        )
      }

      return wrong('Odwrotność to zamiana licznika i mianownika miejscami.')
    },
    revealMessage: `Odwrotność ${valueToText(right)} to ${reciprocalText}.`,
  }
}

function buildCrossCancelStep({ id, division }) {
  const { left, reciprocal, g1, g2, workLeft, workRight } = division
  const fields = []

  if (g1 > 1) {
    fields.push({
      id: 'top',
      answer: g1,
      pair: [left.n, reciprocal.d],
      caption: `skracamy ${left.n} i ${reciprocal.d}`,
      label: `Największy wspólny dzielnik liczb ${left.n} i ${reciprocal.d}`,
    })
  }

  if (g2 > 1) {
    fields.push({
      id: 'bottom',
      answer: g2,
      pair: [reciprocal.n, left.d],
      caption: `skracamy ${reciprocal.n} i ${left.d}`,
      label: `Największy wspólny dzielnik liczb ${reciprocal.n} i ${left.d}`,
    })
  }

  const hint = fields
    .map((field) => {
      const [a, b] = field.pair
      return `Liczby ${a} i ${b}: ${a}: ${divisors(a).join(
        ', ',
      )}; ${b}: ${divisors(b).join(
        ', ',
      )}. Największy wspólny dzielnik to ${field.answer}.`
    })
    .join(' ')

  const describeMistake = (field, value) => {
    const [a, b] = field.pair

    if (value === 1) {
      return 'Liczba 1 niczego nie skraca. Poszukaj dzielnika większego od 1.'
    }

    if (value > 1 && a % value === 0 && b % value === 0) {
      return `To wspólny dzielnik liczb ${a} i ${b}, ale można jeszcze bardziej. Szukamy największego.`
    }

    return `To nie jest wspólny dzielnik liczb ${a} i ${b}.`
  }

  return {
    id,
    kind: 'fields',
    title: 'Skracanie na krzyż',
    prompt:
      fields.length > 1
        ? 'Przez jakie największe liczby można skrócić zaznaczone pary?'
        : 'Przez jaką największą liczbę można skrócić zaznaczone liczby?',
    hint,
    fields,
    emptyMessage: 'Uzupełnij wszystkie liczby.',
    visual: (fieldNode) => (
      <div className="step-formula step-formula--stack">
        <div className="formula-row">
          <Fraction
            n={left.n}
            d={left.d}
            highlightN={g1 > 1}
            highlightD={g2 > 1}
          />
          <span className="op-sign">×</span>
          <Fraction
            n={reciprocal.n}
            d={reciprocal.d}
            highlightD={g1 > 1}
            highlightN={g2 > 1}
          />
        </div>
        {fields.map((field, index) => (
          <div className="formula-row formula-row--answer" key={field.id}>
            <span className="formula-caption">{field.caption}</span>
            {fieldNode(field.id, { autoFocus: index === 0 })}
          </div>
        ))}
      </div>
    ),
    solvedVisual: (
      <span className="solved-line">
        <Fraction n={left.n} d={left.d} size="sm" />
        <span className="solved-sign">×</span>
        <Fraction n={reciprocal.n} d={reciprocal.d} size="sm" />
        <span className="solved-sign">=</span>
        <Fraction n={workLeft.n} d={workLeft.d} size="sm" />
        <span className="solved-sign">×</span>
        <Fraction n={workRight.n} d={workRight.d} size="sm" />
      </span>
    ),
    check: (values) => {
      const incorrect = fields.find(
        (field) => values[field.id] !== field.answer,
      )

      if (!incorrect) {
        return ok('Dobrze! Skracanie na krzyż jest gotowe.')
      }

      return wrong(describeMistake(incorrect, values[incorrect.id]), 'warn')
    },
    revealMessage: `${valueToText(left)} × ${valueToText(
      reciprocal,
    )} = ${valueToText(workLeft)} × ${valueToText(workRight)}.`,
  }
}

function buildDivisionSteps({ idPrefix, target, current }) {
  const division = buildDivisionInfo(target)
  const steps = [
    buildReciprocalStep({
      id: `${idPrefix}-reciprocal`,
      target,
      current,
      division,
    }),
  ]

  if (division.reduced) {
    steps.push(
      buildCrossCancelStep({
        id: `${idPrefix}-cancel`,
        division,
      }),
    )
  }

  return { steps, division }
}

function buildCalcStep({
  id,
  target,
  current,
  value,
  style,
  phase,
  division,
  raw,
}) {
  const meta = OP_META[target.node.op]
  const text = nodeToText(target.node)
  const mixedResult =
    style === 'fractions' && !raw ? toMixed(value) : null
  const wholeResult = style === 'fractions' && !raw && value.d === 1
  const kind =
    style === 'fractions'
      ? raw
        ? 'fraction'
        : mixedResult
          ? 'mixed'
          : wholeResult
            ? 'number'
            : 'fraction'
      : 'decimal'
  const answer = raw ?? mixedResult ?? (wholeResult ? value.n : value)
  const answerText =
    style === 'decimals'
      ? formatDecimal(value) ?? valueToText(value)
      : raw
        ? `${raw.n}/${raw.d}`
        : mixedResult
          ? mixedToText(mixedResult)
          : valueToText(value)
  const fractionDivision = style === 'fractions' && Boolean(division)
  const basePrompt = fractionDivision
    ? 'Uzupełnij wynik mnożenia.'
    : `Ile wynosi ${text}?`
  const baseHint = fractionDivision
    ? division.reduced
      ? 'Po skróceniu pomnóż licznik przez licznik, a mianownik przez mianownik.'
      : 'Pomnóż licznik przez licznik, a mianownik przez mianownik. Na końcu sprawdź, czy wynik jest w najprostszej postaci.'
    : style === 'fractions'
      ? buildFractionHint(target.node)
      : buildDecimalHint(target.node)
  const mistakeMessage = () => {
    if (target.node.op === '/') {
      return `Jeszcze nie. Sprawdź dzielenie ${text}. Przy dzieleniu przez ułamek pomnóż przez jego odwrotność.`
    }

    if (target.node.op === '-' || target.node.op === '+') {
      return `Jeszcze nie. Policz uważnie ${text}. Pamiętaj o wspólnym mianowniku przy ułamkach i o wyrównaniu przecinków przy liczbach dziesiętnych.`
    }

    return `Jeszcze nie. Policz uważnie ${text} — pomnóż liczniki i mianowniki, a wynik skróć.`
  }
  const resultVisual = (size) =>
    raw ? (
      <Fraction n={raw.n} d={raw.d} size={size} />
    ) : mixedResult ? (
      <MixedNumber
        whole={mixedResult.whole}
        n={mixedResult.n}
        d={mixedResult.d}
        size={size}
      />
    ) : (
      <NumberToken value={value} size={size} />
    )

  return {
    id,
    kind,
    title:
      phase === 'parentheses'
        ? 'Działanie w nawiasie'
        : fractionDivision
          ? 'Dzielenie ułamków'
          : `${meta.name[0].toUpperCase()}${meta.name.slice(1)}`,
    prompt: raw
      ? `${basePrompt} Wpisz wynik przed skróceniem.`
      : mixedResult
        ? `${basePrompt} Wynik zapisz jako liczbę mieszaną.`
        : basePrompt,
    hint: raw
      ? buildRawHint(target.node)
      : mixedResult
        ? `${baseHint} Wynik jest większy od 1, więc wyciągnij całości: ${value.n} ÷ ${value.d} = ${mixedResult.whole} reszty ${mixedResult.n}.`
        : baseHint,
    answer,
    answerText,
    visual: (input) => (
      <div className="order-calc">
        <div className="order-calc__context">
          <span className="order-phase__caption">Całe wyrażenie</span>
          <Expression
            node={current}
            size="sm"
            highlightId={target.node.id}
          />
        </div>
        <span className="order-calc__arrow" aria-hidden="true">
          ↓
        </span>
        <div className="order-calc__row">
          {fractionDivision ? (
            <>
              <Expression node={target.node} size="md" />
              <span className="equals">=</span>
              <FractionTerm value={division.left} size="md" />
              <span className="op-sign">×</span>
              <Fraction
                n={division.reciprocal.n}
                d={division.reciprocal.d}
                size="md"
              />
              {division.reduced ? (
                <>
                  <span className="equals">=</span>
                  <Fraction
                    n={division.workLeft.n}
                    d={division.workLeft.d}
                    size="md"
                  />
                  <span className="op-sign">×</span>
                  <Fraction
                    n={division.workRight.n}
                    d={division.workRight.d}
                    size="md"
                  />
                </>
              ) : null}
              <span className="equals">=</span>
              {input}
            </>
          ) : (
            <>
              <Expression node={target.node} size="md" />
              <span className="equals">=</span>
              {input}
            </>
          )}
        </div>
      </div>
    ),
    solvedVisual: fractionDivision ? (
      <span className="solved-line">
        <Expression node={target.node} size="sm" />
        <span className="solved-sign">=</span>
        <FractionTerm value={division.left} size="sm" />
        <span className="solved-sign">×</span>
        <Fraction
          n={division.reciprocal.n}
          d={division.reciprocal.d}
          size="sm"
        />
        {division.reduced ? (
          <>
            <span className="solved-sign">=</span>
            <Fraction
              n={division.workLeft.n}
              d={division.workLeft.d}
              size="sm"
            />
            <span className="solved-sign">×</span>
            <Fraction
              n={division.workRight.n}
              d={division.workRight.d}
              size="sm"
            />
          </>
        ) : null}
        <span className="solved-sign">=</span>
        {resultVisual('sm')}
      </span>
    ) : (
      <span className="solved-line">
        <Expression node={target.node} size="sm" />
        <span className="solved-sign">=</span>
        {resultVisual('sm')}
      </span>
    ),
    check: (input) => {
      if (raw) {
        const parsed = typeof input === 'number' ? { n: input, d: 1 } : input

        if (parsed.n === raw.n && parsed.d === raw.d) {
          return ok(
            `Dobrze! ${text} = ${raw.n}/${raw.d}. Teraz skrócimy wynik.`,
          )
        }

        if (parsed.n * raw.d === raw.n * parsed.d) {
          return wrong(
            `To ta sama wartość, ale zapisz dokładny wynik działania przed skróceniem: ${raw.n}/${raw.d}.`,
            'warn',
          )
        }

        return wrong(mistakeMessage())
      }

      if (kind === 'mixed') {
        const { whole, n, d } = input
        const totalN = whole * d + n

        if (n === 0) {
          return wrong(
            'Część ułamkowa nie może być zerowa. Całości wpisz w pierwsze pole, a w liczniku zostaw resztę.',
            'warn',
          )
        }

        if (n >= d) {
          return wrong(
            'Część ułamkowa musi być mniejsza od mianownika. Wyciągnij całości do pierwszego pola.',
            'warn',
          )
        }

        if (totalN * value.d !== value.n * d) {
          return wrong(mistakeMessage())
        }

        if (gcd(n, d) > 1) {
          return wrong(
            'To poprawna wartość, ale część ułamkowa nie jest w najprostszej postaci — skróć licznik i mianownik przez ich największy wspólny dzielnik.',
            'warn',
          )
        }

        return ok(`Dobrze! ${text} = ${answerText}.`)
      }

      const parsed = typeof input === 'number' ? { n: input, d: 1 } : input

      if (parsed.n <= 0) {
        return wrong('Wynik powinien być liczbą dodatnią. Policz jeszcze raz.')
      }

      if (parsed.n * value.d === value.n * parsed.d) {
        if (
          style === 'fractions' &&
          parsed.d !== 1 &&
          gcd(parsed.n, parsed.d) > 1
        ) {
          return wrong(
            'To poprawna wartość, ale zapisz ułamek w najprostszej postaci — podziel licznik i mianownik przez ich największy wspólny dzielnik.',
            'warn',
          )
        }

        return ok(`Dobrze! ${text} = ${answerText}.`)
      }

      return wrong(mistakeMessage())
    },
    revealMessage: `${text} = ${answerText}.`,
  }
}

function buildSimplifyStep({ id, raw, value }) {
  const divisor = gcd(raw.n, raw.d)
  const mixed = toMixed(value)
  const kind = value.d === 1 ? 'number' : mixed ? 'mixed' : 'fraction'
  const rawText = `${raw.n}/${raw.d}`
  const answerText =
    kind === 'mixed'
      ? mixedToText(mixed)
      : kind === 'number'
        ? String(value.n)
        : `${value.n}/${value.d}`
  const hint =
    kind === 'mixed'
      ? `Podziel licznik i mianownik przez ${divisor}: ${raw.n} ÷ ${divisor} = ${value.n}, ${raw.d} ÷ ${divisor} = ${value.d}. Potem wyciągnij całości: ${value.n} ÷ ${value.d} = ${mixed.whole} reszty ${mixed.n}.`
      : `Podziel licznik i mianownik przez ich największy wspólny dzielnik. NWD(${raw.n}, ${raw.d}) = ${divisor}. ${raw.n} ÷ ${divisor} = ${value.n}, ${raw.d} ÷ ${divisor} = ${value.d}.`
  const prompt =
    kind === 'mixed'
      ? 'Skróć ułamek i zapisz wynik jako liczbę mieszaną.'
      : kind === 'number'
        ? 'Skróć wynik i zapisz go jako liczbę całkowitą.'
        : 'Skróć ułamek do najprostszej postaci.'

  const resultVisual = (size) => {
    if (kind === 'mixed') {
      return (
        <MixedNumber
          whole={mixed.whole}
          n={mixed.n}
          d={mixed.d}
          size={size}
        />
      )
    }

    if (kind === 'number') {
      return <NumberToken value={value} size={size} />
    }

    return <Fraction n={value.n} d={value.d} size={size} />
  }

  return {
    id,
    kind,
    title: kind === 'mixed' ? 'Skróć i wyciągnij całości' : 'Skróć wynik',
    prompt,
    hint,
    answer: kind === 'mixed' ? mixed : kind === 'number' ? value.n : value,
    answerText,
    visual: (input) => (
      <div className="order-mixed">
        <span className="order-phase__caption">Wynik przed skróceniem</span>
        <div className="order-mixed__row">
          <Fraction n={raw.n} d={raw.d} size="md" />
          <span className="equals">=</span>
          {input}
        </div>
      </div>
    ),
    solvedVisual: (
      <span className="solved-line">
        <Fraction n={raw.n} d={raw.d} size="sm" />
        <span className="solved-sign">=</span>
        {resultVisual('sm')}
      </span>
    ),
    check: (input) => {
      if (kind === 'mixed') {
        const { whole, n, d } = input
        const totalN = whole * d + n

        if (n === 0) {
          return wrong(
            'Wpisz część ułamkową — resztę z dzielenia umieść w liczniku.',
            'warn',
          )
        }

        if (n >= d) {
          return wrong(
            'Część ułamkowa musi być mniejsza od mianownika. Wyciągnij całości do pierwszego pola.',
            'warn',
          )
        }

        if (totalN * value.d !== value.n * d) {
          return wrong(
            'Jeszcze nie. Najpierw skróć ułamek, a potem wyciągnij całości.',
          )
        }

        if (gcd(n, d) > 1) {
          return wrong(
            'To poprawna wartość, ale część ułamkowa nie jest w najprostszej postaci — skróć ją.',
            'warn',
          )
        }

        return ok(`Dobrze! ${rawText} = ${answerText}.`)
      }

      if (kind === 'number') {
        if (input === value.n) {
          return ok(`Dobrze! ${rawText} = ${value.n}.`)
        }

        return wrong(
          'Jeszcze nie. Podziel licznik i mianownik przez ich największy wspólny dzielnik.',
        )
      }

      if (input.n * value.d === value.n * input.d) {
        if (input.n === value.n && input.d === value.d) {
          return ok(`Dobrze! ${rawText} = ${answerText}.`)
        }

        const remaining = gcd(input.n, input.d)

        return wrong(
          `To ta sama wartość, ale można ją jeszcze skrócić. Podziel licznik i mianownik przez ${remaining}.`,
          'warn',
        )
      }

      return wrong(
        'Skracanie nie zmienia wartości ułamka. Podziel licznik i mianownik przez tę samą liczbę.',
      )
    },
    revealMessage: `${rawText} = ${answerText}.`,
  }
}

export function buildSteps(task) {
  const steps = []
  let current = task.ast
  let lastPhase = null
  let phaseIndex = 0
  let calcIndex = 0

  for (let guard = 0; guard < 12; guard += 1) {
    if (current.type === 'num') break

    const candidates = collectCandidates(current)
    if (!candidates.length) break

    const phase = detectPhase(candidates)

    if (phase !== lastPhase) {
      steps.push(
        buildPhaseStep({
          id: `phase-${phaseIndex}`,
          phase,
          current,
          first: lastPhase === null,
        }),
      )
      phaseIndex += 1
      lastPhase = phase
    }

    const target = pickCandidate(candidates, phase)
    let division = null

    if (task.style === 'fractions' && target.node.op === '/') {
      const prepared = buildDivisionSteps({
        idPrefix: `calc-${calcIndex}`,
        target,
        current,
      })
      steps.push(...prepared.steps)
      division = prepared.division
    }

    const value = evaluateNode(target.node, task.style)
    const raw =
      task.style === 'fractions' && !division ? rawCalcValue(target) : null
    const rawNeedsSimplify = raw && gcd(raw.n, raw.d) > 1 ? raw : null

    steps.push(
      buildCalcStep({
        id: `calc-${calcIndex}`,
        target,
        current,
        value,
        style: task.style,
        phase,
        division,
        raw: rawNeedsSimplify,
      }),
    )

    if (rawNeedsSimplify) {
      steps.push(
        buildSimplifyStep({
          id: `calc-${calcIndex}-simplify`,
          raw: rawNeedsSimplify,
          value,
        }),
      )
    }

    calcIndex += 1
    current = reduceNode(current, target.node.id)
  }

  return steps
}
