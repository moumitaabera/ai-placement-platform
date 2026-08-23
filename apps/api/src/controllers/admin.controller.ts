import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminJobs,
  getAdminApplications,
getApplicationStatusAnalytics,
} from "../services/admin.service";

export const getStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const stats = await getAdminStats();

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(
      "Admin stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load admin statistics",
    });
  }
};
export const getJobs = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const jobs = await getAdminJobs();

    return res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Admin jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin jobs",
    });
  }
};

export const getUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const users = await getAdminUsers();

    return res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(
      "Admin users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = String(req.params.id);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await deleteAdminUser(
      userId,
      req.userId
    );

    return res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(
      "Admin delete user error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete user";

    if (message === "User not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message ===
        "You cannot delete your own admin account" ||
      message ===
        "Admin users cannot be deleted"
    ) {
      return res.status(403).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

export const getApplications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const applications = await getAdminApplications();

    return res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Admin applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load applications",
    });
  }
};

export const getApplicationAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const analytics =
      await getApplicationStatusAnalytics();

    return res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error(
      "Admin application analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load application analytics",
    });
  }
};