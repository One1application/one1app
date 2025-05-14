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

//

export const getProductsApiService = async ({
  page = 1,
  limit = 10,
  productType = "",
} = {}) => {
  const response = await axiosInstance.get("/admin/products", {
    params: { page, limit, productType },
  });
  return response.data;
};

export const toggleProductVerificationApiService = async ({
  id,
  productType,
}) => {
  const response = await axiosInstance.put(`admin/products/verify`, {
    id,
    productType,
  });
  return response.data;
};

// admin related routes

export const getAdminApiService = async ({ page = 1, limit = 10 } = {}) => {
  const response = await axiosInstance.get("/admin/admins", {
    params: { page, limit },
  });
  return response.data;
};

export const createAdminApiService = async (adminData) => {
  const response = await axiosInstance.post("/admin/admins", adminData);
  return response.data;
};

export const updateAdminApiService = async (id, adminData) => {
  const response = await axiosInstance.put(`/admin/admins/${id}`, adminData);
  return response.data;
};

export const deleteAdminApiService = async (id) => {
  const response = await axiosInstance.delete(`/admin/admins/${id}`);
  return response.data;
};

export const getUsers = async ({ page = 1, limit = 10, role = "" } = {}) => {
  const response = await axiosInstance.get("/admin/users", {
    params: { page, limit, role },
  });
  return response.data;
};

export const createUserApi = async (userData) => {
  const response = await axiosInstance.post("/admin/users", userData);
  return response.data;
};

export const updateUserApi = async (id, userData) => {
  const response = await axiosInstance.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteUserApi = async (id) => {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
};

export const dashboardData = async (period = "today") => {
  const response = await axiosInstance.get("/admin/dashboard", {
    params: { period },
  });
  return response.data;
};

export const getCreatorReport = async ({
  page = 1,
  limit = 10,
  search = "",
  kycStatus = "",
  verifiedStatus = "",
} = {}) => {
  const response = await axiosInstance.get("/admin/creator/report", {
    params: { page, limit, search, kycStatus, verifiedStatus },
  });
  return response.data;
};

export const getCreatorDetails = async (id) => {
  const response = await axiosInstance.get(`/admin/creator/${id}`);
  return response.data;
};

export const toggleCreatorKycStatus = async (
  id,
  { status, rejectionReason }
) => {
  const response = await axiosInstance.patch(`/admin/creator/${id}/kyc`, {
    status,
    rejectionReason,
  });
  return response.data;
};

export const updateCreatorPersonalDetails = async (
  id,
  { name, email, phone, socialMedia, goals, heardAboutUs, creatorComission }
) => {
  const response = await axiosInstance.patch(`/admin/creator/${id}/personal`, {
    name,
    email,
    phone,
    socialMedia,
    goals,
    heardAboutUs,
    creatorComission,
  });
  return response.data;
};
export const getCreatorWithdrawals = async (id) => {
  const response = await axiosInstance.get(`/admin/creator/${id}/withdrawls`);
  return response.data;
};

export const updateWithdrawalStatus = async (
  withdrawalId,
  status,
  failedReason
) => {
  const response = await axiosInstance.patch(
    `/admin/withdrawal/${withdrawalId}/status`,
    {
      status,
      failedReason,
    }
  );
  return response.data;
};

export const getPaymentsApiService = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  productType = "",
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const response = await axiosInstance.get("/admin/payments", {
    params: { page, limit, search, status, productType, sortBy, sortOrder },
  });
  return response.data;
};
