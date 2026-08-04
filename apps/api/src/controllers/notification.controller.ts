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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};