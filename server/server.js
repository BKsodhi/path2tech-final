require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/content', require('./routes/content'));
app.use('/api/execute', require('./routes/execute'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/learning-hub', require('./routes/subjectRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/lms', require('./routes/lmsRoutes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
