import React from "react";

export default function LetterPreviewModal({
  open,
  onClose,
  onStoreSend,
  blob,
  letterType,
  employee
}: {
  open: boolean,
  onClose: () => void,
  onStoreSend: () => void,
  blob: Blob | null,
  letterType: "offer" | "joining",
  employee: any
}) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.36)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div style={{
        background: "#fff", padding: 32, borderRadius: 15, minWidth: 420, maxWidth: 650, boxShadow: "0 2px 24px 0 rgba(130,130,130,0.13)"
      }}>
        <h2 style={{marginBottom:18}}>Preview {letterType === "offer" ? "Offer" : "Joining"} Letter for {employee?.name}</h2>
        <div style={{ margin: "12px 0", minHeight: 420 }}>
          {blob && (
            <iframe
              src={URL.createObjectURL(blob)}
              width="100%"
              height="400px"
              title="document preview"
              style={{ border: "1px solid #ddd", borderRadius: 8 }}
            />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "end", gap: 13 }}>
          <a
            download={`${letterType}_letter_${employee?.name}.pdf`}
            href={blob ? URL.createObjectURL(blob) : "#"}
            style={{ padding: "8px 18px", background: "#21808D", color: "#FFF", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}
          >Download</a>
          <button
            onClick={onStoreSend}
            style={{ padding: "8px 18px", background: "#32B8C6", color: "#FFF", border: "none", borderRadius: 8, fontWeight: 700 }}
          >
            Store & Send to Staff
          </button>
          <button
            onClick={onClose}
            style={{ padding: "8px 15px", background: "#eee", color: "#333", borderRadius: 8, fontWeight: 600, border: "none" }}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}
