import React, { useState } from 'react';

export default function AttendanceTable() {
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const dummyData = [
    { id: 1, name: "Rajesh Kumar", date: "2025-10-26", status: "Present" },
    { id: 2, name: "Neha Singh", date: "2025-10-26", status: "Absent" },
    { id: 3, name: "Amit Sharma", date: "2025-10-26", status: "Late" },
  ];
  
  const filtered = dummyData.filter(att => 
    (!dateFilter || att.date === dateFilter) &&
    (!statusFilter || att.status === statusFilter)
  );

  return (
    <div>
      <h3 style={sectionHeader}>Attendance Tracking</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          style={inputStyle}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={inputStyle}>
          <option value="">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Employee</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(row => (
            <tr key={row.id}>
              <td style={tdStyle}>{row.name}</td>
              <td style={tdStyle}>{row.date}</td>
              <td style={{ ...tdStyle, color: row.status === "Absent" ? "#C0152F" : row.status === "Late" ? "#E68161" : "#21808D" }}>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const sectionHeader = { fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#134252" };
const inputStyle = { padding: "10px", fontSize: 15, borderRadius: 8, border: "1px solid #D1D5DB", minWidth: 140 };
const tableStyle = { width: "100%", borderCollapse: "collapse" as const, background: "#FFFFFE" };
const thStyle = { textAlign: "left" as const, padding: 10, borderBottom: "1px solid rgba(94,82,64,0.2)", color: "#134252" };
const tdStyle = { padding: 10, borderBottom: "1px solid rgba(94,82,64,0.12)", fontSize: 15, color: "#134252" };
