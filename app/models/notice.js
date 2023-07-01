const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noticeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
