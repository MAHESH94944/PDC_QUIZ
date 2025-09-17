const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./db/db");
const studentRoutes = require("./routes/studentRoutes");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Student routes
app.use("/api/students", studentRoutes);

module.exports = app;
