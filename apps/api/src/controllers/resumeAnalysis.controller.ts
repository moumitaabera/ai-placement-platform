import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { analyzeResume } from "../services/resumeAnalysis.service";

export const analyzeMyResume = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { resumeId } = req.body;

    const analysis = await analyzeResume(
      req.userId!,
      resumeId
    );

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: analysis,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};