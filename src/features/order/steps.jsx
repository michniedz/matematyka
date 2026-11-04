import { gcd, lcm } from '../../lib/math.js'
import { Expression, NumberToken } from './Expression.jsx'
import {
  OP_META,
  collectCandidates,
  detectPhase,
  evaluateNode,
  nodeToText,
  pickCandidate,
  reduceNode,
} from './expression.js'
import { formatDecimal, valueToText } from './values.js'

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

function buildCalcStep({ id, target, current, value, style, phase }) {
  const meta = OP_META[target.node.op]
  const text = nodeToText(target.node)
  const answerText = formatDecimal(value) ?? valueToText(value)

  return {
    id,
    kind: style === 'fractions' ? 'fraction' : 'decimal',
    denominatorOptional: style === 'fractions',
    title:
      phase === 'parentheses'
        ? 'Działanie w nawiasie'
        : `${meta.name[0].toUpperCase()}${meta.name.slice(1)}`,
    prompt: `Ile wynosi ${text}?`,
    hint:
      style === 'fractions'
        ? buildFractionHint(target.node)
        : buildDecimalHint(target.node),
    answer: value,
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
          <Expression node={target.node} size="md" />
          <span className="equals">=</span>
          {input}
        </div>
      </div>
    ),
    solvedVisual: (
      <span className="solved-line">
        <Expression node={target.node} size="sm" />
        <span className="solved-sign">=</span>
        <NumberToken value={value} size="sm" />
      </span>
    ),
    check: (input) => {
      if (input.n <= 0) {
        return wrong('Wynik powinien być liczbą dodatnią. Policz jeszcze raz.')
      }

      if (input.n * value.d === value.n * input.d) {
        if (
          style === 'fractions' &&
          input.d !== 1 &&
          gcd(input.n, input.d) > 1
        ) {
          return wrong(
            'To poprawna wartość, ale zapisz ułamek w najprostszej postaci — podziel licznik i mianownik przez ich największy wspólny dzielnik.',
            'warn',
          )
        }

        return ok(`Dobrze! ${text} = ${answerText}.`)
      }

      if (target.node.op === '/') {
        return wrong(
          `Jeszcze nie. Sprawdź dzielenie ${text}. Przy dzieleniu przez ułamek pomnóż przez jego odwrotność.`,
        )
      }

      if (target.node.op === '-' || target.node.op === '+') {
        return wrong(
          `Jeszcze nie. Policz uważnie ${text}. Pamiętaj o wspólnym mianowniku przy ułamkach i o wyrównaniu przecinków przy liczbach dziesiętnych.`,
        )
      }

      return wrong(
        `Jeszcze nie. Policz uważnie ${text} — pomnóż liczniki i mianowniki, a wynik skróć.`,
      )
    },
    revealMessage: `${text} = ${answerText}.`,
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
    steps.push(
      buildCalcStep({
        id: `calc-${calcIndex}`,
        target,
        current,
        value: evaluateNode(target.node, task.style),
        style: task.style,
        phase,
      }),
    )
    calcIndex += 1
    current = reduceNode(current, target.node.id)
  }

  return steps
}
