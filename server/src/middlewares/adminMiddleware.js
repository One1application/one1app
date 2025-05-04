export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Admin access required" });
  }
  next();
};
