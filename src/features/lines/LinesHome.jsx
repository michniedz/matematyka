import { LineFigure } from './LineFigure.jsx'
import { ANGLE_FACTS, LINE_DEFINITIONS, LINE_MODES } from './lines.js'

const HOW_IT_WORKS = [
  {
    title: 'Rozpoznaj pojęcia',
    description:
      'Prosta, półprosta i odcinek mają różne początki i końce. Prostopadłe i równoległe rozpoznasz po kącie i odległości.',
  },
  {
    title: 'Policz kąty',
    description:
      'Korzystaj z tego, że kąty przyległe dają 180°, wierzchołkowe są równe, a sumy kątów w figurach są stałe.',
  },
  {
    title: 'Sprawdź krok po kroku',
    description:
      'Aplikacja sprawdza każdy krok i pokazuje podpowiedź, gdy trzeba chwilę pomyśleć.',
  },
]

export function LinesHome({ onStart, onBack, solvedCount = 0 }) {
  return (
    <div className="topic-page">
      {onBack && (
        <button type="button" className="back-link" onClick={onBack}>
          <span aria-hidden="true">←</span> Wszystkie tematy
        </button>
      )}

      <div className="home lines-home">
        <section className="hero">
          <div className="hero__copy">
            <span className="eyebrow">Matematyka · proste i kąty</span>
            <h1>
              Proste, odcinki i <span className="hero__accent">kąty</span>
            </h1>
            <p className="hero__lead">
              Odróżnij prostą, półprostą i odcinek. Poznaj proste prostopadłe
              i równoległe, kąty α i β oraz miary kątów przy przecięciu prostych.
              Na koniec obliczaj kąty w trójkątach i czworokątach.
            </p>

            <div className="hero__actions">
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => onStart('mixed')}
              >
                <span aria-hidden="true">🎲</span> Losowe zadanie
              </button>
              <a className="btn btn--ghost" href="#pojecia">
                Zobacz pojęcia
              </a>
            </div>

            <ul className="hero__badges">
              <li>✓ {LINE_DEFINITIONS.length} pojęć</li>
              <li>✓ kąty α i β</li>
              <li>✓ trójkąty i czworokąty</li>
              {solvedCount > 0 && (
                <li className="hero__badges-done">
                  ⭐ ukończone zadania: {solvedCount}
                </li>
              )}
            </ul>
          </div>

          <div className="hero-visual lines-hero" aria-hidden="true">
            <div className="lines-hero__card lines-hero__card--lines">
              <span className="hero-visual__eyebrow">proste</span>
              <LineFigure type="perpendicular" />
            </div>

            <div className="lines-hero__card lines-hero__card--angles">
              <span className="hero-visual__eyebrow">kąty alfa i beta</span>
              <LineFigure type="adjacent-angles" />
            </div>

            <span className="hero-float hero-float--one">📐</span>
            <span className="hero-float hero-float--two">α</span>
          </div>
        </section>

        <section className="topics" id="tryby">
          <div className="section-head">
            <div>
              <h2>Wybierz tryb</h2>
              <p>Co chcesz dziś poćwiczyć?</p>
            </div>
            <span className="section-head__hint">
              Każde zadanie jest losowe, a rozwiązanie prowadzi krok po kroku.
            </span>
          </div>

          <div className="op-grid op-grid--three">
            {LINE_MODES.map((mode) => (
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

        <section className="lines-reference" id="pojecia">
          <div className="section-head">
            <div>
              <h2>Proste i odcinki — najważniejsze pojęcia</h2>
              <p>Krótkie definicje z rysunkami. Wszystko w jednym miejscu.</p>
            </div>
            <span className="section-head__hint">
              Prosta nie ma końca, półprosta ma początek, a odcinek dwa końce.
            </span>
          </div>

          <div className="line-def-grid">
            {LINE_DEFINITIONS.map((item) => (
              <article key={item.title} className="line-def-card">
                <div className="line-def-card__visual">
                  <LineFigure type={item.diagram} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lines-reference" id="katy">
          <div className="section-head">
            <div>
              <h2>Kąty α i β oraz kąty w figurach</h2>
              <p>Zależności, które przydadzą się w każdym zadaniu.</p>
            </div>
            <span className="section-head__hint">
              Kąty przyległe dają 180°, wierzchołkowe są równe. W trójkącie jest
              180°, a w czworokącie 360°.
            </span>
          </div>

          <div className="line-fact-grid">
            {ANGLE_FACTS.map((fact) => (
              <article key={fact.title} className="line-fact-card">
                <div className="line-fact-card__visual">
                  <LineFigure {...fact.figure} />
                </div>
                <div>
                  <h3>{fact.title}</h3>
                  <p>{fact.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="how">
          <div className="section-head">
            <div>
              <h2>Jak to działa?</h2>
              <p>Trzy kroki do pewnego rozpoznawania prostych i kątów.</p>
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
