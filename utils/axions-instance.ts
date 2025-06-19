// src/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://erp.satgroups.com/api", // Replace with your real API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
