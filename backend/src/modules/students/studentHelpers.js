import { query } from "../../config/db.js";

export async function generateRollNumber(branch, semester) {
  const year = new Date().getFullYear();
  const branchCode = branch.toUpperCase().slice(0, 4);
  const prefix = `${branchCode}${year}`;

  const result = await query(
    `SELECT roll_number FROM students
     WHERE roll_number LIKE $1
     ORDER BY roll_number DESC LIMIT 1`,
    [`${prefix}%`]
  );

  const lastRoll = result.rows[0]?.roll_number;
  const nextNumber = lastRoll ? Number(lastRoll.slice(prefix.length)) + 1 : 1;

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}


export function mapStudent(row) {
  return {
    id: row.id,
    name: row.name,
    rollNumber: row.roll_number,
    email: row.email,
    branch: row.branch,
    semester: row.semester,
    phone: row.phone,
    gender: row.gender,
    feesStatus: row.fees_status,
    isDetained: row.is_detained,
    createdAt: row.created_at
  };
}
