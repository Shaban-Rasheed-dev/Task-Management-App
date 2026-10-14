import express from "express";
import {
  addComment,
  getCommentsByTask,
} from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
export const commentRouter = express.Router();
commentRouter.post("/create", authMiddleware, addComment);
commentRouter.get("/:taskId", authMiddleware, getCommentsByTask);
