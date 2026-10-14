import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Databse has been connected successfully");
  } catch (error) {
    console.log(`Error from Database connectivity: ${error.message}`);
    process.exit(1);
  }
};
