import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportData {
  loanAmount: number;
  interestRate: number;
  termYears: number;
  monthlyPayment: number;
  totalInterest: number;
}

const fmt = (val: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 }).format(val);

const fmtShort = (val: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(val);

export function generatePDF(data: ReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(26, 42, 68); // navy
  doc.rect(0, 0, pageWidth, 40, "F");

  // Gold accent line
  doc.setFillColor(210, 170, 60); // gold
  doc.rect(0, 40, pageWidth, 3, "F");

  // Logo placeholder
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("MortgageCalc", 20, 22);
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 220);
  doc.text("Mortgage Report", 20, 32);

  // Date
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 220);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-CA")}`, pageWidth - 20, 32, { align: "right" });

  let y = 56;

  // Section: Input Summary
  doc.setFontSize(14);
  doc.setTextColor(26, 42, 68);
  doc.text("Input Summary", 20, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [["Parameter", "Value"]],
    body: [
      ["Loan Amount", fmtShort(data.loanAmount)],
      ["Interest Rate", `${data.interestRate.toFixed(2)}%`],
      ["Term", data.termYears < 1 ? `${data.termYears * 12} months` : `${data.termYears} year${data.termYears !== 1 ? "s" : ""}`],
    ],
    theme: "grid",
    headStyles: { fillColor: [26, 42, 68], textColor: [255, 255, 255], fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
  });

  y = (doc as any).lastAutoTable.finalY + 14;

  // Section: Results
  doc.setFontSize(14);
  doc.setTextColor(26, 42, 68);
  doc.text("Calculation Results", 20, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Amount"]],
    body: [
      ["Monthly Payment", fmt(data.monthlyPayment)],
      ["Annual Payment", fmt(data.monthlyPayment * 12)],
      [`Total Interest Over ${data.termYears} Year${data.termYears !== 1 ? "s" : ""}`, fmt(data.totalInterest)],
      [`Total Cost (Principal + Interest)`, fmt(data.loanAmount + data.totalInterest)],
    ],
    theme: "grid",
    headStyles: { fillColor: [210, 170, 60], textColor: [26, 42, 68], fontSize: 10, fontStyle: "bold" },
    bodyStyles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
  });

  y = (doc as any).lastAutoTable.finalY + 16;

  // Disclaimer
  doc.setFillColor(245, 245, 248);
  doc.roundedRect(20, y, pageWidth - 40, 30, 3, 3, "F");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 110);
  doc.text("DISCLAIMER", 25, y + 8);
  doc.setFontSize(7.5);
  const disclaimer =
    "This report provides hypothetical estimates for informational purposes only. Results are not guaranteed and do not constitute financial advice. Calculations assume monthly compounding. Please consult a licensed mortgage broker or financial advisor before making any financial decisions.";
  const lines = doc.splitTextToSize(disclaimer, pageWidth - 50);
  doc.text(lines, 25, y + 14);

  y += 38;

  // Contact
  doc.setFontSize(9);
  doc.setTextColor(26, 42, 68);
  doc.text("Questions? Contact your mortgage advisor or visit our website.", 20, y);
  doc.setTextColor(210, 170, 60);
  doc.text("www.example.com  |  info@example.com  |  1-800-EXAMPLE", 20, y + 6);

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(26, 42, 68);
  doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 220);
  doc.text("© 2025 MortgageCalc — All rights reserved", pageWidth / 2, pageHeight - 6, { align: "center" });

  doc.save("mortgage-report.pdf");
}
