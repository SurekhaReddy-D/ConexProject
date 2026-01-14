const express = require('express');
const Action = require('../models/Action');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get all actions
router.get('/', authenticate, async (req, res) => {
  try {
    const { projectId, userId, type, department } = req.query;
    const query = {};
    
    if (projectId) query.projectId = projectId;
    if (userId) query.user = userId;
    if (type) query.type = type;
    if (department) query.department = department;

    const actions = await Action.find(query)
      .populate('user', 'name email avatar')
      .populate('projectId', 'name')
      .populate('taskId', 'title')
      .populate('meetingId', 'name')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get action by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const action = await Action.findById(req.params.id)
      .populate('user', 'name email avatar department role')
      .populate('projectId', 'name')
      .populate('taskId', 'title description')
      .populate('meetingId', 'name description')
      .populate('members', 'name email avatar');
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }
    res.json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create action
router.post('/', authenticate, async (req, res) => {
  try {
    const action = new Action({
      ...req.body,
      user: req.user._id
    });
    await action.save();

    await action.populate('user', 'name email avatar');
    res.status(201).json(action);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get recent actions (for timeline)
router.get('/recent/timeline', authenticate, async (req, res) => {
  try {
    const { projectId, department } = req.query;
    const query = {};
    
    if (projectId && projectId !== 'all') query.projectId = projectId;
    if (department && department !== 'all') query.department = department;

    const actions = await Action.find(query)
      .populate('user', 'name email avatar')
      .populate('projectId', 'name')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
