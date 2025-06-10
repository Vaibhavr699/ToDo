import ErrorResponse from '../utils/errorResponse.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Get all tasks for the logged-in user
// @route   GET /api/v1/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// @desc    Get tasks by status for the logged-in user
// @route   GET /api/v1/tasks/status/:status
// @access  Private
export const getTasksByStatus = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      status: req.params.status
    }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks by status error:', error);
    res.status(500).json({ message: 'Error fetching tasks by status' });
  }
};

// @desc    Get tasks by priority for the logged-in user
// @route   GET /api/v1/tasks/priority/:priority
// @access  Private
export const getTasksByPriority = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      priority: req.params.priority
    }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks by priority error:', error);
    res.status(500).json({ message: 'Error fetching tasks by priority' });
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).where('user').equals(req.user.id);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      user: req.user._id // Associate task with the logged-in user
    };

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error creating task' });
  }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Only update if task belongs to user
      req.body,
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validators on update
      }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Update task error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id // Only delete if task belongs to user
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};