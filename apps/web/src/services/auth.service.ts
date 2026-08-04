import api from "@/lib/axios";

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "RECRUITER";
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};