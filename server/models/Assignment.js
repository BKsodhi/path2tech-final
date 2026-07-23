const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Marketing', 'AI', 'CODING', 'Finance', 'CS', 'General'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['REGISTERED', 'PENDING', 'COMPLETED', 'OVERDUE'],
    default: 'PENDING'
  },
  classAverage: {
    type: Number,
    default: 0
  },
  // To track user-specific data, we might use a separate collection or array, 
  // but for the MVP assignment library, we'll store generic info here and track completion in a separate UserAssignment model or array in User.
  // Alternatively, if this represents a user's specific assignment instance:
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attempts: {
    type: Number,
    default: 0
  },
  userScore: {
    type: Number,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
