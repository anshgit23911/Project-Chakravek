import React, { useState, useEffect } from "react";
import { 
  Building2, 
  HelpCircle, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  ShieldAlert, 
  FileText,
  Search,
  ArrowRight,
  ClipboardCheck,
  Copy,
  Check
} from "lucide-react";
import { Contract, AuditObservation } from "../types";
import AISettingsControl, { getAISettings } from "../components/AISettingsControl";
import { formatReportText } from "../lib/utils";

export default function CAGAssistantPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [observing, setObserving] = useState(false);
  const [observations, setObservations] = useState<AuditObservation[]>([]);
  const [currentObs, setCurrentObs] = useState<AuditObservation | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!currentObs) return;
    try {
      const textToCopy = `
COMPTROLLER & AUDITOR GENERAL OF INDIA
DEPT. OF DEFENCE ACQUISITIONS — AUDIT INQUIRY MEMO

${currentObs.formalTitle}
Status: REGULATORY DRAFT

[Audit Guideline Reference Marker]
${currentObs.regulatoryReference}

[Audit Observations Findings]
${currentObs.observationText}

[CAG Systemic Rule Recommendations]
${currentObs.recommendation}
`.trim();
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Filter Search
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/contracts")
      .then(res => res.json())
      .then(data => {
        setContracts(data);
        if (data.length > 0) setSelectedId(data[0].id);
      });

    // Populate initial observations list
    setObservations([
      {
        id: "obs-init",
        contractId: "C-7310",
        contractTitle: "S-Band Air Surveillance Microwave Receiver Modules",
        vendorId: "V-105",
        vendorName: "NovaTech Intelligence Systems",
        formalTitle: "CAG Deficit Inspexi of Radar Components Procurement Pricing",
        regulatoryReference: "GFR-2017 (Comptroller Central Rule Exception Annexure IX)",
        observationText: "The technical committee finalized C-7310 for 45 alert microwave receiver panels on direct single-source nomination. The catalog tracking model demonstrates unit-costs are escalated to INR 1.07 Crore against standard baseline averages of INR 0.44 Crore. This pricing gap denotes an unaccounted fiscal leak of INR 28.3 Crore directly benefitting NovaTech.",
        recommendation: "Issue cause notice to the IAF technical committee. Complete dynamic ledger analysis comparing past radar catalog contracts.",
        generatedAt: "2026-06-18"
      }
    ]);
  }, []);

  const handleGenerateObservation = async () => {
    if (!selectedId) return;
    setObserving(true);
    const { provider, model } = getAISettings();
    try {
      const res = await fetch("/api/ai/audit-observation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId: selectedId, provider, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "CAG Compiler handshake timed out.");

      setCurrentObs(data.observation);
      setObservations(prev => [data.observation, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setObserving(false);
    }
  };

  const filteredObservations = observations.filter(o => 
    o.contractId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.formalTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 select-none flex-1 relative min-h-screen bg-[#030303] text-slate-100 overflow-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* SECTION HEADER */}
        <div className="pb-6 border-b border-cyber-border flex items-center justify-between">
        <div>
          <h1 className="font-display font-medium text-2xl text-white flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-cyber-teal-light" />
            <span>CAG Audit Inquiry Assistant</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Specialized CAG observation composer. Instantly output GFR-aligned legal and constitutional language.</p>
        </div>
        <div className="flex items-center gap-3">
          <AISettingsControl />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT SELECTOR PANEL (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 bg-cyber-card border border-cyber-border rounded-xl space-y-5">
            <h3 className="font-display text-xs font-semibold text-white uppercase tracking-wider border-b border-cyber-border pb-3">Observation Generator</h3>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-450 font-mono block mb-2">Subject Contract</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full bg-cyber-dark/85 border border-cyber-border rounded-lg text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-cyber-teal"
              >
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>{c.id} - {c.title.substring(0, 36)}...</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateObservation}
              disabled={observing}
              className="w-full py-3 px-4 bg-cyber-teal hover:bg-cyber-teal-light text-white font-semibold text-xs rounded-lg border border-cyber-teal-light/20 shadow-md transition-all flex items-center justify-center gap-2"
            >
              {observing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>DRAFTING LEGAL CAG DIRECTIVES...</span>
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-4 h-4 text-cyber-gold" />
                  <span>COMPOSE AUDIT OBSERVATION</span>
                </>
              )}
            </button>
          </div>

          {/* OBSERVATIONS FILE INDEX LISTING */}
          <div className="p-5 bg-cyber-card border border-cyber-border rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
              <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider">FILED OBSERVATIONS</h4>
              <span className="text-[10px] font-mono text-slate-450 font-bold">{filteredObservations.length} Drafts</span>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search filings index..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-cyber-dark border border-cyber-border rounded-lg text-xs pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyber-teal text-white"
              />
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto">
              {filteredObservations.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setCurrentObs(o)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex flex-col gap-1.5 ${
                    currentObs?.id === o.id
                      ? "bg-cyber-navy/40 border-cyber-teal-light/35 text-white"
                      : "bg-cyber-dark hover:bg-cyber-card-hover border-cyber-border text-slate-350"
                  }`}
                >
                  <span className="font-semibold block truncate text-slate-100">{o.formalTitle}</span>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono w-full">
                    <span>CONTRACT: {o.contractId}</span>
                    <span>{o.generatedAt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COMPILER OUTPUT BOARD (7 Columns) */}
        <div className="lg:col-span-7 bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col justify-between min-h-[450px]">
          {currentObs ? (
            <div className="space-y-6">
              {/* Draft Stamp */}
              <div className="p-3.5 bg-cyber-dark border border-cyber-border rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-cyber-gold font-mono tracking-widest">CAG COMPOSER ACTIVE DIRECTIVE</h5>
                  <p className="text-xs font-semibold text-white mt-1">{currentObs.formalTitle}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 bg-cyber-card hover:bg-cyber-card-hover border border-cyber-border text-slate-300 hover:text-white rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                  <span className="shrink-0 text-[10px] font-mono font-bold bg-amber-500/10 text-[#f59e0b] border border-amber-500/20 px-2 py-1.5 rounded">
                    REGULATORY DRAFT
                  </span>
                </div>
              </div>

              {/* Regulatory Reference Citation */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-slate-550 block">Audit Guideline Reference Marker</span>
                <p className="text-xs text-slate-350 font-mono italic">{currentObs.regulatoryReference}</p>
              </div>

              {/* Main Analysis Text */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-slate-550 block bg-cyber-dark/45 px-2 py-1 rounded inline-block">Audit Observations Findings</span>
                <p 
                  className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: formatReportText(currentObs.observationText) }}
                />
              </div>

              {/* Action recommendation */}
              <div className="p-4 bg-teal-950/10 border border-cyber-teal/30 rounded-xl space-y-1 bg-gradient-to-r from-cyber-navy/30 to-cyber-bg">
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-cyber-teal-light block">CAG Systemic Rule Recommendations</span>
                <p className="text-xs text-slate-300 font-serif leading-relaxed italic">&ldquo;{currentObs.recommendation}&rdquo;</p>
              </div>
            </div>
          ) : observing ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <Loader2 className="w-10 h-10 text-cyber-teal-light animate-spin mb-4" />
              <h4 className="text-white text-sm font-semibold">Generating Legal Vetting Language...</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">Applying Comptroller regulatory GFR Rule formats directly inside current audit database models.</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-500 font-mono">
              <HelpCircle className="w-12 h-12 text-cyber-border mb-4" />
              <span className="text-xs uppercase tracking-wider">SELECT OR COMPOSE TO COMPRESS VETTING MEMO</span>
            </div>
          )}

          {currentObs && (
            <div className="pt-5 mt-5 border-t border-cyber-border/40 text-[10px] font-mono text-slate-505 flex items-center justify-between">
              <span>Station clearance badge: CAG SEC-9921</span>
              <span>2026 Procurement oversight indexes</span>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
