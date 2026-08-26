import prisma from "../lib/prisma";


// export const applyForJob = async (
//   userId: string,
//   jobId: string,
//   resumeId: string
// ) => {
//   const student = await prisma.studentProfile.findUnique({
//     where: {
//       userId,
//     },
//   });

//   if (!student) {
//     throw new Error("Student profile not found");
//   }

//   const job = await prisma.job.findUnique({
//     where: {
//       id: jobId,
//     },
//   });

//   if (!job) {
//     throw new Error("Job not found");
//   }

//   const existingApplication =
//     await prisma.application.findUnique({
//       where: {
//         studentId_jobId: {
//           studentId: student.id,
//           jobId,
//         },
//       },
//     });

//   if (existingApplication) {
//     throw new Error("Already applied to this job");
//   }

//   return prisma.application.create({
//     data: {
//       studentId: student.id,
//       jobId,
//       resumeId,
//     },
//   });
// };

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
    include: {
      recruiter: true,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // Job must be active
  if (job.status !== "ACTIVE") {
    throw new Error("Applications are closed for this job");
  }

  // Check application deadline
  if (job.deadline) {
    const deadline = new Date(job.deadline);

    if (deadline.getTime() <= Date.now()) {
      throw new Error("Application deadline has passed");
    }
  }

  // Check whether student already applied
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

  // Make sure resume belongs to this student
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      studentId: student.id,
    },
  });

  if (!resume) {
    throw new Error("Invalid resume selected");
  }

  // Create application
  const application =
    await prisma.application.create({
      data: {
        studentId: student.id,
        jobId,
        resumeId,
      },
    });

  // Notify recruiter
  await prisma.notification.create({
    data: {
      userId: job.recruiter.userId,
      title: "New Job Application",
      message: `A student has applied for your job "${job.title}".`,
    },
  });

  console.log(
    "RECRUITER NOTIFICATION CREATED FOR:",
    job.recruiter.userId
  );

  return application;
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

  const notification =
  await prisma.notification.create({
    data: {
      userId: updatedApplication.student.userId,
      title: "Application Status Updated",
      message: `Your application for "${updatedApplication.job.title}" is now ${status}.`,
    },
  });

console.log(
  "NOTIFICATION CREATED FOR USER:",
  updatedApplication.student.userId
);

console.log(
  "CREATED NOTIFICATION:",
  notification
);
  return updatedApplication;
};

export const viewResume = async (
  resumeId: string,
  applicationId: string
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/view?applicationId=${applicationId}`,
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


// export const viewResume = async (resumeId: string) => {
//   const token = localStorage.getItem("token");

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/view`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to view resume");
//   }

//   return response.blob();
// };


// import prisma from "../lib/prisma";
// export const applyForJob = async (
//   userId: string,
//   jobId: string,
//   resumeId: string
// ) => {
//   const student = await prisma.studentProfile.findUnique({
//     where: {
//       userId,
//     },
//   });

//   if (!student) {
//     throw new Error("Student profile not found");
//   }

//   const job = await prisma.job.findUnique({
//     where: {
//       id: jobId,
//     },
//     include: {
//       recruiter: true,
//     },
//   });

//   if (!job) {
//     throw new Error("Job not found");
//   }

//   const existingApplication =
//     await prisma.application.findUnique({
//       where: {
//         studentId_jobId: {
//           studentId: student.id,
//           jobId,
//         },
//       },
//     });

//   if (existingApplication) {
//     throw new Error("Already applied to this job");
//   }

//   const application =
//     await prisma.application.create({
//       data: {
//         studentId: student.id,
//         jobId,
//         resumeId,
//       },
//     });

//   await prisma.notification.create({
//     data: {
//       userId: job.recruiter.userId,
//       title: "New Job Application",
//       message: `${student.userId} has applied for your job "${job.title}".`,
//     },
//   });

//   return application;
// };
