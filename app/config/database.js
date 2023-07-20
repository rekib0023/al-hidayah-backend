const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/al-hidayah", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
