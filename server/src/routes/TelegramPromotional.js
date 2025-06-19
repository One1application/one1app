
import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadFiles } from "../config/multer.js";
import { createTelegrampromotionachannel, deleteTelegrampromotionachannel, editTelegrampromotionachannel, findavailablepromotionalchannel, getAllTelegrampromotionachannels } from "../controllers/Telegrampromote.js";

const router = express.Router();

const app = express();

app.use(authMiddleware);

router.post("/create-telegram-promotional", uploadFiles , createTelegrampromotionachannel);
router.delete("/delete-telegram-promotional/:id" , deleteTelegrampromotionachannel);
router.put("/edit-telegram-promotional/:id" , uploadFiles, editTelegrampromotionachannel);
router.get("/get-telegram-promotional" , getAllTelegrampromotionachannels);
router.get("/creator-telegram-promotional", findavailablepromotionalchannel);

export default router;