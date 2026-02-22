import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCADDetailed } from "@/lib/mortgage-utils";

interface ScenarioData {
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
}

interface PDFData {
  loanAmount: number;
  scenarioA: ScenarioData;
  scenarioB?: ScenarioData;
}

const fmtShort = (val: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(val);

export function generatePDF(data: PDFData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(26, 42, 68);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setFillColor(210, 170, 60);
  doc.rect(0, 40, pageWidth, 3, "F");

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("MortgageCalc", 20, 22);
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 220);
  doc.text("Interest-Only Mortgage Report", 20, 32);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-CA")}`, pageWidth - 20, 32, { align: "right" });

  let y = 56;

  const addScenario = (label: string, s: ScenarioData) => {
    doc.setFontSize(14);
    doc.setTextColor(26, 42, 68);
    doc.text(label, 20, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [["Parameter", "Value"]],
      body: [
        ["Loan Amount", fmtShort(data.loanAmount)],
        ["Interest Rate", `${s.interestRate.toFixed(2)}%`],
        ["Term", `${s.termMonths} month${s.termMonths !== 1 ? "s" : ""}`],
        ["Monthly Payment", formatCADDetailed(s.monthlyPayment)],
        ["Total Interest", formatCADDetailed(s.totalInterest)],
      ],
      theme: "grid",
      headStyles: { fillColor: [26, 42, 68], textColor: [255, 255, 255], fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    y = (doc as any).lastAutoTable.finalY + 14;
  };

  addScenario(data.scenarioB ? "Scenario A" : "Loan Summary", data.scenarioA);
  if (data.scenarioB) {
    addScenario("Scenario B", data.scenarioB);
  }

  // Disclaimer
  doc.setFillColor(245, 245, 248);
  doc.roundedRect(20, y, pageWidth - 40, 30, 3, 3, "F");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 110);
  doc.text("DISCLAIMER", 25, y + 8);
  doc.setFontSize(7.5);
  const disclaimer =
    "This report provides hypothetical estimates for informational purposes only. Payments are interest-only — the principal balance does not decrease. Results are not guaranteed and do not constitute financial advice.";
  const lines = doc.splitTextToSize(disclaimer, pageWidth - 50);
  doc.text(lines, 25, y + 14);

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(26, 42, 68);
  doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 220);
  doc.text("© 2025 MortgageCalc — All rights reserved", pageWidth / 2, pageHeight - 6, { align: "center" });

  doc.save("mortgage-report.pdf");
}
