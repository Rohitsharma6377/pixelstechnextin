"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUser as setUserAction, setLoading as setLoadingAction } from "@/features/auth/authSlice";

export type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const refresh = useCallback(async () => {
    try {
      dispatch(setLoadingAction(true));
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      const nextUser = data?.user ?? null;
      setUser(nextUser);
      dispatch(setUserAction(nextUser as any));
    } catch {
      setUser(null);
      dispatch(setUserAction(null as any));
    } finally {
      setLoading(false);
      dispatch(setLoadingAction(false));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoadingAction(true));
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        return { ok: false, error: data?.error || "Login failed" };
      }
      await refresh();
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Login failed" };
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
    dispatch(setUserAction(null as any));
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
