const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Submission = require('../models/Submission');
const UserSubjectProgress = require('../models/UserSubjectProgress');

// GET /api/analytics
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch User Subject Progress for "Topics Mastered"
    // A topic is mastered if completedItems.length > 0 (or a specific threshold)
    const subjectProgress = await UserSubjectProgress.find({ userId });
    let topicsMastered = 0;
    subjectProgress.forEach(progress => {
      if (progress.completedItems && progress.completedItems.length > 0) {
        topicsMastered++;
      }
    });

    // 2. Fetch all Submissions for this user
    const submissions = await Submission.find({ user: userId }).sort({ createdAt: 1 });
    
    // Total Questions Solved (unique problems solved vs total submissions)
    // We'll count total submissions as interaction, but questionsSolved could be unique
    const uniqueProblems = new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problem.toString()));
    const questionsSolved = uniqueProblems.size;

    // Time Invested (Estimate 5 mins per submission)
    const totalMinutes = submissions.length * 5;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeInvestedStr = `${hours}h ${minutes}m`;

    // Accuracy
    const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;
    const totalCount = submissions.length;
    const accuracy = totalCount > 0 ? Math.round((acceptedCount / totalCount) * 100) : 0;

    // 3. Aggregate 7-Day Progress Data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const progressData = [];
    
    // Generate the last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.setHours(0,0,0,0));
      const endOfDay = new Date(d.setHours(23,59,59,999));
      
      const daySubs = submissions.filter(s => {
        const dDate = new Date(s.createdAt);
        return dDate >= startOfDay && dDate <= endOfDay;
      });

      const dayTotal = daySubs.length;
      const dayAccepted = daySubs.filter(s => s.status === 'Accepted').length;
      const dayAccuracy = dayTotal > 0 ? Math.round((dayAccepted / dayTotal) * 100) : 0;
      const dayTime = dayTotal * 5; // 5 mins per sub

      progressData.push({
        day: days[startOfDay.getDay()],
        accuracy: dayAccuracy,
        time: dayTime
      });
    }

    res.json({
      timeInvested: timeInvestedStr,
      questionsSolved: questionsSolved,
      accuracy: accuracy,
      topicsMastered: topicsMastered,
      progressData: progressData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
