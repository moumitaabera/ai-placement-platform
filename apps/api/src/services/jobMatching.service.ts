import prisma from "../lib/prisma";
import axios from "axios";
import pdfParse from "pdf-parse";
import ai from "../config/gemini";

export const matchResumeWithJob = async (
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

  // Download PDF
  const response = await axios.get(resume.fileUrl, {
    responseType: "arraybuffer",
  });

  // Extract text
  const pdf = await pdfParse(response.data);

  const prompt = `
You are an expert technical recruiter.

Compare this resume with the job.

Return ONLY valid JSON.

{
  "matchScore": number,
  "matchedSkills": [],
  "missingSkills": [],
  "recommendation": ""
}

Resume:

${pdf.text}

-----------------------

Job Title:
${job.title}

Description:
${job.description}

Skills:
${job.skills.join(", ")}
`;

  const aiResponse =
    await ai.models.generateContent({
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