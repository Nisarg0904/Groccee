require('dotenv').config();
require("./scheduler"); // Import the scheduled task

const express = require('express');
const groceryItemDB = require('./config/groceryitem_db'); 
const app = express();
const groceryItemRoutes = require('./routes/groceryItemRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Middleware to parse incoming JSON requests
app.use(express.json());


async function testDBConnection() {
  try {
    await groceryItemDB.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
}
testDBConnection();


app.use('/api/groceryitems', groceryItemRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route for health check
app.get('/', (req, res) => {
  res.send('GroceryItem service is running!');
});

// Start the server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`GroceryItem service running on port ${PORT}`);
});

module.exports = app;
