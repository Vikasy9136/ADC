import React from 'react';

interface SidebarProps {
  role: 'admin' | 'staff';
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ role, activePage, onPageChange }: SidebarProps) {
  const adminMenu = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'User Management' },
    { id: 'tests', icon: '🧪', label: 'Test Management' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const staffMenu = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'patient-registration', icon: '👤', label: 'Register Patient' },
    { id: 'booking', icon: '📝', label: 'New Booking' },
    { id: 'bookings', icon: '📋', label: 'All Bookings' },
    { id: 'samples', icon: '🧬', label: 'Sample Management' },
    { id: 'billing', icon: '💰', label: 'Billing' },
    { id: 'reports', icon: '📄', label: 'Reports' },
  ];

  const menu = role === 'admin' ? adminMenu : staffMenu;

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="text-3xl mb-2">🏥</div>
        <h2 className="text-lg font-bold text-text">Ashwani Diagnostic</h2>
        <p className="text-xs text-text-secondary capitalize">{role} Portal</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
              activePage === item.id
                ? 'bg-primary text-white'
                : 'text-text hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
