import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      required: true,
      default: "employee",
    },
    image: {
      type: String,
      defualt: "default-avatar.jpg",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
