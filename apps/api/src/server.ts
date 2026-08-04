import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import prisma from "./lib/prisma";
import { env } from "./config/env";

const PORT = Number(env.PORT);

prisma
  .$connect()
  .then(() => {
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed", error);
  });