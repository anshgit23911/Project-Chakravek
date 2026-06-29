import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Settings, 
  ArrowRight, 
  Download, 
  Cpu, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Copy,
  Check
} from "lucide-react";
import { Contract, Vendor, AuditReport } from "../types";
import AISettingsControl, { getAISettings } from "../components/AISettingsControl";
import { formatReportText } from "../lib/utils";
import { jsPDF } from "jspdf";

export default function AuditReportPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!currentReport) return;
    try {
      await navigator.clipboard.writeText(currentReport.generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    // Collect active databases
    fetch("/api/contracts")
      .then(res => res.json())
      .then(data => {
        setContracts(data);
        if (data.length > 0) setSelectedContractId(data[0].id);
      });

    // Populate initial reports
    fetch("/api/dashboard/stats") // We have some reports stored in default state
      .then(() => {
        // Mock grab current list of reports from memory on server
        // or we can simulate list
        setReports([
          {
            id: "rep-01",
            title: "Chakravek Audit Observation - C-6288 Ballistics",
            contractId: "C-6288",
            contractTitle: "Medium Calibre Tracer Ammunition Shells",
            generatedContent: "### COMPTROLLER & AUDITOR GENERAL (CAG) AUDIT INQUIRY\n\n**REFERENCE: CAG/DEF/2026/882-B**\n\n**Subject:** Investigation of Procurement Contract C-6288 awarded to Zenith Armaments Corp (V-102) for Medium Calibre Tracer Ammunition.\n\n#### 1. EXECUTIVE SUMMARY\nAn exhaustive audit has registered grave anomalies. Zenith Armaments Corp won this high-security ballistic supply contract through a single-bidder exception less than 5 months after its offshore registration.\n\n#### 2. CORE RISK ASSESSMENT\n* **Vendor Risk Index:** 87% (Highly anomalous foreign-origin nominee shell corp)\n* **Network Collusion Factor:** Shared administrative registry patterns with supplier Apex Shell Solutions (V-104).\n\n#### 3. REGULATORY FINDINGS\n1. Technical parameter reviews were completely bypassed on emergency pretexts that lack valid structural justification.\n2. Invoicing data indicates offshore accounts being loaded with initial capital advances without prototype testing milestones.",
            generatedBy: "Auditor General Kumar",
            status: "Finalized",
            createdAt: "2026-06-10"
          }
        ]);
      });
  }, []);

  const handleGenerate = async () => {
    if (!selectedContractId) return;
    setGenerating(true);
    setCurrentReport(null);

    const { provider, model } = getAISettings();

    try {
      const res = await fetch("/api/ai/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId: selectedContractId, provider, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to compile document.");

      setCurrentReport(data.report);
      setReports(prev => [data.report, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const triggerExport = (type: 'PDF' | 'DOCX') => {
    if (!currentReport) return;
    
    if (type === 'PDF') {
      try {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxLineWidth = pageWidth - margin * 2;

        let y = margin;

        const checkPageOverflow = (neededHeight: number) => {
          if (y + neededHeight > pageHeight - margin) {
            drawFooter();
            doc.addPage();
            drawPageDecoration();
            y = margin + 15;
          }
        };

        const drawPageDecoration = () => {
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.2);
          doc.rect(margin - 5, margin - 5, pageWidth - (margin - 5) * 2, pageHeight - (margin - 5) * 2);

          doc.setDrawColor(15, 118, 110);
          doc.setLineWidth(1);
          doc.line(margin, margin + 5, pageWidth - margin, margin + 5);
          
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text("SECRET // OFFICIAL CAG AUDIT REPORT DRAFT", margin, margin + 3);
          doc.text("CHAKRAVEK AI GROUNDED FORENSIC NETWORKS", pageWidth - margin, margin + 3, { align: "right" });
        };

        const drawFooter = () => {
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          doc.text("STRICTLY CONFIDENTIAL", margin, pageHeight - margin + 10);
          doc.text("VERIFIED SECURE PLATFORM", pageWidth / 2, pageHeight - margin + 10, { align: "center" });
          const pageCount = (doc as any).internal.getNumberOfPages();
          doc.text(`Page ${pageCount}`, pageWidth - margin, pageHeight - margin + 10, { align: "right" });
        };

        drawPageDecoration();
        y = margin + 12;

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(15, 118, 110);
        doc.text("COMPTROLLER & AUDITOR GENERAL OF INDIA", pageWidth / 2, y, { align: "center" });
        y += 6;

        doc.setFontSize(10);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(120, 90, 40);
        doc.text("DEPT. OF DEFENCE ACQUISITIONS — AUDIT INQUIRY MEMO", pageWidth / 2, y, { align: "center" });
        y += 10;

        checkPageOverflow(35);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.rect(margin, y, maxLineWidth, 28, "FD");

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        
        doc.text("REPORT ID:", margin + 5, y + 6);
        doc.text("DATE GENERATED:", margin + 95, y + 6);
        doc.text("SUBJECT CONTRACT:", margin + 5, y + 13);
        doc.text("LEAD AUDITOR:", margin + 95, y + 13);
        doc.text("DOCUMENT STATUS:", margin + 5, y + 20);
        doc.text("SECURITY RATING:", margin + 95, y + 20);

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(currentReport.id, margin + 35, y + 6);
        doc.text(currentReport.createdAt, margin + 130, y + 6);
        doc.text(currentReport.contractTitle || currentReport.contractId, margin + 35, y + 13);
        doc.text(currentReport.generatedBy, margin + 130, y + 13);
        doc.text("Draft Vetted (Finalized)", margin + 35, y + 20);
        
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(225, 29, 72);
        doc.text("SECRET (CLASS IX)", margin + 130, y + 20);

        y += 36;

        const rawContent = currentReport.generatedContent;
        const lines = rawContent.split("\n");

        for (let line of lines) {
          line = line.trim();
          if (!line) {
            y += 4;
            continue;
          }

          let isHeading = false;
          let isSubheading = false;
          let fontSize = 10;
          let textStyle = "normal";
          let fontColor = [51, 65, 85];
          let lineIndent = 0;

          if (line.startsWith("### ")) {
            isHeading = true;
            line = line.replace("### ", "");
            fontSize = 11.5;
            textStyle = "bold";
            fontColor = [15, 118, 110];
            y += 4;
          } else if (line.startsWith("#### ")) {
            isSubheading = true;
            line = line.replace("#### ", "");
            fontSize = 10.5;
            textStyle = "bold";
            fontColor = [120, 90, 40];
            y += 3;
          } else if (line.startsWith("## ")) {
            isHeading = true;
            line = line.replace("## ", "");
            fontSize = 13;
            textStyle = "bold";
            fontColor = [15, 118, 110];
            y += 5;
          } else if (line.startsWith("- ") || line.startsWith("* ")) {
            line = "• " + line.substring(2);
            lineIndent = 5;
          }

          const cleanLine = line.replace(/\*\*/g, "");

          doc.setFont("Helvetica", textStyle);
          doc.setFontSize(fontSize);
          doc.setTextColor(fontColor[0], fontColor[1], fontColor[2]);

          const wrappedText = doc.splitTextToSize(cleanLine, maxLineWidth - lineIndent);
          
          for (const txtSegment of wrappedText) {
            checkPageOverflow(6);
            doc.text(txtSegment, margin + lineIndent, y);
            y += 5.5;
          }
        }

        drawFooter();
        doc.save(`${currentReport.title.replace(/\s+/g, "_")}.pdf`);
      } catch (pdfError) {
        console.error("PDF generation failed, falling back to basic download", pdfError);
        const element = document.createElement("a");
        const file = new Blob([currentReport.generatedContent], {type: 'application/pdf'});
        element.href = URL.createObjectURL(file);
        element.download = `${currentReport.title.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } else {
      const title = currentReport.title;
      const formattedHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              margin: 40px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #0f766e;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #0f766e;
              font-size: 20pt;
              margin: 0;
            }
            .header h2 {
              color: #78350f;
              font-size: 13pt;
              margin: 5px 0 0 0;
            }
            .meta-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              background-color: #f8fafc;
            }
            .meta-table td {
              border: 1px solid #e2e8f0;
              padding: 10px;
              font-size: 10pt;
            }
            .meta-label {
              font-weight: bold;
              color: #475569;
            }
            h3 {
              color: #0f766e;
              font-size: 14pt;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 5px;
              margin-top: 25px;
            }
            h4 {
              color: #78350f;
              font-size: 12pt;
              margin-top: 20px;
            }
            p, li {
              font-size: 11pt;
              color: #334155;
            }
            ul {
              padding-left: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>COMPTROLLER & AUDITOR GENERAL OF INDIA</h1>
            <h2>DEPARTMENT OF DEFENCE ACQUISITIONS — FORENSIC AUDIT RECORD</h2>
          </div>
          
          <table class="meta-table">
            <tr>
              <td class="meta-label">REPORT ID</td>
              <td>${currentReport.id}</td>
              <td class="meta-label">DATE GENERATED</td>
              <td>${currentReport.createdAt}</td>
            </tr>
            <tr>
              <td class="meta-label">SUBJECT CONTRACT</td>
              <td>${currentReport.contractTitle || currentReport.contractId}</td>
              <td class="meta-label">LEAD AUDITOR</td>
              <td>${currentReport.generatedBy}</td>
            </tr>
            <tr>
              <td class="meta-label">DOCUMENT STATUS</td>
              <td>Draft Vetted (Finalized)</td>
              <td class="meta-label">SECURITY RATING</td>
              <td style="color: #e11d48; font-weight: bold;">SECRET (CLASS IX)</td>
            </tr>
          </table>

          <div>
            ${currentReport.generatedContent
              .split('\n')
              .map(line => {
                const trimmed = line.trim();
                if (!trimmed) return '';
                if (trimmed.startsWith('### ')) {
                  return `<h3>${trimmed.replace('### ', '')}</h3>`;
                }
                if (trimmed.startsWith('#### ')) {
                  return `<h4>${trimmed.replace('#### ', '')}</h4>`;
                }
                if (trimmed.startsWith('## ')) {
                  return `<h2>${trimmed.replace('## ', '')}</h2>`;
                }
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  return `<li>${trimmed.substring(2)}</li>`;
                }
                let parsedLine = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return `<p>${parsedLine}</p>`;
              })
              .join('\n')}
          </div>
        </body>
        </html>
      `;

      const element = document.createElement("a");
      const file = new Blob(['\ufeff' + formattedHtml], {type: 'application/msword'});
      element.href = URL.createObjectURL(file);
      element.download = `${currentReport.title.replace(/\s+/g, "_")}.doc`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 select-none flex-1 relative min-h-screen bg-[#030303] text-slate-100 overflow-x-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* SECTION HEADER */}
        <div className="pb-6 border-b border-cyber-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display font-medium text-lg sm:text-2xl text-white flex items-center gap-2.5">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-teal-light shrink-0" />
            <span className="truncate">Forensic Audit Report Builder</span>
          </h1>
          <p className="text-slate-450 text-xs mt-1">Acquire and compile state-vetted defense procurement files into highly formal GFR Audit Report drafts.</p>
        </div>
        <div className="flex items-center gap-3">
          <AISettingsControl />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ACTION PANEL (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-cyber-card border border-cyber-border rounded-xl space-y-4">
            <h3 className="font-display text-xs font-semibold text-white uppercase tracking-wider mb-2">Configure Target Dossier</h3>
            
            {/* Choose Target Contract */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-450 font-mono block mb-2">Subject Contract File</label>
              <select
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                className="w-full bg-cyber-dark/85 border border-cyber-border rounded-lg text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-cyber-teal"
              >
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>{c.id} - {c.title.substring(0, 32)}...</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 px-4 bg-cyber-teal hover:bg-cyber-teal-light border border-cyber-teal-light/20 text-white font-semibold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>DRAFTING COMPLIANCE PAGES...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyber-gold" />
                  <span>GENERATE FORENSIC DRAFT</span>
                </>
              )}
            </button>
          </div>

          {/* HISTORICAL ARCHIVE LISTING */}
          <div className="p-5 bg-cyber-card border border-cyber-border rounded-xl">
            <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-cyber-border pb-3">DRAFT HISTORY ARCHIVE</h4>
            
            <div className="space-y-3.5">
              {reports.map((rep) => (
                <button
                  key={rep.id}
                  onClick={() => setCurrentReport(rep)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-start gap-2.5 ${
                    currentReport?.id === rep.id 
                      ? "bg-cyber-navy/40 border-cyber-teal-light/35 text-white"
                      : "bg-cyber-dark hover:bg-cyber-card-hover border-cyber-border text-slate-350"
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 mt-0.5 text-cyber-teal-light" />
                  <div>
                    <span className="font-semibold block truncate leading-normal">{rep.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{rep.createdAt} &bull; {rep.generatedBy}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* WORK DOC PREVIEW (8 Columns) */}
        <div className="lg:col-span-8 bg-cyber-card border border-cyber-border rounded-xl flex flex-col justify-between overflow-hidden min-h-[320px] sm:min-h-[500px]">
          {/* Work doc sheet body */}
          <div className="p-4 sm:p-6 md:p-8 flex-1 bg-cyber-dark/40 overflow-y-auto max-h-[50vh] sm:max-h-[600px]">
            {currentReport ? (
              <div className="prose prose-invert max-w-none text-slate-300 font-sans text-xs leading-relaxed space-y-4">
                {/* Formal header stamp */}
                <div className="border-b-2 border-cyber-border pb-6 text-center text-slate-400 font-mono mb-6">
                  <h4 className="font-bold text-white tracking-widest text-[11px] uppercase">OFFICIAL COMMISSION DOCUMENT</h4>
                  <p className="text-[10px] text-cyber-gold mt-1">COMPTROLLER & AUDITOR GENERAL OF INDIA — SECRET RECORD CLASS IX</p>
                  <div className="mt-4 flex items-center justify-between text-[9px] text-slate-500">
                    <span>INDEX NO: {currentReport.id}</span>
                    <span>GENERATED BY: {currentReport.generatedBy}</span>
                    <span>DATE: {currentReport.createdAt}</span>
                  </div>
                </div>

                <div 
                  className="whitespace-pre-wrap font-sans text-xs text-slate-200"
                  dangerouslySetInnerHTML={{ __html: formatReportText(currentReport.generatedContent) }}
                />
              </div>
            ) : generating ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <Loader2 className="w-10 h-10 text-cyber-teal-light animate-spin mb-4" />
                <h4 className="text-white text-sm font-semibold">Chakravek RAG Assembler Compiling Draft...</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Extracting prices vectors, beneficial ownership paths, and sole-bid waived directives inside military registers.</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-500 font-mono">
                <FileText className="w-12 h-12 text-cyber-border mb-4" />
                <span className="text-xs">CONFIGURE A TARGET DOSSIER AND INITIATE FORENSIC GENERATION</span>
              </div>
            )}
          </div>

          {/* Export bar footer */}
          {currentReport && (
            <div className="p-4 bg-cyber-dark/80 border-t border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-slate-500">Document status: <strong>Draft Vetted (Finalized)</strong></span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2.5 min-h-11 bg-cyber-card hover:bg-cyber-card-hover border border-cyber-border text-slate-300 hover:text-white rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyber-teal-light" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => triggerExport('PDF')}
                  className="px-3.5 py-2.5 min-h-11 bg-cyber-card hover:bg-cyber-card-hover border border-cyber-border text-slate-300 hover:text-white rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyber-teal-light" />
                  <span>Download .PDF</span>
                </button>
                <button
                  onClick={() => triggerExport('DOCX')}
                  className="px-3.5 py-2.5 min-h-11 bg-cyber-card hover:bg-cyber-card-hover border border-cyber-border text-slate-300 hover:text-white rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyber-teal-light" />
                  <span>Download .DOCX</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
