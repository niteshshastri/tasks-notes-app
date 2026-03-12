const taskModel = require('../models/taskModel');

class TaskService {
  listTasks(query) {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));

    const { rows, total } = taskModel.findAll({
      search:   query.search   || '',
      status:   query.status   || '',
      priority: query.priority || '',
      page,
      limit,
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  getTask(id) {
    const task = taskModel.findById(id);
    if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });
    return task;
  }

  createTask(body) {
    return taskModel.create(body);
  }

  updateTask(id, body) {
    const existing = taskModel.findById(id);
    if (!existing) throw Object.assign(new Error('Task not found'), { status: 404 });
    return taskModel.update(id, body);
  }

  deleteTask(id) {
    const existing = taskModel.findById(id);
    if (!existing) throw Object.assign(new Error('Task not found'), { status: 404 });
    taskModel.delete(id);
  }
}

module.exports = new TaskService();
