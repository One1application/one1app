import {Router} from "express"
import { getProductSalesRevenue } from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const productRouter = Router();

productRouter.get('/product-sale-revenue', authMiddleware, getProductSalesRevenue)