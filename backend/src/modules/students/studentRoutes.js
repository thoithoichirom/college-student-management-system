import { Router } from "express";
import { createStudent, getStudents, getOwnStudentProfile, updateStudent } from "./studentController.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";

export const studentRoutes = Router();

studentRoutes.use(requireAuth);
studentRoutes.get("/me", requireRole("student"), getOwnStudentProfile);
studentRoutes.get("/", requireRole("admin", "staff"), getStudents);
studentRoutes.post("/", requireRole("admin"), createStudent);
studentRoutes.put("/:id", requireRole("admin"), updateStudent);
