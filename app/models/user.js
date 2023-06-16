const mongoose = require("mongoose");
const { UserType } = require("../utils/constants");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date },
  address: { type: String },
  phone: { type: String },
  type: {
    type: String,
    enum: [UserType.MANAGEMENT, UserType.STAFF, UserType.STUDENT],
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
