const nodemailer = require('nodemailer');
module.exports = (to, subject, text) => {
  const transporter = nodemailer.createTransport({ /* SMTP setup */ });
  return transporter.sendMail({ from: 'noreply@example.com', to, subject, text });
};
