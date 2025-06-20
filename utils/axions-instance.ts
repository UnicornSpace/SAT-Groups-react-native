// src/utils/axiosInstance.ts
import axios from "axios";
import { triggerGlobalError, clearGlobalError } from "./global-error";

const axiosInstance = axios.create({
  baseURL: "https://erp.satgroups.com/api", // Replace with your real API base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

axiosInstance.interceptors.response.use(
  (response) => {
    clearGlobalError(); // backend working
    return response;
  },
  (error) => {
    if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error" ||
      error.response?.status >= 500
    ) {
      triggerGlobalError(); // backend issue
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
