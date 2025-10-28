import React, { useState, useEffect } from 'react';
import StaffModal from '../../components/admin/StaffModal';
import StaffTable from '../../components/admin/StaffTable';
import StatBox from '../../components/common/StateBox';
import { db } from '../../services/db';
import { supabase } from '../../config/supabase';

// Explicit interface for credentials
interface Credentials {
  username: string;
  password: string;
  role: string;
}

// Credentials Modal Props
interface CredentialsModalProps {
  credentials: Credentials;
  error?: string | null;
  onClose: () => void;
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  // CREDENTIALS MODAL STATE
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [newCredentials, setNewCredentials] = useState<Credentials | null>(null);
  const [credentialsError, setCredentialsError] = useState<string | null>(null);

  useEffect(() => {
    loadStaff();
    const staffChannel = supabase
      .channel('any_staff_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staff' }, () => loadStaff())
      .subscribe();

    window.addEventListener("online", syncAndReload);
    window.addEventListener("offline", () => setIsOnline(false));

    const syncInterval = setInterval(() => {
      setIsOnline(navigator.onLine);
      setPendingSync(db.getPendingSyncCount ? db.getPendingSyncCount() : 0);
    }, 1800);

    return () => {
      staffChannel.unsubscribe();
      clearInterval(syncInterval);
      window.removeEventListener("online", syncAndReload);
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const syncAndReload = () => {
    setIsOnline(true);
    syncWithSupabase();
    loadStaff();
  };

  async function loadStaff() {
    if (navigator.onLine) {
      const { data, error } = await supabase.from('staff').select('*');
      if (!error && Array.isArray(data)) {
        setStaff(data);
        if (db.updateStaff) data.forEach((s: any) => db.updateStaff(s.id, s));
        return;
      }
    }
    const localData = db.getAllStaff ? db.getAllStaff() : [];
    setStaff(localData);
  }

  async function syncWithSupabase() {
    if (!isOnline || !db.forceSyncNow) return;
    await db.forceSyncNow();
    await loadStaff();
  }

  const handleAdd = () => {
    setEditingStaff(null);
    setShowModal(true);
  };
  const handleEdit = (item: any) => {
    setEditingStaff(item);
    setShowModal(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure to delete?')) {
      if (navigator.onLine) await supabase.from('staff').delete().eq('id', id);
      db.deleteStaff(id);
      await loadStaff();
    }
  };

  // Handle Save from StaffModal: will receive { ...formData, password? }
  const handleSave = async (data: any) => {
    setShowModal(false);
    setCredentialsError(null);

    let authError = null;
    if (navigator.onLine && data.email && data.password) {
      try {
        // Register staff in Supabase Auth (for email login)
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        if (error) authError = error.message;
      } catch (e: any) {
        authError = e?.message || String(e);
      }
    }

    if (data.password) {
      setNewCredentials({
        username: data.email,
        password: data.password,
        role: data.role,
      });
      setCredentialsError(authError);
      setShowCredentialsModal(true);
    }
    setTimeout(() => loadStaff(), 150);
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = (s?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && String(s.phone).includes(searchTerm));
    const matchesRole = filterRole === 'all' || s.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Header with Sync Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#134252", marginBottom: "4px" }}>
            Staff & Phlebotomist Management
          </h2>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <p style={{ fontSize: "14px", color: "#626C71", margin: 0 }}>
              Manage all staff members and phlebotomists
            </p>
            {/* Online/Offline Status */}
            <div style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "12px",
              background: isOnline ? "#DCFCE7" : "#FEE2E2", fontSize: "12px", fontWeight: "600"
            }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: isOnline ? "#10B981" : "#EF4444"
              }} />
              <span style={{ color: isOnline ? "#059669" : "#DC2626" }}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            {/* Pending Sync Count */}
            {pendingSync > 0 && (
              <div style={{
                padding: "4px 12px", borderRadius: "12px", background: "#FEF3C7",
                color: "#92400E", fontSize: "12px", fontWeight: "600"
              }}>
                🔄 {pendingSync} pending sync
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={syncWithSupabase}
            disabled={!isOnline || pendingSync === 0}
            style={{
              padding: "12px 24px",
              background: pendingSync > 0 ? "#F59E0B" : "#D1D5DB",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: pendingSync > 0 ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <span>🔄</span> Sync Now ({pendingSync})
          </button>
          <button
            onClick={handleAdd}
            style={{
              padding: "12px 24px",
              background: "#21808D",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <span>➕</span> Add New Staff
          </button>
        </div>
      </div>
      {/* Filters */}
      <div style={{
        background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #E5E7EB",
        marginBottom: "24px", display: "flex", gap: "16px", alignItems: "center"
      }}>
        <input
          type="text"
          placeholder="🔍 Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 16px",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            fontSize: "14px"
          }}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{
            padding: "10px 16px", border: "1px solid #D1D5DB", borderRadius: "8px",
            fontSize: "14px", minWidth: "180px"
          }}
        >
          <option value="all">All Roles</option>
          <option value="staff">Staff Only</option>
          <option value="phlebotomist">Phlebotomist Only</option>
        </select>
      </div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <StatBox icon="👥" label="Total Staff" value={staff.length.toString()} color="#3B82F6" />
        <StatBox icon="👨‍🔬" label="Lab Staff" value={staff.filter((s) => s.role === "staff").length.toString()} color="#10B981" />
        <StatBox icon="💉" label="Phlebotomists" value={staff.filter((s) => s.role === "phlebotomist").length.toString()} color="#8B5CF6" />
      </div>
      <StaffTable
        staff={filteredStaff}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* Add/Edit Modal */}
      {showModal && (
        <StaffModal
          staff={editingStaff}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
      {/* Credentials Modal */}
      {showCredentialsModal && newCredentials && (
        <CredentialsModal
          credentials={newCredentials}
          error={credentialsError}
          onClose={() => {
            setShowCredentialsModal(false);
            setNewCredentials(null);
            setCredentialsError(null);
          }}
        />
      )}
    </div>
  );
}


// ============ Credentials Modal ===============
function CredentialsModal({ credentials, error, onClose }: CredentialsModalProps) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    const text = `Username: ${credentials.username}\nPassword: ${credentials.password}\nRole: ${credentials.role}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Could not copy. Please focus this window and try again.");
    }
  };
  const downloadCredentials = () => {
    const text =
      `ASHWANI DIAGNOSTIC CENTER - LOGIN CREDENTIALS\n\n` +
      `Username: ${credentials.username}\n` +
      `Password: ${credentials.password}\n` +
      `Role: ${credentials.role}\n\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `Please keep these credentials safe and secure.`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credentials_${credentials.username}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px 28px 24px 28px",
          maxWidth: "410px",
          width: "96%",
          boxShadow: "0 18px 64px rgba(0,0,0,0.19)"
        }}>
        <h3 style={{ fontSize: "19px", fontWeight: "700", color: "#134252", textAlign: "center" }}>
          Login Credentials Created
        </h3>
        <div style={{ color: "#626C71", fontSize: "14px", textAlign: "center", marginBottom: 18 }}>
          Please save these credentials securely. They won't be shown again.
        </div>
        {error && (
          <div style={{
            background: "#FEE2E2",
            color: "#DC2626",
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 14,
            border: "1px solid #FCA5A5",
            marginBottom: 15,
            textAlign: "center"
          }}>
            ⚠️ {error}
          </div>
        )}
        <div style={{
          background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
          padding: "18px 14px",
          borderRadius: "10px",
          border: "2px dashed #E3E6EA",
          marginBottom: "20px",
        }}>
          <div style={{ marginBottom: "17px" }}>
            <label style={{
              fontSize: "11px", color: "#6B7280", fontWeight: "700", letterSpacing: "0.4px",
              textTransform: "uppercase"
            }}>Username</label>
            <div style={{
              fontSize: "19px", fontWeight: "700", color: "#07233B", marginTop: 5,
              fontFamily: "monospace", padding: "6px", borderRadius: "6px", background: "#fff"
            }}>
              {credentials.username}
            </div>
          </div>
          <div style={{ marginBottom: "17px" }}>
            <label style={{
              fontSize: "11px", color: "#6B7280", fontWeight: "700", letterSpacing: "0.4px",
              textTransform: "uppercase"
            }}>Password</label>
            <div style={{
              fontSize: "19px", fontWeight: "700", color: "#DC2626", marginTop: 5,
              fontFamily: "monospace", padding: "6px", borderRadius: "6px", background: "#fff"
            }}>
              {credentials.password}
            </div>
          </div>
          <div>
            <label style={{
              fontSize: "11px", color: "#6B7280", fontWeight: "700", letterSpacing: "0.4px",
              textTransform: "uppercase"
            }}>Role</label>
            <div style={{
              fontSize: "15px", fontWeight: "600", color: "#21808D", marginTop: 5,
              textTransform: "capitalize"
            }}>
              {credentials.role}
            </div>
          </div>
        </div>
        <div style={{
          background: "#FEF3C7", padding: "11px 15px", borderRadius: "8px", marginBottom: 18,
          border: "1.5px solid #FDE68A", fontSize: "13px",
          color: "#92400E", display: "flex", alignItems: "center", gap: "7px",
        }}>
          <span style={{ fontSize: "19px" }}>⚠️</span>
          <span>
            <b>Important:</b> Please share these credentials securely with the staff member. They will need them to login to the system.
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: 6 }}>
          <button onClick={copyToClipboard} style={{
            flex: 1, padding: "12px", background: copied ? "#10B981" : "#21808D", color: "white",
            border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer"
          }}>
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button onClick={downloadCredentials} style={{
            flex: 1, padding: "12px", background: "#2563EB", color: "white",
            border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer"
          }}>
            <span role="img" aria-label="download">💾</span> Download
          </button>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", background: "#E5EAF0", color: "#1D283A",
            border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer"
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
