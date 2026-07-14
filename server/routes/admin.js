const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Problem = require('../models/Problem');
const Topic = require('../models/Topic');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const Submission = require('../models/Submission');
const LearningHubContent = require('../models/LearningHubContent');

// Protected admin routes
router.use(authMiddleware, adminAuth);

// --- OVERVIEW & STATS ---
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    
    res.json({
      totalUsers,
      totalProblems,
      totalAssessments,
      totalSubmissions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- USERS ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- PROBLEMS ---

// Add a new problem
router.post('/problems', async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.json(problem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a problem
router.put('/problems/:id', async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a problem
router.delete('/problems/:id', async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- ASSESSMENTS ---

// Add a new assessment
router.post('/assessments', async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    await assessment.save();
    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update an assessment
router.put('/assessments/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an assessment
router.delete('/assessments/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json({ message: 'Assessment deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- LEARNING HUB CONTENT ---

// Get all content
router.get('/content', async (req, res) => {
  try {
    const content = await LearningHubContent.find().sort({ subject: 1, type: 1 });
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add new content
router.post('/content', async (req, res) => {
  try {
    const content = new LearningHubContent(req.body);
    await content.save();
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update content
router.put('/content/:id', async (req, res) => {
  try {
    const content = await LearningHubContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete content
router.delete('/content/:id', async (req, res) => {
  try {
    const content = await LearningHubContent.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json({ message: 'Content deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
