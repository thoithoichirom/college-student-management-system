import { Router } from "express";
import {
  getAttendanceBySubject,
  getStudentAttendance,
  markAttendance
} from "./attendanceController.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";

export const attendanceRoutes = Router();

attendanceRoutes.use(requireAuth);
attendanceRoutes.post("/", requireRole("staff"), markAttendance);
attendanceRoutes.get("/subject", requireRole("admin", "staff"), getAttendanceBySubject);
attendanceRoutes.get("/me", requireRole("student"), getStudentAttendance);
attendanceRoutes.get("/student/:studentId", requireRole("admin", "staff"), getStudentAttendance);
