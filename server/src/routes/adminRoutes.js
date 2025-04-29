import express from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createUser, getUsers, updateUser, deleteUser, createAdmin, getAdmins, updateAdmin, deleteAdmin, getPayments, getProducts, getDashboardData, getUserReport } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const adminRouter = express.Router();
adminRouter.use(authMiddleware)
adminRouter.use(adminMiddleware); 

adminRouter.post("/users", createUser);
adminRouter.get("/users", getUsers);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);

adminRouter.get("/payments", getPayments);
adminRouter.get("/products", getProducts);
adminRouter.get("/dashboard", getDashboardData);
adminRouter.get("/user-report", getUserReport);

adminRouter.post("/admins", createAdmin);
adminRouter.get("/admins", getAdmins);
adminRouter.put("/admins/:id", updateAdmin);
adminRouter.delete("/admins/:id", deleteAdmin);
