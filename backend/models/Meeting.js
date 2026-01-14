const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['Daily', 'Planning', 'Review', 'Sprint', 'Technical', 'External', 'Strategy', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  time: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 60 // in minutes
  },
  location: {
    type: String,
    default: 'Virtual Meeting'
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinedMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  agenda: [{
    type: String
  }],
  hasDocument: {
    type: Boolean,
    default: false
  },
  hasRecording: {
    type: Boolean,
    default: false
  },
  documentUrl: {
    type: String
  },
  recordingUrl: {
    type: String
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema);
