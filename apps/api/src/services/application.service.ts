import prisma from "../lib/prisma";

export const applyForJob = async (
  userId: string,
  jobId: string,
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

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  const existingApplication =
    await prisma.application.findUnique({
      where: {
        studentId_jobId: {
          studentId: student.id,
          jobId,
        },
      },
    });

  if (existingApplication) {
    throw new Error("Already applied to this job");
  }

  return prisma.application.create({
    data: {
      studentId: student.id,
      jobId,
      resumeId,
    },
  });
};

export const getMyApplications = async (
  userId: string
) => {
  const student = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  return prisma.application.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      job: true,
      resume: true,
    },
    orderBy: {
  appliedAt: "desc",
},
  });
};

export const getApplicantsForJob = async (
  userId: string,
  jobId: string
) => {
  const recruiter =
    await prisma.recruiterProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      recruiterId: recruiter.id,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  return prisma.application.findMany({
    where: {
      jobId,
    },
    include: {
      student: true,
      resume: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
};

export const updateApplicationStatus = async (
  userId: string,
  applicationId: string,
  status:
    | "APPLIED"
    | "REVIEWING"
    | "SHORTLISTED"
    | "INTERVIEW"
    | "HIRED"
    | "REJECTED"
) => {
  const recruiter =
    await prisma.recruiterProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  const application =
    await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: true,
        student: true,
      },
    });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.job.recruiterId !== recruiter.id) {
    throw new Error("Unauthorized");
  }

  const updatedApplication =
    await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status: status as any,
      },
      include: {
        job: true,
        student: true,
      },
    });

  await prisma.notification.create({
    data: {
      userId: updatedApplication.student.userId,
      title: "Application Status Updated",
      message: `Your application for "${updatedApplication.job.title}" is now ${status}.`,
    },
  });

  return updatedApplication;
};