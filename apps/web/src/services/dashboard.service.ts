import api from "@/lib/api";

export const getStudentDashboard = async () => {
  const response = await api.get(
    "/dashboard/student"
  );

  return response.data;
};

export const getRecruiterDashboard = async () => {
  const response = await api.get(
    "/dashboard/recruiter"
  );

  return response.data;
};