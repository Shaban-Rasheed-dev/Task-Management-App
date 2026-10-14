import { Comment } from "../models/commentModel.js";

export const addComment = async (req, res, next) => {
  try {
    const { taskId, message } = req.body;
    if (!taskId || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Task and message are required" });
    }
    const comment = await Comment.create({
      taskId,
      userId: req.user._id,
      message,
    });
    res.status(201).json({ success: true, message: "Comment added", comment });
  } catch (error) {
    next(error);
  }
};

//comments by task logic
export const getCommentsByTask = async (req, res, next) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate("taskId", "name")
      .populate("userId", "name");

    res
      .status(200)
      .json({ success: true, message: "Comments fetched", comments });
  } catch (error) {
    next(error);
  }
};
