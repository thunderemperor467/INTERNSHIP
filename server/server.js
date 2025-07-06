const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// 🧠 MIDDLEWARE – These must come FIRST
app.use(cors());
app.use(express.json()); // Parses application/json
app.use(express.urlencoded({ extended: true })); // Parses form-urlencoded

// 🧠 ROUTES – These come AFTER middleware
app.use("/api", require("./routes"));

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

