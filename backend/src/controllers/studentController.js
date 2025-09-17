const Student = require("../models/Student");

exports.createStudent = async (req, res) => {
  try {
    const { name, email, contact, hometown, gender, campus, branch, answers } =
      req.body;
    if (!name || !email)
      return res.status(400).json({ message: "name and email required" });

    const student = new Student({
      name,
      email,
      contact,
      hometown,
      gender,
      campus,
      branch,
      answers: answers || [],
    });

    const saved = await student.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudents = async (req, res) => {
  try {
    // include campus, branch, contact and createdAt for admin list view
    const students = await Student.find(
      {},
      "name email contact hometown gender campus branch createdAt"
    ).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
