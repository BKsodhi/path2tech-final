const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { GoogleGenAI } = require('@google/genai');
const Notification = require('../models/Notification');

// Initialize Gemini SDK safely
let ai;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
  console.warn("GEMINI_API_KEY is not set. AI routes will return simulated responses.");
}

// POST /api/ai/interview
router.post('/interview', authMiddleware, async (req, res) => {
  try {
    const { messages, topic, question } = req.body;
    
    if (!ai) {
      // Simulated response if API key is missing
      return res.json({ 
        role: "ai", 
        text: `[SIMULATED RESPONSE - Add GEMINI_API_KEY to .env] That's a great answer about ${topic || 'software engineering'}. Could you elaborate more on the specific challenges you faced?`
      });
    }

    // Convert messages for Gemini
    const contents = messages.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const systemInstruction = `You are an expert AI technical interviewer for a software engineering role. 
The candidate is currently practicing the topic: ${topic || 'General SWE'}. 
If a specific question was provided ("${question || 'none'}"), ensure you evaluate their understanding of it.
Keep your responses concise, conversational, and professional. Ask follow-up questions to test depth of knowledge.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      role: 'ai',
      text: response.text
    });

  } catch (err) {
    console.error("AI Interview Error:", err);
    // Fallback if API key is invalid or blocked
    res.json({ 
      role: "ai", 
      text: `[SIMULATED FALLBACK - API Error: ${err.status || err.message}] That's a great answer about ${topic || 'software engineering'}. Could you elaborate more on the specific challenges you faced?`
    });
  }
});

// POST /api/ai/resume
router.post('/resume', authMiddleware, async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    if (!ai) {
      // Simulated response if API key is missing
      return res.json({ 
        atsScore: 87,
        keywordsMatched: 24,
        keywordsTotal: 28,
        formatScore: "Excellent",
        missingSkills: ["Docker", "Kubernetes", "GraphQL"],
        simulated: true
      });
    }

    const prompt = `Analyze the following resume text for a Software Engineering role. 
Calculate an ATS compatibility score (0-100), count matched keywords out of a typical 30-keyword set, evaluate the format (Poor/Good/Excellent), and list 3-5 missing industry-standard skills.
Return ONLY a raw JSON object with these exact keys: atsScore (number), keywordsMatched (number), keywordsTotal (number), formatScore (string), missingSkills (array of strings). Do not use markdown blocks.

Resume Text:
${resumeText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    try {
      const jsonStr = response.text.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(jsonStr);
      
      // Create a notification
      await Notification.create({
        user: req.user.id,
        title: "AI Resume Analysis Complete",
        desc: `Your ATS score is ${result.atsScore}%. Format: ${result.formatScore}.`,
        type: result.atsScore >= 80 ? "success" : "info"
      });
      
      res.json(result);
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", response.text);
      res.status(500).json({ message: "Failed to parse AI resume analysis." });
    }

  } catch (err) {
    console.error("AI Resume Error:", err);
    // Fallback if API key is invalid or blocked
    res.json({ 
      atsScore: 87,
      keywordsMatched: 24,
      keywordsTotal: 28,
      formatScore: "Excellent",
      missingSkills: ["Docker", "Kubernetes", "GraphQL", "API Key Denied"],
      simulated: true
    });
  }
});

module.exports = router;
