import axios from 'axios';

// Creates an Axios instance to connect to the Laravel backend
// This instance can be used throughout the application to make API requests
const axiosInstance = axios.create({
  // Base URL for the API (url of the Laravel backend)
    baseURL: 'http://127.0.0.1:8000', 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor to handle CSRF token and authentication
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

export default axiosInstance;
