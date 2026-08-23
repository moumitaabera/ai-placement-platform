import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { analyzeResume, getResumeAnalysis, } from "../services/resumeAnalysis.service";

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
export const getMyResumeAnalysis = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { resumeId } = req.params;

    const analysis = await getResumeAnalysis(
      req.userId!,
      resumeId as string
    );

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};