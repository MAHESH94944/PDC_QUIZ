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

// NEW: simple concurrency tracker & backpressure
const MAX_CONCURRENT = parseInt(
  process.env.MAX_CONCURRENT_REQUESTS || "50",
  10
);
let activeRequests = 0;

app.use((req, res, next) => {
  // keep health route responsive (it will still report busy)
  if (req.path === "/health") return next();

  activeRequests++;
  res.on("finish", () => {
    activeRequests = Math.max(0, activeRequests - 1);
  });

  if (activeRequests > MAX_CONCURRENT) {
    // advise client to retry after a short period
    res.setHeader("Retry-After", "2");
    return res.status(429).json({ status: "busy", activeRequests });
  }

  next();
});

// Health route used by frontend to wait until backend is able to accept requests
app.get("/health", (req, res) => {
  const busy = activeRequests >= MAX_CONCURRENT;
  if (busy) {
    res.setHeader("Retry-After", "2");
    return res.status(429).json({ status: "busy", activeRequests });
  }
  res.json({ status: "ok", activeRequests });
});

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Student routes
app.use("/api/students", studentRoutes);

module.exports = app;
