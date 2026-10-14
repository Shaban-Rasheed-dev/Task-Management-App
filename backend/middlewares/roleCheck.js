export const roleCheck = (...allowedRole) => {
  return (req, res, next) => {
    console.log("User role:", req.user.role); // ye line add karo
    if (!allowedRole.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }
    next();
  };
};
