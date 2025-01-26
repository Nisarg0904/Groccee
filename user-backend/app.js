require("dotenv").config();
const express = require("express");
const app = express();
const sequelize = require("./config/user_db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Database connection error:", err));
