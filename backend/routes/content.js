const express = require('express');
const { prisma } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /content/feed - Get feed content (workouts and diets)
router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: { created_at: 'desc' },
      take: 10
    });
    const diets = await prisma.diet.findMany({
      orderBy: { created_at: 'desc' },
      take: 10
    });

    const feed = [
      ...workouts.map(w => ({ type: 'workout', ...w })),
      ...diets.map(d => ({ type: 'diet', ...d }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(feed);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /content/workout - Get all workouts
router.get('/workout', authenticateToken, async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /content/diet - Get all diets
router.get('/diet', authenticateToken, async (req, res) => {
  try {
    const diets = await prisma.diet.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(diets);
  } catch (error) {
    console.error('Error fetching diets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /content/assign - Assign workout and/or diet to member (trainer only)
router.post('/assign', authenticateToken, authorizeRoles('trainer'), async (req, res) => {
  try {
    const { member_id, workout_id, diet_id, notes } = req.body;
    const trainer_id = req.user.id;

    if (!member_id) {
      return res.status(400).json({ error: 'Member ID is required' });
    }

    // Verify member exists and is a member
    const member = await prisma.user.findFirst({
      where: { id: parseInt(member_id), role: 'member' }
    });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Verify workout exists if provided
    if (workout_id) {
      const workout = await prisma.workout.findUnique({
        where: { id: parseInt(workout_id) }
      });
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
    }

    // Verify diet exists if provided
    if (diet_id) {
      const diet = await prisma.diet.findUnique({
        where: { id: parseInt(diet_id) }
      });
      if (!diet) {
        return res.status(404).json({ error: 'Diet not found' });
      }
    }

    const assignment = await prisma.assignment.create({
      data: {
        trainer_id,
        member_id: parseInt(member_id),
        workout_id: workout_id ? parseInt(workout_id) : null,
        diet_id: diet_id ? parseInt(diet_id) : null,
        notes
      }
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error assigning content:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /content/assigned/:memberId - Get assigned content for member
router.get('/assigned/:memberId', authenticateToken, async (req, res) => {
  try {
    const { memberId } = req.params;

    // Allow member to view their own assignments or trainer/admin to view any
    if (req.user.id !== parseInt(memberId) && !['trainer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignments = await prisma.assignment.findMany({
      where: { member_id: parseInt(memberId) },
      include: {
        workout: true,
        diet: true,
        trainer: {
          select: { name: true }
        }
      },
      orderBy: { assigned_date: 'desc' }
    });

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
