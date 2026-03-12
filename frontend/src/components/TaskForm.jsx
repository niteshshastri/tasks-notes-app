import { useState } from 'react';

const EMPTY = { title: '', description: '', status: 'todo', priority: 'medium', due_date: '', tags: [] };

export default function TaskForm({ initial = EMPTY, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial, tags: initial.tags || [] });
  const [tagInput, setTagInput] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const removeTag = (t) => set('tags', form.tags.filter(x => x !== t));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({ ...form, due_date: form.due_date || null });
  };

  return (
    <form onSubmit={handleSubmit} className="modal-body">
      <div className="field">
        <label>Title *</label>
        <input
          autoFocus
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="What needs to be done?"
        />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea
          value={form.description || ''}
          onChange={e => set('description', e.target.value)}
          placeholder="Add more context..."
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="field">
          <label>Priority</label>
          <select value={form.priority} onChange={e => set('priority', e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Due Date</label>
        <input
          type="date"
          value={form.due_date || ''}
          onChange={e => set('due_date', e.target.value)}
        />
      </div>
      <div className="field">
        <label>Tags</label>
        <div className="tag-input-row">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Add tag + Enter"
          />
          <button type="button" className="btn-ghost" onClick={addTag}>Add</button>
        </div>
        {form.tags.length > 0 && (
          <div className="tags" style={{ marginTop: '0.5rem' }}>
            {form.tags.map(t => (
              <span key={t} className="tag" style={{ cursor: 'pointer' }} onClick={() => removeTag(t)}>
                {t} ×
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading || !form.title.trim()}>
          {loading ? 'Saving…' : initial.id ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
