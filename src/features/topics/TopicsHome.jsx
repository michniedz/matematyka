import { Fraction } from '../../components/Fraction.jsx'
import { Expression } from '../order/Expression.jsx'
import { numNode, opNode } from '../order/expression.js'
import { intValue } from '../order/values.js'
import { TOPICS } from './topics.js'

const ORDER_PREVIEW = opNode(
  '*',
  opNode('+', numNode(intValue(2)), numNode(intValue(3)), { group: true }),
  numNode(intValue(4)),
)

const HOW_IT_WORKS = [
  {
    title: 'Wybierz temat',
    description:
      'Ułamki, kolejność działań albo figury. W środku znajdziesz tryby dopasowane do tego, co chcesz ćwiczyć.',
  },
  {
    title: 'Licz krok po kroku',
    description:
      'Każde zadanie jest rozbite na małe kroki. Aplikacja sprawdza odpowiedź po każdym z nich.',
  },
  {
    title: 'Ucz się bez stresu',
    description:
      'Po błędzie dostajesz podpowiedź, a gdy trzeba — pełne rozwiązanie. Tempo ustalasz sam.',
  },
]

export function TopicsHome({ onOpen, solvedCount = 0 }) {
  return (
    <div className="home topics-home">
      <section className="hero">
        <div className="hero__copy">
          <span className="eyebrow">Matematyka · szkoła podstawowa</span>
          <h1>
            Matma <span className="hero__accent">krok po kroku</span>
          </h1>
          <p className="hero__lead">
            Wybierz temat i rozwiązuj zadania razem z aplikacją. Każdy przykład
            jest rozłożony na proste kroki, z podpowiedziami i wyjaśnieniami.
          </p>

          <ul className="hero__badges">
            <li>✓ {TOPICS.length} tematy</li>
            <li>✓ podpowiedzi do każdego kroku</li>
            <li>✓ nauka we własnym tempie</li>
            {solvedCount > 0 && (
              <li className="hero__badges-done">
                ⭐ ukończone zadania: {solvedCount}
              </li>
            )}
          </ul>
        </div>

        <div className="hero-visual topics-visual" aria-hidden="true">
          <div className="topics-visual__card topics-visual__card--fractions">
            <span className="hero-visual__eyebrow">ułamki</span>
            <div className="topics-visual__equation">
              <Fraction n={1} d={2} size="md" tone="a" />
              <span className="hero-visual__sign">×</span>
              <Fraction n={3} d={4} size="md" tone="b" />
              <span className="hero-visual__sign">=</span>
              <Fraction n={3} d={8} size="md" tone="success" />
            </div>
          </div>

          <div className="topics-visual__card topics-visual__card--order">
            <span className="hero-visual__eyebrow">kolejność działań</span>
            <div className="topics-visual__equation">
              <Expression node={ORDER_PREVIEW} size="md" />
              <span className="hero-visual__sign">=</span>
              <span className="topics-visual__result">20</span>
            </div>
          </div>

          <span className="hero-float hero-float--one">✨</span>
          <span className="hero-float hero-float--two">💡</span>
        </div>
      </section>

      <section className="topics">
        <div className="section-head">
          <div>
            <h2>Wybierz temat</h2>
            <p>Od czego zaczynamy dzisiaj?</p>
          </div>
          <span className="section-head__hint">
            Każdy temat ma własne tryby i podpowiedzi krok po kroku.
          </span>
        </div>

        <div className="topic-grid">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`topic-card topic-card--${topic.color}`}
              onClick={() => onOpen(topic.id)}
            >
              <span className="topic-card__icon" aria-hidden="true">
                {topic.icon}
              </span>
              <span className="topic-card__eyebrow">{topic.eyebrow}</span>
              <span className="topic-card__title">{topic.title}</span>
              <span className="topic-card__desc">{topic.description}</span>
              <span className="topic-card__tags">
                {topic.tags.map((tag) => (
                  <span key={tag} className="topic-card__tag">
                    {tag}
                  </span>
                ))}
              </span>
              <span className="topic-card__cta">
                Zaczynamy <span aria-hidden="true">→</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="how">
        <div className="section-head">
          <div>
            <h2>Jak to działa?</h2>
            <p>Trzy proste kroki do lepszego zrozumienia matematyki.</p>
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
  )
}
