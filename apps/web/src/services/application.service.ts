import api from "@/lib/api";

export interface ApplyJobPayload {
  jobId: string;
  resumeId: string;
}

export const applyJob = async (
  data: ApplyJobPayload
) => {
  const response = await api.post(
    "/applications",
    data
  );

  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get(
    "/applications/me"
  );

  return response.data;
};

export const getApplicants = async (
  jobId: string
) => {
  const response = await api.get(
    `/applications/job/${jobId}`
  );

  return response.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string
) => {
  const response = await api.patch(
    `/applications/${applicationId}/status`,
    {
      status,
    }
  );

  return response.data;
};

export const viewResume = async (
  resumeId: string,
  applicationId: string
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/resume/${resumeId}/view?applicationId=${applicationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to view resume");
  }

  return response.blob();
};