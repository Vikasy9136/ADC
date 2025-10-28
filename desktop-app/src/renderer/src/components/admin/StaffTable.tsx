import React from 'react';

interface StaffTableProps {
  staff: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export default function StaffTable({ staff, onEdit, onDelete }: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        padding: '48px',
        textAlign: 'center',
        color: '#9CA3AF'
      }}>
        No staff members found
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      overflow: 'hidden'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <th style={tableHeaderStyle}>Photo</th>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Role</th>
            <th style={tableHeaderStyle}>Designation</th>
            <th style={tableHeaderStyle}>Phone</th>
            <th style={tableHeaderStyle}>Email</th>
            <th style={tableHeaderStyle}>Salary</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={tableCellStyle}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {item.photo}
                </div>
              </td>
              <td style={tableCellStyle}>
                <div style={{ fontWeight: '600', color: '#134252' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Joined: {item.joined_at}</div>
              </td>
              <td style={tableCellStyle}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: item.role === 'staff' ? '#DBEAFE' : '#E9D5FF',
                  color: item.role === 'staff' ? '#1E40AF' : '#6B21A8'
                }}>
                  {item.role === 'staff' ? 'Staff' : 'Phlebotomist'}
                </span>
              </td>
              <td style={tableCellStyle}>{item.designation}</td>
              <td style={tableCellStyle}>{item.phone}</td>
              <td style={tableCellStyle}>{item.email}</td>
              <td style={tableCellStyle}>₹{item.salary.toLocaleString()}</td>
              <td style={tableCellStyle}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: item.status === 'active' ? '#DCFCE7' : '#FEE2E2',
                  color: item.status === 'active' ? '#059669' : '#DC2626'
                }}>
                  {item.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={tableCellStyle}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onEdit(item)}
                    style={actionButtonStyle('#3B82F6')}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    style={actionButtonStyle('#EF4444')}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '600',
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tableCellStyle: React.CSSProperties = {
  padding: '16px',
  fontSize: '14px',
  color: '#374151'
};

const actionButtonStyle = (color: string): React.CSSProperties => ({
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  background: color + '20',
  cursor: 'pointer',
  fontSize: '14px'
});
