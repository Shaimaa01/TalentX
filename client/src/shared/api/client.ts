import axios from "axios";
import { ToastUtils } from "../lib/toast-utils";

// Environment variable for API URL
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Derived WebSocket URL
export const WS_URL = API_URL.replace("http", "ws").replace("/api", "");

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("talentx_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _suppressToast?: boolean;
  }
  export interface AxiosRequestConfig {
    _suppressToast?: boolean;
  }
}

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message =
      data?.message || error.message || "An unexpected error occurred";
    
    // Check if the request explicitly suppressed the global toast
    if (!error.config?._suppressToast) {
       // Use the new ToastUtils
       ToastUtils.error(message);
    }

    if (status === 401) {
      // Check if we are already on the login page to avoid loops
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        // Clear session and redirect
        localStorage.removeItem("talentx_token");
        localStorage.removeItem("talentx_user");
        // Optional: Dispatch a logout action if using a store here (be careful of cycles)
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
