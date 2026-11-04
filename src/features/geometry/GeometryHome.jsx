import { AngleFigure } from './AngleFigure.jsx'
import { Figure } from './Figure.jsx'
import { ANGLES } from './angles.js'
import { FIGURES, FIGURE_GROUPS } from './figures.js'

const MODES = [
  {
    id: 'mixed',
    name: 'Wszystko mieszane',
    glyph: '🎲',
    color: 'violet',
    description: 'Losowo pola, obwody i rozpoznawanie kątów.',
  },
  {
    id: 'area',
    name: 'Pola figur',
    glyph: '▭',
    color: 'mint',
    description:
      'Pole kwadratu, prostokąta, trójkątów, rombu, trapezu, równoległoboku oraz koła.',
  },
  {
    id: 'perimeter',
    name: 'Obwody figur',
    glyph: '📏',
    color: 'amber',
    description:
      'Obwód to długość granicy figury. Ćwicz dodawanie boków i długość okręgu.',
  },
  {
    id: 'angles',
    name: 'Kąty',
    glyph: '∠',
    color: 'rose',
    description:
      'Ostry, prosty, rozwarty, półpełny, wklęsły i pełny — rozpoznawaj je i poznaj ich miary.',
  },
]

const HOW_IT_WORKS = [
  {
    title: 'Wybierz tryb',
    description:
      'Możesz ćwiczyć same pola, same obwody, kąty albo wszystko po trochu.',
  },
  {
    title: 'Użyj wzoru',
    description:
      'Najpierw wybierasz poprawny wzór, a potem podstawiasz dane i liczysz krok po kroku.',
  },
  {
    title: 'Sprawdź i zrozum',
    description:
      'Aplikacja sprawdza każdy krok. Po błędzie dostajesz podpowiedź, a potem pełne wyjaśnienie.',
  },
]

export function GeometryHome({ onStart, onBack, solvedCount = 0 }) {
  return (
    <div className="topic-page">
      {onBack && (
        <button type="button" className="back-link" onClick={onBack}>
          <span aria-hidden="true">←</span> Wszystkie tematy
        </button>
      )}

      <div className="home geometry-home">
        <section className="hero">
          <div className="hero__copy">
            <span className="eyebrow">Matematyka · figury geometryczne</span>
            <h1>
              Pola, obwody i <span className="hero__accent">kąty</span>
            </h1>
            <p className="hero__lead">
              Poznaj wzory na pole i obwód najważniejszych figur. Naucz się
              odróżniać kąty ostre, proste, rozwarte, półpełne, wklęsłe i pełne.
              Każde zadanie rozwiązujesz krok po kroku.
            </p>

            <div className="hero__actions">
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => onStart('mixed')}
              >
                <span aria-hidden="true">🎲</span> Losowe zadanie
              </button>
              <a className="btn btn--ghost" href="#figury">
                Zobacz wzory
              </a>
            </div>

            <ul className="hero__badges">
              <li>✓ {FIGURES.length} figur</li>
              <li>✓ {ANGLES.length} rodzajów kątów</li>
              <li>✓ wzory z wyjaśnieniem</li>
              {solvedCount > 0 && (
                <li className="hero__badges-done">
                  ⭐ ukończone zadania: {solvedCount}
                </li>
              )}
            </ul>
          </div>

          <div className="hero-visual geometry-hero" aria-hidden="true">
            <div className="geometry-hero__card geometry-hero__card--figure">
              <span className="hero-visual__eyebrow">pole i obwód</span>
              <div className="geometry-hero__figure">
                <Figure type="square" dims={{ a: 6 }} name="Kwadrat" />
              </div>
              <div className="geometry-hero__formulas">
                <span>P = a · a</span>
                <span>Obw = 4 · a</span>
              </div>
            </div>

            <div className="geometry-hero__card geometry-hero__card--angle">
              <span className="hero-visual__eyebrow">rodzaje kątów</span>
              <AngleFigure type="obtuse" label="Kąt rozwarty" />
            </div>

            <span className="hero-float hero-float--one">📐</span>
            <span className="hero-float hero-float--two">π</span>
          </div>
        </section>

        <section className="topics" id="tryby">
          <div className="section-head">
            <div>
              <h2>Wybierz tryb</h2>
              <p>Co chcesz dziś poćwiczyć?</p>
            </div>
            <span className="section-head__hint">
              W każdym trybie zadania są losowe, a rozwiązanie prowadzi krok po
              kroku.
            </span>
          </div>

          <div className="op-grid">
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

        <section className="geometry-reference" id="figury">
          <div className="section-head">
            <div>
              <h2>Figury — wzory i wyjaśnienia</h2>
              <p>Pole i obwód w jednym miejscu. Wzory działają dla podanych oznaczeń.</p>
            </div>
            <span className="section-head__hint">
              P — pole, Obw — obwód, a, b, c — boki, h — wysokość, r — promień,
              e i f — przekątne.
            </span>
          </div>

          {FIGURE_GROUPS.map((group) => (
            <div key={group.id} className="figure-group">
              <div className="figure-group__head">
                <h3>{group.name}</h3>
                <p>{group.description}</p>
              </div>

              <div
                className={`figure-grid${
                  group.id === 'circle' ? ' figure-grid--single' : ''
                }`}
              >
                {FIGURES.filter((figure) => figure.group === group.id).map(
                  (figure) => (
                    <article
                      key={figure.id}
                      className={`figure-card figure-card--${group.color}`}
                    >
                      <div className="figure-card__visual">
                        <Figure
                          type={figure.id}
                          dims={figure.preview.dims}
                          approxKeys={figure.preview.approxKeys}
                          name={figure.name}
                        />
                      </div>

                      <div className="figure-card__body">
                        <h4>{figure.name}</h4>
                        <p className="figure-card__summary">{figure.summary}</p>

                        <dl className="figure-card__formulas">
                          <div>
                            <dt>Pole</dt>
                            <dd>{figure.area.formula}</dd>
                          </div>
                          <div>
                            <dt>Obwód</dt>
                            <dd>{figure.perimeter.formula}</dd>
                          </div>
                        </dl>

                        <p className="figure-card__note">{figure.explanation}</p>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="angles-reference" id="katy">
          <div className="section-head">
            <div>
              <h2>Kąty — rodzaje i miary</h2>
              <p>Kąt mierzymy w stopniach. Pełny obrót to 360°.</p>
            </div>
            <span className="section-head__hint">
              Kąt ostry jest mniejszy od prostego, rozwarty — większy. Kąt wklęsły
              jest większy od półpełnego.
            </span>
          </div>

          <div className="angle-grid">
            {ANGLES.map((angle) => (
              <article key={angle.id} className="angle-card">
                <div className="angle-card__visual">
                  <AngleFigure type={angle.id} label={angle.name} />
                </div>
                <div className="angle-card__body">
                  <span className="angle-card__range">{angle.range}</span>
                  <h3>{angle.name}</h3>
                  <p>{angle.description}</p>
                  <span className="angle-card__example">{angle.example}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="how">
          <div className="section-head">
            <div>
              <h2>Jak to działa?</h2>
              <p>Trzy proste kroki do lepszego zrozumienia figur.</p>
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
