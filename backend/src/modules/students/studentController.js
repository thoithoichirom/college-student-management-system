import { query } from "../../config/db.js";
import { hashPassword } from "../../utils/auth.js";
import { httpError } from "../../utils/httpError.js";
import { generateRollNumber, mapStudent } from "./studentHelpers.js";

export async function createStudent(req, res, next) {
  try {
    const { name, email, password, branch, semester, phone, gender, feesStatus = "pending" } = req.body;

    if (!name || !email || !password || !branch || !semester) {
      throw httpError(400, "Name, email, password, branch, and semester are required");
    }

    const rollNumber = await generateRollNumber(branch, semester);
    const passwordHash = await hashPassword(password);

    const result = await query(
      `INSERT INTO students (name, roll_number, email, password_hash, branch, semester, phone, gender, fees_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, rollNumber, email.toLowerCase(), passwordHash, branch, Number(semester), phone || null, gender || null, feesStatus]
    );

    res.status(201).json({ student: mapStudent(result.rows[0]), login: { rollNumber, password } });
  } catch (error) {
    if (error.code === "23505") return next(httpError(409, "Student email already exists"));
    next(error);
  }
}

export async function getStudents(req, res, next) {
  try {
    const result = await query("SELECT * FROM students ORDER BY created_at DESC");
    res.json({ students: result.rows.map(mapStudent) });
  } catch (error) {
    next(error);
  }
}

export async function getOwnStudentProfile(req, res, next) {
  try {
    const result = await query("SELECT * FROM students WHERE id = $1", [req.user.id]);
    if (!result.rows[0]) throw httpError(404, "Student not found");
    res.json({ student: mapStudent(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function updateStudent(req, res, next) {
  try {
    const { name, email, branch, semester, phone, gender, feesStatus, isDetained } = req.body;

    const result = await query(
      `UPDATE students SET
         name        = COALESCE($1, name),
         email       = COALESCE($2, email),
         branch      = COALESCE($3, branch),
         semester    = COALESCE($4, semester),
         phone       = COALESCE($5, phone),
         gender      = COALESCE($6, gender),
         fees_status = COALESCE($7, fees_status),
         is_detained = COALESCE($8, is_detained)
       WHERE id = $9 RETURNING *`,
      [name ?? null, email?.toLowerCase() ?? null, branch ?? null, semester ? Number(semester) : null,
       phone ?? null, gender ?? null, feesStatus ?? null, isDetained ?? null, req.params.id]
    );

    if (!result.rows[0]) throw httpError(404, "Student not found");
    res.json({ student: mapStudent(result.rows[0]) });
  } catch (error) {
    if (error.code === "23505") return next(httpError(409, "Student email already exists"));
    next(error);
  }
}
