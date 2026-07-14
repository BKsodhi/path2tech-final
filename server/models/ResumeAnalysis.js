const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  atsScore: { type: Number, default: 0 },
  formatScore: { type: String, default: 'Needs Review' },
  keywords: [
    {
      word: String,
      found: Boolean
    }
  ],
  suggestions: [
    {
      text: String,
      impact: String,
      done: Boolean
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
