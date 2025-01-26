// const sgMail = require("@sendgrid/mail");

// // Hardcode for testing (use environment variables in production)
// const SENDGRID_API_KEY =
//   "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";
// const EMAIL_SENDER = "nisarg.bhatti0904@gmail.com";

// sgMail.setApiKey(SENDGRID_API_KEY);

// const sendEmail = async (to, subject, text, html) => {
//   try {
//     const msg = {
//       to,
//       from:"nisarg.bhatti0904@gmail.com", // Verified sender email
//       subject,
//       text,
//       html,
//     };

//     console.log(`Sending email to: ${to}`);
//     await sgMail.send(msg); // Using async/await
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error(
//       "Error sending email:",
//       error.response ? error.response.body : error.message
//     );
//     throw new Error("Failed to send email");
//   }
// };

// module.exports = sendEmail;


const nodemailer = require("nodemailer");

// Create transporter using Mailtrap credentials
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // Use the correct Mailtrap host
  port: 2525, // Mailtrap port
  auth: {
    user: "546b7e7b83df25", // Replace with your Mailtrap user
    pass: "7b10f305b318a2", // Replace with your Mailtrap password
  },
});

// Reusable function to send emails
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: "nisarg.bhatti0904@gmail.com", // Replace with a verified sender address
      to, // Recipient email
      subject,
      text, // Plain text
      html, // HTML version
    };

    console.log(`Sending email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
