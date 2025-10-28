import React, { useState } from 'react';

export default function NewBooking() {
  return (
    <div style={{ maxWidth: '1280px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#134252', marginBottom: '24px' }}>
        New Booking
      </h2>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '48px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#134252', marginBottom: '8px' }}>
          Booking Feature Coming Soon
        </h3>
        <p style={{ color: '#626C71' }}>
          Database integration will be added in next phase
        </p>
      </div>
    </div>
  );
}
