const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD } = process.env;
const sendEmail = async (email, subject, text, html) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: SMTP_HOST,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    // Define the email options
    const mailOptions = {
      from: `Waka <DANFIN>`,
      to: email,
      subject,
      text,
      html, // template html format
    };

    // Actually send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = sendEmail;
