const sendgrid = require('@sendgrid/mail');

// Configure SendGrid from environment variable
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
if (SENDGRID_API_KEY) sendgrid.setApiKey(SENDGRID_API_KEY);

async function sendEmail({ to, subject, text, html }) {
  if (SENDGRID_API_KEY) {
    try {
      await sendgrid.send({
        to, from: process.env.FROM_EMAIL || 'noreply@horizonstore.com',
        subject, text, html
      });
      console.log(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (err) {
      console.error('SendGrid error:', err.message);
      // Fallback to console log
    }
  }
  console.log(`--- EMAIL TO: ${to} ---`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text || html}`);
  console.log(`--- END EMAIL ---`);
  return true;
}

module.exports = sendEmail;