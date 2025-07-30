const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect('mongodb://127.0.0.1:27017/quick_clinic');
    const conn = await mongoose.connect(process.env.DB_LINK);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
