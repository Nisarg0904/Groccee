require('dotenv').config();

const express = require('express');
const groceryItemDB = require('./config/recipe_ingredient_db'); 
const app = express();
const recipeIngredientRoutes =  require('./routes/rcIngredient_routes')

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


app.use('/api/recipe-ingredients', recipeIngredientRoutes);

// Root route for health check
app.get('/', (req, res) => {
  res.send('Recipe Ingredient service is running!');
});

// Start the server
const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`Recipe Ingredient service running on port ${PORT}`);
});

module.exports = app;
