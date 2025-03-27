const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const connectDB = require("./config/db");
const userPrefRoutes = require("./routes/userPrefRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

// Start Python Flask recommendation service on port 6002
const pythonServicePath = path.join(
  __dirname,
  "python-service",
  "recommendation_service.py"
);
const pythonProcess = spawn("python", [pythonServicePath], {
  env: { ...process.env, PORT: "6002" }, // Override PORT for the Python process
});

// Log Python process output
pythonProcess.stdout.on("data", (data) => {
  console.log(`Python recommendation service: ${data}`);
});

pythonProcess.stderr.on("data", (data) => {
  console.error(`Python recommendation service error: ${data}`);
});

// Restart logic if the Python process exits unexpectedly
pythonProcess.on("close", (code) => {
  console.log(`Python recommendation service exited with code ${code}`);
  if (code !== 0 && !app.isShuttingDown) {
    console.log("Restarting Python recommendation service...");
    setTimeout(() => {
      const newPythonProcess = spawn("python", [pythonServicePath], {
        env: { ...process.env, PORT: "6002" },
      });
      newPythonProcess.stdout.pipe(process.stdout);
      newPythonProcess.stderr.pipe(process.stderr);
    }, 3000); // Wait 3 seconds before restarting
  }
});

// Track shutdown state for graceful exit
app.isShuttingDown = false;
process.on("SIGINT", () => {
  console.log("Shutting down...");
  app.isShuttingDown = true;
  pythonProcess.kill();
  process.exit(0);
});

// Routes
app.use("/api/userPreference", userPrefRoutes);

app.get("/", (req, res) => {
  res.send("User Preference service is running!");
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Python recommendation service started.");
});
