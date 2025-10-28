import React, { useState } from "react";

// Type for employee objects
export interface Employee {
  id: string | number;
  name: string;
  role?: string;
  status?: string;
  joined_at?: string;
  relieved_at?: string;
  experience?: string | number;
  resignation_requested?: boolean;
  // Add fields if needed for your table
}

// Props shape
interface EmployeeDirectoryProps {
  data?: Employee[];
  onGenerateLetter: (emp: Employee, type: "offer" | "joining") => void;
  onResignationAction: (emp: Employee) => void;
}

export default function EmployeeDirectory({
  data = [],
  onGenerateLetter,
  onResignationAction,
}: EmployeeDirectoryProps) {
  const [tab, setTab] = useState<"directory" | "resign">("directory");
  const resignations = data.filter(emp => !!emp.resignation_requested);

  return (
    <div style={{ marginTop: 30 }}>
      {/* Tab Header */}
      <div style={{ display: "flex", gap: 18, marginBottom: 18, marginLeft: 10 }}>
        <button
          onClick={() => setTab("directory")}
          style={{
            background: tab === "directory" ? "#21808D" : "#F8F9FA",
            color: tab === "directory" ? "#fff" : "#21808D",
            border: "none",
            borderRadius: 9,
            fontWeight: 700,
            padding: "10px 28px",
            boxShadow: tab === "directory" ? "0 2px 8px rgba(33,128,141,0.05)" : "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Employees
        </button>
        <button
          onClick={() => setTab("resign")}
          style={{
            background: tab === "resign" ? "#C0152F" : "#F8F9FA",
            color: tab === "resign" ? "#fff" : "#C0152F",
            border: "none",
            borderRadius: 9,
            fontWeight: 700,
            padding: "10px 28px",
            fontSize: 16,
            position: "relative",
            animation: resignations.length && tab !== "resign" ? "blink .95s linear infinite" : "none",
          }}
        >
          Resignation Requests {resignations.length > 0 ? `(${resignations.length})` : ""}
        </button>
      </div>
      <div
        style={{
          background: "#FFF",
          borderRadius: 14,
          boxShadow: "0 2px 12px 0 rgba(33,128,141,0.07)",
          padding: "15px 0 10px",
          border: "1px solid #F2F2F2",
          minWidth: 700,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: "#134252",
            margin: "0 0 14px 28px",
          }}
        >
          {tab === "directory"
            ? "Employee Directory"
            : "Pending Resignation Requests"}
        </div>
        <div style={{ overflowX: "auto" }}>
          {/* Modern Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              background: "#FFF",
            }}
          >
            <thead>
              <tr style={{ background: "#F8F9FA" }}>
                <th style={th}>Name</th>
                <th style={th}>Role</th>
                <th style={th}>Status</th>
                <th style={th}>Joining</th>
                <th style={th}>Relieved?</th>
                <th style={th}>Experience</th>
                <th style={thLast}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(tab === "directory" ? data : resignations).map((emp, idx) => (
                <tr
                  key={emp.id || idx}
                  style={{
                    background: idx % 2 === 0 ? "#FFF" : "#F8F9FA",
                    ...(tab === "resign"
                      ? { animation: "blink 1s linear infinite" }
                      : {}),
                  }}
                >
                  <td style={td}>
                    <span style={nameStrong}>{emp.name}</span>
                  </td>
                  <td style={td}>
                    <span style={rolePill}>
                      {emp.role
                        ? emp.role.charAt(0).toUpperCase() + emp.role.slice(1)
                        : "Staff"}
                    </span>
                  </td>
                  <td style={td}>
                    <span
                      style={{
                        color: emp.status === "active" ? "#21808D" : "#C0152F",
                        background:
                          emp.status === "active" ? "#E0F6F8" : "#F8D9DD",
                        padding: "5px 16px",
                        borderRadius: 14,
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      {emp.status
                        ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1)
                        : ""}
                    </span>
                  </td>
                  <td style={td}>{emp.joined_at?.slice(0, 10)}</td>
                  <td style={td}>{emp.relieved_at ? "Yes" : "No"}</td>
                  <td style={td}>{emp.experience ?? "--"}</td>
                  <td style={tdActions}>
                    {tab === "directory" && (
                      <>
                        <button
                          style={actionBtn("#32B8C6")}
                          onClick={() => onGenerateLetter(emp, "offer")}
                        >
                          Offer Letter
                        </button>
                        <button
                          style={actionBtn("#21808D")}
                          onClick={() => onGenerateLetter(emp, "joining")}
                        >
                          Joining Letter
                        </button>
                      </>
                    )}
                    {tab === "resign" && (
                      <button
                        style={actionBtn("#C0152F")}
                        onClick={() => onResignationAction(emp)}
                      >
                        Accept & Generate Resignation
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {((tab === "directory" ? data : resignations).length === 0) && (
                <tr>
                  <td colSpan={7} style={tdNoData}>
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Blinking animation for resignation tab */}
      <style>{`
        @keyframes blink {
          50% { background: #F8D9DD !important; }
        }
      `}</style>
    </div>
  );
}

// Styles
const th: React.CSSProperties = {
  color: "#134252",
  fontWeight: 800,
  fontSize: 16,
  textAlign: "left",
  padding: "10px 11px",
  borderBottom: "2px solid #F0F9FF",
  background: "#F8F9FA"
};
const thLast = { ...th, textAlign: "center" as const };
const nameStrong: React.CSSProperties = { fontWeight: 700, color: "#134252", fontSize: 16 };
const rolePill = {
  display: 'inline-block', background: "#E0F6F8", color: "#21808D",
  borderRadius: 11, padding: "5px 13px", fontWeight: 700, fontSize: 14
};
const td: React.CSSProperties = {
  color: "#134252",
  fontWeight: 500,
  fontSize: 15,
  padding: "12px 11px",
  borderBottom: "1px solid #F0F9FF",
  background: "inherit"
};
const tdActions = { ...td, textAlign: "center" as const, minWidth: 220 };
const tdNoData = {
  color: "#7A8A97", textAlign: "center" as const, fontSize: 17,
  padding: "33px 0", background: "#FFF"
};
const actionBtn = (color: string) => ({
  background: color,
  color: "#FFF",
  border: "none",
  borderRadius: 7,
  padding: "6px 15px",
  fontSize: 14,
  fontWeight: 700,
  margin: "0 4px",
  cursor: "pointer",
  transition: "background 0.2s"
});
