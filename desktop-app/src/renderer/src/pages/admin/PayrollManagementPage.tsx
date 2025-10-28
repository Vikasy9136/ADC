import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import SalaryTransferForm from "../../components/admin/SalaryTransferForm";
import SalarySlipActions from "../../components/admin/SalarySlipActions";
import { printSalarySlip, generateSalarySlipPDF } from "../../components/admin/SalarySlipPrint";



export default function PayrollManagementPage() {
  const [people, setPeople] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [salarySlips, setSalarySlips] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [shareModal, setShareModal] = useState<{ open: boolean; email: string; pdfUrl: string; slip: any } | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
    fetchPeople();
    if (navigator.onLine) fetchSalarySlips();
    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  useEffect(() => {
    if (!selected && isOnline) fetchSalarySlips();
  }, [selected, isOnline]);

  const fetchPeople = async () => {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .in("role", ["staff", "phlebotomist"]);
    if (error) {
      setMessage("Error fetching staff: " + error.message);
      setPeople([]);
    } else {
      setPeople(data || []);
    }
    setLoading(false);
  };

  const fetchSalarySlips = async () => {
    if (!navigator.onLine) {
      setSalarySlips([]);
      return;
    }
    const { data, error } = await supabase
      .from("salary_payments")
      .select("*")
      .order("payment_date", { ascending: false })
      .limit(20);
    if (error) {
      setSalarySlips([]);
      setMessage("Error fetching salary slips: " + error.message);
    } else {
      setSalarySlips(data || []);
    }
  };

  const handleSendPayment = async (paymentData: any) => {
    setMessage("");
    if (!isOnline) {
      alert("Please connect to the internet to use this feature.");
      return;
    }
    if (!selected?.id || selected.id === "NULL") {
      setMessage("Error: Staff data missing or ID is invalid!");
      return;
    }
    const found = people.find((p) => p.id === selected.id);
    const slip = {
      staff_id: selected.id,
      staff_name: selected.name,
      staff_email: found?.email || "",
      role: selected.role,
      salary_paid: paymentData.salary,
      bonus_percent: paymentData.bonusPercent,
      bonus_amount: paymentData.bonusAmount,
      payment_mode: paymentData.paymentMode,
      payment_month: paymentData.paymentMonth,
      total_amount: paymentData.totalAmount,
      payment_date: new Date().toISOString(),
      pdf_url: null  // Not uploaded until send action
    };
    const { error } = await supabase.from("salary_payments").insert([slip]);
    if (error) {
      setMessage("Error saving salary slip: " + error.message);
    } else {
      setMessage("Payment successful and slip generated!");
    }
    if (isOnline) await fetchSalarySlips();
    setSelected(null);
  };

  const filtered = people.filter(
    (person) =>
      (filterRole === "all" || person.role === filterRole) &&
      (person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.phone?.includes(searchTerm))
  );

  // --- Sharing & Send/Print logic ---
  const handleSlipPdfUrlUpdate = async (slipId: string | number, url: string) => {
    setSalarySlips(prev => prev.map(slip => slip.id === slipId ? { ...slip, pdf_url: url } : slip));
    await supabase.from("salary_payments").update({ pdf_url: url }).eq("id", slipId);
  };
  const handlePrintSlip = (slip: any) => printSalarySlip(slip);

  const handleShareSlip = (email: string, url: string, slip: any) => {
    setShareModal({
      open: true,
      email,
      pdfUrl: url,
      slip,
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 28 }}>
      <div
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          background: "white",
          borderRadius: 20,
          boxShadow: "0 6px 32px #E5E7EB",
          padding: "38px 35px 24px 35px",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: "#153652", fontSize: 28, fontWeight: 800, marginBottom: 3 }}>Payroll Management</h2>
          <span style={{ color: "#78869f", fontSize: 16, fontWeight: 500 }}>
            Manage and send salary—generate and view slips
          </span>
        </div>
        {message && (
          <div
            style={{
              background: "#f1fdf5",
              color: "#21808D",
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 600,
              border: "1px solid #c9f6ea",
              marginBottom: 20,
            }}
          >
            {message}
          </div>
        )}

        {!selected && (
          <>
            <div
              style={{
                background: "#fdfeff",
                borderRadius: 14,
                border: "1px solid #eef2f4",
                marginBottom: 24,
                padding: 16,
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="🔍 Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "12px 18px",
                  width: 320,
                  border: "1px solid #dce7f3",
                  borderRadius: 7,
                  fontSize: 16,
                  outline: "none",
                }}
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{
                  padding: "12px 18px",
                  fontSize: 16,
                  border: "1px solid #e0e6eb",
                  borderRadius: 7,
                  outline: "none",
                  width: 175,
                }}
              >
                <option value="all">All Roles</option>
                <option value="staff">Staff Only</option>
                <option value="phlebotomist">Phlebotomist Only</option>
              </select>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ color: "#324152", fontStyle: "italic", fontSize: 16, fontWeight: 500 }}>
                No staff or phlebotomists found. Please add data.
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderRadius: 13,
                  marginTop: 0,
                  background: "#fafdff",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  boxShadow: "0 1px 6px #eef2f4",
                }}
              >
                <thead>
                  <tr style={{ color: "#64748B", fontWeight: 700, fontSize: 16 }}>
                    <th style={headerCell}>PHOTO</th>
                    <th style={headerCell}>NAME</th>
                    <th style={headerCell}>ROLE</th>
                    <th style={headerCell}>DESIGNATION</th>
                    <th style={headerCell}>PHONE</th>
                    <th style={headerCell}>EMAIL</th>
                    <th style={headerCell}>SALARY</th>
                    <th style={headerCell}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((person) => (
                    <tr key={person.id} style={{ background: "#fff", borderBottom: "1px solid #f3f4f7" }}>
                      <td style={cell}>
                        <span style={{ fontSize: "2em" }}>{person.photo || "👨‍🔬"}</span>
                      </td>
                      <td style={cell}>
                        <span style={{ fontWeight: 700, color: "#162a3a" }}>{person.name}</span>
                        <div style={{ color: "#868ca0", fontSize: 13, marginTop: 2 }}>Joined: {person.joined_at || "—"}</div>
                      </td>
                      <td style={cell}>
                        <span
                          style={{
                            background: person.role === "phlebotomist" ? "#ede9fe" : "#e0f2f1",
                            color: "#6d28d9",
                            fontWeight: 600,
                            padding: "3px 14px",
                            fontSize: 13,
                            borderRadius: 20,
                            display: "inline-block",
                          }}
                        >
                          {person.role.charAt(0).toUpperCase() + person.role.slice(1)}
                        </span>
                      </td>
                      <td style={cell}>{person.designation || "—"}</td>
                      <td style={cell}>{person.phone || "—"}</td>
                      <td style={cell}>{person.email || "—"}</td>
                      <td style={{ ...cell, color: "#21808D", fontWeight: 700 }}>
                        ₹{parseInt(person.salary) ? parseInt(person.salary).toLocaleString() : "—"}
                      </td>
                      <td style={cell}>
                        <button
                          onClick={() => {
                            if (isOnline) {
                              setSelected(person);
                            } else {
                              alert("Please connect to the internet to use this feature.");
                            }
                          }}
                          style={{
                            background: "linear-gradient(90deg,#059669 30%,#059fad 100%)",
                            color: "white",
                            padding: "8px 20px",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Pay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

        <h3 style={{ fontWeight: 700, margin: "36px 0 9px 0", color: "#153652", fontSize: 19 }}>Recent Salary Slips</h3>
        {!isOnline ? (
          <div style={{ color: "#92400E", background: "#FEF3C7", fontWeight: 600, borderRadius: 10, padding: "18px", margin: "18px 0" }}>
            Please connect to the internet to see the salary slips.
          </div>
        ) : salarySlips.length === 0 ? (
          <div style={{ color: "#324152", fontSize: 15 }}>No slips yet.</div>
        ) : (
          <table style={{ width: "100%", background: "#fafdff", borderRadius: 12, marginTop: 8 }}>
            <thead>
              <tr>
                <th style={headerCell}>Name</th>
                <th style={headerCell}>Role</th>
                <th style={headerCell}>Salary</th>
                <th style={headerCell}>Bonus</th>
                <th style={headerCell}>Total Paid</th>
                <th style={headerCell}>Date</th>
                <th style={headerCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salarySlips.map((slip) => (
                <tr key={slip.id || Math.random()}>
                  <td style={cell}>{slip.staff_name}</td>
                  <td style={cell}>{slip.role}</td>
                  <td style={cell}>₹{slip.salary_paid}</td>
                  <td style={cell}>{slip.bonus_percent ? `${slip.bonus_percent}% (₹${slip.bonus_amount})` : "—"}</td>
                  <td style={cell}>₹{slip.total_amount}</td>
                  <td style={cell}>{new Date(slip.payment_date).toLocaleDateString()}</td>
                  <td style={cell}>
                    <SalarySlipActions
                      slip={slip}
                      onPdfUrlUpdate={handleSlipPdfUrlUpdate}
                      onShare={handleShareSlip}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
          </>
        )}

        {selected && (
          <div
            style={{
              maxWidth: 530,
              margin: "40px auto 15px",
              background: "white",
              borderRadius: 16,
              boxShadow: "0 2px 12px #edeef1",
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                background: "none",
                color: "#21808D",
                fontWeight: 700,
                fontSize: 17,
                margin: "18px 0 10px 26px",
                border: "none",
                cursor: "pointer",
                display: "block",
              }}
            >
              ← Back to Staff/Phlebo List
            </button>
            <SalaryTransferForm staff={selected} onSendPayment={handleSendPayment} />
          </div>
        )}

                {shareModal?.open && (
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(36,54,64,.47)",
              zIndex: 99,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backdropFilter: "blur(1.2px)",
            }}
          >
            <div
              style={{
                background: "#fff",
                boxShadow: "0 6px 32px rgba(0,0,0,.18)",
                borderRadius: 18,
                padding: "36px 32px 24px 32px",
                minWidth: 340,
                maxWidth: "98vw",
                animation: "fadeIn .3s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{
                fontWeight: 800,
                color: "#20576C",
                fontSize: 19,
                marginBottom: 12,
                letterSpacing: 0.8,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span style={{
                  background: "linear-gradient(135deg,#56bdab 10%,#0776c3 75%)",
                  fontSize: 32,
                  borderRadius: "50%",
                  width: 47, height: 47, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", marginRight: 9,
                }}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M21 2.25a.75.75 0 0 1 .673 1.075l-9 18a.75.75 0 0 1-1.39-.02l-2.41-6.177-6.187-2.428a.75.75 0 0 1-.021-1.39l18-9A.75.75 0 0 1 21 2.25Zm-2.5 2.869-12.274 6.138 4.391 1.724a.75.75 0 0 1 .433.433l1.742 4.467L18.13 4.618ZM20.15 3.85l.002.004-.002-.004Z"></path></svg>
                </span>
                Share Salary Slip
              </div>
              <div style={{ width: "100%" }}>
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=Dear ${shareModal.slip.staff_name}, your salary slip: ${shareModal.pdfUrl}`,
                      "_blank"
                    )
                  }
                  style={{
                    width: "100%",
                    background: "#25D366",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 700,
                    padding: "13px 0",
                    fontSize: 18,
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    cursor: "pointer",
                    transition: "background .18s",
                  }}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `mailto:${shareModal.email}?subject=Your%20Salary%20Slip&body=Dear ${shareModal.slip.staff_name},%0D%0AYour salary slip is here: ${shareModal.pdfUrl}`)
                  }
                  style={{
                    width: "100%",
                    background: "linear-gradient(90deg,#066aff 60%,#46bcf8 100%)",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 700,
                    padding: "13px 0",
                    fontSize: 18,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    cursor: "pointer",
                    transition: "background .18s",
                  }}
                >
                  Email
                </button>
                <button
                  onClick={() => setShareModal(null)}
                  style={{
                    width: "100%",
                    background: "#f6fafd",
                    color: "#324152",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 16,
                    padding: "10px 0 8px 0",
                    marginTop: 1,
                    cursor: "pointer",
                    boxShadow: "0 0.5px 0px #e6eef2",
                    transition: "background .18s",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const headerCell: React.CSSProperties = {
  textAlign: "left",
  padding: "14px 9px",
  fontSize: 15,
  color: "#0f172a",
  fontWeight: 700,
  background: "#f6f7fa",
};
const cell: React.CSSProperties = {
  padding: "14px 10px",
  fontSize: 15,
  color: "#374151",
  borderBottom: "1px solid #f6f6f7",
};