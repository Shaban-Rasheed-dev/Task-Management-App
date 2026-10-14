import express from "express";
import {
  dashBoard,
  handleForgotPassword,
  handleResetPassword,
  loginUser,
  otpVerify,
  signUpUser,
} from "../controllers/authController.js";
import { validateSchema } from "../middlewares/validateMiddleware.js";
import { loginschema, signUpschema } from "../validators/authValidator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const authRouter = express.Router();
authRouter.post("/register", validateSchema(signUpschema), signUpUser);
authRouter.post("/login", validateSchema(loginschema), loginUser);
authRouter.get("/dashboard", authMiddleware, dashBoard);
authRouter.post("/forgot-password", handleForgotPassword);
authRouter.post("/verify-otp", otpVerify);
authRouter.post("/reset-password", handleResetPassword);
