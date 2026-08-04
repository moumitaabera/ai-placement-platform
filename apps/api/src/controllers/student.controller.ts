import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      college,
      department,
      course,
      year,
      cgpa,
      phone,
      linkedin,
      github,
      bio,
      skills,
    } = req.body;

    const profile = await prisma.studentProfile.upsert({
      where: {
        userId: req.userId!,
      },
      update: {
        college,
        department,
        course,
        year,
        cgpa,
        phone,
        linkedin,
        github,
        bio,
        skills,
      },
      create: {
        userId: req.userId!,
        college,
        department,
        course,
        year,
        cgpa,
        phone,
        linkedin,
        github,
        bio,
        skills,
      },
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error: unknown) {
  console.error(error);

  if (error instanceof Error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Unknown error",
    });
  }
}
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const profile =
      await prisma.studentProfile.findUnique({
        where: {
          userId: req.userId!,
        },
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};