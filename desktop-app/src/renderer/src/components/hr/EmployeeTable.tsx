import React from "react";

// Employee item type
export interface Employee {
  id: string | number;
  name: string;
  role?: string;
  designation?: string;
  phone?: string;
  email?: string;
  salary?: number;
  status?: string;
  joined_at?: string;
  // add more fields if needed
}

// Props shape
interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string | number) => void;
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
          <th style={{ padding: "14px 12px" }}>PHOTO</th>
          <th>NAME</th>
          <th>ROLE</th>
          <th>DESIGNATION</th>
          <th>PHONE</th>
          <th>EMAIL</th>
          <th>SALARY</th>
          <th>STATUS</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id} style={{ background: "#fff", borderBottom: "1px solid #F1F1F3" }}>
            <td>
              <img src="/avatar-placeholder.png" style={{ width: 38, borderRadius: "50%" }} alt="dp" />
            </td>
            <td>
              <div style={{ fontWeight: 700 }}>{emp.name}</div>
              <div style={{ fontSize: 13, color: "#6C7A95" }}>Joined: {emp.joined_at?.slice(0, 10)}</div>
            </td>
            <td>
              <span style={{
                background: "#E6F0FB", color: "#636C85", borderRadius: 15, padding: "4px 18px", fontWeight: 600
              }}>
                {emp.role ? emp.role.charAt(0).toUpperCase() + emp.role.slice(1) : "—"}
              </span>
            </td>
            <td>{emp.designation || "—"}</td>
            <td>{emp.phone || "—"}</td>
            <td>{emp.email || "—"}</td>
            <td>₹{emp.salary?.toLocaleString() ?? "—"}</td>
            <td>
              <span style={{
                background: emp.status === "Active" ? "#C0FCCE" : "#FEE2E2",
                color: emp.status === "Active" ? "#16A34A" : "#C0152F",
                borderRadius: 13, padding: "4.5px 20px", fontWeight: 600
              }}>
                {emp.status || "Inactive"}
              </span>
            </td>
            <td>
              <button
                onClick={() => onEdit(emp)}
                style={{
                  border: "none",
                  background: "#E9F6FF",
                  color: "#21808D",
                  borderRadius: 7,
                  padding: "8px"
                }}
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(emp.id)}
                style={{
                  marginLeft: 8,
                  border: "none",
                  background: "#FFF0F0",
                  color: "#D83234",
                  borderRadius: 7,
                  padding: "8px"
                }}
              >
                🗑
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
