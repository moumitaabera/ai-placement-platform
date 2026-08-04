import prisma from "../lib/prisma";
import axios from "axios";
import pdfParse from "pdf-parse";
import ai from "../config/gemini";

export const generateInterviewQuestions = async (
  userId: string,
  resumeId: string,
  jobId: string
) => {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      studentId: student.id,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // Download resume PDF
  const response = await axios.get(resume.fileUrl, {
    responseType: "arraybuffer",
  });

  // Extract text
  const pdf = await pdfParse(response.data);

  const prompt = `
You are a senior software engineering interviewer.

Using the candidate's resume and the job description,
generate exactly 10 interview questions.

Requirements:
- Return ONLY valid JSON.
- Mix technical, behavioral, project-based, and problem-solving questions.
- Make the questions personalized.

Format:

{
  "questions":[
    {
      "type":"Technical",
      "question":"..."
    }
  ]
}

Resume:

${pdf.text}

--------------------------

Job Title:
${job.title}

Job Description:

${job.description}

Required Skills:

${job.skills.join(", ")}
`;

  const aiResponse = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  const text = aiResponse.text
    ?.replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  if (!text) {
    throw new Error("AI returned empty response");
  }

  return JSON.parse(text);
};