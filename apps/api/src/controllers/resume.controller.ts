import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary";
import prisma from "../lib/prisma";

export const removeResume = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resumeId = req.params.id as string;

const resume = await deleteResume(
  req.userId!,
  resumeId
);

    if (resume.publicId) {
      await cloudinary.uploader.destroy(
        resume.publicId,
        {
          resource_type: "raw",
        }
      );
    }

    await prisma.resume.delete({
      where: {
        id: resume.id,
      },
    });

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadResume = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    const file = req.file;

    const student = await prisma.studentProfile.findUnique({
      where: {
        userId: req.userId!,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ai-placement-platform/resumes",
          resource_type: "raw",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier
        .createReadStream(file.buffer)
        .pipe(uploadStream);
    });

    const resume = await prisma.resume.create({
  data: {
    studentId: student.id,
    title: file.originalname,
    fileUrl: result.secure_url,
    publicId: result.public_id,
  },
});

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      data: resume,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

import {
  getMyResumes,
  deleteResume,
} from "../services/resume.service";

export const getResumes = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resumes = await getMyResumes(req.userId!);

    res.json({
      success: true,
      data: resumes,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};