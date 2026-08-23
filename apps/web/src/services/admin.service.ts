import api from "@/lib/api";

const API_URL = "http://localhost:5000/api";

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
  const token = localStorage.getItem("accessToken");

  const response = await api.get<AdminUsersResponse>(
    `${API_URL}/admin/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

