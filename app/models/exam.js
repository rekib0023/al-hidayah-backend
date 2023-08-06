const mongoose = require("mongoose");

const studentMarksSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  isPresent: {
    type: Boolean,
    required: true,
  },
});

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  examDate: {
    type: Date,
  },
  classN: {
    type: String,
    required: true,
  },
  result: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      marks: [studentMarksSchema],
      totalMarksObtained:  {
        type: Number,
      },
      totalMarks:  {
        type: Number,
      },
      percent:  {
        type: Number,
      },
    },
  ],
});

const Result = mongoose.model("Result", studentMarksSchema);
const Exam = mongoose.model("Exam", examSchema);

module.exports = {
  Exam,
  Result,
};
