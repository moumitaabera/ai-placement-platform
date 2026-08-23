import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  generateInterviewQuestions,
  startInterview,
  getInterviewSession,
  submitInterview,
  getInterviewHistory,
  getInterviewResult
} from "../services/interview.service";


// Generate interview questions
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

    const questions =
      await generateInterviewQuestions(
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


// Start interview
export const startInterviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      resumeId,
      jobId,
      difficulty,
    } = req.body;

    if (!resumeId || !jobId) {
      return res.status(400).json({
        success: false,
        message:
          "resumeId and jobId are required",
      });
    }

    const result = await startInterview(
      req.userId!,
      resumeId,
      jobId,
      difficulty || "MEDIUM"
    );

    res.status(201).json({
      success: true,
      message:
        "Interview started successfully",
      data: result,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get interview session
export const getInterviewSessionController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const sessionId =
        req.params.sessionId as string ;

      const session =
        await getInterviewSession(
          req.userId!,
          sessionId
        );

      res.status(200).json({
        success: true,
        data: session,
      });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  // Submit interview answers
export const submitInterviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { sessionId, answers } = req.body;

    if (!sessionId || !answers) {
      return res.status(400).json({
        success: false,
        message:
          "sessionId and answers are required",
      });
    }

    const result = await submitInterview(
      req.userId!,
      sessionId,
      answers
    );

    return res.status(200).json({
      success: true,
      message:
        "Interview submitted successfully",
      data: result,
    });
  } catch (error: any) {
    console.error(
      "Submit interview error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Interview submission failed",
    });
  }
};

// Get interview history
export const getInterviewHistoryController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const history = await getInterviewHistory(
      req.userId!
    );

    return res.status(200).json({
      success: true,
      data: history,
    });

  } catch (error: unknown) {
    console.error(
      "Get interview history error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch interview history";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

// Get interview result

export const getInterviewResultController = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const sessionId = req.params.sessionId as string;

    const result = await getInterviewResult(
      req.userId!,
      sessionId
    );


    return res.status(200).json({
      success:true,
      data:result,
    });


  } catch(error){

    console.error(
      "Get interview result error:",
      error
    );


    return res.status(500).json({
      success:false,
      message:"Failed to fetch interview result"
    });

  }
};