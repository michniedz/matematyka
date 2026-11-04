import { useState } from 'react'
import { ExerciseLayout } from '../../components/ExerciseLayout.jsx'
import { StepCard } from '../../components/StepCard.jsx'
import { Expression, NumberToken } from './Expression.jsx'
import { generateTask } from './generator.js'
import { buildSteps } from './steps.jsx'

const TIP_TITLE = 'Nawiasy → × i ÷ → + i −'
const TIPS = {
  fractions:
    'W obrębie tego samego poziomu liczymy od lewej do prawej. Ułamki sprowadzamy do wspólnego mianownika, a dzielenie zamieniamy na mnożenie przez odwrotność.',
  decimals:
    'W obrębie tego samego poziomu liczymy od lewej do prawej. Przy dodawaniu i odejmowaniu wyrównaj przecinki, a przy mnożeniu i dzieleniu policz jak na liczbach całkowitych i wstaw przecinek.',
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
    <section className="task-card order-task">
      <div className="task-card__top">
        <span className="task-card__label">Oblicz</span>
        <span className="chip chip--mint">
          <span aria-hidden="true">( )</span>
          Kolejność działań
        </span>
      </div>

      <div className="order-task__expr">
        <Expression node={task.ast} size="lg" />
        <span className="task-card__equals">=</span>
        <span className="task-card__unknown" aria-label="wynik">
          ?
        </span>
      </div>

      <p className="order-task__style">
        {task.style === 'fractions'
          ? 'ułamki zwykłe i liczby całkowite'
          : 'liczby całkowite i dziesiętne'}
      </p>
    </section>
  )
}

function SuccessCard({ task, helped, onNext, onExit }) {
  const note =
    task.style === 'fractions'
      ? 'Pamiętaj, że ułamki zapisujemy w najprostszej postaci.'
      : 'Wynik zapisujemy z przecinkiem — bez zbędnych zer na końcu.'

  return (
    <section className={`success-card${helped ? ' success-card--helped' : ''}`}>
      <span className="success-card__spark" aria-hidden="true">
        {helped ? '🌱' : '🎉'}
      </span>
      <h2>{helped ? 'Dobrze, że doszedłeś do wyniku!' : 'Brawo, to poprawny wynik!'}</h2>
      <p className="success-card__intro">
        {helped
          ? 'Przeanalizuj kolejność działań i spróbuj następne zadanie samodzielnie.'
          : 'Całe wyrażenie obliczone krok po kroku. Tak trzymaj!'}
      </p>

      <div className="success-card__equation order-success__equation">
        <Expression node={task.ast} size="md" />
        <span className="success-card__sign">=</span>
        <NumberToken value={task.answer} size="xl" tone="success" />
      </div>

      <p className="success-card__note">
        Kolejność: nawiasy → mnożenie i dzielenie → dodawanie i odejmowanie.
        {' '}
        {note}
      </p>

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

export function OrderExercise({ mode, onExit, onSolved }) {
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
        <span className="chip chip--mint">
          <span aria-hidden="true">( )</span>
          Kolejność działań
        </span>
      }
      taskNumber={taskNumber}
      steps={steps}
      history={history}
      onExit={onExit}
      tipTitle={TIP_TITLE}
      tip={TIPS[task.style]}
      emptyIcon="🧮"
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
