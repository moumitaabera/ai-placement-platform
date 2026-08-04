import prisma from "../lib/prisma";

export const recruiterDashboard = async (
  userId: string
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

  const jobs = await prisma.job.findMany({
    where: {
      recruiterId: recruiter.id,
    },
    include: {
      applications: true,
    },
  });

  const totalJobs = jobs.length;

  const activeJobs = jobs.filter(
    (j) => j.status === "ACTIVE"
  ).length;

  const closedJobs = jobs.filter(
    (j) => j.status === "CLOSED"
  ).length;

  const draftJobs = jobs.filter(
    (j) => j.status === "DRAFT"
  ).length;

  const applications = jobs.flatMap(
    (j) => j.applications
  );

  return {
    totalJobs,
    activeJobs,
    closedJobs,
    draftJobs,
    totalApplications: applications.length,
    shortlisted: applications.filter(
      (a) => a.status === "SHORTLISTED"
    ).length,
    interviews: applications.filter(
      (a) => a.status === "INTERVIEW"
    ).length,
    hired: applications.filter(
      (a) => a.status === "HIRED"
    ).length,
    rejected: applications.filter(
      (a) => a.status === "REJECTED"
    ).length,
  };
};
export const studentDashboard = async (
  userId: string
) => {
  const student =
    await prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const applications =
    await prisma.application.findMany({
      where: {
        studentId: student.id,
      },
    });

  return {
    totalApplications: applications.length,

    applied: applications.filter(
      (a) => a.status === "APPLIED"
    ).length,

    reviewing: applications.filter(
      (a) => a.status === "REVIEWING"
    ).length,

    shortlisted: applications.filter(
      (a) => a.status === "SHORTLISTED"
    ).length,

    interviews: applications.filter(
      (a) => a.status === "INTERVIEW"
    ).length,

    hired: applications.filter(
      (a) => a.status === "HIRED"
    ).length,

    rejected: applications.filter(
      (a) => a.status === "REJECTED"
    ).length,
  };
};