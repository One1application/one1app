import { s3 } from "../config/aws.js";
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
};

export const uploadVideo = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${fileName}`,
      Expires: 1200,
      ContentType: fileType,
    };
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);

    return res.status(200).json({
      success: true,
      uploadURL,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
