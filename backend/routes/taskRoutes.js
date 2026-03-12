const { Router } = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');

const router = Router();

const taskValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('status').optional().isIn(['todo', 'in_progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  body('tags').optional().isArray(),
];

router.get('/',    taskController.listTasks);
router.get('/:id', taskController.getTask);
router.post('/',   taskValidation, taskController.createTask);
router.patch('/:id', taskValidation, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
