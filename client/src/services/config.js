import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_SERVER_URL || "/api";

if (!baseURL) {
  throw new Error(
    "VITE_SERVER_URL is not defined in the environment variables."
  );
}

const servicesAxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials : true
});
servicesAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("AuthToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const servicesAxiosInstanceForFileUpload = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
servicesAxiosInstanceForFileUpload.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { servicesAxiosInstance, servicesAxiosInstanceForFileUpload };
