import { jsPDF } from "jspdf";

// Type for employee objects
export interface EmployeePDFInfo {
  id?: string | number;
  name?: string;
  role?: string;
  designation?: string;
  joined_at?: string;
  staff_code?: string;
  [key: string]: any; // for possible extra fields
}

// Helper for clean date string (YYYY-MM-DD becomes 'DD MMMM YYYY')
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "______";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

// Offer letter generator
export function generateOfferLetterPDF(
  employee: EmployeePDFInfo,
  extraFields: { [key: string]: any } = {}
) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("JOB OFFER LETTER", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  let y = 35;
  doc.text(`Dear ${employee.name || "Candidate"},`, 15, y);
  y += 8;
  doc.text(`Date: ${formatDate(employee.joined_at)}`, 15, y); // Uses DB date
  y += 8;
  doc.text(`Ref: ${employee.staff_code || employee.id || "____________"} POBT`, 15, y);
  y += 12;
  doc.text(`Dear ${employee.name || "Candidate"},`, 15, y);
  y += 10;
  doc.text([
    `I am writing to confirm my offer of a position as ${employee.role || "Role"}${employee.designation ? " ("+employee.designation+")" : ""}.`,
    `This position is offered subject to satisfactory reference and pre-employment checks and completion of the three-month probationary period during which your performance will be reviewed.`
  ].join(' '), 15, y, { maxWidth: 180 });
  y += 24;
  doc.text([
    `This is a permanent position and you will therefore be entitled to all ${employee.role || ""} benefits.`,
    `Your starting date will be ${formatDate(employee.joined_at)}. Your salary will be paid directly into your bank account on the 7th of each month.`,
    `You will be entitled to 10 day's holiday per year pro-rata. The Holiday year runs from Jan 1st - Dec 31st.`
  ].join(' '), 15, y, { maxWidth: 180 });
  y += 32;
  doc.text("Please find enclosed clearance forms which I would be grateful if you could complete and return to me as soon as possible.", 15, y, { maxWidth: 180 });
  y += 14;
  doc.text("We are all looking forward to working with you and hope you will soon feel part of the team. If you have any questions, please contact me.", 15, y, { maxWidth: 180 });
  y += 13;
  doc.text("Yours sincerely", 15, y);
  y += 10;
  doc.text("ADC Management", 15, y);
  return doc.output("blob");
}

// Joining letter generator
export function generateJoiningLetterPDF(
  employee: EmployeePDFInfo,
  companyName: string = "Ashwani Diagnostic Centre"
) {
  const doc = new jsPDF();

  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text("JOINING LETTER", 105, 20, { align: "center" });
  doc.setFontSize(13).setFont("helvetica", "normal");

  let y = 40;
  doc.text(`Dear ${employee.name || "Candidate"},`, 15, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.text([
    "Good day!",
    "",
    "Concerning the appointment letter from your kind office, it is with great pleasure that I am writing to inform you of my desire to join your team as a " +
      (employee.role || "Role") + " at " + companyName + " on " +
      (employee.joined_at ? formatDate(employee.joined_at) : "______") + ".",
    "",
    "In line with this, I accept the terms and conditions mentioned in the appointment letter packet. I shall thereby properly discharge all of my duties and responsibilities, and shall abide by the rules and regulations as stated by the company handbook.",
    "",
    "I feel that I can make a significant contribution to the company " + companyName + ". Thus, I am grateful for the opportunity you have presented me with.",
    "",
    "Regards,",
    "",
    "ADC Management"
  ].join('\n'), 15, y, { maxWidth: 180 });
  return doc.output("blob");
}
