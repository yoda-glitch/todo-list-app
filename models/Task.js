// models/Task.js - Blueprint for Task data
// Think of this like a form that defines what a "Task" looks like

const mongoose = require('mongoose');

// Define the Task Schema (blueprint)
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [1, 'Task title cannot be empty'],
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'deleted'], // Only these 3 values allowed
    default: 'pending' // New tasks start as pending
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User
    ref: 'User', // Links to User model
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create index for faster queries
taskSchema.index({ userId: 1, status: 1 });

// Create and export the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

