const sgMail = require("@sendgrid/mail");

// Hardcode for testing (do not use in production)
const SENDGRID_API_KEY =
  "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";
const EMAIL_SENDER = "nisarg.bhatti@georgebrown.ca";

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (to, subject, htmlMessage) => {
  try {
    const msg = {
      to,
      from: {
        email: EMAIL_SENDER,
        name: "ProjectCollaborator", // Customize your sender name
      },
      subject,
      html: htmlMessage,
    };

    console.log(`Sending email to: ${to}`);
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.body : error.message
    );
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
