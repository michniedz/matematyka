import { Fraction } from '../../components/Fraction.jsx'
import { denominators, divisors, gcd, isEquivalent } from '../../lib/math.js'

const NUMBER_OF_MULTIPLES = 6

function numberStep({ id, title, prompt, hint, answer, visual, solvedVisual, check, revealMessage }) {
  return {
    id,
    kind: 'number',
    title,
    prompt,
    hint,
    answer,
    visual,
    solvedVisual,
    check,
    revealMessage,
  }
}

function fractionStep({ id, title, prompt, hint, answer, visual, solvedVisual, check, revealMessage }) {
  return {
    id,
    kind: 'fraction',
    title,
    prompt,
    hint,
    answer,
    visual,
    solvedVisual,
    check,
    revealMessage,
  }
}

function ok(message) {
  return { ok: true, message }
}

function wrong(message, tone = 'error') {
  return { ok: false, tone, message }
}

function checkDivisor(a, b, expected) {
  return (value) => {
    if (value === expected) {
      return ok(`Dobrze! Obie liczby dzielimy przez ${expected}.`)
    }

    if (value === 1) {
      return wrong(
        'Liczba 1 niczego nie skraca. Poszukaj dzielnika większego od 1.',
        'warn',
      )
    }

    if (value > 1 && a % value === 0 && b % value === 0) {
      return wrong(
        'To wspólny dzielnik, ale można jeszcze bardziej. Szukamy największej takiej liczby.',
        'warn',
      )
    }

    return wrong(`To nie jest wspólny dzielnik liczb ${a} i ${b}.`)
  }
}

function checkSimpleFraction(expected) {
  return (value) => {
    if (value.n === expected.n && value.d === expected.d) {
      return ok('Świetnie! To poprawny wynik.')
    }

    if (value.n > 0 && isEquivalent(value, expected)) {
      return wrong(
        'To ta sama wartość, ale zapisz wynik w najprostszej postaci — skróć ułamek.',
        'warn',
      )
    }

    return wrong('Jeszcze nie. Policz uważnie licznik i mianownik.')
  }
}

function checkSimplification(raw, answer) {
  return (value) => {
    if (value.n === answer.n && value.d === answer.d) {
      return ok('Brawo! Ułamek jest w najprostszej postaci.')
    }

    if (value.n > 0 && value.n * raw.d === value.d * raw.n) {
      const remaining = gcd(value.n, value.d)
      return wrong(
        `To ten sam ułamek, ale można go jeszcze skrócić. Podziel licznik i mianownik przez ${remaining}.`,
        'warn',
      )
    }

    return wrong(
      'Skracanie nie zmienia wartości ułamka. Podziel licznik i mianownik przez tę samą liczbę.',
    )
  }
}

