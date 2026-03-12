import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../api/tasks';
import toast from 'react-hot-toast';

export function useNotes(taskId) {
  const [notes, setNotes]   = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const res = await getNotes(taskId);
      setNotes(res.data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [taskId]);

  const addNote = async (content) => {
    try {
      const res = await createNote(taskId, { content });
      setNotes(prev => [res.data, ...prev]);
      toast.success('Note added!');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const editNote = async (id, content) => {
    try {
      const res = await updateNote(taskId, id, { content });
      setNotes(prev => prev.map(n => n.id === id ? res.data : n));
      toast.success('Note updated!');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const removeNote = async (id) => {
    try {
      await deleteNote(taskId, id);
      setNotes(prev => prev.filter(n => n.id !== id));
      toast.success('Note deleted');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return { notes, loading, addNote, editNote, removeNote };
}
