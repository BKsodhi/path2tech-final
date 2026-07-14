const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Submission = require('../models/Submission');

// Get past submissions for a specific problem
router.get('/problem/:id', authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user,
      problem: req.params.id
    }).sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
