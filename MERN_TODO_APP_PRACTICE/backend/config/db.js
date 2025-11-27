import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo-DB Connection Successful...");
  } catch (error) {
    console.log("Error Connecting to DB... ", error);
    process.exit(1);
  }
}

export default connectDB;
