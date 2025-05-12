import express from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  getPayments,
  getProducts,
  getDashboardData,
  adminSelfIdentification,
  toggleProductVerification,
  getCreatorReport,
  getCreatorDetails,
  toggleCreatorKycStatus,
  updateCreatorPersonalDetails,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const adminRouter = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

adminRouter.get("/details", adminSelfIdentification);
adminRouter.post("/users", createUser);
adminRouter.get("/users", getUsers);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);

adminRouter.get("/payments", getPayments);
adminRouter.get("/products", getProducts);
adminRouter.put("/products/verify", toggleProductVerification);
adminRouter.get("/dashboard", getDashboardData);

adminRouter.get("/creator/report", getCreatorReport);
adminRouter.get("/creator/:id", getCreatorDetails);
adminRouter.patch("/creator/:id/kyc", toggleCreatorKycStatus);
adminRouter.patch("/creator/:id/personal", updateCreatorPersonalDetails);

adminRouter.post("/admins", createAdmin);
adminRouter.get("/admins", getAdmins);
adminRouter.put("/admins/:id", updateAdmin);
adminRouter.delete("/admins/:id", deleteAdmin);
