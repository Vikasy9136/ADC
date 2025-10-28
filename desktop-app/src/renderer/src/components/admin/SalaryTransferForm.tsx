import React, { useState } from "react";

export default function SalaryTransferForm({
  staff,
  onSendPayment,
}: {
  staff: any;
  onSendPayment: (paymentData: any) => void;
}) {
  const [bonusPercent, setBonusPercent] = useState(0);
  const [paymentMode, setPaymentMode] = useState(
    staff?.preferred_payment_mode || "bank"
  );
  const baseSalary = Number(staff.salary || 0);
  const bonusAmount = Math.round(baseSalary * (bonusPercent / 100));
  const totalPayable = baseSalary + bonusAmount;
  const [paymentMonth, setPaymentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendPayment({
      salary: baseSalary,
      bonusPercent,
      bonusAmount,
      paymentMode,
      paymentMonth,
      totalAmount: totalPayable,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#f8fafc",
        borderRadius: 14,
        margin: "0 28px 22px 28px",
        padding: 32,
        boxShadow: "0 3px 18px #eef4f7",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 22, color: "#153652" }}>
        {staff.name}
        <span
          style={{
            opacity: 0.7,
            color: "#5246e7",
            fontWeight: 600,
            fontSize: 14,
            marginLeft: 14,
          }}
        >
          {staff.role === "phlebotomist" ? "Phlebotomist" : "Staff"}
        </span>
      </div>
      <div style={inputbox}>
        <label style={label}>Base Salary</label>
        <strong style={{ fontWeight: 700, fontSize: 16, color: "#21808D" }}>
          ₹ {baseSalary.toLocaleString()}
        </strong>
      </div>
      <div style={inputbox}>
        <label style={label}>Bonus (%)</label>
        <input
          type="number"
          min={0}
          max={100}
          placeholder="Bonus percent"
          value={bonusPercent}
          onChange={(e) => setBonusPercent(Number(e.target.value))}
          style={input}
        />
        <span style={{ fontSize: 13, color: "#059669", marginTop: 2 }}>
          +₹{bonusAmount.toLocaleString()} ({bonusPercent}%) Bonus
        </span>
      </div>
      <div style={inputbox}>
        <input
          type="month"
          value={paymentMonth}
          onChange={(e) => setPaymentMonth(e.target.value)}
          style={input}
        />
      </div>
      <div style={inputbox}>
        <label style={label}>Payment Mode</label>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          style={input}
        >
          <option value="bank">Bank Transfer</option>
          <option value="upi">UPI</option>
          <option value="wallet">Wallet</option>
        </select>
      </div>
      <div
        style={{
          marginTop: 5,
          fontWeight: 900,
          fontSize: 19,
          color: "#18b673",
          background: "#e6fdf3",
          borderRadius: 8,
          padding: 7,
          textAlign: "center",
        }}
      >
        Total Payable: ₹{" "}
        {totalPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
      <button
        type="submit"
        style={{
          background: "linear-gradient(90deg,#059669 30%,#059fad 100%)",
          color: "white",
          border: "none",
          borderRadius: 9,
          padding: "14px 0",
          fontWeight: 700,
          fontSize: 17,
          marginTop: 9,
          cursor: "pointer",
          boxShadow: "0 3px 10px #adf1e3a5",
        }}
      >
        Pay Now
      </button>
    </form>
  );
}

const label: React.CSSProperties = {
  fontWeight: 600,
  color: "#324152",
  fontSize: 16,
  marginBottom: 3,
};
const input: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: "10px 13px",
  fontSize: 16,
  marginTop: 2,
  width: "100%",
  background: "white",
};
const inputbox: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  marginBottom: 2,
};
