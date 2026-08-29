import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../services/auth.service";

import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
  const { name, email, password, role } = req.body;

const user = await registerUser(
  name,
  email,
  password,
  role
);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }


};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(
      email,
      password
    );

    res.json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const refresh = async (
  req: Request,
  res: Response
) => {
  try {
    const { refreshToken } = req.body;

    const accessToken = await refreshAccessToken(refreshToken);

    res.json({
      success: true,
      accessToken,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const me = async (
  req: AuthRequest,
  res: Response
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { password, ...safeUser } = user;

  res.json({
    success: true,
    data: safeUser,
  });
};

export const logout = async (
  req: Request,
  res: Response
) => {
  try {
    const { refreshToken } = req.body;

    await logoutUser(refreshToken);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    await forgotPassword(email);

    /*
     * Always return the same message,
     * whether the email exists or not.
     */
    res.json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error: any) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request.",
    });
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || Array.isArray(token)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    await resetPassword(
      token,
      password
    );

    res.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error: any) {
    console.error(
      "Reset password error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to reset password.",
    });
  }
};