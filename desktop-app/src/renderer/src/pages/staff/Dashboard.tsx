import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import AppointmentPopover from "../../components/staff/AppointmentPopover";
import StaffHeader from "../../components/staff/StaffHeader";

const sidebarItems = [
  { label: "Dashboard", key: "dashboard", icon: "🏠" },
  { label: "Reporting", key: "reporting", icon: "📄" },
  { label: "Appointment History", key: "history", icon: "🕑" },
  { label: "Profile", key: "profile", icon: "👤" }
];

const statusOptions = [
  "Booked", "Confirmed", "Sample Received", "In Process", "In Reporting", "Completed"
];

const StaffDashboard: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const [selectedSidebar, setSelectedSidebar] = useState("dashboard");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activePopover, setActivePopover] = useState<string | null>(null);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);

  // Fetch appointments from Supabase on load/refresh
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });
      setAppointments(data || []);
      setNotifications((data || []).filter((a: any) => a.status === "Booked"));
    };
    fetchAppointments();
    // Optionally: poll or subscribe (use Supabase real-time) for live updates
  }, []);

  // Outside click for dropdowns (notification/profile)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Handle notification click (remove from notifications, mark as read in backend)
  const handleReadNotification = async (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    await supabase
      .from("appointments")
      .update({ read: true })
      .eq("id", id);
    setNotificationOpen(false);
  };

  // Reset Password handler (real with Supabase)
  const handleResetPassword = async () => {
    if (user?.email) {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (!error) {
        alert("Password reset email sent!");
      } else {
        alert("Reset failed: " + error.message);
      }
    }
  };

  // For unread badge
  const unreadCount = notifications.length;

  return (
    <>
      <div ref={headerRef}>
        <StaffHeader
          notifications={notifications}
          unreadCount={unreadCount}
          profileName={user?.branchName || "Branch Staff"}
          profileDropdownOpen={profileDropdownOpen}
          setProfileDropdownOpen={setProfileDropdownOpen}
          notificationOpen={notificationOpen}
          setNotificationOpen={setNotificationOpen}
          user={user}
          onEditProfile={() => setSelectedSidebar("profile")}
          onReset={handleResetPassword}
          onReadNotification={handleReadNotification}
        />
      </div>

      <div style={{ display: "flex", minHeight: "100vh", background: "#F7F9F9" }}>
        <aside style={{
          width: 240, background: "#fff", padding: "32px 0 0", borderRight: "1.5px solid #E6ECF0",
          boxShadow: "2px 0 12px #21413e07"
        }}>
          {sidebarItems.map(item => (
            <div
              key={item.key}
              style={{
                padding: "13px 26px", fontWeight: 600, fontSize: 17, color: selectedSidebar === item.key ? "#21808D" : "#567",
                background: selectedSidebar === item.key ? "#EBFEFD" : "none", cursor: "pointer",
                display: "flex", alignItems: "center", borderLeft: selectedSidebar === item.key ? "4px solid #21808D" : "4px solid transparent"
              }}
              onClick={() => setSelectedSidebar(item.key)}
            >
              <span style={{ fontSize: 20, marginRight: 10 }}>{item.icon}</span>{item.label}
            </div>
          ))}
          <button
            onClick={onLogout}
            style={{
              margin: "34px 20px 0", background: "#134252", color: "#fff", border: "none",
              borderRadius: 7, width: "calc(100% - 40px)", padding: "12px", fontWeight: 600, fontSize: 16, cursor: "pointer"
            }}
          >Logout</button>
        </aside>

        <main style={{ flex: 1, padding: "38px 38px 0", minWidth: 0 }}>
          {selectedSidebar === "dashboard" && (
            <>
              <div style={{ fontWeight: 800, fontSize: 29, color: "#1d2a39", marginBottom: 5 }}>
                All Appointments
              </div>
              <div style={{ color: "#626972", marginBottom: 20, fontSize: 17 }}>
                View, manage, and update appointments and perform branch operations.
              </div>
              <button style={{
                background: "#059669", color: "#fff", borderRadius: 7, fontWeight: 700, fontSize: 16,
                border: "none", padding: "12px 26px", marginBottom: 30, cursor: "pointer", float: "right"
              }}>
                + Quick Patient Entry
              </button>
              <div style={{ clear: "both" }}></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(365px, 1fr))", gap: 24 }}>
                {appointments.map(app => (
                  <div key={app.id} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 20, position: "relative" }}>
                    <div style={{
                      fontWeight: 600, fontSize: 17, display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <div>
                        <span style={{
                          padding: "3px 13px", background: "#21808D", color: "#fff", borderRadius: 6, fontWeight: 700, marginRight: 10, fontSize: 15
                        }}>{app.id} {app.group && <span style={{
                          background: "#E6FFFB", color: "#059669", marginLeft: 7, padding: "2px 9px", fontSize: 13, borderRadius: 5
                        }}>Family</span>}</span>
                        <span>{app.patientName}</span>
                      </div>
                      <button
                        style={{ background: "#f1f5f9", color: "#21808D", border: "none", borderRadius: 6, padding: "4px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                        onClick={() => setActivePopover(app.id)}
                      >Details</button>
                    </div>
                    <div style={{ marginTop: 11, fontSize: 15, color: "#526" }}>
                      Status:{" "}
                      <select
                        value={app.status}
                        style={{ fontWeight: 600, borderRadius: 4, border: "1.2px solid #aadbe5", padding: "2px 7px", marginRight: 7 }}
                        onChange={async e => {
                          const updatedStatus = e.target.value;
                          await supabase.from("appointments").update({ status: updatedStatus }).eq("id", app.id);
                          setAppointments(apps => apps.map(a => a.id === app.id ? { ...a, status: updatedStatus } : a));
                        }}
                      >
                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    {activePopover === app.id && (
                      <AppointmentPopover
                        appointment={app}
                        onClose={() => setActivePopover(null)}
                        onDeleteTest={async (testIdx) => {
                          // handle backend test delete here
                        }}
                        onAddTest={() => { /* Implement add logic */ }}
                        onAssignPhlebo={async (phlebo) => {
                          await supabase.from("appointments").update({ assignedPhlebo: phlebo }).eq("id", app.id);
                          setAppointments(apps => apps.map(a => a.id === app.id ? { ...a, assignedPhlebo: phlebo } : a));
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {selectedSidebar !== "dashboard" && (
            <div style={{
              color: "#719", fontSize: 22, marginTop: 45, textAlign: "center", fontWeight: 600
            }}>
              This section will be implemented soon: {sidebarItems.find(i => i.key === selectedSidebar)?.label}
            </div>
          )}
        </main>
      </div>
    </>
  );
};
export default StaffDashboard;
