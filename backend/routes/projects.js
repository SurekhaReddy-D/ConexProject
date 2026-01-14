const express = require('express');
const Project = require('../models/Project');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get all projects
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('members', 'name email avatar department role')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get project by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email avatar department role contact')
      .populate('tasks')
      .populate('createdBy', 'name email avatar');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project
router.post('/', authenticate, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.user._id
    });
    await project.save();
    
    // Create action
    const Action = require('../models/Action');
    await Action.create({
      type: 'project_created',
      title: `Project "${project.name}" was created`,
      description: project.description,
      user: req.user._id,
      projectId: project._id,
      priority: project.priority,
      department: req.user.department
    });

    await project.populate('members', 'name email avatar');
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update project
router.put('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('members', 'name email avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Recalculate progress
    await project.calculateProgress();
    await project.populate('members', 'name email avatar');

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add member to project
router.post('/:id/members', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { userId } = req.body;
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    await project.populate('members', 'name email avatar');
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove member from project
router.delete('/:id/members/:userId', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.members = project.members.filter(
      id => id.toString() !== req.params.userId
    );
    await project.save();

    await project.populate('members', 'name email avatar');
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
