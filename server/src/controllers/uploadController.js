
import { uploadOnImageKit } from "../config/imagekit.js";

export const uploadUtil = async (req, res) => {
    try {
        const { file, body } = req;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { path } = file;
        const isPrivateFile = body.isPrivateFile === "true";
        const response = await uploadOnImageKit(path, "images", isPrivateFile);
        res.status(200).json({
            message: "File uploaded successfully",
            url: response.url,
        });

    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}