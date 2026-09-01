import { Router } from "express";
import { loginStaff, loginStudent, getMe } from "./authController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

export const authRoutes = Router();

authRoutes.post("/staff/login", loginStaff);
authRoutes.post("/student/login", loginStudent);
authRoutes.get("/me", requireAuth, getMe);
