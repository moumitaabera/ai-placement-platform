


import axios from "axios";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary";
import prisma from "../lib/prisma";

import {
  getMyResumes,
  deleteResume,
  getResumeForUser,
} from "../services/resume.service";

// =========================
// DELETE RESUME
// =========================

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

    return res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error: any) {
    console.error(
      "DELETE RESUME ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPLOAD RESUME
// =========================

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

    const student =
      await prisma.studentProfile.findUnique({
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

    const result: any =
      await new Promise((resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "ai-placement-platform/resumes",
              resource_type: "raw",
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }

              resolve(result);
            }
          );

        streamifier
          .createReadStream(file.buffer)
          .pipe(uploadStream);
      });

    const resume =
      await prisma.resume.create({
        data: {
          studentId: student.id,
          title: file.originalname,
          fileUrl: result.secure_url,
          publicId: result.public_id,
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Resume uploaded successfully",
      data: resume,
    });
  } catch (error: any) {
    console.error(
      "UPLOAD RESUME ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET MY RESUMES
// =========================

export const getResumes = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resumes = await getMyResumes(
      req.userId!
    );

    return res.json({
      success: true,
      data: resumes,
    });
  } catch (error: any) {
    console.error(
      "GET RESUMES ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// VIEW RESUME
// =========================

export const viewResume = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resumeId = req.params.id as string;

    const applicationId =
      req.query.applicationId as string | undefined;

    console.log("===== VIEW RESUME REQUEST =====");
    console.log("userId:", req.userId);
    console.log("resumeId:", resumeId);
    console.log("applicationId:", applicationId);

    const resume = await getResumeForUser(
  req.userId!,
  resumeId,
  applicationId,
  req.userRole
);

    const response = await axios.get(
      resume.fileUrl,
      {
        responseType: "arraybuffer",
      }
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "inline"
    );

    return res.send(response.data);
  } catch (error: any) {
    console.error(
      "VIEW RESUME ERROR:",
      error
    );

    if (error.message === "Unauthorized") {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this resume",
      });
    }

    if (error.message === "Resume not found") {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to view resume",
    });
  }
};