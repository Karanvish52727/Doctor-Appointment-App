import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`MongoDB connection error: ${error.message}`.bgRed.white);
  }
};

export default connectDB;
