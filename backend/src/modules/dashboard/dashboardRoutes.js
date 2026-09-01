import { Router } from "express";
import { getAdminStats, getLowAttendanceStudents } from "./dashboardController.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth, requireRole("admin"));
dashboardRoutes.get("/stats", getAdminStats);
dashboardRoutes.get("/low-attendance", getLowAttendanceStudents);
