import axios from "axios";
import { getAccessToken } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  console.log("========== API REQUEST ==========");
  console.log("URL:", config.url);
  console.log("Method:", config.method);
  console.log("Access Token exists:", !!token);
  console.log(
    "Access Token preview:",
    token ? `${token.substring(0, 20)}...` : "NO TOKEN"
  );

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;