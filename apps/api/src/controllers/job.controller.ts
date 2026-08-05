import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createJob,
  getAllJobs,
  getJobById,
   updateJob,
   deleteJob,
} from "../services/job.service";

export const create = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const job = await createJob(
      req.userId!,
      {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        salary: req.body.salary,
        employmentType: req.body.employmentType,
        experienceLevel: req.body.experienceLevel,
        skills: req.body.skills,
        deadline: req.body.deadline
          ? new Date(req.body.deadline)
          : undefined,
      }
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error: unknown) {
  console.error("CREATE JOB ERROR:", error);

  if (error instanceof Error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
};
export const getJobs = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      search,
      location,
      experience,
      employmentType,
      page,
      limit,
    } = req.query;

    const result = await getAllJobs(
      typeof search === "string" ? search : undefined,
      typeof location === "string" ? location : undefined,
      typeof experience === "string"
        ? experience
        : undefined,
      typeof employmentType === "string"
        ? employmentType
        : undefined,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10
    );

    res.json({
      success: true,
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
    


export const getJob = async (
  req: Request,
  res: Response
) => {
  try {
    const jobId = req.params.id as string;

const job = await getJobById(jobId);

    res.json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const update = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const job = await updateJob(
      req.userId!,
      req.params.id as string,
      {
        ...req.body,
        deadline: req.body.deadline
          ? new Date(req.body.deadline)
          : undefined,
      }
    );

    res.json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await deleteJob(
      req.userId!,
      req.params.id as string
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};