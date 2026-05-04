import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
