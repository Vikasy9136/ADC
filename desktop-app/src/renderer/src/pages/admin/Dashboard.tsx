import React, { useEffect, useState } from 'react';
import StaffManagement from './StaffManagement';
import TestManagement from './TestManagement';
import FrontendSettings from './FrontendSettings';
import PayrollManagement from './PayrollManagementPage';
import BranchManagement from './BranchManagement';
import HRManagement from './HRManagement';
import BillTemplateManage from './BillTemplateManage';

// Import icons (we'll use emoji for simplicity)
const menuItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
  { id: 'staff', icon: '👥', label: 'Manage Staff/Phlebo', badge: null },
  { id: 'tests', icon: '🧪', label: 'Test Management', badge: null },
  { id: 'packages', icon: '📦', label: 'Packages/Offers', badge: null },
  { id: 'frontend', icon: '🎨', label: 'Frontend Settings', badge: null },
  { id: 'payroll', icon: '💰', label: 'Payroll Management', badge: null },
  { id: 'attendance', icon: '📅', label: 'Attendance', badge: null },
  { id: 'payments', icon: '💳', label: 'Payment System', badge: null },
  { id: 'patients', icon: '🏥', label: 'Patient Management', badge: null },
  { id: 'branches', icon: '🏢', label: 'Branch Management', badge: null },
  { id: 'hr', icon: '📋', label: 'HR Management', badge: null },
  { id: 'bill-template', icon: '🧾', label: 'Bill Templates', badge: null },
  { id: 'report-template', icon: '📄', label: 'Report Templates', badge: null },
  { id: 'lab-incharge', icon: '👨‍🔬', label: 'Lab Incharge', badge: null },
  { id: 'doctors', icon: '👨‍⚕️', label: 'Pathology Doctors', badge: null },
  { id: 'settings', icon: '⚙️', label: 'Settings', badge: null },
];

interface AdminDashboardProps {
  user: any; // or your user shape
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FCFCF9' }}>
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <Header user={user} onLogout={onLogout} />

