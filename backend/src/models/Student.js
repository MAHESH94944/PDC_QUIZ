const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  questionId: String,
  category: String,
  questionIndex: Number,
  answer: String,
});

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: String,
    hometown: String,
    gender: String,
    campus: String,
    branch: String,
    answers: [AnswerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
