const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// Tasks
export const getTasks = (params) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  ).toString();
  return request(`/tasks${qs ? `?${qs}` : ''}`);
};

export const getTask    = (id)       => request(`/tasks/${id}`);
export const createTask = (body)     => request('/tasks', { method: 'POST', body });
export const updateTask = (id, body) => request(`/tasks/${id}`, { method: 'PATCH', body });
export const deleteTask = (id)       => request(`/tasks/${id}`, { method: 'DELETE' });

// Notes
export const getNotes    = (taskId)       => request(`/tasks/${taskId}/notes`);
export const createNote  = (taskId, body) => request(`/tasks/${taskId}/notes`, { method: 'POST', body });
export const updateNote  = (taskId, id, body) => request(`/tasks/${taskId}/notes/${id}`, { method: 'PATCH', body });
export const deleteNote  = (taskId, id)   => request(`/tasks/${taskId}/notes/${id}`, { method: 'DELETE' });
