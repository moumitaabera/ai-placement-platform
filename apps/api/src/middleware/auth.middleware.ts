import {
  Request,
  Response,
  NextFunction,
} from "express";
import jwt from "jsonwebtoken";

type UserRole =
  | "STUDENT"
  | "RECRUITER"
  | "ADMIN";

interface JwtPayload {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
  file?: Express.Multer.File;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  }

  const [scheme, token] =
    authHeader.split(" ");

  if (
    scheme !== "Bearer" ||
    !token
  ) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid authorization format",
    });
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    console.error(
      "JWT_SECRET is not configured"
    );

    return res.status(500).json({
      success: false,
      message:
        "Authentication configuration error",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      secret
    ) as JwtPayload;

    if (
      !decoded?.id ||
      !decoded?.role
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};