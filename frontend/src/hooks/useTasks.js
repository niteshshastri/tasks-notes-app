import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import toast from 'react-hot-toast';

export function useTasks() {
  const [tasks, setTasks]         = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });
  const [filters, setFilters]     = useState({ search: '', status: '', priority: '' });
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks({ ...filters, page, limit: 9 });
      setTasks(res.data);
      setPagination(res.pagination);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [filters]);

  const addTask = async (body) => {
    try {
      await createTask(body);
      toast.success('Task created!');
      fetchTasks();
      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    }
  };

  const editTask = async (id, body) => {
    try {
      const res = await updateTask(id, body);
      setTasks(prev => prev.map(t => t.id === id ? res.data : t));
      toast.success('Task updated!');
      return res.data;
    } catch (e) {
      toast.error(e.message);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return {
    tasks, pagination, filters, page, loading,
    setFilters, setPage,
    addTask, editTask, removeTask, refresh: fetchTasks,
  };
}
