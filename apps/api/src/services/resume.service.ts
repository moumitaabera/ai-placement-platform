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


type UserRole = "STUDENT" | "RECRUITER" | "ADMIN";

export const getResumeForUser = async (
  userId: string,
  resumeId: string,
  applicationId?: string,
  userRole?: UserRole
) => {
  console.log("===== VIEW RESUME AUTHORIZATION =====");
  console.log("userId:", userId);
  console.log("resumeId:", resumeId);
  console.log("applicationId:", applicationId);
  console.log("userRole:", userRole);

  // ==================================================
  // 1. STUDENT
  // Student can ONLY view their own resume
  // ==================================================

  if (userRole === "STUDENT") {
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

    console.log("STUDENT AUTHORIZED");

    return resume;
  }

  // ==================================================
  // 2. RECRUITER
  // Recruiter can ONLY view resumes of applicants
  // belonging to THEIR OWN JOB
  // ==================================================

  if (userRole === "RECRUITER") {
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!recruiter) {
      throw new Error("Recruiter profile not found");
    }

    if (!applicationId) {
      console.log("RECRUITER DID NOT PROVIDE APPLICATION ID");
      throw new Error("Unauthorized");
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: true,
        resume: true,
      },
    });

    if (!application) {
      console.log("APPLICATION NOT FOUND");
      throw new Error("Unauthorized");
    }

    console.log("APPLICATION AUTHORIZATION CHECK:", {
      applicationId: application.id,
      applicationResumeId: application.resumeId,
      requestedResumeId: resumeId,
      applicationJobId: application.jobId,
      jobRecruiterId: application.job.recruiterId,
      loggedInRecruiterId: recruiter.id,
    });

    // Resume must belong to this application
    if (application.resumeId !== resumeId) {
      console.log("RESUME DOES NOT BELONG TO APPLICATION");
      throw new Error("Unauthorized");
    }

    // Job must belong to logged-in recruiter
    if (application.job.recruiterId !== recruiter.id) {
      console.log("RECRUITER DOES NOT OWN THIS JOB");
      throw new Error("Unauthorized");
    }

    console.log("RECRUITER AUTHORIZED");

    return application.resume;
  }

  // ==================================================
  // 3. ADMIN
  // Admin can view any resume
  // ==================================================

  if (userRole === "ADMIN") {
    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
      },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    console.log("ADMIN AUTHORIZED");

    return resume;
  }

  // ==================================================
  // 4. Unknown / missing role
  // ==================================================

  console.log("INVALID OR MISSING USER ROLE");

  throw new Error("Unauthorized");
};