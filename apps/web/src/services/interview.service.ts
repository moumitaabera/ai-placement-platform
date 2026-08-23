import api from "@/lib/api";

export const startInterview = async (data: {
  resumeId: string;
  jobId: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}) => {
  const response = await api.post("/interview/start", data);

  return response.data;
};

export const generateInterviewQuestions = async (data: {
  resumeId: string;
  jobId: string;
}) => {
  const response = await api.post("/interview/questions", data);

  return response.data;
};

export const submitInterview = async (data: {
  sessionId: string;
  answers: {
    question: string;
    answer: string;
  }[];
}) => {
  const response = await api.post("/interview/submit", data);

  return response.data;
};

export const getInterviewSession = async (
  sessionId: string
) => {
  const response = await api.get(
    `/interview/session/${sessionId}`
  );

  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await api.get("/interview/history");

  return response.data;
};

export const getInterviewResult = async (
  sessionId: string
) => {
  const response = await api.get(
    `/interview/result/${sessionId}`
  );

  return response.data;
};
