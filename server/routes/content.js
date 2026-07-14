const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Problem = require('../models/Problem');
const Interview = require('../models/Interview');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Topic = require('../models/Topic');

const authMiddleware = require('../middleware/auth');

// Get all topics
router.get('/topics', authMiddleware, async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all problems
router.get('/problems', authMiddleware, async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's latest interview
router.get('/interviews/latest', authMiddleware, async (req, res) => {
  try {
    let interview = await Interview.findOne({ user: req.user }).sort({ createdAt: -1 });
    res.json(interview || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's latest resume analysis
router.get('/resume/latest', authMiddleware, async (req, res) => {
  try {
    let resume = await ResumeAnalysis.findOne({ user: req.user }).sort({ createdAt: -1 });
    res.json(resume || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
