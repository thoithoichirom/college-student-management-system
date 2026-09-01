import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./modules/auth/authRoutes.js";
import { studentRoutes } from "./modules/students/studentRoutes.js";
import { attendanceRoutes } from "./modules/attendance/attendanceRoutes.js";
import { marksRoutes } from "./modules/marks/marksRoutes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboardRoutes.js";

dotenv.config();

export const app = express();

const allowedOrigins = new Set([
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);
