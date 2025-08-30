import axios from "axios";

// Create Axios instance for Laravel backend
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000", 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Add request interceptor to inject token on each call
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
