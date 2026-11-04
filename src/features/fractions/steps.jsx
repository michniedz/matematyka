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

function partsStep({
  id,
  title,
  prompt,
  hint,
  fields,
  emptyMessage,
  visual,
  solvedVisual,
  check,
  revealMessage,
}) {
  return {
    id,
    kind: 'parts',
    title,
    prompt,
    hint,
    fields,
    emptyMessage,
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

/**
 * Ułamek, w którym wybrane części można zastąpić polami do wpisania.
 * Wartości bez pola są wyświetlane jako stały tekst.
 */
function fractionSlot({ n, d, numeratorInput, denominatorInput }) {
  if (!numeratorInput && !denominatorInput) {
    return <Fraction n={n} d={d} />
  }

  return (
    <span className="fraction fraction--md fraction--input">
      {numeratorInput ?? <span className="fraction__num">{n}</span>}
      <span className="fraction__line" aria-hidden="true" />
      {denominatorInput ?? <span className="fraction__den">{d}</span>}
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

  const needsLeftScale = lcd !== left.d
  const needsRightScale = lcd !== right.d

  if (needsLeftScale || needsRightScale) {
    const leftFactor = lcd / left.d
    const rightFactor = lcd / right.d
    const fields = []

    if (needsLeftScale) {
      fields.push({
        id: 'left',
        answer: left.n * leftFactor,
        original: left.n,
        oldDenominator: left.d,
        factor: leftFactor,
        label: 'Licznik pierwszego ułamka',
        part: 'num',
      })
    }

    if (needsRightScale) {
      fields.push({
        id: 'right',
        answer: right.n * rightFactor,
        original: right.n,
        oldDenominator: right.d,
        factor: rightFactor,
        label: 'Licznik drugiego ułamka',
        part: 'num',
      })
    }

    const hintParts = []

    if (needsLeftScale) {
      hintParts.push(
        `Pierwszy ułamek: ${lcd} ÷ ${left.d} = ${leftFactor}, więc licznik mnożymy przez ${leftFactor}: ${left.n} · ${leftFactor} = ${left.n * leftFactor}.`,
      )
    }

    if (needsRightScale) {
      hintParts.push(
        `Drugi ułamek: ${lcd} ÷ ${right.d} = ${rightFactor}, więc licznik mnożymy przez ${rightFactor}: ${right.n} · ${rightFactor} = ${right.n * rightFactor}.`,
      )
    }

    steps.push(
      partsStep({
        id: 'scale',
        title: fields.length > 1 ? 'Rozszerz ułamki' : 'Rozszerz ułamek',
        prompt:
          fields.length > 1
            ? `Uzupełnij liczniki, aby oba ułamki miały mianownik ${lcd}.`
            : needsLeftScale
              ? `Uzupełnij licznik pierwszego ułamka, aby miał mianownik ${lcd}.`
              : `Uzupełnij licznik drugiego ułamka, aby miał mianownik ${lcd}.`,
        hint: hintParts.join(' '),
        fields,
        emptyMessage:
          fields.length > 1
            ? 'Wpisz liczby w oba liczniki.'
            : 'Wpisz liczbę w licznik.',
        visual: (inputs) => (
          <div className="step-formula">
            <Fraction n={left.n} d={left.d} />
            <span className="op-sign">{sign}</span>
            <Fraction n={right.n} d={right.d} />
            <span className="equals">=</span>
            {fractionSlot({
              n: left.n,
              d: lcd,
              numeratorInput: inputs.left,
            })}
            <span className="op-sign">{sign}</span>
            {fractionSlot({
              n: right.n,
              d: lcd,
              numeratorInput: inputs.right,
            })}
          </div>
        ),
        solvedVisual: (
          <span className="solved-line">
            <Fraction n={left.n} d={left.d} size="sm" />
            <span className="solved-sign">{sign}</span>
            <Fraction n={right.n} d={right.d} size="sm" />
            <span className="solved-sign">=</span>
            <Fraction n={scaledLeft} d={lcd} size="sm" />
            <span className="solved-sign">{sign}</span>
            <Fraction n={scaledRight} d={lcd} size="sm" />
          </span>
        ),
        check: (values) => {
          const incorrect = fields.filter(
            (field) => values[field.id] !== field.answer,
          )

          if (incorrect.length === 0) {
            return ok(
              fields.length > 1
                ? 'Dobrze! Oba ułamki mają teraz wspólny mianownik.'
                : 'Dobrze! Ułamek został rozszerzony.',
            )
          }

          const unchanged = incorrect.some(
            (field) => values[field.id] === field.original,
          )

          if (unchanged) {
            return wrong(
              'Pamiętaj, że przy rozszerzaniu zmienia się też licznik. Pomnóż licznik przez tę samą liczbę, co mianownik.',
              'warn',
            )
          }

          const field = incorrect[0]
          const which = field.id === 'left' ? 'pierwszy' : 'drugi'

          return wrong(
            `Sprawdź ${which} ułamek: ${lcd} ÷ ${field.oldDenominator} = ${field.factor}, więc licznik ${field.original} · ${field.factor} = ${field.answer}.`,
          )
        },
        revealMessage:
          fields.length > 1
            ? `${left.n}/${left.d} = ${scaledLeft}/${lcd}, a ${right.n}/${right.d} = ${scaledRight}/${lcd}.`
            : needsLeftScale
              ? `${left.n}/${left.d} = ${scaledLeft}/${lcd}.`
              : `${right.n}/${right.d} = ${scaledRight}/${lcd}.`,
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
          <Fraction n={left.n} d={left.d} />
          <span className="op-sign">{sign}</span>
          <Fraction n={right.n} d={right.d} />
          <span className="equals">=</span>
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
          <Fraction n={left.n} d={left.d} size="sm" />
          <span className="solved-sign">{sign}</span>
          <Fraction n={right.n} d={right.d} size="sm" />
          <span className="solved-sign">=</span>
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

function buildCrossStep({
  id,
  left,
  right,
  prefix,
  pairA,
  pairB,
  highlightLeft,
  highlightRight,
  expected,
}) {
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
          {prefix}
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

function buildReductionStep({
  op,
  left,
  right,
  convertedRight,
  g1,
  g2,
  workLeft,
  workRight,
}) {
  const fields = []

  if (g1 > 1) {
    fields.push({
      id: 'left-n',
      answer: workLeft.n,
      original: left.n,
      divisor: g1,
      label: 'Licznik pierwszego ułamka',
      part: 'num',
    })
  }

  if (g2 > 1) {
    fields.push({
      id: 'left-d',
      answer: workLeft.d,
      original: left.d,
      divisor: g2,
      label: 'Mianownik pierwszego ułamka',
      part: 'den',
    })
  }

  if (g2 > 1) {
    fields.push({
      id: 'right-n',
      answer: workRight.n,
      original: convertedRight.n,
      divisor: g2,
      label: 'Licznik drugiego ułamka',
      part: 'num',
    })
  }

  if (g1 > 1) {
    fields.push({
      id: 'right-d',
      answer: workRight.d,
      original: convertedRight.d,
      divisor: g1,
      label: 'Mianownik drugiego ułamka',
      part: 'den',
    })
  }

  if (fields.length === 0) return null

  const isDiv = op === 'div'
  const hintParts = []

  if (g1 > 1) {
    hintParts.push(
      `${left.n} i ${convertedRight.d} skracamy przez ${g1}: ${left.n} ÷ ${g1} = ${workLeft.n}, ${convertedRight.d} ÷ ${g1} = ${workRight.d}.`,
    )
  }

  if (g2 > 1) {
    hintParts.push(
      `${convertedRight.n} i ${left.d} skracamy przez ${g2}: ${convertedRight.n} ÷ ${g2} = ${workRight.n}, ${left.d} ÷ ${g2} = ${workLeft.d}.`,
    )
  }

  const reducedLeft = (inputs) =>
    fractionSlot({
      n: workLeft.n,
      d: workLeft.d,
      numeratorInput: inputs['left-n'],
      denominatorInput: inputs['left-d'],
    })

  const reducedRight = (inputs) =>
    fractionSlot({
      n: workRight.n,
      d: workRight.d,
      numeratorInput: inputs['right-n'],
      denominatorInput: inputs['right-d'],
    })

  return partsStep({
    id: 'reduce',
    title: 'Skróć na krzyż',
    prompt: 'Uzupełnij liczby po skróceniu na krzyż.',
    hint: hintParts.join(' '),
    fields,
    emptyMessage: 'Uzupełnij wszystkie zaznaczone liczby.',
    visual: (inputs) => (
      <div className="step-formula step-formula--stack">
        <div className="formula-row">
          <Fraction n={left.n} d={left.d} />
          <span className="op-sign">{isDiv ? '÷' : '×'}</span>
          <Fraction n={right.n} d={right.d} />
          <span className="equals">=</span>
          {isDiv ? (
            <>
              <Fraction n={left.n} d={left.d} />
              <span className="op-sign">×</span>
              <Fraction n={convertedRight.n} d={convertedRight.d} />
              <span className="equals">=</span>
            </>
          ) : null}
          {reducedLeft(inputs)}
          <span className="op-sign">×</span>
          {reducedRight(inputs)}
        </div>
      </div>
    ),
    solvedVisual: (
      <span className="solved-line">
        <Fraction n={left.n} d={left.d} size="sm" />
        <span className="solved-sign">{isDiv ? '÷' : '×'}</span>
        <Fraction n={right.n} d={right.d} size="sm" />
        <span className="solved-sign">=</span>
        {isDiv ? (
          <>
            <Fraction n={left.n} d={left.d} size="sm" />
            <span className="solved-sign">×</span>
            <Fraction n={convertedRight.n} d={convertedRight.d} size="sm" />
            <span className="solved-sign">=</span>
          </>
        ) : null}
        <Fraction n={workLeft.n} d={workLeft.d} size="sm" />
        <span className="solved-sign">×</span>
        <Fraction n={workRight.n} d={workRight.d} size="sm" />
      </span>
    ),
    check: (values) => {
      const incorrect = fields.filter(
        (field) => values[field.id] !== field.answer,
      )

      if (incorrect.length === 0) {
        return ok('Dobrze! Skracanie na krzyż jest gotowe.')
      }

      const unchanged = incorrect.some(
        (field) => values[field.id] === field.original,
      )

      if (unchanged) {
        return wrong(
          'Pamiętaj, że skracanie zmienia obie liczby w zaznaczonej parze — podziel je przez wspólny dzielnik.',
          'warn',
        )
      }

      const field = incorrect[0]

      return wrong(
        `Sprawdź ${field.label.toLowerCase()}: ${field.original} ÷ ${field.divisor} = ${field.answer}.`,
      )
    },
    revealMessage: isDiv
      ? `${left.n}/${left.d} ÷ ${right.n}/${right.d} = ${left.n}/${left.d} × ${convertedRight.n}/${convertedRight.d} = ${workLeft.n}/${workLeft.d} × ${workRight.n}/${workRight.d}.`
      : `${left.n}/${left.d} × ${right.n}/${right.d} = ${workLeft.n}/${workLeft.d} × ${workRight.n}/${workRight.d}.`,
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

  const reduction = buildReductionStep({
    op: 'mul',
    left,
    right,
    convertedRight: right,
    g1,
    g2,
    workLeft,
    workRight,
  })

  if (reduction) steps.push(reduction)

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
          <Fraction n={left.n} d={left.d} />
          <span className="op-sign">×</span>
          <Fraction n={right.n} d={right.d} />
          <span className="equals">=</span>
          <Fraction n={workLeft.n} d={workLeft.d} />
          <span className="op-sign">×</span>
          <Fraction n={workRight.n} d={workRight.d} />
          <span className="equals">=</span>
          {input}
        </div>
      ),
      solvedVisual: (
        <span className="solved-line">
          <Fraction n={left.n} d={left.d} size="sm" />
          <span className="solved-sign">×</span>
          <Fraction n={right.n} d={right.d} size="sm" />
          <span className="solved-sign">=</span>
          <Fraction n={workLeft.n} d={workLeft.d} size="sm" />
          <span className="solved-sign">×</span>
          <Fraction n={workRight.n} d={workRight.d} size="sm" />
          <span className="solved-sign">=</span>
          <Fraction n={answer.n} d={answer.d} size="sm" />
        </span>
      ),
      check: checkSimpleFraction(product),
      revealMessage: `${left.n}/${left.d} × ${right.n}/${right.d} = ${workLeft.n}/${workLeft.d} × ${workRight.n}/${workRight.d} = ${product.n}/${product.d}.`,
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
  const divisionPrefix = (
    <>
      <Fraction n={left.n} d={left.d} />
      <span className="op-sign">÷</span>
      <Fraction n={right.n} d={right.d} />
      <span className="equals">=</span>
    </>
  )

  if (g1 > 1) {
    steps.push(
      buildCrossStep({
        id: 'cross-top',
        left,
        right: converted,
        prefix: divisionPrefix,
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
        prefix: divisionPrefix,
        pairA: reciprocal.n,
        pairB: left.d,
        highlightLeft: { numerator: false, denominator: true },
        highlightRight: { numerator: true, denominator: false },
        expected: g2,
      }),
    )
  }

  const reduction = buildReductionStep({
    op: 'div',
    left,
    right,
    convertedRight: reciprocal,
    g1,
    g2,
    workLeft,
    workRight,
  })

  if (reduction) steps.push(reduction)

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
          <Fraction n={left.n} d={left.d} />
          <span className="op-sign">÷</span>
          <Fraction n={right.n} d={right.d} />
          <span className="equals">=</span>
          <Fraction n={left.n} d={left.d} />
          <span className="op-sign">×</span>
          <Fraction n={reciprocal.n} d={reciprocal.d} />
          <span className="equals">=</span>
          <Fraction n={workLeft.n} d={workLeft.d} />
          <span className="op-sign">×</span>
          <Fraction n={workRight.n} d={workRight.d} />
          <span className="equals">=</span>
          {input}
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
          <span className="solved-sign">=</span>
          <Fraction n={workLeft.n} d={workLeft.d} size="sm" />
          <span className="solved-sign">×</span>
          <Fraction n={workRight.n} d={workRight.d} size="sm" />
          <span className="solved-sign">=</span>
          <Fraction n={task.answer.n} d={task.answer.d} size="sm" />
        </span>
      ),
      check: checkSimpleFraction(product),
      revealMessage: `${left.n}/${left.d} ÷ ${right.n}/${right.d} = ${left.n}/${left.d} × ${reciprocal.n}/${reciprocal.d} = ${workLeft.n}/${workLeft.d} × ${workRight.n}/${workRight.d} = ${product.n}/${product.d}.`,
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
