import React, { useState, useEffect } from 'react';

export default function AllBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // For now, use dummy data since DB not connected
    setLoading(false);
    setBookings([]);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#134252' }}>All Bookings</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p style={{ color: '#626C71' }}>No bookings yet. Database will be connected later.</p>
      </div>
    </div>
  );
}
