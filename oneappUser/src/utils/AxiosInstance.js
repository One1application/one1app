import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("UserToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
