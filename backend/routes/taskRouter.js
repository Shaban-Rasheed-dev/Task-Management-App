import express from "express";
import {
  allTasks,
  createTask,
  deleteTask,
  endTime,
  getOneTask,
  startTime,
  updateTask,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleCheck } from "../middlewares/roleCheck.js";
export const taskRouter = express.Router();
taskRouter.post("/create", authMiddleware, roleCheck("admin"), createTask);
taskRouter.get("/alltasks", authMiddleware, allTasks);
taskRouter.get("/edit/:id", authMiddleware, getOneTask);
taskRouter.put("/update/:id", authMiddleware, roleCheck("admin"), updateTask);
taskRouter.delete(
  "/delete/:id",
  authMiddleware,
  roleCheck("admin"),
  deleteTask,
);
taskRouter.patch(
  "/start/:id",
  authMiddleware,
  roleCheck("employee"),
  startTime,
);
taskRouter.patch("/end/:id", authMiddleware, roleCheck("employee"), endTime);
