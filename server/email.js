// Email notification helper
// In production, replace with actual SendGrid/Mailgun integration
async function sendEmail({ to, subject, text, html }) {
  // Currently logs to console - replace with SendGrid API in production
  console.log(`--- EMAIL TO: ${to} ---`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text || html}`);
  console.log(`--- END EMAIL ---`);
  return true;
}
module.exports = sendEmail;
