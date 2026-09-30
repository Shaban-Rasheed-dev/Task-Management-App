import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//siignup logic functionality
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body; // Zod se validated data

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
    });

    res.status(201).json({
      success: true,
      message: "User registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

//Login logic functionality
export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const existinguser = await User.findOne({ email }).select("+password");
    if (!existinguser) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });
    }
    const isPassword = await bcrypt.compare(password, existinguser.password);
    if (!isPassword) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });
    }

    const expiresIn = rememberMe ? "30d" : "1d";
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined; // undefined = session cookie
    const token = jwt.sign(
      {
        id: existinguser._id,
        role: existinguser.role,
        email: existinguser.email,
      },
      process.env.JWT_SECRET,
      // { expiresIn: "7d" },
      { expiresIn },
    );
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        // maxAge: 7 * 24 * 60 * 60 * 1000,
        ...(maxAge && { maxAge }), // sirf tab add karo jab maxAge defined ho
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: existinguser._id,
          name: existinguser.name,
          email: existinguser.email,
          role: existinguser.role,
        },
      });
  } catch (error) {
    next(error);
  }
};

//logout functionality
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
