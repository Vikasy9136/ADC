import React from "react";

const StaffHeader: React.FC<{
  notifications: any[];
  unreadCount: number;
  profileName: string;
  profileDropdownOpen: boolean;
  setProfileDropdownOpen: (v: boolean) => void;
  notificationOpen: boolean;
  setNotificationOpen: (v: boolean) => void;
  user: any;
  onEditProfile: () => void;
  onReset: () => void;
  onReadNotification: (id: string) => void;
}> = ({
  notifications,
  unreadCount,
  profileName,
  profileDropdownOpen,
  setProfileDropdownOpen,
  notificationOpen,
  setNotificationOpen,
  user,
  onEditProfile,
  onReset,
  onReadNotification
}) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    borderBottom: "1.5px solid #f1f7f8", background: "#fff",
    padding: "0 40px", height: 66, minHeight: 66, width: "100%", zIndex: 21
  }}>
    <div style={{ fontSize: 24, fontWeight: 800, color: "#21808D" }}>{profileName || "Staff Portal"}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setNotificationOpen(!notificationOpen)}
          style={{
            background: "#f3f3f3", borderRadius: "50%", border: "none", width: 44, height: 44,
            fontSize: 24, cursor: "pointer", boxShadow: unreadCount ? "0 0 0 3px #05966930" : undefined
          }}
        >🔔
          {unreadCount > 0 && (
            <span style={{
              position: "absolute", right: 5, top: 5, background: "#059669", color: "#fff",
              borderRadius: "50%", padding: "2.5px 7px", fontWeight: 700, fontSize: 13, minWidth: 20
            }}>{unreadCount}</span>
          )}
        </button>
        {notificationOpen && (
          <div style={{
            position: "absolute", right: 0, top: 48, background: "#fff", borderRadius: 9, minWidth: 270,
            boxShadow: "0 6px 32px #176a6480", zIndex: 99, border: "1.2px solid #eef8f8", padding: "2px 0"
          }}>
            <div style={{
              fontWeight: 700, fontSize: 16, color: "#17786A", padding: "12px 16px 6px"
            }}>Notifications</div>
            {notifications.length === 0 ? (
              <div style={{
                color: "#778", padding: "0 20px 15px", fontSize: 15
              }}>No recent appointments.</div>
            ) : (notifications.map(app => (
              <div key={app.id}
                   style={{
                     borderBottom: "1px solid #daf7f5", padding: "14px 18px 11px",
                     fontSize: 16, cursor: "pointer", opacity: app.read ? 0.5 : 1,
                     background: app.read ? "#F5F7FA" : "#fff"
                   }}
                   onClick={() => onReadNotification(app.id)}
              >
                <b>{app.patientName}</b> - New appointment<br />
                <span style={{ color: "#546", fontSize: 13 }}>ID: {app.id}</span>
              </div>
            )))}
          </div>
        )}
      </div>
      <div style={{ position: "relative" }}>
        <button
          style={{
            width: 44, height: 44, borderRadius: "50%", border: "none",
            background: "#e8fafc", fontSize: 24, color: "#21808D", cursor: "pointer"
          }}
          title="Profile"
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
        >
          👤
        </button>
        {profileDropdownOpen && (
          <div style={{
            position: "absolute", right: 0, top: 48, background: "#fff", borderRadius: 9, minWidth: 220,
            boxShadow: "0 6px 32px #176a6480", zIndex: 99, border: "1.2px solid #eef8f8", padding: "12px 0"
          }}>
            <div style={{ padding: "12px 22px", fontWeight: 700, fontSize: 16 }}>
              {user?.name || "Staff User"}
            </div>
            <div style={{
              padding: "6px 22px", cursor: "pointer", color: "#1270B8", fontWeight: 600
            }} onClick={onEditProfile}>
              Edit Profile
            </div>
            <div style={{
              padding: "6px 22px", cursor: "pointer", color: "#924DCD", fontWeight: 600
            }} onClick={onReset}>
              Reset Password
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
export default StaffHeader;
