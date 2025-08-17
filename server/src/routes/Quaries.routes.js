import express from "express"
import { upload } from "../config/multer.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { bulkResolvedorPending, getAllQueries, raiseQuery , toggleQueryStatus } from "../controllers/PelampelQuery.js";
const router = express.Router();


router.post("/raise" , authMiddleware , upload.array("images" , 4) , raiseQuery );
router.patch("/toggle/:queryId" , authMiddleware , toggleQueryStatus)
router.get("/all-queries" ,authMiddleware , getAllQueries)
router.delete("/reject")
router.patch("/resolved-pending-all" ,authMiddleware , bulkResolvedorPending)
router.delete("reject-all")








export default router;