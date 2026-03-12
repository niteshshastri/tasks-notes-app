import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';

const STATUS = ['todo', 'in_progress', 'done'];
const STATUS_LABEL = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const PRI_CLASS    = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };

export default function TaskDetail({ task, onClose, onUpdate, onEdit, onDelete }) {
  const { notes, addNote, editNote, removeNote } = useNotes(task.id);
  const [noteText, setNoteText]   = useState('');
  const [editingNote, setEditingNote] = useState(null); // { id, content }
  const [submitting, setSubmitting]   = useState(false);

  const handleStatusChange = async (status) => {
    await onUpdate(task.id, { status });
  };

  const submitNote = async () => {
    if (!noteText.trim()) return;
    setSubmitting(true);
    await addNote(noteText.trim());
    setNoteText('');
    setSubmitting(false);
  };

  const submitEditNote = async () => {
    if (!editingNote.content.trim()) return;
    await editNote(editingNote.id, editingNote.content.trim());
    setEditingNote(null);
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal detail-modal">
        <div className="modal-header">
          <h2 className="modal-title">{task.title}</h2>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button className="btn-ghost" onClick={() => onEdit(task)}>Edit</button>
            <button className="btn-danger" onClick={() => { onDelete(task.id); onClose(); }}>Delete</button>
            <button className="btn-icon" onClick={onClose} title="Close">✕</button>
          </div>
        </div>

        <div className="modal-body">
          {/* Status Quick-Select */}
          <div className="field">
            <label>Status</label>
            <div className="status-quick">
              {STATUS.map(s => (
                <button
                  key={s}
                  className={`status-btn ${s}${task.status === s ? ' active' : ''}`}
                  onClick={() => handleStatusChange(s)}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge ${PRI_CLASS[task.priority]}`}>{task.priority} priority</span>
            {task.due_date && (
              <span className={`due-date${isOverdue ? ' overdue' : ''}`}>
                {isOverdue ? '⚠ Overdue: ' : '📅 Due: '}
                {new Date(task.due_date + 'T00:00:00').toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div className="field">
              <label>Description</label>
              <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>
                {task.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="tags">
              {task.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}

          {/* Timestamps */}
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
            Created {new Date(task.created_at).toLocaleString()}
            {task.updated_at !== task.created_at && ` · Updated ${new Date(task.updated_at).toLocaleString()}`}
          </p>

          {/* Notes */}
          <div className="notes-section">
            <p className="notes-title">Notes ({notes.length})</p>

            <div className="note-form">
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note..."
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) submitNote(); }}
              />
              <button className="btn-primary" onClick={submitNote} disabled={submitting || !noteText.trim()}>
                Add
              </button>
            </div>

            {notes.map(note => (
              <div key={note.id} className="note-item">
                {editingNote?.id === note.id ? (
                  <>
                    <textarea
                      className="note-content"
                      value={editingNote.content}
                      onChange={e => setEditingNote(n => ({ ...n, content: e.target.value }))}
                      style={{ background: 'transparent', border: '1px solid var(--accent)', borderRadius: '4px', padding: '0.3rem' }}
                    />
                    <div className="note-actions">
                      <button className="btn-primary" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }} onClick={submitEditNote}>Save</button>
                      <button className="btn-ghost"   style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }} onClick={() => setEditingNote(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="note-content">{note.content}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                      <span className="note-date">{new Date(note.created_at).toLocaleDateString()}</span>
                      <div className="note-actions">
                        <button className="btn-icon" onClick={() => setEditingNote({ id: note.id, content: note.content })} title="Edit">✏</button>
                        <button className="btn-icon btn-danger" onClick={() => removeNote(note.id)} title="Delete">×</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
