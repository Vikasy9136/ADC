import React from 'react';

interface StatBoxProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

export default function StatBox({ icon, label, value, color }: StatBoxProps) {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        background: color + '20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#626C71', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#134252' }}>{value}</div>
      </div>
    </div>
  );
}
