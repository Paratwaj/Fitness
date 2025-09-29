const express = require('express');
const { prisma } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// POST /subscriptions - Create subscription (member)
router.post('/', authenticateToken, authorizeRoles('member'), async (req, res) => {
  try {
    const { plan_id } = req.body;
    const user_id = req.user.id;

    if (!plan_id) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    // Check if plan exists
    const plan = await prisma.plan.findFirst({
      where: { id: parseInt(plan_id), is_active: true }
    });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check if user already has active subscription
    const existingSub = await prisma.subscription.findFirst({
      where: { user_id, status: 'active' }
    });

    if (existingSub) {
      return res.status(400).json({ error: 'User already has an active subscription' });
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + plan.duration_months);

    const newSubscription = await prisma.subscription.create({
      data: {
        user_id,
        plan_id: parseInt(plan_id),
        start_date: startDate,
        end_date: endDate
      }
    });

    res.status(201).json(newSubscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /subscriptions/:userId - Get user's subscription
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Allow users to view their own subscription or admins to view any
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { user_id: parseInt(userId), status: 'active' },
      include: {
        plan: true
      },
      orderBy: { created_at: 'desc' }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /subscriptions/:id - Update subscription (renew/upgrade)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { plan_id, auto_renew } = req.body;

    // Find subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(id) }
    });
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Check ownership or admin access
    if (subscription.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};

    if (plan_id) {
      // Upgrade plan
      const plan = await prisma.plan.findFirst({
        where: { id: parseInt(plan_id), is_active: true }
      });
      if (!plan) {
        return res.status(404).json({ error: 'New plan not found' });
      }

      const newEndDate = new Date(subscription.end_date);
      newEndDate.setMonth(newEndDate.getMonth() + plan.duration_months);

      updateData.plan_id = parseInt(plan_id);
      updateData.end_date = newEndDate;
    }

    if (auto_renew !== undefined) {
      updateData.auto_renew = auto_renew;
    }

    const updatedSub = await prisma.subscription.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(updatedSub);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
