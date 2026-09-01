import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("college_sms_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("college_sms_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("college_sms_user", JSON.stringify(data.user));
      } catch (error) {
        localStorage.removeItem("college_sms_token");
        localStorage.removeItem("college_sms_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    login(authData) {
      localStorage.setItem("college_sms_token", authData.token);
      localStorage.setItem("college_sms_user", JSON.stringify(authData.user));
      setToken(authData.token);
      setUser(authData.user);
    },
    logout() {
      localStorage.removeItem("college_sms_token");
      localStorage.removeItem("college_sms_user");
      setToken(null);
      setUser(null);
    }
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
