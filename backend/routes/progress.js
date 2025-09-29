const express = require('express');
const { prisma } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /progress/:userId - Get progress for user
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Allow users to view their own progress or trainers/admins to view any
    if (req.user.id !== parseInt(userId) && !['trainer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const progress = await prisma.progress.findMany({
      where: { user_id: parseInt(userId) },
      orderBy: { logged_date: 'desc' }
    });

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /progress - Log new progress
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { weight, photos, notes, logged_date } = req.body;
    const user_id = req.user.id;

    const newProgress = await prisma.progress.create({
      data: {
        user_id,
        weight: weight ? parseFloat(weight) : null,
        photos: photos ? JSON.stringify(photos) : null,
        notes,
        logged_date: logged_date || new Date()
      }
    });

    res.status(201).json(newProgress);
  } catch (error) {
    console.error('Error logging progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
