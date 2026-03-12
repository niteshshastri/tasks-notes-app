const { validationResult } = require('express-validator');
const taskService = require('../services/taskService');

exports.listTasks = (req, res, next) => {
  try {
    const result = taskService.listTasks(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

exports.getTask = (req, res, next) => {
  try {
    const task = taskService.getTask(Number(req.params.id));
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.createTask = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const task = taskService.createTask(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const task = taskService.updateTask(Number(req.params.id), req.body);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = (req, res, next) => {
  try {
    taskService.deleteTask(Number(req.params.id));
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
