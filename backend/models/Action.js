const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['task_completed', 'meeting_completed', 'milestone_reached', 'code_review', 'bug_fixed', 'design_completed', 'project_created', 'task_assigned', 'comment_added'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  department: {
    type: String,
    enum: ['Engineering', 'Design', 'Product', 'Marketing', 'Other'],
    default: 'Other'
  },
  hasDocument: {
    type: Boolean,
    default: false
  },
  hasMeeting: {
    type: Boolean,
    default: false
  },
  hasGitHub: {
    type: Boolean,
    default: false
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
actionSchema.index({ createdAt: -1 });
actionSchema.index({ projectId: 1, createdAt: -1 });
actionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Action', actionSchema);
