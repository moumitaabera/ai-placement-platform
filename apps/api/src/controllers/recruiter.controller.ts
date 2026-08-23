import { Response } from "express";

import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getRecruiterProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const profile =
      await prisma.recruiterProfile.findUnique({
        where: {
          userId: req.userId!,
        },
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error: unknown) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch recruiter profile",
    });
  }
};

export const updateRecruiterProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      designation,
      companyId,
    } = req.body;

    const profile =
      await prisma.recruiterProfile.upsert({
        where: {
          userId: req.userId!,
        },

        update: {
          designation,
          companyId:
            companyId || null,
        },

        create: {
          userId: req.userId!,
          designation,
          companyId:
            companyId || null,
        },
      });

    return res.json({
      success: true,
      message:
        "Recruiter profile updated successfully",
      data: profile,
    });
  } catch (error: unknown) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update recruiter profile",
    });
  }
};