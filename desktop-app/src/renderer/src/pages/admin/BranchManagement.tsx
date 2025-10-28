import React, { useState, useEffect } from 'react';
import BranchModal from '../../components/admin/BranchModal';
import { supabase } from '../../config/supabase';

export interface BranchForm {
  id?: string; // From modal it is string/undefined
  name: string;
  address: string;
  status: 'active' | 'coming_soon' | 'maintenance';
  latitude: number | string | null;
  longitude: number | string | null;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  status: 'active' | 'coming_soon' | 'maintenance';
  latitude: number;
  longitude: number;
}

const BRANCH_STATUS = {
  active: { label: "Active", color: "#21808D" },
  coming_soon: { label: "Coming Soon", color: "#E68161" },
  maintenance: { label: "Maintenance", color: "#626C71" }
};

type LatLng = { lat: number; lng: number };

export default function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);

  useEffect(() => { loadBranches(); }, []);

  async function loadBranches() {
    const { data } = await supabase.from('branches').select('*');
    setBranches(data ?? []);
  }

  function handleAdd() {
    setEditing(null);
    setShowModal(true);
  }

  function handleEdit(item: Branch) {
    setEditing(item);
    setShowModal(true);
  }

  async function handleSave(branchData: BranchForm): Promise<void> {
    // Always cast latitude/longitude to number before saving
    const { id, ...rest } = branchData;
    const payload = {
      ...rest,
      latitude: rest.latitude === "" || rest.latitude === null ? null : Number(rest.latitude),
      longitude: rest.longitude === "" || rest.longitude === null ? null : Number(rest.longitude),
    };
    if (editing) {
      await supabase.from('branches')
        .update(payload)
        .eq('id', editing.id);
    } else {
      await supabase.from('branches')
        .insert([payload]);
    }
    await loadBranches();
    setShowModal(false);
  }

  async function handleDelete(id: number) {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      await supabase.from('branches').delete().eq('id', id);
      await loadBranches();
    }
  }

  function exampleLatLngHandler({ lat, lng }: LatLng) {}

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FCFCF9",
      padding: "0 0 64px 0"
    }}>
      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, #21808D 0%, #32B8C6 100%)",
        borderRadius: 0,
        padding: "26px 22px 14px 36px",
        marginBottom: 24,
        maxWidth: 1140,
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <h1 style={{
          color: "#FFF",
          fontSize: 27,
          fontWeight: 800,
          letterSpacing: ".5px",
          margin: 0
        }}>
          Branch Management
        </h1>
        <div style={{ color: "#F8F9FA", fontSize: 15, marginTop: 4 }}>
          Admin can add, edit, tag staff, and manage branch maintenance from here.
        </div>
      </div>
      {/* Card */}
      <div style={{
        background: "#FFFFFE",
        border: "1px solid rgba(94,82,64,0.11)",
        borderRadius: 16,
        maxWidth: 910,
        margin: "0 auto",
        padding: "22px 18px 18px",
        boxShadow: "0 2px 8px rgba(33,128,141,0.04)",
      }}>
        {/* Card header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#134252" }}>Branch List</span>
          <button
            onClick={handleAdd}
            style={{
              background: "linear-gradient(135deg, #21808D 0%, #32B8C6 100%)",
              color: "#FFF",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: 15,
              boxShadow: "0 2px 8px rgba(33,128,141,0.10)",
              cursor: "pointer",
              letterSpacing: ".1px"
            }}
          >+ Add New Branch</button>
        </div>
        <div style={{ overflowX: "auto", borderRadius: "10px" }}>
          <table style={{
            width: "100%",
            minWidth: 600,
            background: "#FFFFFE",
            borderCollapse: "separate",
            borderSpacing: 0,
            borderRadius: 12,
            margin: 0,
          }}>
            <thead>
              <tr style={{ background: "#F8F9FA" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Status</th>
                <th style={thStyleCenter}>Lat/Lng</th>
                <th style={thStyleCenter}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map(branch => (
                <tr
                  key={branch.id}
                  style={{
                    borderBottom: "1px solid rgba(94,82,64,0.10)",
                    background: "#FFFFFE"
                  }}
                >
                  <td style={tdStyle}>{branch.name}</td>
                  <td style={{ ...tdStyle, maxWidth: 320, whiteSpace: "pre-line", overflowWrap: "break-word" }}>
                    <span style={{ fontSize: 15 }}>{branch.address}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      display: "inline-block",
                      minWidth: 68,
                      padding: "5px 20px 5px 20px",
                      borderRadius: "24px",
                      color: "#FFF",
                      fontWeight: 700,
                      fontSize: 15,
                      textAlign: "center",
                      background:
                        branch.status === "active" ? "#21808D"
                          : branch.status === "maintenance" ? "#626C71"
                            : "linear-gradient(135deg, #E68161 0%, #D97350 100%)"
                    }}>
                      {BRANCH_STATUS[branch.status]?.label || branch.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center", color: "#21808D", fontWeight: 700 }}>
                    {branch.latitude},<br />{branch.longitude}
                  </td>
                  <td style={{
                    ...tdStyle,
                    textAlign: "center",
                    padding: "8px 0",
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px"
                    }}>
                      <button
                        onClick={() => handleEdit(branch)}
                        style={actionBtn("primary")}>✏️</button>
                      <button
                        onClick={() => handleDelete(branch.id)}
                        style={actionBtn("danger")}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {branches.length === 0 && (
          <div style={{ color: "#626C71", textAlign: "center", margin: "36px 0 10px", fontSize: 17 }}>
            No branches added yet.
          </div>
        )}
      </div>
      {showModal && (
        <BranchModal
          branch={editing ? {
            id: editing.id.toString(),
            name: editing.name,
            address: editing.address,
            status: editing.status,
            latitude: editing.latitude ?? "",
            longitude: editing.longitude ?? "",
          } : null}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// --- Styles
const thStyle: React.CSSProperties = {
  color: "#134252",
  borderBottom: "1.5px solid rgba(94,82,64,0.13)",
  fontWeight: 700,
  fontSize: 15,
  textAlign: "left",
  padding: "9px 10px 8px 0"
};
const thStyleCenter: React.CSSProperties = {
  ...thStyle, textAlign: "center"
};
const tdStyle: React.CSSProperties = {
  color: "#134252",
  fontSize: 15,
  fontWeight: 500,
  padding: "10px 7px",
  background: "#FFFFFE",
  textAlign: 'left',
  verticalAlign: 'middle',
};

function actionBtn(type: "primary" | "danger"): React.CSSProperties {
  if (type === "danger") {
    return {
      border: "none",
      background: "#C0152F",
      color: "#FFF",
      padding: "7px 14px",
      borderRadius: 8,
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center"
    };
  }
  return {
    border: "none",
    background: "#21808D",
    color: "#FFF",
    padding: "7px 14px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center"
  };
}
