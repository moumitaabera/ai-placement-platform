import prisma from "../lib/prisma";

export const getMyResumes = async (userId: string) => {
  const student = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  return prisma.resume.findMany({
    where: {
      studentId: student.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteResume = async (
  userId: string,
  resumeId: string
) => {
  const student = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
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

  return resume;
};