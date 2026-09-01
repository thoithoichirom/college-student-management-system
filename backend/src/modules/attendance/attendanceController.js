import { query } from "../../config/db.js";
import { httpError } from "../../utils/httpError.js";

export async function markAttendance(req, res, next) {
  try {
    const { subject, classDate, records } = req.body;

    if (!subject || !classDate || !Array.isArray(records) || records.length === 0) {
      throw httpError(400, "Subject, classDate, and records are required");
    }

    for (const record of records) {
      await query(
        `INSERT INTO attendance (student_id, subject, class_date, status, marked_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (student_id, subject, class_date)
         DO UPDATE SET status = EXCLUDED.status, marked_by = EXCLUDED.marked_by`,
        [record.studentId, subject, classDate, record.status, req.user.id]
      );
    }

    res.status(201).json({ message: "Attendance saved successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getAttendanceBySubject(req, res, next) {
  try {
    const { subject } = req.query;

    if (!subject) throw httpError(400, "Subject is required");

    const result = await query(
      `SELECT a.*, s.name AS student_name, s.roll_number
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       WHERE a.subject = $1
       ORDER BY a.class_date DESC, s.roll_number ASC`,
      [subject]
    );

    res.json({ attendance: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getStudentAttendance(req, res, next) {
  try {
    const studentId = req.params.studentId || req.user.id;

    const result = await query(
      `SELECT subject,
         COUNT(*)::int AS total_classes,
         COUNT(*) FILTER (WHERE status = 'present')::int AS present_classes,
         ROUND((COUNT(*) FILTER (WHERE status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100, 2) AS percentage
       FROM attendance
       WHERE student_id = $1
       GROUP BY subject
       ORDER BY subject ASC`,
      [studentId]
    );

    res.json({ attendance: result.rows });
  } catch (error) {
    next(error);
  }
}
