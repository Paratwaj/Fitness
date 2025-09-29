const express = require('express');
const { prisma } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /admin/analytics - Get analytics data
router.get('/analytics', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    // Total members
    const totalMembers = await prisma.user.count({
      where: { role: 'member' }
    });

    // Total revenue
    const totalRevenueResult = await prisma.payment.aggregate({
      where: { status: 'completed' },
      _sum: { amount: true }
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    // Active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'active' }
    });

    // For monthly revenue and member growth, use raw queries since Prisma doesn't support date truncation easily
    const monthlyRevenue = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "created_at") as month,
        SUM(amount) as revenue
      FROM payments
      WHERE status = 'completed' AND "created_at" >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "created_at")
      ORDER BY month DESC
    `;

    const memberGrowth = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "join_date") as month,
        COUNT(*) as new_members
      FROM users
      WHERE role = 'member' AND "join_date" >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "join_date")
      ORDER BY month DESC
    `;

    res.json({
      totalMembers,
      totalRevenue,
      activeSubscriptions,
      monthlyRevenue,
      memberGrowth
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /users - List all users (admin only)
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        join_date: true
      },
      orderBy: { join_date: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /users/:id - Update user (admin only)
router.put('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /users/:id - Delete user (admin only)
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
