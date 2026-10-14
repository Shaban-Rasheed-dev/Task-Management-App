import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const categoryRouter = express.Router();
categoryRouter.post("/", authMiddleware, createCategory);
categoryRouter.get("/", authMiddleware, getAllCategory);
categoryRouter.get("/one/:id", authMiddleware, getOneCategory);
categoryRouter.put("/update/:id", authMiddleware, updateCategory);
categoryRouter.delete("/delete/:id", authMiddleware, deleteCategory);
