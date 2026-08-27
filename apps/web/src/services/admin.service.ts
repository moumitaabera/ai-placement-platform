import api from "@/lib/api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "RECRUITER" | "ADMIN";
  provider: "LOCAL" | "GOOGLE";
  isVerified: boolean;
  createdAt: string;
}

interface AdminUsersResponse {
  success: boolean;
  data: AdminUser[];
  message?: string;
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await api.get<AdminUsersResponse>("/admin/users");

  return response.data.data;
};