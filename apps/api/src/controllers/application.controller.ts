import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { applyForJob, getMyApplications, getApplicantsForJob, updateApplicationStatus,} from "../services/application.service";

export const apply = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { jobId, resumeId } = req.body;

    const application = await applyForJob(
      req.userId!,
      jobId,
      resumeId
    );

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const myApplications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const applications =
      await getMyApplications(req.userId!);

    res.json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const applicants = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const applications =
      await getApplicantsForJob(
        req.userId!,
        req.params.jobId as string
      );

    res.json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const application =
      await updateApplicationStatus(
        req.userId!,
        req.params.id as string,
        req.body.status
      );

    res.json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};