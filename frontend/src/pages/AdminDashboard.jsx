import { useEffect, useState } from "react";
import { AlertTriangle, BadgeIndianRupee, Edit3, Search, ShieldAlert, Trash2, UserPlus, Users } from "lucide-react";
import { api, getApiError } from "../api/client.js";
import { Layout } from "../components/Layout.jsx";
import { Message } from "../components/Message.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";

const emptyStudent = {
  name: "",
  email: "",
  password: "",
  branch: "CSE",
  semester: 4,
  phone: "",
  gender: "",
  feesStatus: "pending"
};

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ search: "", branch: "", semester: "" });
  const [form, setForm] = useState(emptyStudent);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const [statsResponse, studentsResponse] = await Promise.all([
      api.get("/dashboard/stats"),
      api.get("/students", { params: filters })
    ]);

    setStats(statsResponse.data.stats);
    setStudents(studentsResponse.data.students);
  }

  useEffect(() => {
    loadData().catch((requestError) => setError(getApiError(requestError)));
  }, []);

  async function applyFilters(event) {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.get("/students", { params: filters });
      setStudents(data.students);
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitStudent(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, {
          name: form.name,
          email: form.email,
          branch: form.branch,
          semester: Number(form.semester),
          phone: form.phone,
          gender: form.gender,
          feesStatus: form.feesStatus
        });
        setMessage("Student updated successfully.");
      } else {
        const { data } = await api.post("/students", form);
        setMessage(`Student created. Roll number: ${data.login.rollNumber}`);
      }

      setForm(emptyStudent);
      setEditingId(null);
      await loadData();
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  function editStudent(student) {
    setEditingId(student.id);
    setForm({
      name: student.name,
      email: student.email,
      password: "",
      branch: student.branch,
      semester: student.semester,
      phone: student.phone || "",
      gender: student.gender || "",
      feesStatus: student.feesStatus
    });
  }

  async function removeStudent(id) {
    if (!confirm("Delete this student and all related attendance/marks?")) {
      return;
    }

    try {
      await api.delete(`/students/${id}`);
      await loadData();
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  async function quickUpdate(student, updates) {
    try {
      await api.put(`/students/${student.id}`, updates);
      await loadData();
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  return (
    <Layout title="Admin Dashboard" subtitle="Monitor students, fees, attendance risk, and detention status.">
      <Message type="success">{message}</Message>
      <Message type="error">{error}</Message>

      <section className="stats-grid">
        <Stat icon={<Users />} label="Total Students" value={stats?.totalStudents ?? 0} />
        <Stat icon={<AlertTriangle />} label="Below 75%" value={stats?.attendanceBelow75 ?? 0} />
        <Stat icon={<BadgeIndianRupee />} label="Fees Pending" value={stats?.feesPending ?? 0} />
        <Stat icon={<ShieldAlert />} label="Detained" value={stats?.detainedStudents ?? 0} />
      </section>

      <section className="content-grid two-columns">
        <form className="panel form-grid" onSubmit={submitStudent}>
          <div className="panel-heading">
            <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
            <UserPlus size={20} />
          </div>
          <input name="name" placeholder="Full name" value={form.name} onChange={updateForm} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={updateForm} required />
          {!editingId && (
            <input name="password" type="password" placeholder="Initial password" value={form.password} onChange={updateForm} required />
          )}
          <div className="row">
            <input name="branch" placeholder="Branch" value={form.branch} onChange={updateForm} required />
            <input name="semester" type="number" min="1" max="10" value={form.semester} onChange={updateForm} required />
          </div>
          <div className="row">
            <input name="phone" placeholder="Phone" value={form.phone} onChange={updateForm} />
            <input name="gender" placeholder="Gender" value={form.gender} onChange={updateForm} />
          </div>
          <select name="feesStatus" value={form.feesStatus} onChange={updateForm}>
            <option value="pending">Fees pending</option>
            <option value="paid">Fees paid</option>
          </select>
          <div className="button-row">
            <button className="primary-button" type="submit">{editingId ? "Save changes" : "Create student"}</button>
            {editingId && (
              <button className="ghost-button" type="button" onClick={() => { setEditingId(null); setForm(emptyStudent); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="panel">
          <div className="panel-heading">
            <h2>Student Directory</h2>
            <Search size={20} />
          </div>
          <form className="filters" onSubmit={applyFilters}>
            <input placeholder="Name or roll number" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
            <input placeholder="Branch" value={filters.branch} onChange={(event) => setFilters({ ...filters, branch: event.target.value })} />
            <input placeholder="Semester" type="number" value={filters.semester} onChange={(event) => setFilters({ ...filters, semester: event.target.value })} />
            <button className="secondary-button" type="submit">Filter</button>
          </form>
        </div>
      </section>

      <section className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No</th>
              <th>Branch</th>
              <th>Sem</th>
              <th>Fees</th>
              <th>Detention</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <strong>{student.name}</strong>
                  <span className="muted">{student.email}</span>
                </td>
                <td>{student.rollNumber}</td>
                <td>{student.branch}</td>
                <td>{student.semester}</td>
                <td>
                  <button className="text-button" type="button" onClick={() => quickUpdate(student, { feesStatus: student.feesStatus === "paid" ? "pending" : "paid" })}>
                    <StatusBadge tone={student.feesStatus === "paid" ? "success" : "danger"}>{student.feesStatus}</StatusBadge>
                  </button>
                </td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={student.isDetained} onChange={(event) => quickUpdate(student, { isDetained: event.target.checked })} />
                    <span>{student.isDetained ? "Detained" : "Clear"}</span>
                  </label>
                </td>
                <td>
                  <div className="action-row">
                    <button className="icon-button" type="button" onClick={() => editStudent(student)} title="Edit student">
                      <Edit3 size={16} />
                    </button>
                    <button className="icon-button danger-icon" type="button" onClick={() => removeStudent(student.id)} title="Delete student">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