function solvedEquation(left, sign, right, equals, result) {
  return (
    <span className="solved-line">
      <Fraction n={left.n} d={left.d} size="sm" />
      <span className="solved-sign">{sign}</span>
      <Fraction n={right.n} d={right.d} size="sm" />
      <span className="solved-sign">{equals}</span>
      <Fraction n={result.n} d={result.d} size="sm" />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Dodawanie i odejmowanie                                            */
/* ------------------------------------------------------------------ */

function buildAddSubSteps(task) {
  const { left, right, lcd, scaledLeft, scaledRight, resN, answer, op } = task
  const sign = op === 'add' ? '+' : '−'
  const action = op === 'add' ? 'dodajemy' : 'odejmujemy'
  const steps = []

  steps.push(
    numberStep({
      id: 'common-denominator',
      title: 'Wspólny mianownik',
      prompt: 'Jaki będzie najmniejszy wspólny mianownik obu ułamków?',
      hint: `Wypisz wielokrotności mianowników: ${left.d}: ${denominators(
        left.d,
        NUMBER_OF_MULTIPLES,
      ).join(', ')}… oraz ${right.d}: ${denominators(
        right.d,
        NUMBER_OF_MULTIPLES,
      ).join(
        ', ',
      )}… Najmniejsza liczba, która pojawia się w obu ciągach, to wspólny mianownik.`,
      answer: lcd,
      visual: (input) => (
        <div className="step-formula step-formula--stack">
          <div className="formula-row">
            <Fraction n={left.n} d={left.d} />
            <span className="op-sign">{sign}</span>
            <Fraction n={right.n} d={right.d} />
          </div>
          <div className="formula-row formula-row--answer">
            <span className="formula-caption">wspólny mianownik</span>
            {input}
          </div>
        </div>
      ),
      solvedVisual: (
        <span className="solved-words">
          Wspólny mianownik: <strong>{lcd}</strong>
        </span>
      ),
      check: (value) => {
        if (value === lcd) return ok('Dobrze! Teraz rozszerzymy oba ułamki.')

        if (value > 0 && value % left.d === 0 && value % right.d === 0) {
          return wrong(
            'To wspólna wielokrotność, ale szukamy najmniejszej. Spróbuj jeszcze raz.',
            'warn',
          )
        }

        return wrong(
          `To nie jest wspólna wielokrotność mianowników ${left.d} i ${right.d}.`,
        )
      },
      revealMessage: `Najmniejszy wspólny mianownik to ${lcd}.`,
    }),
  )

  if (lcd !== left.d) {
    const factor = lcd / left.d
    const target = left.n * factor

    steps.push(
      numberStep({
        id: 'scale-left',
        title: 'Rozszerz pierwszy ułamek',
        prompt: `Uzupełnij licznik, aby mianownik pierwszego ułamka był równy ${lcd}.`,
        hint: `${lcd} ÷ ${left.d} = ${factor}. Licznik mnożymy przez tę samą liczbę: ${left.n} · ${factor} = ${target}.`,
        answer: target,
        visual: (input) => (
          <div className="step-formula">
            <Fraction n={left.n} d={left.d} />
            <span className="equals">=</span>
            <span className="fraction fraction--md">
              <span className="fraction__num fraction__slot">{input}</span>
              <span className="fraction__line" aria-hidden="true" />
              <span className="fraction__den">{lcd}</span>
            </span>
          </div>
        ),
        solvedVisual: (
          <span className="solved-line">
            <Fraction n={left.n} d={left.d} size="sm" />
            <span className="solved-sign">=</span>
            <Fraction n={target} d={lcd} size="sm" />
          </span>
        ),
        check: (value) => {
          if (value === target) {
            return ok('Dobrze! Ułamek został rozszerzony.')
          }

          if (value === left.n) {
            return wrong(
              'Pamiętaj, że przy rozszerzaniu zmienia się też licznik.',
              'warn',
            )
          }

          return wrong(
            `Nie do końca. Mianownik zwiększamy ${factor} razy, więc licznik też mnożymy przez ${factor}.`,
          )
        },
        revealMessage: `${left.n}/${left.d} = ${target}/${lcd}.`,
      }),
    )
  }

  if (lcd !== right.d) {
    const factor = lcd / right.d
    const target = right.n * factor

    steps.push(
      numberStep({
        id: 'scale-right',
        title: 'Rozszerz drugi ułamek',
        prompt: `Uzupełnij licznik, aby mianownik drugiego ułamka był równy ${lcd}.`,
        hint: `${lcd} ÷ ${right.d} = ${factor}. Licznik mnożymy przez tę samą liczbę: ${right.n} · ${factor} = ${target}.`,
        answer: target,
        visual: (input) => (
          <div className="step-formula">
            <Fraction n={right.n} d={right.d} />
            <span className="equals">=</span>
            <span className="fraction fraction--md">
              <span className="fraction__num fraction__slot">{input}</span>
              <span className="fraction__line" aria-hidden="true" />
              <span className="fraction__den">{lcd}</span>
            </span>
          </div>
        ),
        solvedVisual: (
          <span className="solved-line">
            <Fraction n={right.n} d={right.d} size="sm" />
            <span className="solved-sign">=</span>
            <Fraction n={target} d={lcd} size="sm" />
          </span>
        ),
        check: (value) => {
          if (value === target) {
            return ok('Dobrze! Oba ułamki mają teraz ten sam mianownik.')
          }

          if (value === right.n) {
            return wrong(
              'Pamiętaj, że przy rozszerzaniu zmienia się też licznik.',
              'warn',
            )
          }

          return wrong(
            `Nie do końca. Mianownik zwiększamy ${factor} razy, więc licznik też mnożymy przez ${factor}.`,
          )
        },
        revealMessage: `${right.n}/${right.d} = ${target}/${lcd}.`,
      }),
    )
  }

  steps.push(
    numberStep({
      id: 'combine',
      title: op === 'add' ? 'Dodaj liczniki' : 'Odejmij liczniki',
      prompt: `Wpisz licznik wyniku. Mianownik zostaje bez zmian.`,
      hint: `Przy wspólnym mianowniku ${action} tylko liczniki: ${scaledLeft} ${sign} ${scaledRight}. Mianownik ${lcd} przepisujemy.`,
      answer: resN,
      visual: (input) => (
        <div className="step-formula">
          <Fraction n={scaledLeft} d={lcd} />
          <span className="op-sign">{sign}</span>
          <Fraction n={scaledRight} d={lcd} />
          <span className="equals">=</span>
          <span className="fraction fraction--md">
            <span className="fraction__num fraction__slot">{input}</span>
            <span className="fraction__line" aria-hidden="true" />
            <span className="fraction__den">{lcd}</span>
          </span>
        </div>
      ),
      solvedVisual: (
        <span className="solved-line">
          <Fraction n={scaledLeft} d={lcd} size="sm" />
          <span className="solved-sign">{sign}</span>
          <Fraction n={scaledRight} d={lcd} size="sm" />
          <span className="solved-sign">=</span>
          <Fraction n={resN} d={lcd} size="sm" />
        </span>
      ),
      check: (value) => {
        if (value === resN) {
          return ok('Dobrze! To już prawie koniec.')
        }

        return wrong(
          `Sprawdź obliczenie: ${scaledLeft} ${sign} ${scaledRight}. Mianownik się nie zmienia.`,
        )
      },
      revealMessage: `${scaledLeft}/${lcd} ${sign} ${scaledRight}/${lcd} = ${resN}/${lcd}.`,
    }),
  )

  if (task.needsSimplify) {
    steps.push(
      fractionStep({
        id: 'simplify',
        title: 'Skróć wynik',
        prompt: 'Skróć ułamek do najprostszej postaci.',
        hint: `Podziel licznik i mianownik przez ich największy wspólny dzielnik. NWD(${resN}, ${lcd}) = ${gcd(
          resN,
          lcd,
        )}. ${resN} ÷ ${gcd(resN, lcd)} = ${answer.n}, ${lcd} ÷ ${gcd(
          resN,
          lcd,
        )} = ${answer.d}.`,
        answer,
        visual: (input) => (
          <div className="step-formula">
            <Fraction n={resN} d={lcd} />
            <span className="equals">=</span>
            {input}
          </div>
        ),
        solvedVisual: (
          <span className="solved-line">
            <Fraction n={resN} d={lcd} size="sm" />
            <span className="solved-sign">=</span>
            <Fraction n={answer.n} d={answer.d} size="sm" />
          </span>
        ),
        check: checkSimplification({ n: resN, d: lcd }, answer),
        revealMessage: `${resN}/${lcd} = ${answer.n}/${answer.d}.`,
      }),
    )
  }

  return steps
}

/* ------------------------------------------------------------------ */
/* Mnożenie                                                            */
/* ------------------------------------------------------------------ */

function buildCrossStep({ id, left, right, pairA, pairB, highlightLeft, highlightRight, expected }) {
  return numberStep({
    id,
    title: 'Skracanie na krzyż',
    prompt: 'Przez jaką największą liczbę można skrócić zaznaczone liczby?',
    hint: `Wypisz dzielniki obu liczb: ${pairA}: ${divisors(
      pairA,
    ).join(', ')}; ${pairB}: ${divisors(pairB).join(
      ', ',
    )}. Największa wspólna liczba to ${expected}.`,
    answer: expected,
    visual: (input) => (
      <div className="step-formula step-formula--stack">
        <div className="formula-row">
          <Fraction
            n={left.n}
            d={left.d}
            highlightN={highlightLeft.numerator}
            highlightD={highlightLeft.denominator}
          />
          <span className="op-sign">×</span>
          <Fraction
            n={right.n}
            d={right.d}
            highlightN={highlightRight.numerator}
            highlightD={highlightRight.denominator}
          />
        </div>
        <div className="formula-row formula-row--answer">
          <span className="formula-caption">największy wspólny dzielnik</span>
          {input}
        </div>
      </div>
    ),
    solvedVisual: (
      <span className="solved-words">
        Skracamy <strong>{pairA}</strong> i <strong>{pairB}</strong> przez{' '}
        <strong>{expected}</strong>.
      </span>
    ),
    check: checkDivisor(pairA, pairB, expected),
    revealMessage: `Liczby ${pairA} i ${pairB} skracamy przez ${expected}.`,
  })
}

function buildMulSteps(task) {
  const { left, right, g1, g2, workLeft, workRight, answer } = task
  const steps = []

  if (g1 > 1) {
    steps.push(
      buildCrossStep({
        id: 'cross-top',
        left,
        right,
        pairA: left.n,
        pairB: right.d,
        highlightLeft: { numerator: true, denominator: false },
        highlightRight: { numerator: false, denominator: true },
        expected: g1,
      }),
    )
  }

  if (g2 > 1) {
    steps.push(
      buildCrossStep({
        id: 'cross-bottom',
        left,
        right,
        pairA: right.n,
        pairB: left.d,
        highlightLeft: { numerator: false, denominator: true },
        highlightRight: { numerator: true, denominator: false },
        expected: g2,
      }),
    )
  }

  const product = {
    n: workLeft.n * workRight.n,
    d: workLeft.d * workRight.d,
  }

  steps.push(
    fractionStep({
      id: 'multiply',
      title: 'Pomnóż ułamki',
      prompt: 'Uzupełnij wynik mnożenia.',
      hint: 'Pomnóż licznik przez licznik, a mianownik przez mianownik.',
      answer: product,
      visual: (input) => (
        <div className="step-formula">
          <Fraction n={workLeft.n} d={workLeft.d} />
          <span className="op-sign">×</span>
          <Fraction n={workRight.n} d={workRight.d} />
          <span className="equals">=</span>
          {input}
        </div>
      ),
      solvedVisual: solvedEquation(
        workLeft,
        '×',
        workRight,
        '=',
        answer,
      ),
      check: checkSimpleFraction(product),
      revealMessage: `${workLeft.n}/${workLeft.d} × ${workRight.n}/${workRight.d} = ${product.n}/${product.d}.`,
    }),
  )

  return steps
}

/* ------------------------------------------------------------------ */
/* Dzielenie                                                           */
/* ------------------------------------------------------------------ */

function buildDivSteps(task) {
  const { left, right, reciprocal, g1, g2, workLeft, workRight } = task
  const steps = []

  steps.push(
    fractionStep({
      id: 'reciprocal',
      title: 'Zamień na mnożenie',
      prompt: 'Uzupełnij odwrotność drugiego ułamka.',
      hint: `Odwrotność ułamka ${right.n}/${right.d} to ${reciprocal.n}/${reciprocal.d}. Wystarczy zamienić miejscami licznik i mianownik.`,
      answer: reciprocal,
      visual: (input) => (
        <div className="step-formula step-formula--stack">
          <div className="formula-row">
            <Fraction n={left.n} d={left.d} />
            <span className="op-sign">÷</span>
            <Fraction n={right.n} d={right.d} />
            <span className="equals">=</span>
            <Fraction n={left.n} d={left.d} />
            <span className="op-sign">×</span>
            {input}
          </div>
        </div>
      ),
      solvedVisual: (
        <span className="solved-line">
          <Fraction n={left.n} d={left.d} size="sm" />
          <span className="solved-sign">÷</span>
          <Fraction n={right.n} d={right.d} size="sm" />
          <span className="solved-sign">=</span>
          <Fraction n={left.n} d={left.d} size="sm" />
          <span className="solved-sign">×</span>
          <Fraction n={reciprocal.n} d={reciprocal.d} size="sm" />
        </span>
      ),
      check: (value) => {
        if (value.n === reciprocal.n && value.d === reciprocal.d) {
          return ok('Dobrze! Dzielenie zamieniliśmy na mnożenie.')
        }

        if (value.n > 0 && isEquivalent(value, reciprocal)) {
          return wrong(
            'To ta sama wartość, ale zapisz odwrotność dokładnie — zamień licznik z mianownikiem.',
            'warn',
          )
        }

        return wrong(
          'Odwrotność to zamiana licznika i mianownika miejscami.',
        )
      },
      revealMessage: `Odwrotność ${right.n}/${right.d} to ${reciprocal.n}/${reciprocal.d}.`,
    }),
  )

  const converted = { n: reciprocal.n, d: reciprocal.d }

  if (g1 > 1) {
    steps.push(
      buildCrossStep({
        id: 'cross-top',
        left,
        right: converted,
        pairA: left.n,
        pairB: reciprocal.d,
        highlightLeft: { numerator: true, denominator: false },
        highlightRight: { numerator: false, denominator: true },
        expected: g1,
      }),
    )
  }

  if (g2 > 1) {
    steps.push(
      buildCrossStep({
        id: 'cross-bottom',
        left,
        right: converted,
        pairA: reciprocal.n,
        pairB: left.d,
        highlightLeft: { numerator: false, denominator: true },
        highlightRight: { numerator: true, denominator: false },
        expected: g2,
      }),
    )
  }

  const product = {
    n: workLeft.n * workRight.n,
    d: workLeft.d * workRight.d,
  }

  steps.push(
    fractionStep({
      id: 'multiply',
      title: 'Pomnóż ułamki',
      prompt: 'Uzupełnij wynik mnożenia.',
      hint: 'Pomnóż licznik przez licznik, a mianownik przez mianownik.',
      answer: product,
      visual: (input) => (
        <div className="step-formula">
          <Fraction n={workLeft.n} d={workLeft.d} />
          <span className="op-sign">×</span>
          <Fraction n={workRight.n} d={workRight.d} />
          <span className="equals">=</span>
          {input}
        </div>
      ),
      solvedVisual: solvedEquation(workLeft, '×', workRight, '=', task.answer),
      check: checkSimpleFraction(product),
      revealMessage: `${workLeft.n}/${workLeft.d} × ${workRight.n}/${workRight.d} = ${product.n}/${product.d}.`,
    }),
  )

  return steps
}

export function buildSteps(task) {
  switch (task.op) {
    case 'mul':
      return buildMulSteps(task)
    case 'div':
      return buildDivSteps(task)
    case 'add':
    case 'sub':
    default:
      return buildAddSubSteps(task)
  }
}
