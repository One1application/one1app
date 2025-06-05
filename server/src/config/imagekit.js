import { configDotenv } from "dotenv";
import fs from "fs";
import ImageKit from "imagekit";
configDotenv();
export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadOnImageKit = async (localFilePath, category, isPrivateFile) => {
  console.log("imagekit", imagekit);
  try {
    if (!localFilePath) {
      throw new Error("No file path provided");
    }

    if (!category) {
      throw new Error("No category/folder name provided");
    }
    const folderPath = category.trim().toLowerCase();

    const file = fs.readFileSync(localFilePath);

    const response = await imagekit.upload({
      file: file,
      fileName: localFilePath.split("/").pop(),
      folder: folderPath,
      useUniqueFileName: true,
      isPrivateFile,
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading to ImageKit:", error.message);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};

const generateSignedUrl = (url) => {
  try {
    const signedUrl = imagekit.url({
      path: url,
      signed: true,
      expireSeconds: 3600,
    });
  
    return signedUrl;
  } catch (error) {
    throw error;
  }
};

export { generateSignedUrl, uploadOnImageKit };
