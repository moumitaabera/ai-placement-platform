import axios from "axios";
import pdfParse from "pdf-parse";
import prisma from "../lib/prisma";
import { analyzeResumeWithAI } from "./ai.service";

export const analyzeResume = async (
  userId: string,
  resumeId: string
) => {
  // Find student
  const student = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  // Find resume
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      studentId: student.id,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  // Download PDF
  const response = await axios.get(resume.fileUrl, {
    responseType: "arraybuffer",
  });

  // Extract text
  const pdf = await pdfParse(response.data);

  // Analyze with Gemini
  const analysis = await analyzeResumeWithAI(pdf.text);

  // Save to database
  const savedAnalysis = await prisma.resumeAnalysis.upsert({
    where: {
      resumeId: resume.id,
    },
    update: {
      score: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
    },
    create: {
      resumeId: resume.id,
      score: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
    },
  });

  return savedAnalysis;
};