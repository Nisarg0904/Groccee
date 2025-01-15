const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const express = require('express');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());

app.use(express.json());


// app.use('/api/userPreference');

app.get('/', (req, res) => {
    res.send('User Preference service is running!');
  });

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
