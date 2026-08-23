import api from "@/lib/api";

export interface RecruiterProfile {
  id?: string;
  userId?: string;
  designation: string | null;
  companyId: string | null;
}

export interface UpdateRecruiterProfileData {
  designation: string;
  companyId: string | null;
}

export const getRecruiterProfile = async () => {
  const response = await api.get(
    "/recruiter/profile"
  );

  return response.data;
};

export const updateRecruiterProfile = async (
  data: UpdateRecruiterProfileData
) => {
  const response = await api.put(
    "/recruiter/profile",
    data
  );

  return response.data;
};