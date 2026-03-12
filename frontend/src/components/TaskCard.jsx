const STATUS_LABEL = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const STATUS_CLASS = { todo: 'badge-todo', in_progress: 'badge-progress', done: 'badge-done' };
const PRI_CLASS    = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };

export default function TaskCard({ task, onClick }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div className="task-card" onClick={onClick} role="button" tabIndex={0}
         onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="task-card-header">
        <h3 className={`task-title${task.status === 'done' ? ' done' : ''}`}>{task.title}</h3>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-meta">
        <span className={`badge ${STATUS_CLASS[task.status]}`}>
          {STATUS_LABEL[task.status]}
        </span>
        <span className={`badge ${PRI_CLASS[task.priority]}`}>
          {task.priority}
        </span>

        {task.tags?.length > 0 && (
          <div className="tags">
            {task.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
            {task.tags.length > 2 && <span className="tag">+{task.tags.length - 2}</span>}
          </div>
        )}

        {task.due_date && (
          <span className={`due-date${isOverdue ? ' overdue' : ''}`}>
            {isOverdue ? '⚠ ' : '📅 '}
            {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short', day: 'numeric'
            })}
          </span>
        )}
      </div>
    </div>
  );
}
