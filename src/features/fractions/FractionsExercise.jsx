import { useState } from 'react'
import { Fraction } from '../../components/Fraction.jsx'
import { FractionBar } from '../../components/FractionBar.jsx'
import { StepCard } from '../../components/StepCard.jsx'
import { ExerciseLayout } from '../../components/ExerciseLayout.jsx'
import { generateTask } from './generator.js'
import { getModeMeta } from './operations.js'
import { buildSteps } from './steps.jsx'

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

function TaskCard({ task, meta }) {
  return (
    <section className="task-card">
      <div className="task-card__top">
        <span className="task-card__label">Oblicz</span>
        <span className={`chip chip--${meta.color}`}>
          <span aria-hidden="true">{meta.glyph}</span>
          {meta.name}
        </span>
      </div>

      <div className="task-card__expr">
        <span className="operand">
          <Fraction n={task.left.n} d={task.left.d} size="lg" tone="a" />
          <FractionBar n={task.left.n} d={task.left.d} tone="a" />
        </span>

        <span className="task-card__sign">{meta.sign}</span>

        <span className="operand">
          <Fraction n={task.right.n} d={task.right.d} size="lg" tone="b" />
          <FractionBar n={task.right.n} d={task.right.d} tone="b" />
        </span>

        <span className="task-card__equals">=</span>
        <span className="task-card__unknown" aria-label="wynik">
          ?
        </span>
      </div>
    </section>
  )
}

function SuccessCard({ task, meta, helped, onNext, onExit }) {
  const simplifyNote =
    task.op === 'add' || task.op === 'sub'
      ? task.needsSimplify
        ? 'Wynik został skrócony do najprostszej postaci.'
        : 'Ten wynik od razu był w najprostszej postaci — nie trzeba było skracać.'
      : 'Skracanie na krzyż sprawiło, że wynik jest już w najprostszej postaci.'

  return (
    <section className={`success-card${helped ? ' success-card--helped' : ''}`}>
      <span className="success-card__spark" aria-hidden="true">
        {helped ? '🌱' : '🎉'}
      </span>
      <h2>{helped ? 'Dobrze, że doszedłeś do wyniku!' : 'Brawo, to poprawny wynik!'}</h2>
      <p className="success-card__intro">
        {helped
          ? 'Przeanalizuj rozwiązanie i spróbuj kolejne zadanie samodzielnie.'
          : 'Rozwiązałeś zadanie krok po kroku. Tak trzymaj!'}
      </p>

      <div className="success-card__equation">
        <Fraction n={task.left.n} d={task.left.d} size="md" tone="a" />
        <span className="success-card__sign">{meta.sign}</span>
        <Fraction n={task.right.n} d={task.right.d} size="md" tone="b" />
        <span className="success-card__sign">=</span>
        <Fraction n={task.answer.n} d={task.answer.d} size="xl" tone="success" />
      </div>

      <p className="success-card__note">{simplifyNote}</p>

      <div className="success-card__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={onNext}>
          Następne zadanie <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="btn btn--ghost" onClick={onExit}>
          Zmień dział
        </button>
      </div>
    </section>
  )
}

export function FractionsExercise({ mode, onExit, onSolved }) {
  const [exercise, setExercise] = useState(() => createExercise(mode))
  const [taskNumber, setTaskNumber] = useState(1)

  const { task, steps, index, history, finished } = exercise
  const meta = getModeMeta(task.op)
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
        <span className={`chip chip--${meta.color}`}>
          <span aria-hidden="true">{meta.glyph}</span>
          {meta.name}
        </span>
      }
      taskNumber={taskNumber}
      steps={steps}
      history={history}
      onExit={onExit}
      tipTitle={meta.tipTitle}
      tip={meta.tip}
      taskCard={<TaskCard task={task} meta={meta} />}
    >
      {finished ? (
        <SuccessCard
          task={task}
          meta={meta}
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
