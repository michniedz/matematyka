export function ExerciseLayout({
  chip,
  taskNumber,
  steps,
  history,
  onExit,
  tipTitle,
  tip,
  taskCard,
  children,
  emptyIcon = '✏️',
}) {
  const progress = steps.length
    ? Math.round((history.length / steps.length) * 100)
    : 0

  return (
    <div className="exercise">
      <div className="exercise__top">
        <button type="button" className="btn btn--ghost btn--sm" onClick={onExit}>
          <span aria-hidden="true">←</span> Menu
        </button>

        <div className="exercise__id">
          {chip}
          <span className="exercise__number">Zadanie {taskNumber}</span>
        </div>

        <div className="progress-wrap">
          <div
            className="progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-valuenow={history.length}
            aria-label="Postęp rozwiązywania"
          >
            <span className="progress__fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress__label">
            {history.length} z {steps.length} kroków
          </span>
        </div>
      </div>

      <div className="exercise__grid">
        <div className="exercise__main">
          {taskCard}
          {children}
        </div>

        <aside className="side-panel">
          <div className="side-panel__head">
            <h2>Twoje kroki</h2>
            <span className="side-panel__count">
              {history.length}/{steps.length}
            </span>
          </div>

          {history.length === 0 ? (
            <div className="side-panel__empty">
              <span aria-hidden="true">{emptyIcon}</span>
              <p>Rozwiązuj krok po kroku. Tutaj zapiszą się Twoje obliczenia.</p>
            </div>
          ) : (
            <ol className="timeline">
              {history.map((entry) => (
                <li key={entry.id} className="timeline__item">
                  <span className="timeline__dot" aria-hidden="true" />
                  <div className="timeline__body">
                    <span className="timeline__title">{entry.title}</span>
                    <span className="timeline__visual">{entry.visual}</span>
                    {entry.revealed && (
                      <span className="timeline__note">pokazane rozwiązanie</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}

          <div className="tip-box">
            <span className="tip-box__icon" aria-hidden="true">
              💡
            </span>
            <div>
              <strong>{tipTitle}</strong>
              <p>{tip}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
