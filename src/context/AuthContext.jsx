/* eslint-disable react/prop-types */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, loginWithCredentials, readSession, readUsers, registerUniversityUser, writeSession, writeUsers } from "../portal/portalAuth";
import { apiLogin, apiRegisterUser, isNetworkApiError } from "../portal/apiClient";
import { inferPortalTypeFromEmail } from "../portal/portalAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(readSession());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (identifier, password) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    let result = loginWithCredentials(identifier, password);

    if (!result.success) {
      try {
        const apiResult = await apiLogin(identifier, password);
        result = { success: true, user: normalizeApiUser(apiResult.user) };
      } catch (error) {
        result = { success: false, error: error.message || result.error };
      }
    }

    if (result.success) {
      writeSession(result.user);
      setUser(result.user);
    }
    setIsLoading(false);
    return result;
  }, []);

  const register = useCallback(async (data) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    const portalType = inferPortalTypeFromEmail(data.email);
    let result;

    try {
      const apiResult = await apiRegisterUser({ ...data, portalType });
      result = { success: true, user: normalizeApiUser(apiResult.user) };
    } catch (error) {
      result = isNetworkApiError(error)
        ? registerUniversityUser(data)
        : { success: false, error: error.message };
    }

    if (result.success) {
      writeSession(result.user);
      setUser(result.user);
    }
    setIsLoading(false);
    return result;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((current) => {
      if (!current) return current;
      const nextUser = { ...current, ...updates };
      writeSession(nextUser);

      if (nextUser.id && !String(nextUser.id).startsWith("default-")) {
        writeUsers(readUsers().map((item) => (item.id === nextUser.id ? { ...item, ...updates } : item)));
      }

      return nextUser;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, updateProfile, isAuthenticated: Boolean(user) }),
    [isLoading, login, logout, register, updateProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function normalizeApiUser(user) {
  const name = user.name || user.fullName || "ORIC User";
  const portalType = user.portal_type || user.portalType;
  return {
    ...user,
    id: String(user.id),
    name,
    fullName: name,
    portalType,
    role: portalType,
    employeeId: user.employee_id || user.employeeId || "",
    rollNumber: user.roll_number || user.rollNumber || "",
    avatar: user.avatar || name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
  };
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
