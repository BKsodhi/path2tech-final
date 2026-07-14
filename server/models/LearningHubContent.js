const mongoose = require('mongoose');

const learningHubContentSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    enum: [
      'Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 
      'Computer Networks', 'OOPs', 'System Design', 'Web Development', 
      'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Computer Architecture'
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['theory', 'mcq', 'coding']
  },
  title: {
    type: String,
    required: true
  },
  contentPayload: {
    type: Object, // JSON object storing specific questions, options, starter codes, and targeted reference keywords
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('LearningHubContent', learningHubContentSchema);
