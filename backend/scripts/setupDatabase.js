import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { pool } from "../src/config/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, "..", "db", "schema.sql");

async function setupDatabase() {
  const schema = fs.readFileSync(schemaPath, "utf8");
  await pool.query(schema);
  console.log("Database schema applied successfully.");
  await pool.end();
}

setupDatabase().catch(async (error) => {
  console.error("Database setup failed:");
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
