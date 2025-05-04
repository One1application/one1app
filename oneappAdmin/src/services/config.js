import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_URL || "/api";

if (!baseURL) {
  throw new Error(
    "VITE_SERVER_URL is not defined in the environment variables."
  );
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("AuthToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { axiosInstance };
