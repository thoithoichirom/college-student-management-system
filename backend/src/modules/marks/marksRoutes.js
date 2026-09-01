import { Router } from "express";
import { enterMarks, getMarksBySubject, getStudentMarks } from "./marksController.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";

export const marksRoutes = Router();

marksRoutes.use(requireAuth);
marksRoutes.post("/", requireRole("staff"), enterMarks);
marksRoutes.get("/subject", requireRole("admin", "staff"), getMarksBySubject);
marksRoutes.get("/me", requireRole("student"), getStudentMarks);
marksRoutes.get("/student/:studentId", requireRole("admin", "staff"), getStudentMarks);
