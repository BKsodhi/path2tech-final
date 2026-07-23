const mongoose = require('mongoose');

const userPerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  performanceScore: {
    type: Number,
    required: true,
    default: 0
  },
  assignmentsCompleted: {
    type: Number,
    default: 0
  },
  practicesCompleted: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Compound index to quickly find performance trend for a specific user
userPerformanceSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('UserPerformance', userPerformanceSchema);
