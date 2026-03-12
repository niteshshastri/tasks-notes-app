const { Router } = require('express');
const { body } = require('express-validator');
const noteController = require('../controllers/noteController');

const router = Router({ mergeParams: true });

const noteValidation = [
  body('content').notEmpty().withMessage('Content is required').trim(),
];

// Nested under /tasks/:taskId/notes
router.get('/',    noteController.getNotes);
router.post('/',   noteValidation, noteController.createNote);
router.patch('/:id', noteValidation, noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
