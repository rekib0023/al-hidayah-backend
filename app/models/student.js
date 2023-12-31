const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rollNumber: { type: String, required: true },
  batch: { type: String },
  class: { type: String },
  parentsDetail: { type: String },
  dateOfAdmission: { type: Date },
  admissionNumber: { type: Number },
  attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }], // Reference to the Attendance model
});

studentSchema.index({ rollNumber: 1, class: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
