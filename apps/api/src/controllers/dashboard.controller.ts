import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { recruiterDashboard , studentDashboard,} from "../services/dashboard.service";


export const recruiterStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = await recruiterDashboard(
      req.userId!
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const studentStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = await studentDashboard(
      req.userId!
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};