const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: String },
  dateOfJoining: { type: Date },
  salary: { type: Number },
  employeeNumber: { type: Number },
  jobTitle: { type: String },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phoneNumber: { type: String },
  },
  bankDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    branch: { type: String },
    IFSCCode: { type: String },
  },
  documents: [
    {
      name: { type: String },
      description: { type: String },
      file: { type: String }, // Assuming file path or URL
    },
  ],
  attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }], // Reference to the Attendance model
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
