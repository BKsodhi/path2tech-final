const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String }, // name of lucide-react icon
  totalTopics: { type: Number, default: 0 },
  color: { type: String } // e.g. "cyan", "violet", "emerald"
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
