import React, { useEffect, useState } from 'react';
import { supabase } from "../../services/supabaseClient";

interface StaffDashboardProps {
  user: any; // or your user shape
  onLogout: () => void;
}

export default function StaffDashboard({ user, onLogout }: StaffDashboardProps) {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (!user || authErr) {
        setError("Not logged in.");
        return;
      }
      const { data: staff, error: staffErr } = await supabase
        .from("staff")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();
      if (staffErr || !staff) {
        setError("Staff profile not found.");
        return;
      }
      setProfile(staff);
    }
    fetchProfile();
  }, []);

  if (error) {
    return <div style={{ color: "red", textAlign: "center", marginTop: 80 }}>{error}</div>;
  }
  if (!profile) {
    return <div style={{ textAlign: "center", marginTop: 80 }}>Loading staff profile...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#FCFCF9',
      padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <div style={{ fontSize: '44px', marginBottom: 16 }}>👨‍⚕️</div>
      <h2 style={{ color: '#134252', fontWeight: 'bold', fontSize: '2rem' }}>
        Welcome, {profile.name || profile.email}
      </h2>
      <p style={{ color: '#626C71', marginBottom: 24 }}>Staff Dashboard</p>
      <button onClick={onLogout}
        style={{
          padding: '12px 28px', color: 'white', background: '#21808D',
          border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: 17, marginBottom: 40
        }}>
        Logout
      </button>
      <div style={{
        padding: '46px', borderRadius: 14, background: 'white',
        boxShadow: '0 5px 16px rgba(0,0,0,0.07)', minWidth: 280, minHeight: 80
      }}>
        <span style={{ color: '#626C71' }}>
          Dashboard widgets and actions will go here.<br />You may add Patient Registration, Booking, etc.
        </span>
      </div>
    </div>
  );
}
