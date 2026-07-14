const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  password: { type: String, required: true },
  streak: { type: Number, default: 0 },
  problemsSolved: { type: Number, default: 0 },
  careerScore: { type: Number, default: 0 },
  dsaScore: { type: Number, default: 0 },
  systemDesignScore: { type: Number, default: 0 },
  behavioralScore: { type: Number, default: 0 },
  resumeMatch: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
