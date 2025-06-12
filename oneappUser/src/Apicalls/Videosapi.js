
import { axiosInstance } from "../utils/AxiosInstance.js";
export const getSignedVideoUrl = async (videoUrl) => {
  const response = await axiosInstance.get(
    `/course/playVideo?url=${encodeURIComponent(videoUrl)}`
  );
  return response;
};