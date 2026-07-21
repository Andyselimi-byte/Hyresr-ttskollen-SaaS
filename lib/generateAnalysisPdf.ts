import { jsPDF } from "jspdf";
import type { ContractAnalysis } from "@/types";

// Brand palette
const NAVY: [number, number, number] = [15, 23, 42];      // #0f172a
const BLUE: [number, number, number] = [26, 86, 160];     // #1a56a0
const GREY: [number, number, number] = [100, 116, 139];   // #64748b
const LIGHT: [number, number, number] = [229, 231, 235];  // #e5e7eb

const STATUS: Record<string, { label: string; color: [number, number, number]; bg: [number, number, number] }> = {
  flag: { label: "UPPMÄRKSAMMA", color: [121, 31, 31],  bg: [252, 235, 235] },
  warn: { label: "NOTERA",       color: [99, 56, 6],    bg: [250, 238, 218] },
  ok:   { label: "OK",           color: [39, 80, 10],   bg: [234, 243, 222] },
};

const RISK: Record<string, { label: string; color: [number, number, number] }> = {
  low:    { label: "LÅG RISK",       color: [39, 128, 60] },
  medium: { label: "MEDELHÖG RISK",  color: [180, 130, 20] },
  high:   { label: "HÖG RISK",       color: [180, 40, 40] },
};

export function generateAnalysisPdf(analysis: ContractAnalysis): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  const dateStr = new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });

  function ensureSpace(needed: number) {
    if (y + needed > pageH - 20) {
      addFooter();
      doc.addPage();
      y = margin;
    }
  }

  function addFooter() {
    doc.setDrawColor(...LIGHT);
    doc.setLineWidth(0.2);
    doc.line(margin, pageH - 14, pageW - margin, pageH - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...GREY);
    doc.text("Hyresrättskollen · Juridisk information, ej juridisk rådgivning · hyresrättskollen.se", margin, pageH - 9);
    const page = doc.getNumberOfPages();
    doc.text(`Sida ${page}`, pageW - margin, pageH - 9, { align: "right" });
  }

  // ── Header band ──
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 34, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Hyresrättskollen", margin, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(150, 175, 210);
  doc.text("Avtalsgranskning enligt 12 kap. Jordabalken", margin, 23);
  doc.setFontSize(8);
  doc.setTextColor(120, 140, 170);
  doc.text(`Genererad ${dateStr}`, pageW - margin, 16, { align: "right" });

  y = 46;

  // ── Title + risk ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...NAVY);
  doc.text("Sammanfattning av din avtalsanalys", margin, y);
  y += 8;

  if (analysis.riskLevel && RISK[analysis.riskLevel]) {
    const r = RISK[analysis.riskLevel];
    doc.setFillColor(...r.color);
    doc.roundedRect(margin, y - 4, 42, 8, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(r.label, margin + 21, y + 1.4, { align: "center" });
    y += 10;
  }

  // ── Summary text ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 60, 75);
  const summaryLines = doc.splitTextToSize(analysis.summary, contentW);
  ensureSpace(summaryLines.length * 5 + 6);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 6;

  // ── Counts ──
  const counts = {
    flag: analysis.clauses.filter(c => c.status === "flag").length,
    warn: analysis.clauses.filter(c => c.status === "warn").length,
    ok: analysis.clauses.filter(c => c.status === "ok").length,
  };
  const chips: Array<[string, number, string]> = [
    ["flag", counts.flag, "Uppmärksamma"],
    ["warn", counts.warn, "Notera"],
    ["ok", counts.ok, "OK"],
  ];
  let cx = margin;
  chips.forEach(([status, count, label]) => {
    const s = STATUS[status];
    const w = 42;
    doc.setFillColor(...s.bg);
    doc.roundedRect(cx, y, w, 9, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...s.color);
    doc.text(`${count}`, cx + 4, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(label, cx + 11, y + 6);
    cx += w + 4;
  });
  y += 16;

  // ── Recommendations ──
  if (analysis.recommendations && analysis.recommendations.length > 0) {
    ensureSpace(14);
    doc.setFillColor(230, 241, 251);
    const recHeaderY = y;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLUE);
    doc.text("Rekommenderade åtgärder", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 60, 75);
    analysis.recommendations.forEach((rec, i) => {
      const lines = doc.splitTextToSize(`${i + 1}.  ${rec}`, contentW - 4);
      ensureSpace(lines.length * 5 + 2);
      doc.text(lines, margin + 2, y);
      y += lines.length * 5 + 2;
    });
    void recHeaderY;
    y += 6;
  }

  // ── Clauses ──
  (["flag", "warn", "ok"] as const).forEach(status => {
    const clauses = analysis.clauses.filter(c => c.status === status);
    if (clauses.length === 0) return;
    const s = STATUS[status];

    ensureSpace(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(status === "flag" ? "Uppmärksamma" : status === "warn" ? "Notera" : "Godkända klausuler", margin, y);
    y += 7;

    clauses.forEach(clause => {
      const findingLines = doc.splitTextToSize(clause.finding, contentW - 8);
      const infoLines = doc.splitTextToSize(clause.information, contentW - 8);
      const blockH = 10 + findingLines.length * 4.5 + infoLines.length * 4 + 8;
      ensureSpace(blockH);

      const startY = y;
      // left accent bar
      doc.setFillColor(...s.color);
      doc.rect(margin, startY, 1.2, blockH - 3, "F");

      // title + badge
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(clause.title, margin + 5, startY + 4);

      doc.setFillColor(...s.bg);
      const badgeW = doc.getTextWidth(s.label) * 0.35 + 6;
      doc.roundedRect(pageW - margin - badgeW, startY, badgeW, 5.5, 1, 1, "F");
      doc.setFontSize(6.5);
      doc.setTextColor(...s.color);
      doc.text(s.label, pageW - margin - badgeW / 2, startY + 3.7, { align: "center" });

      let ly = startY + 9;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(50, 60, 75);
      doc.text(findingLines, margin + 5, ly);
      ly += findingLines.length * 4.5 + 1;

      doc.setFontSize(8);
      doc.setTextColor(...GREY);
      doc.text(infoLines, margin + 5, ly);
      ly += infoLines.length * 4 + 1;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(...BLUE);
      doc.text(clause.lawRef, margin + 5, ly);

      y = startY + blockH;
    });
    y += 4;
  });

  // ── Disclaimer box ──
  ensureSpace(24);
  doc.setDrawColor(...LIGHT);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentW, 18, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("Viktigt", margin + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  const disc = doc.splitTextToSize(
    "Denna analys är juridisk information och utgör inte juridisk rådgivning. Vid tvist rekommenderas kontakt med Hyresgästföreningen eller en jurist. Analysen baseras på det underlag du laddat upp.",
    contentW - 8
  );
  doc.text(disc, margin + 4, y + 11);
  y += 24;

  addFooter();
  return doc;
}
