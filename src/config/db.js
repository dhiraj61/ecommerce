const { tryCatch } = require("bullmq");
const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URI);
    if (connect) {
      console.log("connected to database");
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;
