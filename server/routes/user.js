const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = require('../middleware/auth');

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/progress', authMiddleware, async (req, res) => {
  try {
    const { problemsSolved, careerScore, streak, dsaScore, systemDesignScore, behavioralScore, resumeMatch } = req.body;
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (problemsSolved !== undefined) user.problemsSolved = problemsSolved;
    if (careerScore !== undefined) user.careerScore = careerScore;
    if (streak !== undefined) user.streak = streak;
    if (dsaScore !== undefined) user.dsaScore = dsaScore;
    if (systemDesignScore !== undefined) user.systemDesignScore = systemDesignScore;
    if (behavioralScore !== undefined) user.behavioralScore = behavioralScore;
    if (resumeMatch !== undefined) user.resumeMatch = resumeMatch;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
