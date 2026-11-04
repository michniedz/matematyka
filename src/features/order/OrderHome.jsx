import { Expression } from './Expression.jsx'
import { numNode, opNode } from './expression.js'
import { intValue } from './values.js'

const HERO_EXAMPLE = opNode(
  '*',
  opNode('+', numNode(intValue(2)), numNode(intValue(3)), { group: true }),
  numNode(intValue(4)),
)

const PAREN_EXAMPLE = opNode(
  '*',
  opNode('+', numNode(intValue(2)), numNode(intValue(3)), { group: true }),
  numNode(intValue(4)),
)

const MULDIV_EXAMPLE = opNode(
  '+',
  numNode(intValue(2)),
  opNode('*', numNode(intValue(3)), numNode(intValue(4))),
)

const ADDSUB_EXAMPLE = opNode(
  '+',
  opNode('-', numNode(intValue(8)), numNode(intValue(2))),
  numNode(intValue(1)),
)

const MODES = [
  {
    id: 'mixed',
    name: 'Wszystko mieszane',
    glyph: '🎲',
    color: 'violet',
    description: 'Losowo ułamki zwykłe albo liczby dziesiętne.',
  },
  {
    id: 'fractions',
    name: 'Ułamki i całości',
    glyph: '½',
    color: 'mint',
    description: 'Nawiasy, ułamki zwykłe i liczby całkowite.',
  },
  {
    id: 'decimals',
    name: 'Liczby dziesiętne',
    glyph: '0,5',
    color: 'amber',
    description: 'Działania z przecinkami i liczbami całkowitymi.',
  },
]

const RULES = [
  {
    title: 'Nawiasy',
    description:
      'Jeśli w wyrażeniu jest nawias, zaczynamy właśnie od niego. Dopiero potem liczymy resztę.',
    example: PAREN_EXAMPLE,
  },
  {
    title: 'Mnożenie i dzielenie',
    description:
      'Gdy nie ma nawiasów, mnożenie i dzielenie mają pierwszeństwo przed dodawaniem i odejmowaniem.',
    example: MULDIV_EXAMPLE,
  },
  {
    title: 'Dodawanie i odejmowanie',
    description:
      'Na końcu wykonujemy dodawanie i odejmowanie. Przy kilku takich działaniach liczymy od lewej do prawej.',
    example: ADDSUB_EXAMPLE,
  },
]

export function OrderHome({ onStart, onBack, solvedCount = 0 }) {
  return (
    <div className="topic-page">
      {onBack && (
        <button type="button" className="back-link" onClick={onBack}>
          <span aria-hidden="true">←</span> Wszystkie tematy
        </button>
      )}

      <div className="home">
        <section className="hero">
          <div className="hero__copy">
            <span className="eyebrow">Matematyka · kolejność działań</span>
            <h1>
              Najpierw <span className="hero__accent">nawiasy</span>
            </h1>
            <p className="hero__lead">
              Naucz się, co robić najpierw: nawiasy, mnożenie i dzielenie, a na
              końcu dodawanie i odejmowanie. W zadaniach pojawiają się ułamki,
              liczby całkowite i liczby dziesiętne.
            </p>

            <div className="hero__actions">
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => onStart('mixed')}
              >
                <span aria-hidden="true">🎲</span> Losowe zadanie
              </button>
              <a className="btn btn--ghost" href="#tryby">
                Wybierz tryb
              </a>
            </div>

            <ul className="hero__badges">
              <li>✓ nawiasy i priorytety</li>
              <li>✓ ułamki i przecinki</li>
              <li>✓ podpowiedzi do każdego kroku</li>
              {solvedCount > 0 && (
                <li className="hero__badges-done">
                  ⭐ ukończone zadania: {solvedCount}
                </li>
              )}
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual__card order-hero__card">
              <span className="hero-visual__eyebrow">krok po kroku</span>
              <div className="order-hero__expr">
                <Expression node={HERO_EXAMPLE} size="md" />
              </div>
              <ol className="order-hero__steps">
                <li>
                  <span>1</span> nawias: 2 + 3 = 5
                </li>
                <li>
                  <span>2</span> mnożenie: 5 × 4 = 20
                </li>
              </ol>
              <div className="hero-visual__check">✓ wynik: 20</div>
            </div>
            <span className="hero-float hero-float--one">( )</span>
            <span className="hero-float hero-float--two">💡</span>
          </div>
        </section>

        <section className="topics" id="tryby">
          <div className="section-head">
            <div>
              <h2>Wybierz tryb</h2>
              <p>Z jakimi liczbami chcesz dziś poćwiczyć?</p>
            </div>
            <span className="section-head__hint">
              W każdym trybie zadania są losowe, a rozwiązanie prowadzi krok po
              kroku.
            </span>
          </div>

          <div className="op-grid op-grid--three">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`op-card op-card--${mode.color}`}
                onClick={() => onStart(mode.id)}
              >
                <span className="op-card__icon" aria-hidden="true">
                  {mode.glyph}
                </span>
                <span className="op-card__body">
                  <span className="op-card__title">{mode.name}</span>
                  <span className="op-card__desc">{mode.description}</span>
                </span>
                <span className="op-card__arrow" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rules">
          <div className="section-head">
            <div>
              <h2>Trzy zasady</h2>
              <p>Ta kolejność zawsze się sprawdza.</p>
            </div>
          </div>

          <ol className="how-grid">
            {RULES.map((rule, index) => (
              <li key={rule.title} className="how-card rule-card">
                <span className="how-card__number">{index + 1}</span>
                <h3>{rule.title}</h3>
                <p>{rule.description}</p>
                <span className="rule-card__example">
                  <Expression node={rule.example} size="sm" />
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
