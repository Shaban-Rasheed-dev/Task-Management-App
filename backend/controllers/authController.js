import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Otp } from "../models/otpModel.js";
import { sendEmail } from "../config/sendMail.js";
import crypto from "crypto";

//user sigup logic  functionality
export const signUpUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });

    //check if user is already is exist
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }

    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRound);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
    });

    res.status(201).json({
      success: true,
      message: "User Registered",
    });
  } catch (error) {
    next(error);
  }
};

//user login logic functionality
export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const userExist = await User.findOne({ email }).select("+password");

    //check if user is not in DB
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isMatchedPassword = await bcrypt.compare(
      password,
      userExist.password,
    );

    if (isMatchedPassword) {
      const expiresIn = rememberMe ? "30d" : "1d";
      const token = jwt.sign(
        { userId: userExist._id, email: userExist.email, role: userExist.role },
        process.env.JWT_SECRET,
        { expiresIn },
      );
      // console.log("Remember me value:", rememberMe);
      // console.log("Token expiry set to:", expiresIn);
      return res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    // console.log(error);
    // res.status(500).json({ success: false, message: "internal server error" });
    next(error);
  }
};

//dashboard logic functionality
export const dashBoard = (req, res, next) => {
  try {
    const userData = req.user;
    return res.status(200).json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
};

//create a ogic for handleforgot password
// export const handleForgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     console.log("opt code", otp);

//     const newOtp = await Otp.create({
//       email,
//       otp,
//     });
//     const message = `Your verification code for reset password is${otp} `;
//     await sendEmail(email, "Reset Password", message);
//     res
//       .status(200)
//       .json({ success: true, message: "Otp is sent to your email" });
//   } catch (error) {
//     next(error);
//   }
// };

// //verify otp
// export const otpVerify = async (req, res, next) => {
//   const { email, otp } = req.body;
//   try {
//     const otpRecord = await Otp.findOne({ email, otp });

//     if (!otpRecord) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired otp" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Otp verification successfull" });
//   } catch (error) {
//     next(error);
//   }
// };

// //new password logic
// export const handleResetPassword = async (req, res, next) => {
//   const { email, otp, newPassword } = req.body;
//   try {
//     const otpRecord = await Otp.findOne({ email, otp });

//     if (!otpRecord) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired otp" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     const saltRound = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, saltRound);
//     user.password = hashedPassword;
//     await user.save();

//     await Otp.deleteMany({ email });

//     res
//       .status(200)
//       .json({ success: true, message: "Password reset successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// STEP 1: Send OTP
export const handleForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Security practice: Email exist kare ya na kare, same response dein (User Enumeration Defense)
    if (user) {
      // Purane OTPs clear karein
      await Otp.deleteMany({ email });

      // Secure Random OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await Otp.create({ email, otp });

      const message = `Your password reset verification code is: ${otp}. Valid for 5 minutes.`;
      await sendEmail(email, "Reset Password OTP", message);
    }

    res.status(200).json({
      success: true,
      message: "Otp has been sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// STEP 2: Verify OTP & Return Reset Token
export const otpVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // OTP verification ke baad ek unique Reset Token banayein
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Clear used OTP and save temporary token or pass via session/JWT
    await Otp.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken, // Ye token frontend save karega Next Step ke liye
      email, // Clear state tracking ke liye
    });
  } catch (error) {
    next(error);
  }
};

// STEP 3: Reset Password using Reset Token
export const handleResetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reset request" });
    }

    const saltRound = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, saltRound);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
