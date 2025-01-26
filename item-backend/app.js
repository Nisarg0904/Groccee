const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());

app.use("/api/items", itemRoutes);

app.get('/', (req, res) => {
  res.send('Recipe service is running!');
});

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
