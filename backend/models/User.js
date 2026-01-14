const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['manager', 'member', 'admin'],
    default: 'member'
  },
  department: {
    type: String,
    enum: ['Engineering', 'Design', 'Product', 'Marketing', 'Other'],
    default: 'Engineering'
  },
  contact: {
    email: String,
    discord: String,
    linkedin: String,
    phone: String,
    github: String
  },
  skills: [{
    type: String
  }],
  bio: {
    type: String,
    default: ''
  },
  teams: [{
    type: String
  }],
  joinDate: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate avatar initials
userSchema.pre('save', function(next) {
  if (!this.avatar) {
    const names = this.name.split(' ');
    this.avatar = names.map(n => n[0]).join('').toUpperCase();
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
