import { useState } from 'react'
import './App.css'
import './styles/learning.css'
import './features/order/order.css'
import './features/geometry/geometry.css'
import './features/lines/lines.css'
import { FractionsExercise } from './features/fractions/FractionsExercise'
import { FractionsHome } from './features/fractions/FractionsHome'
import { GeometryExercise } from './features/geometry/GeometryExercise'
import { GeometryHome } from './features/geometry/GeometryHome'
import { LinesExercise } from './features/lines/LinesExercise'
import { LinesHome } from './features/lines/LinesHome'
import { OrderExercise } from './features/order/OrderExercise'
import { OrderHome } from './features/order/OrderHome'
import { TopicsHome } from './features/topics/TopicsHome'
import { useTheme } from './lib/useTheme.js'

function BrandMark() {
  return (
    <span className="brand__mark" aria-hidden="true">
      <span className="brand__num">1</span>
      <span className="brand__line" />
      <span className="brand__den">2</span>
    </span>
  )
}

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [screen, setScreen] = useState({ name: 'topics' })
  const [solvedCount, setSolvedCount] = useState(0)

  const isExercise = screen.name === 'exercise'

  const goTopics = () => setScreen({ name: 'topics' })

  const openTopic = (topic) => setScreen({ name: 'topic', topic })

  const goToTopic = (topic) => setScreen({ name: 'topic', topic })

  const startExercise = (topic, mode) => {
    setScreen({
      name: 'exercise',
      topic,
      mode,
      key: `${topic}-${mode}-${Date.now()}`,
    })
  }

  let content

  if (screen.name === 'exercise') {
    content =
      screen.topic === 'order' ? (
        <OrderExercise
          key={screen.key}
          mode={screen.mode}
          onExit={() => goToTopic('order')}
          onSolved={() => setSolvedCount((current) => current + 1)}
        />
      ) : screen.topic === 'geometry' ? (
        <GeometryExercise
          key={screen.key}
          mode={screen.mode}
          onExit={() => goToTopic('geometry')}
          onSolved={() => setSolvedCount((current) => current + 1)}
        />
      ) : screen.topic === 'lines' ? (
        <LinesExercise
          key={screen.key}
          mode={screen.mode}
          onExit={() => goToTopic('lines')}
          onSolved={() => setSolvedCount((current) => current + 1)}
        />
      ) : (
        <FractionsExercise
          key={screen.key}
          mode={screen.mode}
          onExit={() => goToTopic('fractions')}
          onSolved={() => setSolvedCount((current) => current + 1)}
        />
      )
  } else if (screen.name === 'topic' && screen.topic === 'order') {
    content = (
      <OrderHome
        onStart={(mode) => startExercise('order', mode)}
        onBack={goTopics}
        solvedCount={solvedCount}
      />
    )
  } else if (screen.name === 'topic' && screen.topic === 'geometry') {
    content = (
      <GeometryHome
        onStart={(mode) => startExercise('geometry', mode)}
        onBack={goTopics}
        solvedCount={solvedCount}
      />
    )
  } else if (screen.name === 'topic' && screen.topic === 'lines') {
    content = (
      <LinesHome
        onStart={(mode) => startExercise('lines', mode)}
        onBack={goTopics}
        solvedCount={solvedCount}
      />
    )
  } else if (screen.name === 'topic') {
    content = (
      <FractionsHome
        onStart={(mode) => startExercise('fractions', mode)}
        onBack={goTopics}
        solvedCount={solvedCount}
      />
    )
  } else {
    content = <TopicsHome onOpen={openTopic} solvedCount={solvedCount} />
  }

  return (
    <div className="app">
      <header className="appbar">
        <button
          type="button"
          className="brand"
          onClick={goTopics}
          aria-label="Wróć do wyboru tematu"
        >
          <BrandMark />
          <span className="brand__text">
            <strong>Matma</strong>
            <small>krok po kroku</small>
          </span>
        </button>

        <div className="appbar__right">
          {isExercise && (
            <span className="score-chip" title="Ukończone zadania">
              <span aria-hidden="true">⭐</span>
              <strong>{solvedCount}</strong>
            </span>
          )}

          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'
            }
            title={theme === 'dark' ? 'Jasny motyw' : 'Ciemny motyw'}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
        </div>
      </header>

      <main className="app__main">{content}</main>

      <footer className="app__footer">
        <span>Matma krok po kroku</span>
        <span aria-hidden="true">·</span>
        <span>ułamki, kolejność działań, figury i kąty</span>
      </footer>
    </div>
  )
}
