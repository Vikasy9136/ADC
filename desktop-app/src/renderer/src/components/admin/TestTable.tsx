import React from 'react';

interface TestTableProps {
  tests: any[];
  onEdit: (test: any) => void;
  onDelete: (id: string) => void;
}

export default function TestTable({ tests, onEdit, onDelete }: TestTableProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      overflowX: 'auto',
      marginTop: '16px'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F9FAFB' }}>
            <th style={headCell}>Code</th>
            <th style={headCell}>Name</th>
            <th style={headCell}>Category</th>
            <th style={headCell}>Price</th>
            <th style={headCell}>Sample</th>
            <th style={headCell}>Department</th>
            <th style={headCell}>Status</th>
            <th style={headCell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tests.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', color: '#9CA3AF', padding: '30px 0' }}>
                No tests found.
              </td>
            </tr>
          ) : (
            tests.map(test => (
              <tr key={test.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={cell}>{test.test_code}</td>
                <td style={cell}>{test.test_name}</td>
                <td style={cell}>{test.test_category}</td>
                <td style={cell}>₹{test.price}</td>
                <td style={cell}>{test.sample_type}</td>
                <td style={cell}>{test.department}</td>
                <td style={cell}>
                  <span style={{
                    display: 'inline-block', padding: '2px 10px',
                    borderRadius: '6px', color: test.is_active ? '#059669' : '#DC2626',
                    background: test.is_active ? '#DCFCE7' : '#FEE2E2',
                    fontWeight: 500, fontSize: 13
                  }}>
                    {test.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={cell}>
                  <button onClick={() => onEdit(test)} style={actionBtn}>✏️ Edit</button>
                  <button onClick={() => onDelete(test.id)} style={{ ...actionBtn, color: '#DC2626' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const headCell: React.CSSProperties = {
  padding: '14px 12px',
  textAlign: 'left',
  color: '#134252',
  fontWeight: 800,
  fontSize: 14,
  borderBottom: '1px solid #E5E7EB'
};
const cell: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #F1F5F9',
  verticalAlign: 'middle'
};
const actionBtn: React.CSSProperties = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: '6px 10px',
  fontSize: 13,
  fontWeight: 600,
  color: '#21808D'
};
