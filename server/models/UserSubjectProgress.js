const mongoose = require('mongoose');

const userSubjectProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  vocalAccuracyScore: {
    type: Number,
    default: 0
  },
  codingSuccessRate: {
    type: Number,
    default: 0
  },
  completedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningHubContent'
  }]
}, { timestamps: true });

// Compound index to ensure one progress record per user per subject
userSubjectProgressSchema.index({ userId: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('UserSubjectProgress', userSubjectProgressSchema);
