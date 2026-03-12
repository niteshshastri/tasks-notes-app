const noteModel = require('../models/noteModel');
const taskModel = require('../models/taskModel');

class NoteService {
  getNotesByTask(taskId) {
    const task = taskModel.findById(taskId);
    if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });
    return noteModel.findByTaskId(taskId);
  }

  createNote(taskId, content) {
    const task = taskModel.findById(taskId);
    if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });
    return noteModel.create(taskId, content);
  }

  updateNote(id, content) {
    const note = noteModel.findById(id);
    if (!note) throw Object.assign(new Error('Note not found'), { status: 404 });
    return noteModel.update(id, content);
  }

  deleteNote(id) {
    const note = noteModel.findById(id);
    if (!note) throw Object.assign(new Error('Note not found'), { status: 404 });
    noteModel.delete(id);
  }
}

module.exports = new NoteService();
