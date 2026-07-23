const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const UserPerformance = require('../models/UserPerformance');
const Assignment = require('../models/Assignment');
const TestHistory = require('../models/TestHistory');

// GET /api/lms/dashboard - Fetch data for the main analytics dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user;

    // Fetch assignments for this user
    const assignments = await Assignment.find({ userId }).sort({ dueDate: 1 });
    
    // Fetch performance trends
    const performance = await UserPerformance.find({ userId }).sort({ date: 1 }).limit(30);

    res.json({
      assignments,
      performance,
      message: "LMS dashboard data successfully fetched."
    });
  } catch (error) {
    console.error('LMS Dashboard Error:', error);
    res.status(500).json({ message: 'Server error fetching LMS data' });
  }
});

// GET /api/lms/assignments - Fetch all assignments with filters
router.get('/assignments', authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const { category } = req.query; // e.g. 'Marketing', 'CODING'

    const filter = { userId };
    if (category) filter.type = category;

    const assignments = await Assignment.find(filter).sort({ dueDate: 1 });
    res.json({ assignments });
  } catch (error) {
    console.error('Assignments Fetch Error:', error);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
});

module.exports = router;
