const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get top users sorted by careerScore and problemsSolved
router.get('/', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ careerScore: -1, problemsSolved: -1 })
      .limit(50)
      .select('name careerScore problemsSolved streak dsaScore systemDesignScore');
    
    res.json(topUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
