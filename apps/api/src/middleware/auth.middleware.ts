import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET!
) as JwtPayload;

console.log("Decoded Token:", decoded);

req.userId = decoded.id;

console.log("User ID:", req.userId);

next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};