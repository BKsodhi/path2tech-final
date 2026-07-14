const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timeLimitMinutes: {
    type: Number,
    required: true
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  xpReward: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
