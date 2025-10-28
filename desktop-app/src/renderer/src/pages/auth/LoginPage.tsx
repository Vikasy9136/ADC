import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase } from "../../services/supabaseClient";
import { getAllCredentials, saveCredential } from "../../services/db";
import AdminRegisterPage from "./AdminRegisterPage";

interface UserProfile {
  [key: string]: any;
  email?: string;
  userType?: string;
}

interface Credentials {
  role: string;
  username: string;
  password: string;
  isActive?: boolean;
  email?: string | null;
}

interface LoginPageProps {
  onLogin: (profile: UserProfile) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showAdminRegisterPage, setShowAdminRegisterPage] = useState<boolean>(false);
  const [shouldShowRegister, setShouldShowRegister] = useState<boolean>(false);

useEffect(() => {
  async function checkAdmin() {
    let adminOnline = false, adminOffline = false;
    // Check local admin (offline)
    const creds: Credentials[] = getAllCredentials ? getAllCredentials() : [];
    adminOffline = creds.some((c: Credentials) => c.role === "admin");
    // Check online admin (users table, by role)
    if (navigator.onLine) {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("role", "admin")
        .limit(1);
      adminOnline = !!(data && data.length > 0);
    }
    // Only show if NO admin in users table and NO admin in offline creds
    setShouldShowRegister(!(adminOnline || adminOffline));
  }
  checkAdmin();
}, [showAdminRegisterPage]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let userType: string | null = null;
    let userProfile: UserProfile | null = null;

    // Online (Supabase Auth only)
    if (navigator.onLine) {
      const { data: authData, error: onlineError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (!onlineError && authData?.user) {
        // Try staff profile first (by id or email, depending on how your staff table is structured)
        const { data: staffRow } = await supabase
          .from("staff")
          .select("*")
          .eq("id", authData.user.id)  // or .eq("email", email.trim()) if your staff table uses email as PK
          .maybeSingle();

        if (staffRow) {
          userType = staffRow.role || "staff";
          userProfile = { ...staffRow, email: email.trim(), userType: "staff" };
          saveCredential({ username: email.trim(), password, role: "staff", isActive: true });
        } else {
          // Try admin table using email (not id!)
          const { data: userAdminRow } = await supabase
            .from("users")
            .select("*")
            .eq("email", email.trim())
            .maybeSingle();
          if (userAdminRow?.role === "admin") {
            userType = "admin";
            userProfile = { ...userAdminRow, email: email.trim(), userType: "admin" };
            saveCredential({ username: email.trim(), password, role: "admin", isActive: true });
          }
        }
      } else if (onlineError) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
    }

    // Offline (Local credentials)
    if (!userType) {
      const allCreds: Credentials[] = getAllCredentials ? getAllCredentials() : [];
      const cred = allCreds.find(
        (c) =>
          c.username === email.trim() &&
          c.password === password &&
          c.isActive &&
          (c.role === "admin" || c.role === "staff" || c.role === "phlebotomist")
      );
      if (cred) {
        userType = cred.role;
        userProfile = { ...cred, email: cred.email || cred.username || email.trim(), userType };
      }
    }

    setLoading(false);
    if (userType && userProfile) {
      onLogin({ ...userProfile, userType });
    } else {
      setError("Invalid admin or staff credentials.");
    }
  };

  if (showAdminRegisterPage) {
    return <AdminRegisterPage onRegister={() => setShowAdminRegisterPage(false)} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #21808D 0%, #32B8C6 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "64px", marginBottom: "12px" }}>🏥</div>
          <h1
            style={{
              fontWeight: 700,
              fontSize: "28px",
              marginBottom: "8px",
              color: "#134252",
              lineHeight: "1.2",
            }}
          >
            Ashwani Diagnostic Center
          </h1>
          <p style={{ color: "#626C71", fontSize: "15px" }}>Staff & Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                background: "#FEE2E2",
                color: "#DC2626",
                borderRadius: 8,
                fontSize: 14,
                border: "1px solid #FCA5A5",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              fontSize: 14,
              color: "#134252",
              marginBottom: 8,
              fontWeight: 600
            }}>
              Email
            </label>
            <input
              type="email"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #D1D5DB",
                borderRadius: 8,
                fontSize: 15,
                transition: "all 0.2s",
                outline: "none"
              }}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              autoFocus
              required
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontSize: 14,
              color: "#134252",
              marginBottom: 8,
              fontWeight: 600
            }}>
              Password
            </label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #D1D5DB",
                borderRadius: 8,
                fontSize: 15,
                transition: "all 0.2s",
                outline: "none"
              }}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              fontWeight: 600,
              color: "white",
              fontSize: 16,
              background: loading ? "#9CA3AF" : "#21808D",
              border: "none",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1a6873"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#21808D"; }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid white",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                  }}
                ></span>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span>Login</span>
              </>
            )}
          </button>
        </form>
        {shouldShowRegister && (
          <button
            style={{
              marginTop: 16, width: "100%", padding: "12px", fontWeight: 600,
              color: "white", fontSize: 16, background: "#059669",
              border: "none", borderRadius: 8, cursor: "pointer"
            }}
            onClick={() => setShowAdminRegisterPage(true)}
          >
            Register as Admin
          </button>
        )}
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 12,
            color: "#9CA3AF"
          }}
        >
          <p style={{ margin: 0 }}>© 2025 Ashwani Diagnostic Center. All rights reserved.</p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
