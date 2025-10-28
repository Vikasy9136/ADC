import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { saveCredential } from "../../services/db";
import bcrypt from "bcryptjs";

export default function AdminRegisterPage({ onRegister }: { onRegister?: (user: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [syncStatus, setSyncStatus] = useState(''); 
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSyncStatus('');
    setCreating(true);
    setSuccess(false);

    // 1. Register admin locally (for offline login)
    saveCredential({
      username: email,
      password,
      role: 'admin',
      isActive: true
    });

    // 2. If online, register with Supabase Auth and users table
    if (navigator.onLine) {
      try {
        const { data, error: regErr } = await supabase.auth.signUp({ email, password });
        if (regErr) {
          setError("Supabase Auth registration: " + regErr.message);
          setSyncStatus('');
          setCreating(false);
          return;
        }
        // Hash password before storing in users table (frontend hashing with bcryptjs)
        const password_hash = bcrypt.hashSync(password, 10);
        const user_id = data?.user?.id;
        // Insert admin record in users table: includes hash (never store plain password!)
        const { error: dbErr } = await supabase.from("users").insert([{
          id: user_id,    
          email,
          role: 'admin',
          name,
          password_hash
        }]);
        if (dbErr) {
          setSyncStatus("Auth successful, but failed to sync to users table: " + dbErr.message);
        } else {
          setSyncStatus("");
          setSuccess(true);
        }
        setCreating(false);
        if (onRegister) onRegister({ email, name });
        return;
      } catch (e: any) {
        setError("Sync error: " + (e?.message || "Unknown error"));
        setCreating(false);
      }
    } else {
      alert('Admin registered locally. Will sync to Supabase when online.');
      setCreating(false);
      setSuccess(true);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", justifyContent: "center", alignItems: "center",
      background: "linear-gradient(135deg, #21808D 0%, #32B8C6 100%)"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff", borderRadius: 16, maxWidth: 400, width: "95%", padding: 36, boxShadow: "0 2px 24px #0001"
      }}>
        <h2 style={{ color: "#21808D", marginBottom: 20 }}>Register as Admin</h2>
        {error && <div style={{ color: 'red', marginBottom: 14 }}>{error}</div>}
        {syncStatus && <div style={{ color: '#059669', marginBottom: 14 }}>{syncStatus}</div>}
        {success && (
          <div style={{ color: "#059669", marginBottom: 18, fontWeight: 600, fontSize: 15 }}>
            Successfully registered!<br />
            You can now <b>login with your credentials</b>.
          </div>
        )}
        <input type="text" placeholder="Full Name"
          value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
        <input type="email" placeholder="Email Address"
          value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
        <input type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required minLength={8} />
        <button type="submit" disabled={creating} style={btnStyle}>
          {creating ? "Registering..." : "Register"}
        </button>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 16 }}>
          Admin account will always work offline.<br />
          If online, we will also sync to Supabase when possible.
        </div>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 15px", fontSize: 15, marginBottom: 14,
  borderRadius: 7, border: "1.5px solid #D7DFE5",
};
const btnStyle: React.CSSProperties = {
  width: "100%", padding: "12px", fontSize: 16, background: "#21808D",
  color: "#FFF", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer",
};
