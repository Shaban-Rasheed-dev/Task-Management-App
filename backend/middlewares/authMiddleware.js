import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unathorzed HTTP not a valid token",
    });
  }
  //   console.log(token);
  const jwtToken = token.replace("Bearer", "").trim();
  //   console.log("token veriy", jwtToken);
  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);
    // console.log(isVerified);
    const userData = await User.findOne({ email: isVerified.email }).select({
      password: 0,
    });
    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token invalid.",
      });
    }
    req.user = userData;
    req.token = token;
    req.userId = userData._id;
    next();
  } catch (error) {
    res.status(403).json({ message: "Unauthorized. Invalid token" });
  }
};
