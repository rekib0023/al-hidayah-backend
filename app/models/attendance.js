const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  isPresent: { type: Boolean, required: true },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
