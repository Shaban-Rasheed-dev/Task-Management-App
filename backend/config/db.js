import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database has been connected successfully");
  } catch (error) {
    console.log(`Database connectivity error: ${error}`);
    process.exit(1);
  }
};
