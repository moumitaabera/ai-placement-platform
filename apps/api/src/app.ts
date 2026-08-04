import express from "express";
import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import resumeRoutes from "./routes/resume.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import notificationRoutes from "./routes/notification.routes";
import resumeAnalysisRoutes from "./routes/resumeAnalysis.routes";
import jobMatchingRoutes from "./routes/jobMatching.routes";
import interviewRoutes from "./routes/interview.routes";
import mockInterviewRoutes from "./routes/mockInterview.routes";
import { errorHandler } from "./middleware/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import logger from "./config/logger";



const app = express();
app.use(
  pinoHttp({
    logger,
  })
);
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
app.use(limiter);

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "AI Placement Platform API Running 🚀",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/student", studentRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use(
  "/api/resume-analysis",
  resumeAnalysisRoutes
);
app.use(
  "/api/job-matching",
  jobMatchingRoutes
);
app.use(
  "/api/interview",
  interviewRoutes
);
app.use(
  "/api/mock-interview",
  mockInterviewRoutes
);
app.use(errorHandler);
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


export default app;