        {/* Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <ContentArea activeMenu={activeMenu} />
        </main>
      </div>
    </div>
  );
}


// Sidebar Component
function Sidebar({ activeMenu, onMenuClick }: any) {
  return (
    <div style={{
      width: '280px', background: 'white', borderRight: '1px solid #E5E7EB',
      display: 'flex', flexDirection: 'column', overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>🏥</div>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#134252', textAlign: 'center', margin: 0 }}>
          Ashwani Diagnostic
        </h2>
        <p style={{ fontSize: '12px', color: '#626C71', textAlign: 'center', margin: '4px 0 0 0' }}>
          Admin Panel
        </p>
      </div>

      {/* Menu Items */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuClick(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '4px',
              border: 'none',
              borderRadius: '8px',
              background: activeMenu === item.id ? '#21808D' : 'transparent',
              color: activeMenu === item.id ? 'white' : '#626C71',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeMenu === item.id ? '600' : '500',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== item.id) {
                e.currentTarget.style.background = '#F3F4F6';
              }
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== item.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{
                background: '#EF4444',
                color: 'white',
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: '600'
              }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

// Header Component
function Header({ user, onLogout }: any) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check status every 2 seconds
    const interval = setInterval(() => {
      setIsOnline(navigator.onLine);
    }, 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);


  return (
    <header style={{
      height: '64px',
      background: 'white',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#134252', margin: 0 }}>
          Welcome, {user.name}
        </h1>
        <p style={{ fontSize: '13px', color: '#626C71', margin: '2px 0 0 0' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Dynamic Online/Offline Badge */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '8px 12px', 
          background: isOnline ? '#DCFCE7' : '#FEE2E2', 
          borderRadius: '8px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            background: isOnline ? '#10B981' : '#EF4444', 
            borderRadius: '50%',
            animation: isOnline ? 'pulse 2s infinite' : 'none'
          }}></div>
          <span style={{ 
            fontSize: '13px', 
            color: isOnline ? '#059669' : '#DC2626', 
            fontWeight: '500' 
          }}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            background: '#FEE2E2',
            color: '#DC2626',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

// Content Area - Routes to different pages
function ContentArea({ activeMenu }: { activeMenu: string }) {
  const pages: any = {
    'dashboard': <DashboardPage />,
    'staff': <StaffManagement />,
    'tests': <TestManagement />,
    'packages': <PackageManagementPage />,
    'frontend': <FrontendSettings />,
    'payroll': <PayrollManagement />,
    'attendance': <AttendancePage />,
    'settings': <SettingsPage />,
    'payments': <PaymentSystemPage />,
    'patients': <PatientManagementPage />,
    'branches': <BranchManagement />,
    'hr': <HRManagement />,
    'bill-template': <BillTemplateManage />,
    'report-template': <ReportTemplatePage />,
    'lab-incharge': <LabInchargePage />,
    'doctors': <DoctorsPage />,
  };

  return pages[activeMenu] || <DashboardPage />;
}

// ============================================
// PAGE COMPONENTS (Placeholders - will implement each)
// ============================================

function DashboardPage() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#134252', marginBottom: '24px' }}>
        Dashboard Overview
      </h2>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <StatCard icon="👥" title="Total Staff" value="24" change="+3" />
        <StatCard icon="🧪" title="Tests Today" value="156" change="+12%" />
        <StatCard icon="💰" title="Revenue Today" value="₹45,230" change="+8%" />
        <StatCard icon="📋" title="Pending Reports" value="12" change="-5" />
      </div>

      {/* Charts Placeholder */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <ChartPlaceholder title="Revenue Trends (Last 7 Days)" />
        <ChartPlaceholder title="Test Distribution" />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, change }: any) {
  const isPositive = change.startsWith('+');
  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #E5E7EB'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <p style={{ fontSize: '13px', color: '#626C71', margin: '0 0 4px 0' }}>{title}</p>
      <p style={{ fontSize: '28px', fontWeight: '700', color: '#134252', margin: '0 0 8px 0' }}>{value}</p>
      <span style={{
        fontSize: '12px',
        color: isPositive ? '#059669' : '#DC2626',
        background: isPositive ? '#DCFCE7' : '#FEE2E2',
        padding: '4px 8px',
        borderRadius: '6px',
        fontWeight: '500'
      }}>
        {change}
      </span>
    </div>
  );
}

function ChartPlaceholder({ title }: { title: string }) {
  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      minHeight: '300px'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#134252', marginBottom: '16px' }}>{title}</h3>
      <div style={{
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9FAFB',
        borderRadius: '8px',
        color: '#9CA3AF'
      }}>
        Chart visualization will appear here
      </div>
    </div>
  );
}

function StaffManagementPage() {
  return <PagePlaceholder title="Manage Staff/Phlebotomist" description="Add, edit, delete staff with profile photos" />;
}

function TestManagementPage() {
  return <PagePlaceholder title="Test Management" description="Manage all diagnostic tests" />;
}

function PackageManagementPage() {
  return <PagePlaceholder title="Packages & Offers" description="Create and manage test packages" />;
}

function FrontendSettingsPage() {
  return <PagePlaceholder title="Frontend Management" description="Customize website appearance, colors, fonts, logo" />;
}

function PayrollPage() {
  return <PagePlaceholder title="Payroll Management" description="Manage staff salaries and payments" />;
}

function AttendancePage() {
  return <PagePlaceholder title="Attendance Management" description="View staff attendance records" />;
}

function SettingsPage() {
  return <PagePlaceholder title="Settings" description="Email SMTP, SMS Notifications, System Settings" />;
}

function PaymentSystemPage() {
  return <PagePlaceholder title="Payment System" description="Configure payment gateways and methods" />;
}

function PatientManagementPage() {
  return <PagePlaceholder title="Patient Management" description="View, edit, delete patient records" />;
}

function BranchManagementPage() {
  return <PagePlaceholder title="Branch Management" description="Manage multiple branches with map" />;
}

function HRManagementPage() {
  return <PagePlaceholder title="HR Management" description="Offer letters, joining dates, promotions" />;
}

function BillTemplatePage() {
  return <PagePlaceholder title="Bill Template Management" description="Create and manage billing templates" />;
}

function ReportTemplatePage() {
  return <PagePlaceholder title="Report Template Management" description="Create and manage report templates" />;
}

function LabInchargePage() {
  return <PagePlaceholder title="Lab Incharge Management" description="Manage lab incharge details and signatures" />;
}

function DoctorsPage() {
  return <PagePlaceholder title="Pathology Doctors" description="Manage pathology doctors and signatures" />;
}

function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#134252', marginBottom: '8px' }}>{title}</h2>
      <p style={{ fontSize: '14px', color: '#626C71', marginBottom: '24px' }}>{description}</p>
      
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#134252', marginBottom: '8px' }}>
          Coming Soon
        </h3>
        <p style={{ fontSize: '14px', color: '#626C71' }}>
          This feature will be implemented next
        </p>
      </div>
    </div>
  );
}
