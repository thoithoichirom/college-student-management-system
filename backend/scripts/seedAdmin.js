import dotenv from "dotenv";
import { pool, query } from "../src/config/db.js";
import { hashPassword } from "../src/utils/auth.js";

dotenv.config();

async function seedAdmin() {
  const name = process.env.SEED_ADMIN_NAME || "HOD Admin";
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@college.test").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
  const passwordHash = await hashPassword(password);

  await query(
    `INSERT INTO staff (name, email, password_hash, role, subject)
     VALUES ($1, $2, $3, 'admin', NULL)
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = 'admin'`,
    [name, email, passwordHash]
  );

  console.log("Admin account ready.");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  await pool.end();
}

seedAdmin().catch(async (error) => {
  console.error("Admin seed failed:");
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
