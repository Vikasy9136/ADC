import React from "react";
// Import your icon or use emoji/svg as needed
// import { PlusOutlined } from '@ant-design/icons';

const BillTemplateManage: React.FC = () => {
  // Placeholder: List of templates from API. Empty array simulates no templates.
  const billTemplates: any[] = [];

  return (
    <div style={{ minHeight: "100vh", background: "#FCFCF9" }}>
      <div style={{
        maxWidth: 950, margin: "0 auto", padding: "36px 18px"
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24
        }}>
          <div>
            <h2 style={{
              margin: 0, fontWeight: 700, fontSize: 26, color: "#1b3848"
            }}>
              Bill Template Management
            </h2>
            <div style={{
              color: "#6b7280", fontSize: 16, marginTop: 2
            }}>
              Create and manage your billing templates
            </div>
          </div>
          <button style={{
            background: "#21808D", color: "#fff", borderRadius: 7, fontWeight: 600,
            border: "none", padding: "12px 20px", fontSize: 16, boxShadow: "0 1.5px 8px #0002",
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer"
          }}>
            {/* <PlusOutlined /> */}
            <span style={{ fontSize: 22, paddingRight: 5 }}>+</span> New Template
          </button>
        </div>
        {billTemplates.length === 0 ? (
          <div style={{
            background: "#fff", minHeight: 325, borderRadius: 12, border: "1.5px solid #e5e7eb",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            {/* Replace with your preferred icon/illustration */}
            <span style={{ fontSize: 56, marginBottom: 8 }}>🚧</span>
            <h3 style={{
              color: "#145171", fontWeight: 600, margin: "15px 0 8px", fontSize: 21
            }}>
              No Bill Templates Yet
            </h3>
            <div style={{ color: "#8999A5", marginBottom: 22, fontSize: 15 }}>
              Get started by creating your first bill template. <br />
              Templates help you streamline billing for your services.
            </div>
            <button style={{
              background: "#059669", color: "#fff", borderRadius: 7, fontWeight: 600,
              border: "none", padding: "12px 34px", fontSize: 15, cursor: "pointer"
            }}>
              + Add Bill Template
            </button>
          </div>
        ) : (
          // Replace this with your table/list view code once you implement backend.
          <div style={{
            background: "#fff", minHeight: 325, borderRadius: 12, border: "1.5px solid #e5e7eb",
            padding: 18
          }}>
            {/* Bill templates table/list goes here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillTemplateManage;
