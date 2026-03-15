/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

const decodeJwtPayload = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    const decoded = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");
  const [studentId, setStudentId] = useState(() => {
    const storedStudentId = sessionStorage.getItem("studentId");
    if (storedStudentId) return storedStudentId;

    const storedToken = sessionStorage.getItem("token");
    if (!storedToken) return "";

    const parsed = decodeJwtPayload(storedToken);
    if (parsed?.studentId) {
      sessionStorage.setItem("studentId", parsed.studentId);
      return parsed.studentId;
    }

    return "";
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");

    const bootstrapAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authApi.profile();
        setProfile(data || null);
      } catch {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("studentId");
        setToken("");
        setStudentId("");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const { data } = await authApi.profile();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  };

  const completeLogin = ({ token: jwtToken, studentId: sid }) => {
    if (jwtToken) {
      sessionStorage.setItem("token", jwtToken);
      setToken(jwtToken);
    }
    if (sid) {
      sessionStorage.setItem("studentId", sid);
      setStudentId(sid);
    }
    sessionStorage.removeItem("pendingStudentId");

    setTimeout(() => {
      refreshProfile();
    }, 0);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("studentId");
    sessionStorage.removeItem("pendingStudentId");
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    setToken("");
    setStudentId("");
    setProfile(null);
    setLoading(false);
  };

  const value = {
    token,
    studentId,
    profile,
    loading,
    setLoading,
    completeLogin,
    refreshProfile,
    logout,
    isAuthenticated: Boolean(token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
