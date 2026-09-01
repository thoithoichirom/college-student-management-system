import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./state/AuthContext.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { StaffDashboard } from "./pages/StaffDashboard.jsx";
import { StudentDashboard } from "./pages/StudentDashboard.jsx";

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="screen-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "staff") {
    return <Navigate to="/staff" replace />;
  }

  return <Navigate to="/student" replace />;
}

function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="screen-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={(
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/staff"
        element={(
          <ProtectedRoute roles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/student"
        element={(
          <ProtectedRoute roles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        )}
      />
    </Routes>
  );
}
