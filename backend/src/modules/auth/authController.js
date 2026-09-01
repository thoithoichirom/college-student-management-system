import { query } from "../../config/db.js";
import { comparePassword, signToken } from "../../utils/auth.js";
import { httpError } from "../../utils/httpError.js";

export async function loginStaff(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw httpError(400, "Email and password are required");
    }

    const result = await query("SELECT * FROM staff WHERE email = $1", [email.toLowerCase()]);
    const staff = result.rows[0];

    if (!staff || !(await comparePassword(password, staff.password_hash))) {
      throw httpError(401, "Invalid email or password");
    }

    const token = signToken(staff);
    res.json({
      user: { id: staff.id, name: staff.name, email: staff.email, role: staff.role, subject: staff.subject },
      token
    });
  } catch (error) {
    next(error);
  }
}

export async function loginStudent(req, res, next) {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      throw httpError(400, "Roll number and password are required");
    }

    const result = await query("SELECT * FROM students WHERE roll_number = $1", [rollNumber.toUpperCase()]);
    const student = result.rows[0];

    if (!student || !(await comparePassword(password, student.password_hash))) {
      throw httpError(401, "Invalid roll number or password");
    }

    const token = signToken({ ...student, role: "student" });
    res.json({
      user: { id: student.id, name: student.name, rollNumber: student.roll_number, role: "student", branch: student.branch, semester: student.semester },
      token
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    if (req.user.role === "student") {
      const result = await query("SELECT * FROM students WHERE id = $1", [req.user.id]);
      if (!result.rows[0]) throw httpError(404, "Student not found");
      const s = result.rows[0];
      return res.json({
        user: { id: s.id, name: s.name, rollNumber: s.roll_number, role: "student", branch: s.branch, semester: s.semester }
      });
    }

    const result = await query("SELECT * FROM staff WHERE id = $1", [req.user.id]);
    if (!result.rows[0]) throw httpError(404, "Staff not found");
    const s = result.rows[0];
    res.json({
      user: { id: s.id, name: s.name, email: s.email, role: s.role, subject: s.subject }
    });
  } catch (error) {
    next(error);
  }
}
