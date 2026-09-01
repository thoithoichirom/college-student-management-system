import { useState } from "react";
import { Navigate } from "react-router-dom";
import { GraduationCap, KeyRound, Mail, UserRound } from "lucide-react";
import { api, getApiError } from "../api/client.js";
import { useAuth } from "../state/AuthContext.jsx";
import { Message } from "../components/Message.jsx";

export function LoginPage() {
  const { user, login } = useAuth();
  const [mode, setMode] = useState("staff");
  const [form, setForm] = useState({ email: "", rollNumber: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "staff" ? "/auth/staff/login" : "/auth/student/login";
      const payload = mode === "staff"
        ? { email: form.email, password: form.password }
        : { rollNumber: form.rollNumber, password: form.password };
      const { data } = await api.post(endpoint, payload);
      login(data);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-copy">
          <div className="brand large">
            <GraduationCap size={34} />
            <div>
              <strong>College SMS</strong>
              <span>Student Management System</span>
            </div>
          </div>
          <h1>Manage attendance, marks, fees, and detentions from one portal.</h1>
          <p>Admins, teachers, and students each get only the tools and data they are allowed to access.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="segmented">
            <button
              type="button"
              className={mode === "staff" ? "active" : ""}
              onClick={() => setMode("staff")}
            >
              Staff/Admin
            </button>
            <button
              type="button"
              className={mode === "student" ? "active" : ""}
              onClick={() => setMode("student")}
            >
              Student
            </button>
          </div>

          <Message type="error">{error}</Message>

          {mode === "staff" ? (
            <label className="field">
              <span>Email</span>
              <div className="input-with-icon">
                <Mail size={18} />
                <input name="email" type="email" value={form.email} onChange={updateField} required />
              </div>
            </label>
          ) : (
            <label className="field">
              <span>Roll Number</span>
              <div className="input-with-icon">
                <UserRound size={18} />
                <input name="rollNumber" value={form.rollNumber} onChange={updateField} required />
              </div>
            </label>
          )}

          <label className="field">
            <span>Password</span>
            <div className="input-with-icon">
              <KeyRound size={18} />
              <input name="password" type="password" value={form.password} onChange={updateField} required />
            </div>
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
