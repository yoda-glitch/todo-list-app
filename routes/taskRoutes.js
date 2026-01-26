// routes/taskRoutes.js - URL paths for tasks

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(authMiddleware);

// GET /tasks - Show all tasks
router.get('/', taskController.getTasks);

// POST /tasks - Create new task
router.post('/', taskController.createTask);

// POST /tasks/:id/complete - Mark task as completed
router.post('/:id/complete', taskController.completeTask);

// POST /tasks/:id/delete - Delete task
router.post('/:id/delete', taskController.deleteTask);

module.exports = router;