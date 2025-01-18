const sendEmail = require("./services/emailService"); // Adjust the path as needed

sendEmail(
  "kashyapmavani@yahoo.in",
  "Test Email",
  "<p>This is a test email from SendGrid.</p>"
)
  .then(() => console.log("Test email sent successfully"))
  .catch((error) => console.error("Error:", error.message));
