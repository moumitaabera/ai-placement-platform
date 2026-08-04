import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { evaluateAnswer } from "../services/mockInterview.service";

export const evaluateInterviewAnswer = asyncHandler(
  async (req: Request, res: Response) => {
    const { question, answer } = req.body;

    if (!question || !answer) {
      throw new ApiError(
        400,
        "Question and answer are required."
      );
    }

    const result = await evaluateAnswer(
      question,
      answer
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);