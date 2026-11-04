import { Fraction } from '../../components/Fraction.jsx'
import { FractionBar } from '../../components/FractionBar.jsx'
import { OPERATION_LIST } from './operations.js'

const HOW_IT_WORKS = [
  {
    title: 'Wylosuj zadanie',
    description:
      'Wybierz jedno z działań albo pozwól aplikacji wylosować przykład z całego zestawu.',
  },
  {
    title: 'Licz krok po kroku',
    description:
      'Aplikacja prowadzi Cię przez wspólny mianownik, rozszerzanie, skracanie na krzyż i wynik.',
  },
  {
    title: 'Sprawdź każdy krok',
    description:
      'Po każdej odpowiedzi dostajesz podpowiedź. Nic nie umknie — krok po kroku do celu.',
  },
]

export function FractionsHome({ onStart, onBack, solvedCount = 0 }) {
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
          <span className="eyebrow">Matematyka · ułamki zwykłe</span>
          <h1>
            Ułamki <span className="hero__accent">bez tajemnic</span>
          </h1>
          <p className="hero__lead">
            Dodawaj, odejmuj, mnóż i dziel ułamki. Każde zadanie rozwiązujesz
            razem z aplikacją — krok po kroku, bez stresu.
          </p>

          <div className="hero__actions">
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => onStart('mixed')}
            >
              <span aria-hidden="true">🎲</span> Losowe zadanie
            </button>
            <a className="btn btn--ghost" href="#dzialy">
              Wybierz dział
            </a>
          </div>

          <ul className="hero__badges">
            <li>✓ podpowiedzi do każdego kroku</li>
            <li>✓ 4 działania</li>
            <li>✓ nauka we własnym tempie</li>
            {solvedCount > 0 && (
              <li className="hero__badges-done">⭐ ukończone zadania: {solvedCount}</li>
            )}
          </ul>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual__card">
            <span className="hero-visual__eyebrow">krok po kroku</span>
            <div className="hero-visual__equation">
              <Fraction n={1} d={2} size="lg" tone="a" />
              <span className="hero-visual__sign">+</span>
              <Fraction n={1} d={3} size="lg" tone="b" />
              <span className="hero-visual__sign">=</span>
              <Fraction n={5} d={6} size="lg" tone="success" />
            </div>
            <div className="hero-visual__bars">
              <FractionBar n={1} d={2} tone="a" />
              <FractionBar n={1} d={3} tone="b" />
            </div>
            <div className="hero-visual__check">✓ wspólny mianownik 6</div>
          </div>
          <span className="hero-float hero-float--one">✨</span>
          <span className="hero-float hero-float--two">💡</span>
        </div>
      </section>

      <section className="topics" id="dzialy">
        <div className="section-head">
          <div>
            <h2>Wybierz dział</h2>
            <p>Od czego zaczynamy dzisiaj?</p>
          </div>
          <span className="section-head__hint">
            Każdy dział to losowe zadania i pełne rozwiązanie krok po kroku.
          </span>
        </div>

        <div className="op-grid">
          {OPERATION_LIST.map((op) => (
            <button
              key={op.id}
              type="button"
              className={`op-card op-card--${op.color}`}
              onClick={() => onStart(op.id)}
            >
              <span className="op-card__icon" aria-hidden="true">
                {op.glyph}
              </span>
              <span className="op-card__body">
                <span className="op-card__title">{op.name}</span>
                <span className="op-card__desc">{op.description}</span>
              </span>
              <span className="op-card__arrow" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="how">
        <div className="section-head">
          <div>
            <h2>Jak to działa?</h2>
            <p>Trzy proste kroki do lepszego zrozumienia ułamków.</p>
          </div>
        </div>

        <ol className="how-grid">
          {HOW_IT_WORKS.map((item, index) => (
            <li key={item.title} className="how-card">
              <span className="how-card__number">{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
      </section>
      </div>
    </div>
  )
}
