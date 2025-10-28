// src/pages/admin/HRManagement.tsx
import React, { useState, useEffect } from "react";
import EmployeeDirectory from "../../components/hr/EmployeeDirectory";
import LeaveManagement from "../../components/hr/LeaveManagement";
import AnnouncementFeed from "../../components/hr/AnnouncementFeed";
import PolicyDownload from "../../components/hr/PolicyDownload";
import { supabase } from "../../services/supabaseClient";
import LetterPreviewModal from "../../components/hr/LetterPreviewModal";
import { generateOfferLetterPDF, generateJoiningLetterPDF } from "../../utils/pdfGenerators";

// Define types for each entity
interface Employee { id: string | number; name: string; [key: string]: any }
interface Leave { id: string | number; [key: string]: any }
interface Announcement { id: string | number; title: string; date: string }
interface Policy { id: string | number; title: string }

const LeaveManagementComponent = LeaveManagement as React.ComponentType<{ data: Leave[] }>;
const PolicyDownloadComponent = PolicyDownload as React.ComponentType<{ data: Policy[] }>;

export default function HRManagement() {
  const [activeTab, setActiveTab] = useState("employee");
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [leaveData, setLeaveData] = useState<Leave[]>([]);
  const [announcementData, setAnnouncementData] = useState<Announcement[]>([]);
  const [policyData, setPolicyData] = useState<Policy[]>([]);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewType, setPreviewType] = useState<"offer" | "joining">("offer");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      const { data: staff } = await supabase.from("staff").select("*");
      const { data: phlebo } = await supabase.from("phlebo").select("*");
      setEmployeeData([...(staff ?? []), ...(phlebo ?? [])]);
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    async function fetchLeaves() {
      const { data } = await supabase.from("leaves").select("*");
      setLeaveData(data ?? []);
    }
    fetchLeaves();
  }, []);

  useEffect(() => {
    async function fetchAnnouncements() {
      const { data } = await supabase.from("announcements").select("*");
      setAnnouncementData(data ?? []);
    }
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    async function fetchPolicies() {
      const { data } = await supabase.from("policies").select("*");
      setPolicyData(data ?? []);
    }
    fetchPolicies();
  }, []);

  async function handleGenerateLetter(employee: Employee, type: "offer" | "joining") {
    const pdfBlob =
      type === "offer"
        ? generateOfferLetterPDF(employee)
        : generateJoiningLetterPDF(employee, "Ashwani Diagnostic Centre");
    setPreviewType(type);
    setPreviewEmployee(employee);
    setPreviewBlob(pdfBlob);
    setPreviewOpen(true);
  }

  async function handleUploadAndSend() {
    if (!previewBlob || !previewEmployee) return;
    const type = previewType;
    const employee = previewEmployee;
    const fileName = `${type}_letter_${employee.id}_${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, previewBlob, { contentType: "application/pdf" });
    if (uploadError) {
      alert("Document upload failed: " + uploadError.message);
      return;
    }
    const { error } = await supabase.from("hr_documents").insert([
      {
        employee_id: employee.id,
        type,
        file_url: uploadData.path,
        status: "active",
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      alert("Error storing the document DB record: " + error.message);
      return;
    }
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} Letter PDF uploaded and saved!`);
    setPreviewOpen(false);
  }

  function handleResignationAction(employee: Employee) {
    alert(`Accepted resignation and generated letter for: ${employee.name}`);
  }

  return (
    <div style={{ background: "#FCFCF9", minHeight: "100vh", padding: "0 0 38px 0" }}>
      {/* HEADER */}
      <div
        style={{
          padding: "32px 0 18px 0",
          background: "#FFF",
          boxShadow: "0 2px 8px rgba(33,128,141,0.02)",
          borderBottom: "1px solid #F4F5F7",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#134252",
                  marginBottom: "2px",
                }}
              >
                HR Management
              </h2>
              <div style={{ color: "#6C7A95", fontSize: "15px" }}>
                Manage all employee lifecycle, onboarding, and employment documents.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "32px auto 0 auto",
          background: "#fff",
          borderRadius: 17,
          boxShadow: "0 2px 8px rgba(33,128,141,0.07)",
          border: "1px solid #E8ECEE",
          overflow: "hidden",
        }}
      >
        {/* TABS */}
        <div
          style={{
            borderBottom: "1.5px solid #F8F9FA",
            display: "flex",
            padding: "0 24px",
            background: "#F9FAFB",
          }}
        >
          {[
            { key: "employee", label: "Employees" },
            { key: "leave", label: "Leave" },
            { key: "announcements", label: "Announcements" },
            { key: "policies", label: "Policies" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: "none",
                border: "none",
                color: activeTab === tab.key ? "#21808D" : "#626C71",
                fontWeight: activeTab === tab.key ? 700 : 600,
                fontSize: 15,
                padding: "20px 26px 13px 0",
                borderBottom:
                  activeTab === tab.key
                    ? "3px solid #21808D"
                    : "3px solid transparent",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* CONTENT */}
        <div style={{ padding: "22px 30px 14px 30px" }}>
          {activeTab === "employee" && (
            <EmployeeDirectory
              data={employeeData}
              onGenerateLetter={handleGenerateLetter}
              onResignationAction={handleResignationAction}
            />
          )}
          {activeTab === "leave" && <LeaveManagementComponent data={leaveData} />}
          {activeTab === "announcements" && (
            <AnnouncementFeed data={announcementData} />
          )}
          {activeTab === "policies" && (
            <PolicyDownloadComponent data={policyData} />
          )}
        </div>
      </div>
      <LetterPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onStoreSend={handleUploadAndSend}
        blob={previewBlob}
        letterType={previewType}
        employee={previewEmployee}
      />
    </div>
  );
}
