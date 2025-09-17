const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./db/db");

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// routes
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);

// basic health route
app.get("/api/health", (req, res) => res.json({ ok: true }));

module.exports = app;
