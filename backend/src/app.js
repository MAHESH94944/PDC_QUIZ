const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

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

// simple status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    ok: true,
    message: "Backend is running",
    env: process.env.NODE_ENV || "development",
  });
});

// If running in non-production and frontend static not served, provide a simple root response
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("Backend is running. Visit /api/status for JSON.");
  });
}

// Serve frontend in production (or when FRONTEND_DIST is set)
const isProd = process.env.NODE_ENV === "production";
const frontendDist =
  process.env.FRONTEND_DIST ||
  path.resolve(__dirname, "..", "..", "frontend", "dist");

if (isProd) {
  // Serve static files
  app.use(express.static(frontendDist));

  // For any non-API GET request, serve index.html so SPA routing works
  // Use middleware (not app.get with "*") to avoid path-to-regexp errors on Render
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"), (err) => {
      if (err) {
        console.error("Error sending index.html:", err);
        res.status(500).send("Server error");
      }
    });
  });
}

module.exports = app;
