const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Assessment = require('../models/Assessment');

// Get all assessments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const assessments = await Assessment.find().populate('problems', 'title difficulty tags xp');
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get specific assessment
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('problems');
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
