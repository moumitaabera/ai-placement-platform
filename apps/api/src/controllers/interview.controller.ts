import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateInterviewQuestions } from "../services/interview.service";

export const generateQuestions = async (
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

    const questions = await generateInterviewQuestions(
      req.userId!,
      resumeId,
      jobId
    );

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};