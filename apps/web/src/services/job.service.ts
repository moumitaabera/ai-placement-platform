import api from "@/lib/api";



export interface JobPayload {
  title: string;
  description: string;
  location?: string;
  salary?: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[];
  deadline?: string;
}
export const createJob = async (data: JobPayload) => {
  const response = await api.post("/jobs", data);
  return response.data;
};

export const updateJob = async (
  id: string,
  data: Partial<JobPayload>
) => {
  const response = await api.patch(`/jobs/${id}`, data);
  return response.data;
};

export const getJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};

export const getJob = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const deleteJob = async (id: string) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

export const getMyJobs = async () => {
  const response = await api.get("/jobs/my-jobs");
  return response.data;
};

export const getMyJobById = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};