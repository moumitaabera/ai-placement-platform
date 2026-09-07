import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { matchResumeWithJob } from "../services/jobMatching.service";

export const matchJob = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { resumeId, jobId } = req.body;

    if (!resumeId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobId are required",
      });
    }

    const result = await matchResumeWithJob(
      req.userId!,
      resumeId,
      jobId
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
  res.status(500).json({
    success: false,
    message:
      error instanceof Error
        ? error.message
        : "Failed to match resume with job",
  });
}
};