import { query } from "../../config/db.js";

export async function getAdminStats(req, res, next) {
  try {
    const totalStudents = await query("SELECT COUNT(*)::int AS count FROM students");
    const feesPending = await query("SELECT COUNT(*)::int AS count FROM students WHERE fees_status = 'pending'");
    const detainedStudents = await query("SELECT COUNT(*)::int AS count FROM students WHERE is_detained = TRUE");

    res.json({
      stats: {
        totalStudents: totalStudents.rows[0].count,
        feesPending: feesPending.rows[0].count,
        detainedStudents: detainedStudents.rows[0].count
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getLowAttendanceStudents(req, res, next) {
  try {
    const result = await query(
      `SELECT s.id, s.name, s.roll_number, s.branch, a.subject,
         COUNT(*)::int AS total_classes,
         COUNT(*) FILTER (WHERE a.status = 'present')::int AS present_classes,
         ROUND((COUNT(*) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100, 2) AS percentage
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       GROUP BY s.id, s.name, s.roll_number, s.branch, a.subject
       HAVING (COUNT(*) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(*), 0)) * 100 < 75
       ORDER BY percentage ASC`
    );

    res.json({ students: result.rows });
  } catch (error) {
    next(error);
  }
}
