import { axiosInstance } from "./config";

export const adminLogin = async (phoneNumber) => {
  const response = await axiosInstance.post("/auth/admin/login", {
    phoneNumber,
  });
  return response.data;
};

export const verifyAdminOtp = async (phoneNumber, otp) => {
  const response = await axiosInstance.post("/auth/admin/login/verify-otp", {
    phoneNumber,
    otp,
  });
  return response.data;
};

export const selfIdentification = async () => {
  const response = await axiosInstance.get("/admin/details");
  return response.data;
};
