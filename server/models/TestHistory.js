const mongoose = require('mongoose');

const testHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  testType: {
    type: String,
    enum: ['APTITUDE', 'SKILL', 'INTERVIEW_FREE_FORM', 'INTERVIEW_JD', 'INTERVIEW_RESUME'],
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  feedback: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('TestHistory', testHistorySchema);
