const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  subject: { type: String, required: true },
  isAllDay: { type: Boolean, default: false },
  color: { type: String },
  startTimeZone: { type: String, default: "India Standard Time" },
  endTimeZone: { type: String, default: "India Standard Time" },
  recurrenceRule: { type: String, default: "" },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
