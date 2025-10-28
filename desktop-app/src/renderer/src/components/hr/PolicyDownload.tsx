import React from 'react';
export default function PolicyDownload() {
  const files = [
    { id: 1, name: "Employee Handbook.pdf", url: "/files/handbook.pdf" }
  ];
  return (
    <div>
      <h3 style={sectionHeader}>HR Policies & Documents</h3>
      <ul>
        {files.map(file => (
          <li key={file.id} style={{ marginBottom: 12 }}>
            <a href={file.url} download style={{ color: "#21808D", fontWeight: 600 }}>
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const sectionHeader = { fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#134252" };
