const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const LearningHubContent = require('../models/LearningHubContent');
const UserSubjectProgress = require('../models/UserSubjectProgress');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get content for a specific subject
router.get('/:subject', authMiddleware, async (req, res) => {
  try {
    const subject = req.params.subject;
    const content = await LearningHubContent.find({ subject });
    
    // Group by type for the frontend tabs
    const grouped = {
      theory: content.filter(c => c.type === 'theory'),
      mcq: content.filter(c => c.type === 'mcq'),
      coding: content.filter(c => c.type === 'coding')
    };

    // Get or create user progress
    let progress = await UserSubjectProgress.findOne({ userId: req.user, subject });
    if (!progress) {
      progress = await UserSubjectProgress.create({ userId: req.user, subject });
    }

    res.json({ content: grouped, progress });
  } catch (err) {
    console.error('Error fetching subject content:', err.message);
    res.status(500).send('Server Error');
  }
});

// Voice Evaluation Endpoint
router.post('/eval-vocal-response', authMiddleware, async (req, res) => {
  try {
    const { transcript, expectedKeywords, itemType, itemId, subject } = req.body;

    const prompt = `
      You are an expert, friendly AI teacher. The student was asked a ${itemType} question.
      Their voice-transcribed answer is: "${transcript}"
      The expected key concepts or keywords are: ${expectedKeywords.join(', ')}.
      
      Determine if the student's answer captures the semantic meaning of the expected concepts.
      It does not need to be a word-for-word match. Minor speech-to-text transcription errors are okay.
      
      Return ONLY a JSON object with the following fields:
      - passing (boolean): true if they grasped the core concept, false if they missed the mark completely.
      - score (number): a score from 0 to 100 based on accuracy.
      - encouragingFeedback (string): A short, friendly, supportive message (e.g., "Great job! You totally got it." or "That's a solid attempt! You're super close, try highlighting the concept of...").
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.response.text());

    // Update progress if they passed
    if (result.passing && itemId && subject) {
      const progress = await UserSubjectProgress.findOne({ userId: req.user, subject });
      if (progress && !progress.completedItems.includes(itemId)) {
        progress.completedItems.push(itemId);
        // Simple running average update for vocal score
        progress.vocalAccuracyScore = Math.round((progress.vocalAccuracyScore + result.score) / (progress.completedItems.length === 1 ? 1 : 2));
        await progress.save();
      }
    }

    res.json(result);
  } catch (err) {
    console.error('Vocal Eval Error:', err.message);
    res.status(500).json({ error: 'Failed to evaluate voice response.' });
  }
});

module.exports = router;
