const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send renewal reminder SMS
const sendRenewalReminderSMS = async (phoneNumber, name, planName, endDate) => {
  try {
    const message = await client.messages.create({
      body: `Hi ${name}, your ${planName} subscription expires on ${new Date(endDate).toLocaleDateString()}. Renew now at ${process.env.FRONTEND_URL}/pricing`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`Renewal reminder SMS sent to ${phoneNumber}, SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending renewal reminder SMS:', error);
  }
};

module.exports = {
  sendRenewalReminderSMS,
};
