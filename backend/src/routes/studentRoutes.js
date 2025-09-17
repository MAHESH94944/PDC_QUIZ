const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentController");

// POST /api/students  -> create student with answers
router.post("/", controller.createStudent);

// GET /api/students -> list students (admin)
router.get("/", controller.getStudents);

// GET /api/students/:id -> student detail with answers
router.get("/:id", controller.getStudentById);

module.exports = router;
