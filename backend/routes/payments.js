const express = require('express');
const { prisma } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Initialize Stripe only if key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = require('stripe');
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

const router = express.Router();

// POST /payments - Process payment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'usd', payment_method_id, subscription_id } = req.body;
    const user_id = req.user.id;

    if (!amount || !payment_method_id) {
      return res.status(400).json({ error: 'Amount and payment method are required' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method: payment_method_id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Record payment in database
    const payment = await prisma.payment.create({
      data: {
        user_id,
        subscription_id: subscription_id ? parseInt(subscription_id) : null,
        amount: parseFloat(amount),
        currency,
        payment_method: 'stripe',
        transaction_id: paymentIntent.id,
        status: 'completed'
      }
    });

    res.json({
      payment,
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// GET /payments/:userId - Get payment history
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Allow users to view their own payments or admins to view any
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const payments = await prisma.payment.findMany({
      where: { user_id: parseInt(userId) },
      orderBy: { created_at: 'desc' }
    });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Webhook endpoint for Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update payment status in database
      await prisma.payment.updateMany({
        where: { transaction_id: paymentIntent.id },
        data: { status: 'completed' }
      });
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await prisma.payment.updateMany({
        where: { transaction_id: failedPayment.id },
        data: { status: 'failed' }
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
