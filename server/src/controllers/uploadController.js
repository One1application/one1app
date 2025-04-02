import { s3 } from "../config/aws.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
      Bucket: "my-app-bucket-1743423461630",
      Key: `uploads/${Date.now()}_${fileName}`,
      ContentType: fileType,
    };
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return res.status(200).json({
      success: true,
      uploadURL: signedUrl,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
