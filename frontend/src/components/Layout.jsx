import { LogOut, School } from "lucide-react";
import { useAuth } from "../state/AuthContext.jsx";

export function Layout({ title, subtitle, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <School size={26} />
          <div>
            <strong>College SMS</strong>
            <span>{user?.role?.toUpperCase()} PORTAL</span>
          </div>
        </div>
        <div className="user-chip">
          <span>{user?.name}</span>
          <button className="icon-button" type="button" onClick={logout} title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="page">
        <div className="page-title">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
