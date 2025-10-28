import React from "react";
import { supabase } from "../../services/supabaseClient";
import { printSalarySlip, generateSalarySlipPDF } from "./SalarySlipPrint";



interface SalarySlip {
  id: string | number;
  staff_name: string;
  payment_month?: string;
  pdf_url?: string | null;
  [key: string]: any;
}

interface SalarySlipActionsProps {
  slip: SalarySlip;
  onPdfUrlUpdate: (id: string | number, url: string) => void;
  onShare: (email: string, url: string, slip: SalarySlip) => void;
}

export default function SalarySlipActions({
  slip,
  onPdfUrlUpdate,
  onShare,
}: SalarySlipActionsProps) {
  // PRINT: Always in-browser PDF generation, not upload
  const handlePrint = async () => {
    printSalarySlip(slip);
  };

  // SEND: Upload only if not already uploaded; else just share link
  const handleSend = async () => {
    if (slip.pdf_url) {
      // Already uploaded, use share modal/callback
      onShare(slip.staff_email || "", slip.pdf_url, slip);
      return;
    }

    // 1. Generate PDF blob (must match Print version)
    const pdfBlob = await generateSalarySlipPDF(slip);

    // 2. File name should be meaningful and unique
    const safeName =
      slip.staff_name.replace(/\s+/g, "_") +
      "_" +
      (slip.payment_month ? slip.payment_month.replace(/[\/\\]/g, "_") : "month") +
      "_" +
      slip.id;
    const fileName = `salary_slips/${safeName}.pdf`;

    // 3. Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("salary_slips")
      .upload(fileName, pdfBlob, { upsert: true, contentType: "application/pdf" });

    if (error) {
      alert("PDF upload failed: " + error.message);
      return;
    }

    // 4. Retrieve public URL
    const { data: pub } = supabase.storage.from("salary_slips").getPublicUrl(fileName);
    const publicUrl = pub?.publicUrl;
    if (publicUrl) {
      onPdfUrlUpdate(slip.id, publicUrl);
      onShare(slip.staff_email || "", publicUrl, { ...slip, pdf_url: publicUrl });
    } else {
      alert("Unable to get public URL");
    }
  };

  return (
    <>
      <button
        type="button"
        style={{
          color: "#3b82f6",
          border: "none",
          background: "white",
          cursor: "pointer",
          fontWeight: 600,
          marginRight: 10,
        }}
        onClick={handlePrint}
      >
        Print
      </button>
      <button
        type="button"
        style={{
          color: "#059669",
          border: "none",
          background: "white",
          cursor: "pointer",
          fontWeight: 600,
        }}
        onClick={handleSend}
      >
        Send
      </button>
    </>
  );
}
