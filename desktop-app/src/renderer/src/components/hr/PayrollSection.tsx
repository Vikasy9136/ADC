import React from 'react';

export default function PayrollSection() {
  const payrolls = [
    { id: 1, employee: "Rajesh Kumar", month: "Sep 2025", amount: 25000, status: "Paid" }
  ];
  
  return (
    <div>
      <h3 style={sectionHeader}>Payroll Management</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Employee</th>
            <th style={thStyle}>Month</th>
            <th style={thStyle}>Amount (₹)</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map(pay => (
            <tr key={pay.id}>
              <td style={tdStyle}>{pay.employee}</td>
              <td style={tdStyle}>{pay.month}</td>
              <td style={tdStyle}>{pay.amount}</td>
              <td style={tdStyle}>{pay.status}</td>
              <td style={tdStyle}>
                <button style={buttonDetails}>Details</button>
                <button style={buttonDownload}>Download</button>
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
const buttonDetails = {
  padding: '6px 14px', background: '#32B8C6', color: 'white', borderRadius: 8, border: 'none', marginRight: 8, cursor: 'pointer'
};
const buttonDownload = {
  padding: '6px 14px', background: '#21808D', color: 'white', borderRadius: 8, border: 'none', cursor: 'pointer'
};
