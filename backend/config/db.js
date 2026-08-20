const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medcare_hospital';
    console.log(`Connecting to MongoDB at: ${mongoURI}...`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // 3 seconds timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn("⚠️ Falling back to in-memory store for REST endpoints.");
    return false;
  }
};

module.exports = connectDB;
