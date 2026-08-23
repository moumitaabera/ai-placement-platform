import api from "@/lib/api";

export interface ProfileFormData {
  college: string;
  department: string;
  course: string;
  year: number | "";
  cgpa: number | "";
  phone: string;
  linkedin: string;
  github: string;
  bio: string;
  skills: string;
}

export interface StudentProfile {
  college: string;
  department: string;
  course: string;
  year: number;
  cgpa: number;
  phone: string;
  linkedin: string;
  github: string;
  bio: string;
  skills: string[];
}

export const updateProfile = async (
  data: StudentProfile
) => {
  const response = await api.put(
    "/student/profile",
    data
  );

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(
    "/student/profile"
  );

  return response.data;
};