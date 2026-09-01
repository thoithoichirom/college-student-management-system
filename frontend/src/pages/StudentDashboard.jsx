import { useEffect, useState } from "react";
import { BookOpenCheck, CircleUserRound, CreditCard, FileBarChart } from "lucide-react";
import { api, getApiError } from "../api/client.js";
import { Layout } from "../components/Layout.jsx";
import { Message } from "../components/Message.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import { attendanceTone } from "../utils/formatters.js";

export function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudentData() {
      try {
        const [profileResponse, attendanceResponse, marksResponse] = await Promise.all([
          api.get("/students/me"),
          api.get("/attendance/me"),
          api.get("/marks/me")
        ]);
        setProfile(profileResponse.data.student);
        setAttendance(attendanceResponse.data.summary);
        setMarks(marksResponse.data.marks);
      } catch (requestError) {
        setError(getApiError(requestError));
      }
    }

    loadStudentData();
  }, [user.id]);

  return (
    <Layout title="Student Dashboard" subtitle="Check your own attendance, marks, fees, and detention status.">
      <Message type="error">{error}</Message>

      <section className="content-grid three-columns">
        <div className="panel profile-panel">
          <div className="panel-heading">
            <h2>Profile</h2>
            <CircleUserRound size={20} />
          </div>
          <Info label="Name" value={profile?.name || user.name} />
          <Info label="Roll No" value={profile?.rollNumber || user.rollNumber} />
          <Info label="Branch" value={profile?.branch || user.branch} />
          <Info label="Semester" value={profile?.semester || user.semester} />
        </div>

        <div className="panel profile-panel">
          <div className="panel-heading">
            <h2>Fees</h2>
            <CreditCard size={20} />
          </div>
          <StatusBadge tone={profile?.feesStatus === "paid" ? "success" : "danger"}>
            {profile?.feesStatus || "pending"}
          </StatusBadge>
        </div>

        <div className="panel profile-panel">
          <div className="panel-heading">
            <h2>Detention</h2>
            <BookOpenCheck size={20} />
          </div>
          <StatusBadge tone={profile?.isDetained ? "danger" : "success"}>
            {profile?.isDetained ? "Detained" : "Clear"}
          </StatusBadge>
        </div>
      </section>

      <section className="content-grid two-columns">
        <div className="panel">
          <div className="panel-heading">
            <h2>Attendance</h2>
            <FileBarChart size={20} />
          </div>
          <div className="stack-list">
            {attendance.length === 0 && <p className="muted">No attendance has been marked yet.</p>}
            {attendance.map((item) => (
              <div className="metric-row" key={item.subject}>
                <div>
                  <strong>{item.subject}</strong>
                  <span>{item.present_classes}/{item.total_classes} classes</span>
                </div>
                <StatusBadge tone={attendanceTone(item.percentage)}>
                  {Number(item.percentage).toFixed(2)}%
                </StatusBadge>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h2>Marks</h2>
            <FileBarChart size={20} />
          </div>
          <div className="stack-list">
            {marks.length === 0 && <p className="muted">No marks entered yet.</p>}
            {marks.map((item) => (
              <div className="metric-row" key={item.id}>
                <div>
                  <strong>{item.subject}</strong>
                  <span>{item.examType}</span>
                </div>
                <StatusBadge tone="neutral">
                  {item.marksObtained}/{item.totalMarks}
                </StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}
