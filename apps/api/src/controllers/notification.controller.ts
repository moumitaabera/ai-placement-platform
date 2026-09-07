import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notification.service";

export const notifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = await getNotifications(req.userId!);

    res.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
  res.status(500).json({
    success: false,
    message:
      error instanceof Error
        ? error.message
        : "Failed to fetch notifications",
  });
}
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const notification =
      await markNotificationAsRead(
        req.userId!,
        req.params.id as string
      );

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error: unknown) {
  res.status(400).json({
    success: false,
    message:
      error instanceof Error
        ? error.message
        : "Failed to mark notification as read",
  });
}
};

