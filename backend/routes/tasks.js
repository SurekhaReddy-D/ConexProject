const express = require('express');
const Task = require('../models/Task');
const Action = require('../models/Action');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get all tasks
router.get('/', authenticate, async (req, res) => {
  try {
    const { projectId, assignedTo, status } = req.query;
    const query = {};
    
    if (projectId) query.projectId = projectId;
    if (assignedTo) query.assignedTo = assignedTo;
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('projectId', 'name')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get task by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar department role contact')
      .populate('projectId', 'name description')
      .populate('createdBy', 'name email avatar');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/', authenticate, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      name: req.body.name || req.body.title,
      title: req.body.title || req.body.name,
      createdBy: req.user._id
    };

    const task = new Task(taskData);
    await task.save();

    // Create action
    await Action.create({
      type: 'task_assigned',
      title: `Task "${task.title}" assigned to ${req.body.assignedToName || 'user'}`,
      description: task.description,
      user: req.user._id,
      projectId: task.projectId,
      taskId: task._id,
      priority: task.priority,
      department: req.user.department
    });

    await task.populate('assignedTo', 'name email avatar');
    await task.populate('projectId', 'name');
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email avatar')
      .populate('projectId', 'name');

    // Create action if status changed to completed
    if (oldStatus !== 'Completed' && updatedTask.status === 'Completed') {
      updatedTask.completionDate = new Date();
      await updatedTask.save();

      await Action.create({
        type: 'task_completed',
        title: `Task "${updatedTask.title}" completed`,
        description: updatedTask.description,
        user: req.user._id,
        projectId: updatedTask.projectId,
        taskId: updatedTask._id,
        priority: updatedTask.priority,
        department: req.user.department
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks by project
router.get('/project/:projectId', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks by user
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId })
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
