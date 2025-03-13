const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

// Start Python Flask recommendation service
const pythonServicePath = path.join(__dirname, 'python-service', 'recommendation_service.py');
const pythonProcess = spawn('python', [pythonServicePath]);

// Log Python process output
pythonProcess.stdout.on('data', (data) => {
  console.log(`Python recommendation service: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Python recommendation service error: ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Python recommendation service exited with code ${code}`);
  // Restart the service if it crashes unexpectedly
  if (code !== 0 && !app.isShuttingDown) {
    console.log('Restarting Python recommendation service...');
    setTimeout(() => {
      const newPythonProcess = spawn('python', [pythonServicePath]);
      pythonProcess.stdout.pipe(process.stdout);
      pythonProcess.stderr.pipe(process.stderr);
    }, 3000); // Wait 3 seconds before restarting
  }
});

// API routes
app.use('/api/recipes', recipeRoutes);

app.get('/', (req, res) => {
  res.send('Recipe service is running!');
});

// Track shutdown state
app.isShuttingDown = false;

// Handle application shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  app.isShuttingDown = true;
  pythonProcess.kill();
  process.exit(0);
});

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Python recommendation service started on port 6001');
});