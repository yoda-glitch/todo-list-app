// controllers/taskController.js - Handles all task operations

const Task = require('../models/Task');
const logger = require('../config/logger');

// Show All Tasks
exports.getTasks = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const filter = req.query.filter || 'all'; 
    // all, pending, completed

    let query = { userId, status: { $ne: 'deleted' } };

    if (filter === 'pending') {
      query.status = 'pending';
    } else if (filter === 'completed') {
      query.status = 'completed';
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.render('tasks', { tasks, filter });
  } catch (error) {
    logger.error(`Get tasks error: ${error.message}`);
    res.render('tasks', { tasks: [], filter: 'all', error: 'Failed to load tasks' });
  }
};

// Create New Task
exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.session.user.id;

    if (!title || title.trim() === '') {
      return res.redirect('/tasks');
    }

    const task = new Task({
      title: title.trim(),
      userId
    });

    await task.save();
    logger.info(`Task created by user ${req.session.user.username}: ${title}`);

    res.redirect('/tasks');
  } catch (error) {
    logger.error(`Create task error: ${error.message}`);
    res.redirect('/tasks');
  }
};

// Mark Task as Completed
exports.completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.session.user.id;

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      return res.redirect('/tasks');
    }

    task.status = 'completed';
    await task.save();

    logger.info(`Task completed: ${task.title}`);
    res.redirect('/tasks');
  } catch (error) {
    logger.error(`Complete task error: ${error.message}`);
    res.redirect('/tasks');
  }
};

// Delete Task (mark as deleted)
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.session.user.id;

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      return res.redirect('/tasks');
    }

    task.status = 'deleted';
    await task.save();

    logger.info(`Task deleted: ${task.title}`);
    res.redirect('/tasks');
  } catch (error) {
    logger.error(`Delete task error: ${error.message}`);
    res.redirect('/tasks');
  }
};