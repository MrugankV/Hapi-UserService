// utils/emailService.js
const nodemailer = require("nodemailer");

// Configure the email transport using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP server (e.g., Gmail, SendGrid, Mailgun)
  port: 587, // Typically 587 for TLS, 465 for SSL, or 25 for non-secure connections
  secure: false, // Use true for port 465, false for other ports
  auth: {
    user: process.env.mailer_username, // Your email address
    pass: process.env.mailer_password, // Your email password or app-specific password
  },
});

/**
 * Sends a welcome email to the new user
 * @param {string} email - Recipient's email address
 * @returns {Promise} - Promise indicating the email send result
 */
const sendWelcomeEmail = async (email) => {
  try {
    // Define the email options
    const mailOptions = {
      from: '"XYZ Corp" <your-email@example.com>', // Sender address
      to: email, // Recipient address
      subject: "Welcome to Our Platform!", // Subject line
      text: `Hello,\n\nWelcome to Our Platform! We're excited to have you on board.\n\nBest regards,\nThe Team`, // Plain text body
      html: `
        <h3>Hello,</h3>
        <p>Welcome to Our Platform! We're excited to have you on board.</p>
        <p>Best regards,<br/>The Team</p>
      `, // HTML body
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

module.exports = sendWelcomeEmail;
