import axios from "axios";
import {
  servicesAxiosInstance,
  servicesAxiosInstanceForFileUpload,
} from "../config";
/**
 *
 * Registers a new user with the provided details.
 *
 * @param {Object} data - The user registration details.
 * @param {string} data.name - The full name of the user.
 * @param {string} data.username - The chosen username.
 * @param {string} data.phoneNumber - The phone number of the user.
 * @param {string} data.email - The email of the user.
 * @returns {Promise<import("axios").AxiosResponse<any>>} A promise that resolves with the API response.
 *
 * @example
 * registerAndGetOTP({
 *   name: "seedhemaut",
 *   username: "maut",
 *   phoneNumber: "1234567892",
 *   email: "seedhemaut@gmail.com"
 * })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const registerAndGetOTP = async (data) => {
  const response = await servicesAxiosInstance.post("/auth/register", data);
  return response;
};

/**
 * Verify the OTP
 * @param {object} data The user credentials.
 * @param {string} data.otp
 * @param {string} data.phoneNumber
 * @returns {Promise<import("axios").AxiosResponse<any>>} A promise that resolves with the API response.
 * @example
 * verifyEnteredOTP({  phoneNumber: "1234567891", otp: "000000" })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const verifyEnteredOTP = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/auth/register/verify-otp",
    data
  );
  return response;
};

/**
 * Sends a sign-in request for an existing user using email and phone number.
 *
 * @param {Object} data - The user credentials.
 * @param {string} data.email - The email of the user.
 * @param {string} data.phoneNumber - The phone number of the user.
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 *
 * @example
 * signInUser({ email: "seedhe@gmail.com", phoneNumber: "1234567891" })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const signInUser = async (data) => {
  const response = await servicesAxiosInstance.post("auth/login", data);
  return response;
};
/**
 *
 * @param {Object} data - The user Credentials
 * @param {string} data.email
 * @param {string} data.phoneNumber
 * @param {string} data.otp
 * @returns {Promise<import("axios").AxiosResponse<any>>} A promise that resolves with the API response.
 *
 *  * @example
 * verifyLoginuser({ email: "seedhe@gmail.com", phoneNumber: "1234567891", otp: "000000" })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const verifyLoginUser = async (data) => {
  const response = await servicesAxiosInstance.post(
    "auth/login/verify-otp",
    data
  );
  return response;
};

export const handelUplaodFile = async (formdata) => {
  const response = await servicesAxiosInstanceForFileUpload.post(
    "/upload/file",
    formdata
  );
  return response;
};

export const handelUplaodFileS3 = async (formdata) => {
  console.log("FORMA DATA ", formdata);

  const response = await servicesAxiosInstanceForFileUpload.post(
    "/upload/video",
    {
      fileName: formdata.get("fileName"),
      fileType: formdata.get("fileType"),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const createPayUpContent = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/payingup/create-payingup",
    data
  );
  return response;
};

export const createLockedContent = async (data) => {
  const response = await servicesAxiosInstance.post("/premium/create-content", data);
  return response;
};

export const createNewWebinarRequest = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/webinar/create-webinar",
    data
  );
  return response;
};

export const createNewCourseRequest = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/course/create-course",
    data
  );
  return response;
};

export const fetchBalanceDetails = async () => {
  const response = await servicesAxiosInstance.get("/wallet/balance");
  return response;
};

export const saveBusinessInformation = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/wallet/add-business-info",
    data
  );
  return response;
};

export const fetchBusinessInformation = async () => {
  const response = await servicesAxiosInstance.get("/wallet/get-business-info");
  return response;
};

export const saveVerificationInformation = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/wallet/add-verfication-details",
    data
  );
  return response;
};
export const fetchVerificationInformation = async () => {
  const response = await servicesAxiosInstance.get(
    "/wallet/get-verification-details"
  );
  return response;
};
export const savePrimaryPaymentInformation = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/wallet/add-bank-details",
    data
  );
  return response;
};
export const fetchPrimaryPaymentInformation = async () => {
  const response = await servicesAxiosInstance.get("/wallet/get-bank-details");
  return response;
};

export const fetchTransactionsPage = async (data) => {
  const response = await servicesAxiosInstance.get("/wallet/get-transactions", {
    params: data,
  });
  return response;
};
export const fetchWithdrawalPage = async (data) => {
  const response = await servicesAxiosInstance.get("/wallet/get-withdrawals", {
    params: data,
  });
  return response;
};
export const saveSecondaryBankorUpiAccount = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/wallet/add-bank-or-upi",
    data
  );
  return response;
};
export const fetchAllWebinarsData = async () => {
  const response = await servicesAxiosInstance.get(
    "/webinar/get-creator-webinars"
  );
  return response;
};

export const fetchWebinar = async (id) => {
  const response = await servicesAxiosInstance.get(
    `/webinar/get-webinar-by-id/${id}`
  );
  return response;
};

export const purchaseWebinar = async (id) => {
  const response = await servicesAxiosInstance.post(
    "/webinar/purchase-webinar",
    {
      webinarId: id,
    }
  );
  return response;
};

export const fetchAllPayingUpsData = async () => {
  const response = await servicesAxiosInstance.get(
    "/payingup/get-creator-payingups"
  );
  return response;
};
export const fetchAllCoursesData = async () => {
  const response = await servicesAxiosInstance.get(
    "/course/get-creator-courses"
  );
  return response;
};
export const fetchCourse = async (id) => {
  const response = await servicesAxiosInstance.get(
    `/course/get-course-by-id/${id}`
  );
  return response;
};
export const purchaseCourse = async (id) => {
  const response = await servicesAxiosInstance.post("/course/purchase-course", {
    courseId: id,
  });
  return response;
};

export const editCourse = async (courseId, data) => {
  const response = await servicesAxiosInstance.post(
    `/course/edit-course/${courseId}`,
    data
  );
  return response;
};

export const fetchPayingUp = async (id) => {
  const response = await servicesAxiosInstance.get(
    `/payingup/get-payingup-by-id/${id}`
  );
  return response;
};

export const purchasePayingUp = async (id) => {
  const response = await servicesAxiosInstance.post(
    "/payingup/purchase-payingup",
    {
      payingUpId: id,
    }
  );
  return response;
};

export const verifyPayment = async (body) => {
  const response = await servicesAxiosInstance.post(
    "wallet/verify-payment",
    body
  );
  return response;
};

export const verifyInviteLink = async (inviteLink) => {
  const response = await axios.post("http://localhost:3000/verify-channel", {
    inviteLink,
  });
  return response;
};

export const createTelegram = async (body) => {
  const response = await servicesAxiosInstance.post(
    "/telegram/create-telegram",
    body
  );
  return response;
};

export const fetchAllTelegramData = async () => {
  const response = await servicesAxiosInstance.get(
    "/telegram/get-creator-telegrams"
  );
  return response;
};

export const fetchTelegram = async (id) => {
  const response = await servicesAxiosInstance.get(
    `/telegram/get-telegram-by-id/${id}`
  );
  return response;
};

export const purchaseTelegram = async ({ telegramId, days }) => {
  const response = await servicesAxiosInstance.post(
    "/telegram/purchase-telegram",
    {
      telegramId,
      days,
    }
  );
  return response;
};

export const editPayingUp = async (payingUpId, data) => {
  const response = await servicesAxiosInstance.post(
    `/payingup/edit-payingup/${payingUpId}`,
    data
  );
  return response;
};

export const editWebinar = async (webinarId, data) => {
  const response = await servicesAxiosInstance.post(
    `/webinar/edit-webinar/${webinarId}`,
    data
  );
  return response;
};

export const fetchUserDetails = async () => {
  const response = await servicesAxiosInstance.get("/self/details");
  return response;
};

export const fetchCustomers = async (page = 1) => {
  const response = await servicesAxiosInstance.get(`/self/customers/${page}`);
  return response;
};

export const getSignedVideoUrl = async (videoUrl) => {
  const response = await servicesAxiosInstance.get(`/course/playVideo?url=${encodeURIComponent(videoUrl)}`);
  return response;
};
