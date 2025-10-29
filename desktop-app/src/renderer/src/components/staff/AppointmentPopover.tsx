import React, { useState } from "react";

interface AppointmentPopoverProps {
  appointment: any;
  onClose: () => void;
  onDeleteTest: (testIdx: number) => void;
  onAddTest: () => void;
  onAssignPhlebo: (phlebo: string) => void;
}

const AppointmentPopover: React.FC<AppointmentPopoverProps> = ({
  appointment,
  onClose,
  onDeleteTest,
  onAddTest,
  onAssignPhlebo
}) => {
  const [phlebo, setPhlebo] = useState(appointment.assignedPhlebo || "");

  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
      background: "rgba(34,64,95,0.24)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center"
    }}
      onClick={onClose}
    >
      <div style={{
        position: "relative", background: "#fff", borderRadius: 13, boxShadow: "0 5px 32px #0003",
        padding: "32px 40px", minWidth: 420, maxWidth: "96vw"
      }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: "#1e3444" }}>
          Appointment Details
        </div>
        <div style={{ fontSize: 15, marginBottom: 11 }}>
          <b>ID:</b> {appointment.id}
        </div>
        {appointment.patients.map((pat: any, i: number) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>Patient Name:</b> {pat.name} <br />
            <b>Age:</b> {pat.age} <br />
            <b>Mobile:</b> <a href={`tel:${pat.mobile}`}>{pat.mobile}</a> <br />
            <b>Address:</b> {pat.address}
          </div>
        ))}
        <div style={{ marginBottom: 9 }}>
          <b>Booked Tests:</b>
          <ul style={{ margin: "7px 0 0 10px", padding: 0 }}>
            {appointment.bookedTests.map((test: any, i: number) => (
              <li key={i}>{test.name} — ₹{test.price}
                <button style={{
                  marginLeft: 8, color: "#DC2626", background: "none",
                  border: "none", fontSize: 14, cursor: "pointer"
                }}
                  onClick={() => onDeleteTest(i)}
                >Delete</button>
              </li>
            ))}
          </ul>
          <button style={{
            marginTop: 10, background: "#21808D", color: "#fff", borderRadius: 6,
            border: "none", padding: "5px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}
            onClick={onAddTest}
          >+ Add Test</button>
        </div>
        <div>
          <b>Collection Charges:</b> ₹{appointment.collectionCharges}<br />
          <b>Concession:</b> ₹{appointment.concession}<br />
          <b>Coupon:</b> {appointment.coupon ? appointment.coupon : "-"}<br />
          <b><u>Total Bill:</u></b> ₹{(
            appointment.bookedTests.reduce((acc: number, t: any) => acc + t.price, 0)
            + appointment.collectionCharges - appointment.concession
          )} <br />
        </div>
        <div style={{ marginTop: 12 }}>
          <b>Assign Phlebo:</b>
          <input type="text" value={phlebo}
            placeholder="Phlebo name"
            style={{ marginLeft: 7, borderRadius: 5, border: "1px solid #bee4e4", padding: "4px 9px", fontSize: 15 }}
            onChange={e => setPhlebo(e.target.value)}
            onBlur={() => onAssignPhlebo(phlebo)}
          />
        </div>
        <button style={{
          marginTop: 18, background: "#060", color: "#fff", borderRadius: 7, border: "none",
          padding: "8px 19px", fontWeight: 600, fontSize: 15, cursor: "pointer"
        }}
          onClick={() =>
            window.open(`https://www.google.com/maps?q=${appointment.location}`, '_blank')
          }
        >Get Directions</button>
        <button style={{
          position: "absolute", right: 12, top: 9, background: "none", border: "none",
          color: "#B12B38", fontWeight: 700, fontSize: 21, cursor: "pointer"
        }}
          onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default AppointmentPopover;
