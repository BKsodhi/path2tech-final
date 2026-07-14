const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
  xp: { type: Number, default: 50 },
  examples: [
    {
      input: String,
      output: String,
      explanation: String
    }
  ],
  starterCode: { type: String, default: '' },
  testCases: [
    {
      input: String,
      expected: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
