CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'staff')),
  subject VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  roll_number VARCHAR(40) NOT NULL UNIQUE,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  branch VARCHAR(80) NOT NULL,
  semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 10),
  phone VARCHAR(30),
  gender VARCHAR(30),
  fees_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (fees_status IN ('paid', 'pending')),
  is_detained BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(120) NOT NULL,
  class_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent')),
  marked_by UUID REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, subject, class_date)
);

CREATE TABLE IF NOT EXISTS marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(120) NOT NULL,
  marks_obtained NUMERIC(5,2) NOT NULL CHECK (marks_obtained >= 0),
  total_marks NUMERIC(5,2) NOT NULL CHECK (total_marks > 0),
  exam_type VARCHAR(30) NOT NULL CHECK (exam_type IN ('internal', 'external')),
  entered_by UUID REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, subject, exam_type)
);

CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_branch_semester ON students(branch, semester);
CREATE INDEX IF NOT EXISTS idx_attendance_student_subject ON attendance(student_id, subject);
CREATE INDEX IF NOT EXISTS idx_marks_student_subject ON marks(student_id, subject);
