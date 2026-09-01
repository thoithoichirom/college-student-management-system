import { query } from "../../config/db.js";
import { httpError } from "../../utils/httpError.js";

export async function enterMarks(req, res, next) {
  try {
    const { studentId, subject, marksObtained, totalMarks, examType } = req.body;

    if (!studentId || !subject || marksObtained === undefined || !totalMarks || !examType) {
      throw httpError(400, "Student, subject, marks, total marks, and exam type are required");
    }

    if (Number(marksObtained) > Number(totalMarks)) {
      throw httpError(400, "Marks obtained cannot be greater than total marks");
    }

    const result = await query(
      `INSERT INTO marks (student_id, subject, marks_obtained, total_marks, exam_type, entered_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (student_id, subject, exam_type)
       DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained, total_marks = EXCLUDED.total_marks
       RETURNING *`,
      [studentId, subject, Number(marksObtained), Number(totalMarks), examType, req.user.id]
    );

    res.status(201).json({ marks: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function getStudentMarks(req, res, next) {
  try {
    const studentId = req.params.studentId || req.user.id;

    const result = await query(
      `SELECT * FROM marks WHERE student_id = $1 ORDER BY subject ASC, exam_type ASC`,
      [studentId]
    );

    res.json({ marks: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getMarksBySubject(req, res, next) {
  try {
    const { subject } = req.query;

    if (!subject) throw httpError(400, "Subject is required");

    const result = await query(
      `SELECT m.*, s.name AS student_name, s.roll_number
       FROM marks m
       JOIN students s ON s.id = m.student_id
       WHERE m.subject = $1
       ORDER BY s.roll_number ASC`,
      [subject]
    );

    res.json({ marks: result.rows });
  } catch (error) {
    next(error);
  }
}
