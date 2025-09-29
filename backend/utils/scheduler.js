const cron = require('node-cron');
const { prisma } = require('../config/database');
const { sendRenewalReminder } = require('./emailService');
const { sendRenewalReminderSMS } = require('./smsService');

// Schedule renewal reminders (runs daily at 9 AM)
const scheduleRenewalReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running renewal reminder job...');

    try {
      // Find subscriptions expiring in 3 days
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const expiringSubscriptions = await prisma.subscription.findMany({
        where: {
          status: 'active',
          end_date: {
            gte: new Date(threeDaysFromNow.toDateString()),
            lt: new Date(threeDaysFromNow.toDateString() + ' 23:59:59')
          },
          auto_renew: true
        },
        include: {
          user: {
            select: { name: true, email: true }
          },
          plan: {
            select: { name: true }
          }
        }
      });

      for (const sub of expiringSubscriptions) {
        // Send email reminder
        await sendRenewalReminder(sub.user.email, sub.user.name, sub.plan.name, sub.end_date);

        // Note: SMS would require phone number in user table
        // await sendRenewalReminderSMS(sub.user.phone, sub.user.name, sub.plan.name, sub.end_date);
      }

      console.log(`Sent ${expiringSubscriptions.length} renewal reminders`);
    } catch (error) {
      console.error('Error in renewal reminder job:', error);
    }
  });
};

// Schedule subscription status updates (runs daily at midnight)
const scheduleSubscriptionUpdates = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running subscription status update job...');

    try {
      // Mark expired subscriptions
      const expiredResult = await prisma.subscription.updateMany({
        where: {
          status: 'active',
          end_date: {
            lt: new Date()
          }
        },
        data: {
          status: 'expired'
        }
      });

      console.log(`Marked ${expiredResult.count} subscriptions as expired`);
    } catch (error) {
      console.error('Error in subscription update job:', error);
    }
  });
};

module.exports = {
  scheduleRenewalReminders,
  scheduleSubscriptionUpdates,
};
