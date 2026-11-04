import { useState } from 'react'
import { ExerciseLayout } from '../../components/ExerciseLayout.jsx'
import { StepCard } from '../../components/StepCard.jsx'
import { AngleFigure } from './AngleFigure.jsx'
import { DimensionList, Figure } from './Figure.jsx'
import { generateTask } from './generator.js'
import { buildSteps } from './steps.jsx'

const TIP_TITLE = 'Pole, obwód i kąty'
const TIPS = {
  area: 'Pole mierzymy w centymetrach kwadratowych (cm²). Wybierz wzór, podstaw dane i policz krok po kroku.',
  perimeter:
    'Obwód to długość granicy figury — mierzymy go w centymetrach (cm). Dodaj długości wszystkich boków.',
  angles:
    'Kąt prosty ma 90°, półpełny 180°, a pełny 360°. Kąt wklęsły jest większy od półpełnego, ale mniejszy od pełnego.',
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
  if (task.kind === 'angle') {
    return (
      <section className="task-card geometry-task">
        <div className="task-card__top">
          <span className="task-card__label">Rozpoznaj kąt</span>
          <span className="chip chip--amber">
            <span aria-hidden="true">∠</span>
            Kąty
          </span>
        </div>

        <div className="geometry-task__figure geometry-task__figure--angle">
          <AngleFigure type={task.angle.id} />
        </div>

        <p className="geometry-task__prompt">
          Popatrz na ramiona kąta i ich rozwarcie. Jaki to kąt?
        </p>
      </section>
    )
  }

  return (
    <section className="task-card geometry-task">
      <div className="task-card__top">
        <span className="task-card__label">
          {task.quantity === 'area' ? 'Oblicz pole' : 'Oblicz obwód'}
        </span>
        <span className={`chip chip--${task.figure.color}`}>
          {task.figure.name}
        </span>
      </div>

      <div className="geometry-task__figure">
        <Figure
          type={task.figureId}
          dims={task.dims}
          approxKeys={task.approxKeys}
          name={task.figure.name}
        />
      </div>

      <DimensionList dims={task.dims} approxKeys={task.approxKeys} />

      <p className="geometry-task__prompt">{task.prompt}</p>
    </section>
  )
}

function SuccessCard({ task, helped, onNext, onExit }) {
  if (task.kind === 'angle') {
    return (
      <section className={`success-card${helped ? ' success-card--helped' : ''}`}>
        <span className="success-card__spark" aria-hidden="true">
          {helped ? '🌱' : '🎉'}
        </span>
        <h2>
          {helped
            ? 'Dobrze, że doszedłeś do rozwiązania!'
            : `To ${task.angle.name.toLowerCase()}!`}
        </h2>
        <p className="success-card__intro">{task.angle.description}</p>

        <div className="geometry-success__figure geometry-success__figure--angle">
          <AngleFigure type={task.angle.id} label={task.angle.name} />
        </div>

        <p className="success-card__note">
          Zakres miary: {task.angle.range}. {task.angle.example}.
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

  const answerLabel = task.quantity === 'area' ? 'P' : 'Obw'

  return (
    <section className={`success-card${helped ? ' success-card--helped' : ''}`}>
      <span className="success-card__spark" aria-hidden="true">
        {helped ? '🌱' : '🎉'}
      </span>
      <h2>
        {helped
          ? 'Dobrze, że doszedłeś do wyniku!'
          : task.quantity === 'area'
            ? 'Brawo, poprawne pole!'
            : 'Brawo, poprawny obwód!'}
      </h2>
      <p className="success-card__intro">
        {helped
          ? 'Przeanalizuj wzór i policz kolejne zadanie samodzielnie.'
          : 'Wzór, dane i obliczenia — wszystko się zgadza.'}
      </p>

      <div className="geometry-success__figure">
        <Figure
          type={task.figureId}
          dims={task.dims}
          approxKeys={task.approxKeys}
          name={task.figure.name}
        />
      </div>

      <div className="geometry-success__equation">
        <span className="geometry-success__answer-label">{answerLabel} =</span>
        <strong className="geometry-success__answer">
          {task.answerText} {task.unit}
        </strong>
      </div>

      <p className="success-card__note">
        {task.formula}. {task.explanation}
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

export function GeometryExercise({ mode, onExit, onSolved }) {
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

  const tip =
    task.kind === 'angle' ? TIPS.angles : TIPS[task.quantity]

  return (
    <ExerciseLayout
      chip={
        <span className="chip chip--amber">
          <span aria-hidden="true">📐</span>
          Figury i kąty
        </span>
      }
      taskNumber={taskNumber}
      steps={steps}
      history={history}
      onExit={onExit}
      tipTitle={TIP_TITLE}
      tip={tip}
      emptyIcon="📐"
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
