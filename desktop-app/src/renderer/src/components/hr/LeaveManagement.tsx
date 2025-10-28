import React, { useState } from 'react';

export default function LeaveManagement() {
  const [pendingLeaves] = useState([
    { id: 1001, employee: "Rajesh Kumar", type: "Sick Leave", days: 2, status: "Pending" },
  ]);
  
  return (
    <div>
      <h3 style={sectionHeader}>Leave Management</h3>
      {pendingLeaves.length === 0 && <p>No pending leave requests</p>}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Employee</th>
            <th style={thStyle}>Leave Type</th>
            <th style={thStyle}>Days</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingLeaves.map(leave => (
            <tr key={leave.id}>
              <td style={tdStyle}>{leave.employee}</td>
              <td style={tdStyle}>{leave.type}</td>
              <td style={tdStyle}>{leave.days}</td>
              <td style={{ ...tdStyle, color: leave.status === "Pending" ? "#E68161" : "#21808D" }}>{leave.status}</td>
              <td style={tdStyle}>
                <button style={buttonApprove}>Approve</button>
                <button style={buttonReject}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const sectionHeader = { fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#134252" };
const tableStyle = { width: "100%", borderCollapse: "collapse" as const, background: "#FFFFFE" };
const thStyle = { textAlign: 'left' as const, padding: 10, borderBottom: "1px solid rgba(94,82,64,0.2)", color: "#134252" };
const tdStyle = { padding: 10, borderBottom: "1px solid rgba(94,82,64,0.12)", fontSize: 15, color: "#134252" };
const buttonApprove = {
  padding: '6px 14px', background: '#21808D', color: 'white', borderRadius: 8, border: 'none', marginRight: 8, cursor: 'pointer'
};
const buttonReject = {
  padding: '6px 14px', background: '#C0152F', color: 'white', borderRadius: 8, border: 'none', cursor: 'pointer'
};
