import React, { useEffect, useState } from 'react';
import LoginPage from './pages/auth/LoginPage';
import StaffDashboard from './pages/staff/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import { supabase } from "./services/supabaseClient";
import { User } from '@supabase/supabase-js';

export default function App() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [staffProfile, setStaffProfile] = useState<any>(null);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data?.user ?? null;
    setAuthUser(user);

    if (user) {
      // Check if staff profile exists
      const { data: staff } = await supabase
        .from("staff")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();
      setStaffProfile(staff || null);

      // Check if admin profile exists
      const { data: admin } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        // .eq("role", "admin")
        .maybeSingle();
      setAdminProfile(admin || null);
    } else {
      setStaffProfile(null);
      setAdminProfile(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setStaffProfile(null);
    setAdminProfile(null);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      const user = data?.user ?? null;
      setAuthUser(user);

      if (user) {
        const { data: staff } = await supabase
          .from("staff")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();
        setStaffProfile(staff || null);

        const { data: admin } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .eq("role", "admin")
          .maybeSingle();
        setAdminProfile(admin || null);
      } else {
        setStaffProfile(null);
        setAdminProfile(null);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 120 }}>Loading...</div>;
  }

  if (!authUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (staffProfile) {
    return <StaffDashboard user={staffProfile} onLogout={handleLogout} />;
  }

  if (adminProfile) {
    return <AdminDashboard user={adminProfile} onLogout={handleLogout} />;
  }

  return (
    <div style={{ marginTop: 120, color: "red", textAlign: 'center' }}>
      Unknown or unauthorized user.
      <button style={{ marginLeft: 8 }} onClick={handleLogout}>Logout</button>
    </div>
  );
}
