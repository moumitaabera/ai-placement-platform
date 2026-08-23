import prisma from "../lib/prisma";

export const createJob = async (
  userId: string,
  data: {
    title: string;
    description: string;
    location?: string;
    salary?: string;
    employmentType: string;
    experienceLevel: string;
    skills: string[];
    deadline?: Date;
  }
) => {
  console.log("Logged User ID:", userId);

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: {
      userId,
    },
  });

  console.log("Recruiter Profile:", recruiter);

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  return prisma.job.create({
    data: {
      recruiterId: recruiter.id,
      ...data,
    },
  });
};

export const getAllJobs = async (
  search?: string,
  location?: string,
  experience?: string,
  employmentType?: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),

    ...(location && {
      location: {
        contains: location,
        mode: "insensitive" as const,
      },
    }),

    ...(experience && {
      experienceLevel: experience,
    }),

    ...(employmentType && {
      employmentType,
    }),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        recruiter: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.job.count({
      where,
    }),
  ]);

  return {
    jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
            

export const getJobById = async (
  jobId: string
) => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      recruiter: {
        include: {
          company: true,
        },
      },
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

export const updateJob = async (
  userId: string,
  jobId: string,
  data: Partial<{
    title: string;
    description: string;
    location: string;
    salary: string;
    employmentType: string;
    experienceLevel: string;
    skills: string[];
    deadline: Date;
    status: "ACTIVE" | "CLOSED" | "DRAFT";
  }>
) => {
  const recruiter = await prisma.recruiterProfile.findUnique({
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

  return prisma.job.update({
    where: {
      id: jobId,
    },
    data,
  });
};

export const deleteJob = async (
  userId: string,
  jobId: string
) => {
  const recruiter = await prisma.recruiterProfile.findUnique({
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

  await prisma.job.delete({
    where: {
      id: jobId,
    },
  });

  return {
    message: "Job deleted successfully",
  };
};

export const getRecruiterJobs = async (userId: string) => {
  const recruiter = await prisma.recruiterProfile.findUnique({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs;
};