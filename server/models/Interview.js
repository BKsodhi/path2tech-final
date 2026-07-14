const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, default: 'SWE — Round 2' },
  durationSeconds: { type: Number, default: 0 },
  feedback: {
    eyeContact: { type: Number, default: 0 },
    speakingPace: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 }
  },
  transcript: [
    {
      role: { type: String, enum: ['ai', 'user'], required: true },
      text: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
