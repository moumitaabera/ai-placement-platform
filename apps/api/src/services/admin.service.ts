import prisma from "../lib/prisma";

export const getAdminStats = async () => {
  const [
    totalStudents,
    totalRecruiters,
    totalJobs,
    activeJobs,
    totalApplications,
    totalInterviews,
    completedInterviews,
    totalResumes,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "STUDENT",
      },
    }),

    prisma.user.count({
      where: {
        role: "RECRUITER",
      },
    }),

    prisma.job.count(),

    prisma.job.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.application.count(),

    prisma.interviewSession.count(),

    prisma.interviewSession.count({
      where: {
        completedAt: {
          not: null,
        },
      },
    }),

    prisma.resume.count(),
  ]);

  return {
    totalStudents,
    totalRecruiters,
    totalJobs,
    activeJobs,
    totalApplications,
    totalInterviews,
    completedInterviews,
    totalResumes,
  };
};

export const getAdminUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      provider: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return users;
};

/*
 * Delete user
 */
export const deleteAdminUser = async (
  userId: string,
  adminUserId: string
) => {
  // Admin যেন নিজেকে delete করতে না পারে
  if (userId === adminUserId) {
    throw new Error(
      "You cannot delete your own admin account"
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // অন্য কোনো ADMIN account delete করা যাবে না
  if (user.role === "ADMIN") {
    throw new Error(
      "Admin users cannot be deleted"
    );
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return {
    message: "User deleted successfully",
  };
};

export const getAdminJobs = async () => {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      recruiter: {
        select: {
          id: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
      _count: {
        select: {
          applications: true,
          interviewSessions: true,
        },
      },
    },
  });

  return jobs;
};

export const getAdminApplications = async () => {
  const applications = await prisma.application.findMany({
    orderBy: {
      appliedAt: "desc",
    },

    select: {
      id: true,
      status: true,
      appliedAt: true,

      student: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },

      job: {
        select: {
          title: true,
          employmentType: true,
          location: true,

          recruiter: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },

              company: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },

      resume: {
        select: {
          id: true,
          title: true,
          fileUrl: true,
        },
      },
    },
  });

  return applications;
};

export const getApplicationStatusAnalytics =
  async () => {
    const applications =
      await prisma.application.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      });

    const result = {
      APPLIED: 0,
      REVIEWING: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      REJECTED: 0,
      HIRED: 0,
    };

    for (const application of applications) {
      result[application.status] =
        application._count._all;
    }

    return result;
  };