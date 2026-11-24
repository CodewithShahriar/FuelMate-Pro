// Supabase GoTrue Auth Client & Hook
import { useState, useEffect } from "react";
import { supabaseConfig, uploadFillUpsToCloud, uploadExpensesToCloud, fetchCloudFillUps, fetchCloudExpenses } from "./supabase-client";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
}

export interface AuthSession {
  access_token: string;
  user: AuthUser;
}

const AUTH_KEY = "fuelmate_auth_session_v1";

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse auth session", e);
  }
  return null;
}

export function saveSession(session: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

// Global state listeners
let listeners: Array<(session: AuthSession | null) => void> = [];
let currentSession: AuthSession | null = getStoredSession();

function notifyListeners(s: AuthSession | null) {
  currentSession = s;
  saveSession(s);
  listeners.forEach((fn) => fn(s));
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(currentSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (newSession: AuthSession | null) => setSession(newSession);
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, []);

  const signUp = async (email: string, pass: string, fullName?: string) => {
    setLoading(true);
    setError(null);

    const cleanBase = supabaseConfig.url.replace(/\/+$/, "").replace(/\/rest\/v1\/?$/, "");
    const url = `${cleanBase}/auth/v1/signup`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          apikey: supabaseConfig.key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: pass,
          data: { full_name: fullName || email.split("@")[0] },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error_description || data.msg || data.message || "Sign up failed");
      }

      // If session returned immediately (or after auto-confirm)
      if (data.access_token && data.user) {
        const newSession: AuthSession = {
          access_token: data.access_token,
          user: {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.user_metadata?.full_name || fullName,
          },
        };
        notifyListeners(newSession);
        await migrateLocalDataToAccount(newSession.user.id, newSession.access_token);
        return { success: true, session: newSession };
      }

      // If confirmation email required
      return { success: true, needsConfirmation: true, user: data.user };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);

    const cleanBase = supabaseConfig.url.replace(/\/+$/, "").replace(/\/rest\/v1\/?$/, "");
    const url = `${cleanBase}/auth/v1/token?grant_type=password`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          apikey: supabaseConfig.key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: pass,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error_description || data.msg || data.message || "Invalid credentials");
      }

      const newSession: AuthSession = {
        access_token: data.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name,
        },
      };
      notifyListeners(newSession);

      // Automatically migrate any local data or fetch cloud records
      await migrateLocalDataToAccount(newSession.user.id, newSession.access_token);
      return { success: true, session: newSession };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    notifyListeners(null);
  };

  return {
    session,
    user: session?.user || null,
    isAuthenticated: Boolean(session?.access_token),
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
}

// Automatically upload local records with user_id attached
export async function migrateLocalDataToAccount(userId: string, token: string) {
  if (typeof window === "undefined") return;

  try {
    const rawFuel = localStorage.getItem("fuelmate_pro_fillups_v2");
    const rawExp = localStorage.getItem("fuelmate_pro_expenses_v2");

    const fillUps = rawFuel ? JSON.parse(rawFuel) : [];
    const expenses = rawExp ? JSON.parse(rawExp) : [];

    // Tag each item with user_id
    const taggedFuel = fillUps.map((f: any) => ({ ...f, user_id: userId }));
    const taggedExp = expenses.map((e: any) => ({ ...e, user_id: userId }));

    if (taggedFuel.length > 0) {
      await uploadFillUpsToCloud(taggedFuel);
    }
    if (taggedExp.length > 0) {
      await uploadExpensesToCloud(taggedExp);
    }

    console.log(`✅ Migrated ${taggedFuel.length} fill-ups and ${taggedExp.length} expenses to account ${userId}`);
  } catch (e) {
    console.warn("Notice during account data migration:", e);
  }
}
