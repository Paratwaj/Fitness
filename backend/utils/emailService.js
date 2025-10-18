const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send renewal reminder email
const sendRenewalReminder = async (email, name, planName, endDate) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Subscription Renewal Reminder - FitHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Subscription Renewal Reminder</h2>
          <p>Dear ${name},</p>
          <p>Your ${planName} subscription is expiring on ${new Date(endDate).toLocaleDateString()}.</p>
          <p>Please renew your subscription to continue enjoying our fitness services.</p>
          <a href="${process.env.FRONTEND_URL}/pricing" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Now</a>
          <p>Thank you for being a valued member!</p>
          <p>Best regards,<br>The FitHub Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Renewal reminder sent to ${email}`);
  } catch (error) {
    console.error('Error sending renewal reminder email:', error);
  }
};

module.exports = {
  sendRenewalReminder,
};
