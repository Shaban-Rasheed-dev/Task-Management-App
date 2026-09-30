import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next({ status: 401, message: "No Token Provided" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return next({ status: 401, message: "Invalid or expired token" });
  }
};
