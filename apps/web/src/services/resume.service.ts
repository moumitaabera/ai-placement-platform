import api from "@/lib/api";

export const uploadResume = async (file: File) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await api.post(
    "/resume/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getResumes = async () => {
  const response = await api.get("/resume");
  return response.data;
};

export const deleteResume = async (id: string) => {
  const response = await api.delete(`resume/${id}`);
  return response.data;
};

export const analyzeResume = async (resumeId: string) => {
  const response = await api.post(
    "/resume-analysis/analyze",
    {
      resumeId,
    }
  );

  return response.data;
};