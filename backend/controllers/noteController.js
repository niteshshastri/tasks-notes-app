const { validationResult } = require('express-validator');
const noteService = require('../services/noteService');

exports.getNotes = (req, res, next) => {
  try {
    const notes = noteService.getNotesByTask(Number(req.params.taskId));
    res.json({ success: true, data: notes });
  } catch (err) {
    next(err);
  }
};

exports.createNote = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const note = noteService.createNote(Number(req.params.taskId), req.body.content);
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

exports.updateNote = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const note = noteService.updateNote(Number(req.params.id), req.body.content);
    res.json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = (req, res, next) => {
  try {
    noteService.deleteNote(Number(req.params.id));
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
};
