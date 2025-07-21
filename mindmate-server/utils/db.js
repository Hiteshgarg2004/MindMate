// utils/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Load .env before using process.env

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDb;
