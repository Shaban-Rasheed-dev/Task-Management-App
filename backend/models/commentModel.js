import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // knse task ka comment hai
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    // comment kis user ne kiya
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //message knsa aya hai
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", commentSchema);
