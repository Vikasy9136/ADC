import { jsPDF } from "jspdf";

export async function generateSalarySlipPDF(slip: any): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "A4"
  });

  let y = 48; // Start margin
  const leftX = 52;

  // Company header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Salary Slip", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });

  y += 40;

  // Employee and payment info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Employee Name: `, leftX, y);
  doc.setFont("helvetica", "bold");
  doc.text(slip.staff_name || "—", leftX + 115, y);
  doc.setFont("helvetica", "normal");
  y += 18;
  doc.text(`Role: `, leftX, y);
  doc.setFont("helvetica", "bold");
  doc.text(slip.role || "—", leftX + 40, y);
  doc.setFont("helvetica", "normal");
  y += 18;
  doc.text(`Pay Month: `, leftX, y);
  doc.setFont("helvetica", "bold");
  doc.text(slip.payment_month || "—", leftX + 67, y);
  doc.setFont("helvetica", "normal");
  y += 18;
  doc.text(`Pay Date: `, leftX, y);
  doc.setFont("helvetica", "bold");
  doc.text(slip.payment_date ? new Date(slip.payment_date).toLocaleDateString() : "—", leftX + 57, y);
  doc.setFont("helvetica", "normal");
  y += 18;
  doc.text(`Payment Mode: `, leftX, y);
  doc.setFont("helvetica", "bold");
  doc.text(slip.payment_mode || "—", leftX + 85, y);
  y += 30;

  // Draw lines for table borders
  doc.setDrawColor(180, 180, 180);
  let tY = y + 8;
  doc.line(leftX, tY - 6, leftX + 350, tY - 6); // Top border

  // Table header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Earnings", leftX, tY);
  doc.text("Amount", leftX + 120, tY);
  doc.text("Deductions", leftX + 200, tY);
  doc.text("Amount", leftX + 310, tY);

  tY += 11;
  doc.setFont("helvetica", "normal");
  doc.line(leftX, tY, leftX + 350, tY); // Underline header

  // Salary
  tY += 19;
  doc.text("Basic Salary", leftX, tY);
  doc.text(
    slip.salary_paid ? "$" + Number(slip.salary_paid).toLocaleString() : "—",
    leftX + 120,
    tY
  );
  doc.text("-", leftX + 200, tY);
  doc.text("-", leftX + 310, tY);

  // Bonus
  tY += 18;
  doc.text("Bonus", leftX, tY);
  doc.text(
    slip.bonus_amount ? `₹${Number(slip.bonus_amount).toLocaleString()}` : "—",
    leftX + 120, tY
  );
  doc.text("-", leftX + 200, tY);
  doc.text("-", leftX + 310, tY);

  // Add blank lines for extra rows if needed
  tY += 18;
  doc.text("-", leftX, tY);
  doc.text("-", leftX + 120, tY);
  doc.text("-", leftX + 200, tY);
  doc.text("-", leftX + 310, tY);

  // Draw table bottom border
  tY += 8;
  doc.line(leftX, tY, leftX + 350, tY);

  // Gross Salary row
  tY += 22;
  doc.setFont("helvetica", "bold");
  doc.text("Total Paid", leftX, tY);
  doc.text(
    slip.total_amount ? "₹" + Number(slip.total_amount).toLocaleString() : "—",
    leftX + 120,
    tY
  );

  y = tY + 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("This is a system generated salary slip.", leftX, y);

  // Optional: add your company name or footer

  return doc.output("blob");
}

export function printSalarySlip(slip: any) {
  generateSalarySlipPDF(slip).then(blob => {
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  });
}
