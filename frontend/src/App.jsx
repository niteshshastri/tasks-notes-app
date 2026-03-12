import { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTasks } from './hooks/useTasks';
import TaskCard    from './components/TaskCard';
import TaskDetail  from './components/TaskDetail';
import TaskForm    from './components/TaskForm';
import './styles/global.css';

export default function App() {
  const {
    tasks, pagination, filters, page, loading,
    setFilters, setPage,
    addTask, editTask, removeTask,
  } = useTasks();

  const [search, setSearch]           = useState('');
  const [showCreate, setShowCreate]   = useState(false);
  const [detailTask, setDetailTask]   = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving]           = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search })), 350);
    return () => clearTimeout(t);
  }, [search]);

  const handleCreate = async (body) => {
    setSaving(true);
    const ok = await addTask(body);
    setSaving(false);
    if (ok) setShowCreate(false);
  };

  const handleUpdate = async (id, body) => {
    const updated = await editTask(id, body);
    if (updated && detailTask?.id === id) setDetailTask(updated);
  };

  const handleEditSave = async (body) => {
    setSaving(true);
    const updated = await editTask(editingTask.id, body);
    setSaving(false);
    if (updated) {
      setEditingTask(null);
      if (detailTask?.id === editingTask.id) setDetailTask(updated);
    }
  };

  const stats = {
    total: pagination.total,
    todo:  tasks.filter(t => t.status === 'todo').length,
    inProg: tasks.filter(t => t.status === 'in_progress').length,
    done:  tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="app">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e1e1e', color: '#f0ede8', border: '1px solid #2a2a2a', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }
      }} />

      <header className="header">
        <div className="header-logo">Task<span>Flow</span></div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Task</button>
      </header>

      <main className="main">
        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-chip"><strong>{pagination.total}</strong> total</div>
          <div className="stat-chip" style={{ color: 'var(--todo)' }}><strong>{stats.todo}</strong> to do</div>
          <div className="stat-chip" style={{ color: 'var(--progress)' }}><strong>{stats.inProg}</strong> in progress</div>
          <div className="stat-chip" style={{ color: 'var(--done)' }}><strong>{stats.done}</strong> done</div>
        </div>

        {/* Controls */}
        <div className="controls">
          <input
            className="search-input"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            className="filter-select"
            value={filters.priority}
            onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="loading">Loading tasks…</div>
        ) : (
          <div className="task-grid">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>No tasks found.</p>
                <p style={{ marginTop: '0.5rem' }}>
                  {filters.search || filters.status || filters.priority
                    ? 'Try adjusting your filters.'
                    : 'Create your first task to get started!'}
                </p>
              </div>
            ) : (
              tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setDetailTask(task)}
                />
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="page-info">Page {page} of {pagination.totalPages}</span>
            <button className="btn-ghost" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">New Task</h2>
              <button className="btn-icon" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} loading={saving} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditingTask(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Edit Task</h2>
              <button className="btn-icon" onClick={() => setEditingTask(null)}>✕</button>
            </div>
            <TaskForm
              initial={editingTask}
              onSubmit={handleEditSave}
              onCancel={() => setEditingTask(null)}
              loading={saving}
            />
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {detailTask && !editingTask && (
        <TaskDetail
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onUpdate={handleUpdate}
          onEdit={(t) => setEditingTask(t)}
          onDelete={removeTask}
        />
      )}
    </div>
  );
}
