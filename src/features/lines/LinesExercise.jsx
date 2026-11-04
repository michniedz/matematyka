import { useState } from 'react'
import { ExerciseLayout } from '../../components/ExerciseLayout.jsx'
import { StepCard } from '../../components/StepCard.jsx'
import { LineFigure } from './LineFigure.jsx'
import { generateTask } from './generator.js'
import { buildSteps } from './steps.jsx'

const TIP_TITLE = 'Proste, odcinki i kąty'
const TIPS = {
  basics:
    'Prosta nie ma końca, półprosta ma początek, a odcinek dwa końce. Prostopadłe przecinają się pod kątem 90°, a równoległe nigdy się nie przecinają.',
  'alpha-beta':
    'α i β to greckie litery, którymi oznaczamy kąty. Kąty przyległe dają 180°, a wierzchołkowe są równe.',
  intersection:
    'Przy przecięciu dwóch prostych kąty przyległe sumują się do 180°, a kąty wierzchołkowe mają równe miary.',
  polygon:
    'Suma kątów w trójkącie wynosi 180°, a w czworokącie 360°. Odejmij znane kąty od tej sumy.',
}

function createExercise(mode) {
  const task = generateTask(mode)
  return {
    task,
    steps: buildSteps(task),
    index: 0,
    history: [],
    finished: false,
  }
}

function TaskCard({ task }) {
  return (
    <section className="task-card lines-task">
      <div className="task-card__top">
        <span className="task-card__label">{task.title}</span>
        <span className="chip chip--rose">
          <span aria-hidden="true">∡</span>
          Proste i kąty
        </span>
      </div>

      <div className="lines-task__figure">
        <LineFigure {...task.figure} />
      </div>

      <p className="geometry-task__prompt">{task.prompt}</p>
    </section>
  )
}

function answerSummary(task) {
  if (task.kind === 'intersection') {
    return `β = ${task.beta}°, γ = ${task.gamma}°, δ = ${task.delta}°`
  }

  if (task.kind === 'polygon') {
    return `Brakujący kąt x = ${task.missing}°`
  }

  return ''
}

function SuccessCard({ task, helped, onNext, onExit }) {
  const summary = answerSummary(task)

  return (
    <section className={`success-card${helped ? ' success-card--helped' : ''}`}>
      <span className="success-card__spark" aria-hidden="true">
        {helped ? '🌱' : '🎉'}
      </span>
      <h2>
        {helped ? 'Dobrze, że doszedłeś do rozwiązania!' : 'Brawo, poprawnie!'}
      </h2>
      <p className="success-card__intro">{task.explanation}</p>

      <div className="lines-success__figure">
        <LineFigure {...task.figure} />
      </div>

      {summary && <p className="lines-success__answer">{summary}</p>}

      <div className="success-card__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={onNext}>
          Następne zadanie <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="btn btn--ghost" onClick={onExit}>
          Zmień tryb
        </button>
      </div>
    </section>
  )
}

export function LinesExercise({ mode, onExit, onSolved }) {
  const [exercise, setExercise] = useState(() => createExercise(mode))
  const [taskNumber, setTaskNumber] = useState(1)

  const { task, steps, index, history, finished } = exercise
  const step = steps[index]
  const isLast = index + 1 >= steps.length
  const helped = history.some((entry) => entry.revealed)

  const handleSolved = (entry) => {
    setExercise((current) => {
      if (current.history.some((item) => item.id === entry.id)) return current
      return { ...current, history: [...current.history, entry] }
    })
  }

  const handleNext = () => {
    if (isLast) {
      setExercise((current) => ({ ...current, finished: true }))
      onSolved()
      return
    }

    setExercise((current) => ({ ...current, index: current.index + 1 }))
  }

  const startNewTask = () => {
    setExercise(createExercise(mode))
    setTaskNumber((current) => current + 1)
  }

  return (
    <ExerciseLayout
      chip={
        <span className="chip chip--rose">
          <span aria-hidden="true">∡</span>
          Proste i kąty
        </span>
      }
      taskNumber={taskNumber}
      steps={steps}
      history={history}
      onExit={onExit}
      tipTitle={TIP_TITLE}
      tip={TIPS[task.kind]}
      emptyIcon="📏"
      taskCard={<TaskCard task={task} />}
    >
      {finished ? (
        <SuccessCard
          task={task}
          helped={helped}
          onNext={startNewTask}
          onExit={onExit}
        />
      ) : (
        <StepCard
          key={step.id}
          step={step}
          index={index}
          total={steps.length}
          isLast={isLast}
          onSolved={handleSolved}
          onNext={handleNext}
        />
      )}
    </ExerciseLayout>
  )
}
