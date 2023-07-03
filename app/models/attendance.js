const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String },
  date: { type: Date, required: true },
  isPresent: { type: Boolean, required: true },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
