const mongoose = require("mongoose");

const admissionRequest = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    parentName: { type: String, required: true },
    parentContact: { type: String, required: true },
    previousSchool: { type: String },
    gradeApplyingFor: { type: String, required: true },
    documents: [{
      name: { type: String, required: true },
      link: { type: String, required: true },
    }],
    submissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  });
  
  const Admission = mongoose.model('Admission', admissionRequest);
  
  module.exports = Admission;