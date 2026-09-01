import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, FilePenLine, ListChecks, Search } from "lucide-react";
import { api, getApiError } from "../api/client.js";
import { Layout } from "../components/Layout.jsx";
import { Message } from "../components/Message.jsx";
import { Tabs } from "../components/Tabs.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { formatDate } from "../utils/formatters.js";

export function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState("");
  const [classDate, setClassDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState({});
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [marksForm, setMarksForm] = useState({ studentId: "", subject: "", marksObtained: "", totalMarks: "25", examType: "internal" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const tabs = useMemo(() => [
    { id: "attendance", label: "Mark Attendance", icon: <ClipboardCheck size={18} /> },
    { id: "view", label: "View Attendance", icon: <ListChecks size={18} /> },
    { id: "marks", label: "Enter Marks", icon: <FilePenLine size={18} /> }
  ], []);

  useEffect(() => {
    api.get("/students")
      .then(({ data }) => {
        setStudents(data.students);
        const defaults = {};
        data.students.forEach((student) => {
          defaults[student.id] = "present";
        });
        setAttendance(defaults);
      })
      .catch((requestError) => setError(getApiError(requestError)));
  }, []);

  async function submitAttendance(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const records = students.map((student) => ({
        studentId: student.id,
        status: attendance[student.id] || "absent"
      }));

      await api.post("/attendance", { subject, classDate, records });
      setMessage("Attendance saved successfully.");
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  async function loadAttendance(event) {
    event.preventDefault();
    setError("");

    try {
      const { data } = await api.get("/attendance/subject", { params: { subject, classDate } });
      setAttendanceRows(data.attendance);
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  async function submitMarks(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/marks", {
        ...marksForm,
        marksObtained: Number(marksForm.marksObtained),
        totalMarks: Number(marksForm.totalMarks)
      });
      setMessage("Marks saved successfully.");
      setMarksForm((current) => ({ ...current, marksObtained: "" }));
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  return (
    <Layout title="Staff Dashboard" subtitle="Mark attendance, review class records, and enter internal or external marks.">
      <Message type="success">{message}</Message>
      <Message type="error">{error}</Message>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "attendance" && (
        <form className="panel" onSubmit={submitAttendance}>
          <div className="panel-heading">
            <h2>Mark Attendance</h2>
            <ClipboardCheck size={20} />
          </div>
          <div className="row compact">
            <input placeholder="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} required />
            <input type="date" value={classDate} onChange={(event) => setClassDate(event.target.value)} required />
          </div>
          <div className="attendance-list">
            {students.map((student) => (
              <div className="attendance-row" key={student.id}>
                <div>
                  <strong>{student.name}</strong>
                  <span>{student.rollNumber}</span>
                </div>
                <select value={attendance[student.id] || "absent"} onChange={(event) => setAttendance({ ...attendance, [student.id]: event.target.value })}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            ))}
          </div>
          <button className="primary-button" type="submit">Submit attendance</button>
        </form>
      )}

      {activeTab === "view" && (
        <section className="panel">
          <div className="panel-heading">
            <h2>View Attendance</h2>
            <Search size={20} />
          </div>
          <form className="filters" onSubmit={loadAttendance}>
            <input placeholder="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} required />
            <input type="date" value={classDate} onChange={(event) => setClassDate(event.target.value)} />
            <button className="secondary-button" type="submit">Search</button>
          </form>
          <div className="table-panel embedded">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.studentName}</td>
                    <td>{row.rollNumber}</td>
                    <td>{formatDate(row.classDate)}</td>
                    <td>
                      <StatusBadge tone={row.status === "present" ? "success" : "danger"}>{row.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "marks" && (
        <form className="panel form-grid narrow" onSubmit={submitMarks}>
          <div className="panel-heading">
            <h2>Enter Marks</h2>
            <FilePenLine size={20} />
          </div>
          <select value={marksForm.studentId} onChange={(event) => setMarksForm({ ...marksForm, studentId: event.target.value })} required>
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>{student.rollNumber} - {student.name}</option>
            ))}
          </select>
          <input placeholder="Subject" value={marksForm.subject} onChange={(event) => setMarksForm({ ...marksForm, subject: event.target.value })} required />
          <div className="row">
            <input type="number" min="0" step="0.5" placeholder="Marks obtained" value={marksForm.marksObtained} onChange={(event) => setMarksForm({ ...marksForm, marksObtained: event.target.value })} required />
            <input type="number" min="1" step="0.5" placeholder="Total marks" value={marksForm.totalMarks} onChange={(event) => setMarksForm({ ...marksForm, totalMarks: event.target.value })} required />
          </div>
          <select value={marksForm.examType} onChange={(event) => setMarksForm({ ...marksForm, examType: event.target.value })}>
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
          <button className="primary-button" type="submit">Save marks</button>
        </form>
      )}
    </Layout>
  );
}
