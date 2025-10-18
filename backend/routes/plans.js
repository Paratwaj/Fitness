const express = require('express');
const { prisma } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /plans - Get all active plans
router.get('/', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { is_active: true },
      orderBy: { price: 'asc' }
    });
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /plans - Create new plan (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, description, price, duration_months, features } = req.body;

    if (!name || !price || !duration_months) {
      return res.status(400).json({ error: 'Name, price, and duration are required' });
    }

    const newPlan = await prisma.plan.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration_months,
        features: features ? JSON.stringify(features) : null
      }
    });

    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /plans/:id - Update plan (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration_months, features, is_active } = req.body;

    const updatedPlan = await prisma.plan.updateMany({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        duration_months,
        features: features ? JSON.stringify(features) : undefined,
        is_active: is_active !== undefined ? is_active : undefined
      }
    });

    if (updatedPlan.count === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = await prisma.plan.findUnique({ where: { id: parseInt(id) } });
    res.json(plan);
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /plans/:id - Delete plan (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPlan = await prisma.plan.deleteMany({
      where: { id: parseInt(id) }
    });

    if (deletedPlan.count === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
