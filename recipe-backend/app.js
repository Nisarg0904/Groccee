const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const express = require('express');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());

app.use(express.json());


app.use('/api/recipes', recipeRoutes);

app.get('/', (req, res) => {
    res.send('Recipe service is running!');
  });

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
