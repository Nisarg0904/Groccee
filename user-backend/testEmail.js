// const sendEmail = require("./services/emailService"); // Adjust the path as needed

// sendEmail(
//   "nisargbhatti09@gmail.com",
//   "Test Email",
//   "This is a test email from SendGrid.",
//   "<p>This is a test email from SendGrid.</p>"
// )
//   .then(() => console.log("Test email sent successfully"))
//   .catch((error) => console.error("Error:", error.message));

const sendEmail = require("./services/emailService"); // Adjust the path as needed

sendEmail(
  "nisargbhatti09@gmail.com", // Recipient email
  "Test Email", // Email subject
  "This is a test email with Mailtrap.", // Plain text
  "<p>This is a <strong>test email</strong> with Mailtrap.</p>" // HTML
)
  .then(() => console.log("Test email sent successfully"))
  .catch((error) => console.error("Error:", error.message));
