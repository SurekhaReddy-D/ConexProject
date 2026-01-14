const express = require('express');
const Meeting = require('../models/Meeting');
const Action = require('../models/Action');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get all meetings
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, type, projectId } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (projectId) query.projectId = projectId;

    const meetings = await Meeting.find(query)
      .populate('host', 'name email avatar')
      .populate('joinedMembers', 'name email avatar')
      .populate('projectId', 'name')
      .sort({ time: -1 });
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get meeting by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('host', 'name email avatar department role contact')
      .populate('joinedMembers', 'name email avatar')
      .populate('projectId', 'name');
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create meeting
router.post('/', authenticate, async (req, res) => {
  try {
    const meeting = new Meeting({
      ...req.body,
      host: req.user._id
    });
    await meeting.save();

    await meeting.populate('host', 'name email avatar');
    await meeting.populate('joinedMembers', 'name email avatar');
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update meeting
router.put('/:id', authenticate, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const oldStatus = meeting.status;
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('host', 'name email avatar')
      .populate('joinedMembers', 'name email avatar');

    // Create action if status changed to completed
    if (oldStatus !== 'Completed' && updatedMeeting.status === 'Completed') {
      await Action.create({
        type: 'meeting_completed',
        title: `Meeting "${updatedMeeting.name}" completed`,
        description: updatedMeeting.description,
        user: req.user._id,
        projectId: updatedMeeting.projectId,
        meetingId: updatedMeeting._id,
        hasMeeting: true,
        members: updatedMeeting.joinedMembers.map(m => m._id),
        department: req.user.department
      });
    }

    res.json(updatedMeeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete meeting
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join meeting
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (!meeting.joinedMembers.includes(req.user._id)) {
      meeting.joinedMembers.push(req.user._id);
      await meeting.save();
    }

    await meeting.populate('joinedMembers', 'name email avatar');
    res.json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get ongoing meetings
router.get('/status/ongoing', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const meetings = await Meeting.find({
      status: 'In Progress',
      time: { $lte: now }
    })
      .populate('host', 'name email avatar')
      .populate('joinedMembers', 'name email avatar')
      .sort({ time: -1 });
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming meetings
router.get('/status/upcoming', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const meetings = await Meeting.find({
      status: 'Scheduled',
      time: { $gte: now }
    })
      .populate('host', 'name email avatar')
      .populate('joinedMembers', 'name email avatar')
      .sort({ time: 1 });
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get meeting history
router.get('/status/history', authenticate, async (req, res) => {
  try {
    const meetings = await Meeting.find({
      status: 'Completed'
    })
      .populate('host', 'name email avatar')
      .populate('joinedMembers', 'name email avatar')
      .populate('projectId', 'name')
      .sort({ time: -1 })
      .limit(50);
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
