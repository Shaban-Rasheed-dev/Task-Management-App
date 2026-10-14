import express from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  getUpdateUser,
  getUsersForDropdown,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploads } from "../middlewares/multer.js";
export const userRouter = express.Router();
userRouter.post("/adduser", authMiddleware, uploads.single("image"), addUser);
userRouter.get("/allusers", authMiddleware, getAllUsers);
userRouter.get("/dropdown", authMiddleware, getUsersForDropdown);
userRouter.get("/edit/:id", authMiddleware, getOneUser);
userRouter.put(
  "/update/:id",
  authMiddleware,
  uploads.single("image"),
  getUpdateUser,
);
userRouter.delete("/delete/:id", authMiddleware, deleteUser);
