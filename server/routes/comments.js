const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Comment = require('../models/Comment');

// Get comments for a problem
router.get('/problem/:id', async (req, res) => {
  try {
    const comments = await Comment.find({ problem: req.params.id })
      .populate('user', 'name')
      .sort({ upvotes: -1, createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Post a comment
router.post('/problem/:id', authMiddleware, async (req, res) => {
  try {
    const comment = new Comment({
      user: req.user,
      problem: req.params.id,
      text: req.body.text
    });
    await comment.save();
    
    // Return populated comment
    const populated = await Comment.findById(comment._id).populate('user', 'name');
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Upvote comment
router.put('/:id/upvote', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    comment.upvotes += 1;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
