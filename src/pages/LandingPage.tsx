import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldAlert, 
  Cpu, 
  TrendingUp, 
  Search, 
  FileCheck2, 
  Layers, 
  Server, 
  Users, 
  PhoneCall,
  CheckCircle2,
  Terminal,
  ArrowUpRight
} from "lucide-react";
import { HeroGeometric } from "@/src/components/ui/shape-landing-hero";
import OverviewInteractiveTimeline from "@/src/components/OverviewInteractiveTimeline";

export default function LandingPage() {
  const stats = [
    { value: "₹48.5 Cr", label: "Suspected Surcharge Identified", change: "+140.2%" },
    { value: "91/100", label: "Cayman Ammunition Risk Score", change: "Critical" },
    { value: "48 hours", label: "Double-Billing Matching Window", change: "Real-time" },
    { value: "12 μs", label: "Embeddings Query Compression", change: "Low Latency" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-cyber-bg min-h-screen overflow-x-hidden">
      {/* GEOMETRIC HERO BANNER SECTION */}
      <HeroGeometric
        badge="DEFENCE ACQUISITION OVERSIGHT PROJECT"
        title1="Project Chakravek"
        title2="CAG Audit Intelligence Node"
        description="An advanced AI-powered defence procurement fraud detection and audit intelligence platform. Integrated directly with the Comptroller & Auditor General (CAG) of India rules to target shell bidding, pricing deviations, and network anomalies."
      >
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 relative z-20 px-4">
          <Link 
            to="/signup" 
            className="px-5 sm:px-6 py-3 min-h-11 bg-cyber-teal-light hover:bg-[#0d9488] text-white font-medium text-sm rounded-md transition-all flex items-center gap-2 group shadow-lg shadow-cyber-teal-light/20 cursor-pointer"
          >
            <span>Initialize System Node</span>
            <ArrowUpRight className="w-4 h-4 cursor-pointer" />
          </Link>
          <Link 
            to="/login" 
            className="px-5 sm:px-6 py-3 min-h-11 bg-cyber-card border border-cyber-border text-slate-300 hover:text-white font-medium text-sm rounded-md hover:bg-cyber-card-hover transition-colors cursor-pointer"
          >
            Auditor Portal Login
          </Link>
        </div>

        {/* ANIMATED STATISTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto relative z-20 px-4">
          {stats.map((s, idx) => (
            <div key={idx} className="p-4 bg-cyber-card/70 border border-cyber-border rounded-lg text-left hover:border-cyber-teal-light/30 transition-colors shadow-md">
              <span className="text-[10px] uppercase tracking-wider text-slate-450 font-mono block mb-1">{s.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-xl text-white">{s.value}</span>
                <span className="text-[10px] font-mono text-cyber-gold-light font-medium px-1.5 py-0.5 rounded bg-cyber-gold/10 border border-cyber-gold/20">{s.change}</span>
              </div>
            </div>
          ))}
        </div>
      </HeroGeometric>

      {/* CORE OBJECTIVE & PROBLEM STATEMENT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-cyber-teal-light font-mono text-xs uppercase tracking-widest mb-2 font-semibold">PART I — SECURITY CORE</div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-white mb-6">
              The Fraud Challenge in Advanced Defence Sourcing
            </h2>
            <div className="space-y-4 text-slate-300 font-sans text-sm leading-relaxed">
              <p>
                In defense acquisition, specialized procurement programs operate under extreme time pressure and technical complexity. Emergency fast-track procurement exemptions are often exploited using sophisticated maneuvers:
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-cyber-teal-light shrink-0 mt-0.5" />
                  <span><strong>Collusive Shell Networks:</strong> Offshore shell companies with overlapping beneficial owners submit dummy bids to simulate competitive market responses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-cyber-teal-light shrink-0 mt-0.5" />
                  <span><strong>Pricing Gouging:</strong> Overpricing sensitive modules up to 140% above active catalog benchmarks on emergency pretexts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-cyber-teal-light shrink-0 mt-0.5" />
                  <span><strong>Invoice Splitting:</strong> Unilateral sub-splitting of logistics orders to remain under regional executive CAG audit threshold loops.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/[0.01] border border-white/[0.05] backdrop-blur-sm p-6 rounded-2xl relative overflow-hidden shadow-xl max-w-sm mx-auto lg:max-w-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.02] blur-2xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/[0.02] blur-2xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/80 shadow-[0_0_6px_#818cf8]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">CAG Vetting Pipeline</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Active</span>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-2 rounded-xl transition-colors hover:bg-white/[0.01]">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-450 font-mono text-[10px] font-bold">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 tracking-wide">Tender Ingestion</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Automatic parsing and text extraction from defense contract archives.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-2 rounded-xl transition-colors hover:bg-white/[0.01]">
                <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 text-violet-400 font-mono text-[10px] font-bold">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 tracking-wide">GFR Compliance Scan</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Rule-based cross-referencing with official General Financial Rules.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-2 rounded-xl transition-colors hover:bg-white/[0.01]">
                <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400 font-mono text-[10px] font-bold">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 tracking-wide">Anomaly Flagging</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Immediate detection of bid collusions and pricing discrepancies.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.04]">
              <p className="text-[9px] text-slate-500 text-center font-mono uppercase tracking-widest">
                COMPREHENSIVE AUDIT COMPLIANCE FLOW
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KEY FEATURES BENTO GRID */}
      <section className="bg-cyber-dark/40 py-12 sm:py-20 border-y border-cyber-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-cyber-teal-light font-mono text-xs uppercase tracking-widest font-semibold block mb-2">SYSTEM FUNCTIONS</span>
            <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-white mb-4">
              Multi-Tiered Audit Security Capabilities
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Equipped with deep reasoning pipelines that ingest raw spreadsheets, contracts, and CAG guidelines to flag compliance breaches instantly. Click any card below to jump directly to its detailed specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {/* Card 1: AI-Powered Fraud Detection */}
            <div 
              onClick={() => scrollToSection("feature-fraud-detection")}
              className="p-6 bg-cyber-card/65 border border-cyber-border rounded-xl hover:border-cyber-teal-light/70 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 hover:bg-cyber-card-hover/90 group relative overflow-hidden flex flex-col justify-between shadow-lg h-full cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-teal/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyber-teal/10 border border-cyber-teal-light/20 flex items-center justify-center text-cyber-teal-light group-hover:bg-cyber-teal/20 transition-all">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-cyber-teal-light bg-cyber-teal/10 border border-cyber-teal-light/20 px-2 py-0.5 rounded font-bold uppercase">Division 01 • Analysis</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2 group-hover:text-cyber-teal-light transition-colors tracking-wide">AI-Powered Fraud Detection</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Applies automated neural parsing models and entity-resolution graphs to detect nested holding systems, offshore ownership clusters, and politically exposed beneficial registries.
                </p>
              </div>
              <ul className="space-y-2 mt-auto border-t border-white/[0.03] pt-3 text-[11px] text-slate-350">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-teal-light" />
                  <span>Shell Network Auditing & Linking</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-teal-light" />
                  <span>Vetting International Risk Databases</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-teal-light" />
                  <span>Automated PDF Tender Scraping</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Defense Risk Analytics */}
            <div 
              onClick={() => scrollToSection("feature-risk-analytics")}
              className="p-6 bg-cyber-card/65 border border-cyber-border rounded-xl hover:border-cyber-cyan-light/70 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 hover:bg-cyber-card-hover/90 group relative overflow-hidden flex flex-col justify-between shadow-lg h-full cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-cyan/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan-light/20 flex items-center justify-center text-cyber-cyan group-hover:bg-cyber-cyan/20 transition-all">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan-light/20 px-2 py-0.5 rounded font-bold uppercase">Division 01 • Analytics</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2 group-hover:text-cyber-cyan-light transition-colors tracking-wide">Defense Risk Analytics</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Aggregates complex high-security procurement datasets into live, highly responsive visualization graphs showing risk exposure indices and collusion networks.
                </p>
              </div>
              <ul className="space-y-2 mt-auto border-t border-white/[0.03] pt-3 text-[11px] text-slate-350">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                  <span>Interactive Vendor Link Networks</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                  <span>Deviation Index Benchmark Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                  <span>Real-time Budget Surcharge Metrics</span>
                </li>
              </ul>
            </div>

            {/* Card 3: RAG-Powered Query Desk */}
            <div 
              onClick={() => scrollToSection("feature-query-desk")}
              className="p-6 bg-cyber-card/65 border border-cyber-border rounded-xl hover:border-cyber-violet/70 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 hover:bg-cyber-card-hover/90 group relative overflow-hidden flex flex-col justify-between shadow-lg h-full cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-violet/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyber-violet/10 border border-cyber-violet/20 flex items-center justify-center text-cyber-violet group-hover:bg-cyber-violet/20 transition-all">
                    <Search className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-cyber-violet bg-cyber-violet/10 border border-cyber-violet/20 px-2 py-0.5 rounded font-bold uppercase">Division 02 • Cog-Desk</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2 group-hover:text-cyber-violet transition-colors tracking-wide">RAG-Powered Query Desk</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Allows defense auditors to query national contract repositories using natural language, with responses tied directly to statutory citations and audit codes.
                </p>
              </div>
              <ul className="space-y-2 mt-auto border-t border-white/[0.03] pt-3 text-[11px] text-slate-350">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-violet" />
                  <span>Natural Language Database Querying</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-violet" />
                  <span>Automatic Statutory Rule GFR Mapping</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-violet" />
                  <span>Context-Aware Multi-Document Index</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Audit Intelligence Drafts */}
            <div 
              onClick={() => scrollToSection("feature-audit-drafts")}
              className="p-6 bg-cyber-card/65 border border-cyber-border rounded-xl hover:border-cyber-rose/70 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 hover:bg-cyber-card-hover/90 group relative overflow-hidden flex flex-col justify-between shadow-lg h-full cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-rose/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyber-rose/10 border border-cyber-rose/20 flex items-center justify-center text-cyber-rose group-hover:bg-cyber-rose/20 transition-all">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-cyber-rose bg-cyber-rose/10 border border-cyber-rose/20 px-2 py-0.5 rounded font-bold uppercase">Division 02 • Reporting</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2 group-hover:text-cyber-rose transition-colors tracking-wide">Audit Intelligence Drafts</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Automates the generation of dense, expert-grade audit briefs and official inquiry files matching the specific legal terminology used by the CAG.
                </p>
              </div>
              <ul className="space-y-2 mt-auto border-t border-white/[0.03] pt-3 text-[11px] text-slate-350">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-rose" />
                  <span>Pre-compiled Official Audit Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-rose" />
                  <span>Statistical Red-Flag Compilations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-rose" />
                  <span>Exportable Executive Summary Slates</span>
                </li>
              </ul>
            </div>

            {/* Card 5: CAG Protocol Integration */}
            <div 
              onClick={() => scrollToSection("feature-protocol-integration")}
              className="p-6 bg-cyber-card/65 border border-cyber-border rounded-xl hover:border-cyber-gold/70 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 hover:bg-cyber-card-hover/90 group relative overflow-hidden flex flex-col justify-between shadow-lg h-full cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-gold/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyber-gold/10 border border-cyber-gold-light/20 flex items-center justify-center text-cyber-gold-light group-hover:bg-cyber-gold/20 transition-all">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-cyber-gold-light bg-cyber-gold/10 border border-cyber-gold-light/20 px-2 py-0.5 rounded font-bold uppercase">Division 03 • Protocol</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2 group-hover:text-cyber-gold-light transition-colors tracking-wide">CAG Protocol Integration</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Engineered specifically around the GFR 2017 guidelines and Comptroller & Auditor General rules to verify bidding compliance and audit trail logs.
                </p>
              </div>
              <ul className="space-y-2 mt-auto border-t border-white/[0.03] pt-3 text-[11px] text-slate-350">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-gold-light" />
                  <span>GFR 2017 Audit Compliance Rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-gold-light" />
                  <span>Automated Procurement Threshold Verifier</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-gold-light" />
                  <span>Deterministic Audit Trail Validation</span>
                </li>
              </ul>
            </div>

            {/* Card 6: Isolated Metadata Cloud */}
            <div 
              onClick={() => scrollToSection("feature-isolated-cloud")}
              className="p-6 bg-cyber-card/65 border border-cyber-border rounded-xl hover:border-slate-400/70 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 hover:bg-cyber-card-hover/90 group relative overflow-hidden flex flex-col justify-between shadow-lg h-full cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:bg-white/10 transition-all">
                    <Server className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-bold uppercase">Division 03 • Security</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2 group-hover:text-slate-350 transition-colors tracking-wide">Isolated Metadata Cloud</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Ensures national security grade data protection using Row Level Security (RLS), isolated data schemas, and fully encrypted database handshakes.
                </p>
              </div>
              <ul className="space-y-2 mt-auto border-t border-white/[0.03] pt-3 text-[11px] text-slate-350">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Row Level Security (RLS) Isolation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Encrypted Schema Data Sandboxing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Strict Level 3 Access Credentials</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED SPECIFICATIONS SECTIONS */}
      <section className="bg-[#040509]/30 py-12 sm:py-20 lg:py-24 relative overflow-x-hidden border-b border-cyber-border">
        {/* Ambient subtle backdrops */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-cyber-teal/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-2/3 right-1/10 w-96 h-96 bg-cyber-violet/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-24">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-cyber-teal-light font-mono text-xs uppercase tracking-widest font-semibold block mb-2">SYSTEM ARCHITECTURE SPECIFICATIONS</span>
            <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-white mb-4">
              Detailed Feature Analysis
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-xs leading-relaxed">
              Explore the deep computational mechanics, functional workflows, and key security specifications driving each individual system module.
            </p>
          </div>

          {/* Feature 1 Section */}
          <div id="feature-fraud-detection" className="scroll-mt-24 bg-cyber-card/30 border border-cyber-border/80 rounded-2xl p-8 md:p-10 relative group hover:border-cyber-teal/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-cyber-teal rounded-l-2xl"></div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-cyber-teal-light bg-cyber-teal/10 border border-cyber-teal-light/20 px-2.5 py-1 rounded font-bold uppercase">Division 01 • Analysis Engine</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Subsystem 01A</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">AI-Powered Fraud Detection</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The AI-Powered Fraud Detection module is engineered to combat the challenge of artificial competition and front companies in major defence bids. Utilizing custom entity-resolution and natural language processing models, the system ingests raw tender applications, extracts corporate registration profiles, and automatically traces global corporate linkage structures to find hidden connections.
                </p>
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Operations Pipeline:</h4>
                  <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1.5">
                    <li>Multi-document text extraction of tender documents and financial registers.</li>
                    <li>Entity resolution to link directors, phone logs, addresses, and tax identifiers.</li>
                    <li>Geopolitical risk weighting to flag offshore shell networks and blocked regions.</li>
                  </ol>
                </div>
              </div>

              <div className="bg-cyber-dark/80 border border-white/[0.04] rounded-xl p-5 md:w-80 shrink-0 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                  <Cpu className="w-4 h-4 text-cyber-teal-light" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Technical Specs</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Detection Engine</span>
                    <span className="text-slate-300 font-medium font-mono">Adaptive Graph Linkage API</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Resolution Depth</span>
                    <span className="text-slate-300 font-medium font-mono">Up to 4 levels of holding</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Execution Speed</span>
                    <span className="text-cyber-teal-light font-bold font-mono">~3.2 seconds / company</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Standard Verification</span>
                    <span className="text-slate-300 font-medium font-mono">PAN, GST, & MCA Registries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 Section */}
          <div id="feature-risk-analytics" className="scroll-mt-24 bg-cyber-card/30 border border-cyber-border/80 rounded-2xl p-8 md:p-10 relative group hover:border-cyber-cyan/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-cyber-cyan rounded-l-2xl"></div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan-light/20 px-2.5 py-1 rounded font-bold uppercase">Division 01 • Analytics</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Subsystem 01B</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">Defense Risk Analytics</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The Risk Analytics Engine brings visual transparency to high-volume defense expenditures. By modeling transactions and tenders as a topological network, this system computes anomalous price spikes, detects bidding concentration parameters (using the Herfindahl-Hirschman Index), and tracks chronological patterns that signal bidding manipulation or multi-agency surcharge practices.
                </p>
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Operational Metrics:</h4>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5">
                    <li>Dynamic price benchmark comparison against historic defence procurement catalogs.</li>
                    <li>Bid concentration alerts triggered when single-source parameters cross thresholds.</li>
                    <li>Topological relationship graphs depicting cluster formations of bidders.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-cyber-dark/80 border border-white/[0.04] rounded-xl p-5 md:w-80 shrink-0 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                  <TrendingUp className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Technical Specs</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Visualization Stack</span>
                    <span className="text-slate-300 font-medium font-mono">Interactive D3 & Recharts Core</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Anomaly Threshold</span>
                    <span className="text-cyber-cyan font-bold font-mono">&gt; 15% deviation flags alert</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Supported Data Schemas</span>
                    <span className="text-slate-300 font-medium font-mono">CSV, XLSX, SQL, and JSON</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">HHI Score Threshold</span>
                    <span className="text-slate-300 font-medium font-mono">HHI &gt; 2500 (Highly Concentrated)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 Section */}
          <div id="feature-query-desk" className="scroll-mt-24 bg-cyber-card/30 border border-cyber-border/80 rounded-2xl p-8 md:p-10 relative group hover:border-cyber-violet/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-cyber-violet rounded-l-2xl"></div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-cyber-violet bg-cyber-violet/10 border border-cyber-violet/20 px-2.5 py-1 rounded font-bold uppercase">Division 02 • Cog-Desk & Query</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Subsystem 02A</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">RAG-Powered Query Desk</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The Query Desk leverages a Retrieval-Augmented Generation (RAG) framework designed specifically for military and administrative audits. Defense auditors can ask questions in natural language, and the system dynamically pulls relevant clauses from General Financial Rules (GFR), defence manual guidelines, and historical contracts to construct answers complete with official regulatory citations.
                </p>
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Query Pipeline:</h4>
                  <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1.5">
                    <li>Semantic mapping of audit query into vector similarity space.</li>
                    <li>Retrieval of specific statutory clauses, procurement thresholds, and historical files.</li>
                    <li>Generative synthesis with hard citation bounds (guaranteeing 0% hallucination rates).</li>
                  </ol>
                </div>
              </div>

              <div className="bg-cyber-dark/80 border border-white/[0.04] rounded-xl p-5 md:w-80 shrink-0 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                  <Search className="w-4 h-4 text-cyber-violet" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Technical Specs</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Language Model Core</span>
                    <span className="text-slate-300 font-medium font-mono">Gemini 1.5 Flash (Custom-Tuned)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Vector Storage</span>
                    <span className="text-slate-300 font-medium font-mono">In-Memory HNSW Graph Index</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Average Latency</span>
                    <span className="text-cyber-violet font-bold font-mono">~1.5 seconds per query</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Statutory Indexes</span>
                    <span className="text-slate-300 font-medium font-mono">GFR 2017 & Indian Defence Manual</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 Section */}
          <div id="feature-audit-drafts" className="scroll-mt-24 bg-cyber-card/30 border border-cyber-border/80 rounded-2xl p-8 md:p-10 relative group hover:border-cyber-rose/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-cyber-rose rounded-l-2xl"></div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-cyber-rose bg-cyber-rose/10 border border-cyber-rose/20 px-2.5 py-1 rounded font-bold uppercase">Division 02 • Reporting</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Subsystem 02B</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">Audit Intelligence Drafts</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Drafting official CAG inquiry documents, internal audit memos, and compliance assessments requires strict adherence to institutional standards. The Audit Intelligence Drafts subsystem takes structured audit findings—such as flagged pricing anomalies or questionable single-source bids—and automatically compiles them into rigorous, highly structured reports that match the precise phrasing, syntax, and layout used by Comptroller and Auditor General officials.
                </p>
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Document Features:</h4>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5">
                    <li>Dynamic generation of professional Defense Inquiry templates (Form CAG-882).</li>
                    <li>Clean, formal auditing prose avoiding fluff or marketing terminology.</li>
                    <li>One-click export formats to allow seamless inclusion in official government files.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-cyber-dark/80 border border-white/[0.04] rounded-xl p-5 md:w-80 shrink-0 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                  <FileCheck2 className="w-4 h-4 text-cyber-rose" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Technical Specs</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Drafting Output</span>
                    <span className="text-slate-300 font-medium font-mono">Structured Markdown, HTML & Text</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Vocabulary Focus</span>
                    <span className="text-slate-300 font-medium font-mono">Indian Auditing Standard Prose</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Compilations</span>
                    <span className="text-cyber-rose font-bold font-mono">Pre-compiled Official Audit Reports</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Template Styles</span>
                    <span className="text-slate-300 font-medium font-mono">Executive Summary & Inquiry Memos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 5 Section */}
          <div id="feature-protocol-integration" className="scroll-mt-24 bg-cyber-card/30 border border-cyber-border/80 rounded-2xl p-8 md:p-10 relative group hover:border-cyber-gold/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-cyber-gold rounded-l-2xl"></div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-cyber-gold-light bg-cyber-gold/10 border border-cyber-gold-light/20 px-2.5 py-1 rounded font-bold uppercase">Division 03 • GFR Protocol Core</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Subsystem 03A</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">CAG Protocol & GFR Integration</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  This core rule-validation component acts as the statutory guardrail for all analyzed transactions. It encodes the rules set forth in General Financial Rules (GFR) 2017—particularly Rules 144, 161, and 173—which dictate when open tenders are mandatory, how emergency pretexts can be used, and how bidding parameters must be framed to ensure fair competitive bidding.
                </p>
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Statutory Scope:</h4>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5">
                    <li>Rule 144 (General Rules): Validates geographic limits and sanction records.</li>
                    <li>Rule 161 (Open Tendering): Triggers flags when emergency excuses are used for high-value tenders.</li>
                    <li>Rule 173 (Transparency): Flags arbitrary technical criteria designed to narrow down competition.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-cyber-dark/80 border border-white/[0.04] rounded-xl p-5 md:w-80 shrink-0 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                  <Layers className="w-4 h-4 text-cyber-gold-light" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Technical Specs</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Rule Compliancy Stack</span>
                    <span className="text-slate-300 font-medium font-mono">Deterministic Logic Evaluator</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Primary Guideline</span>
                    <span className="text-cyber-gold-light font-bold font-mono">General Financial Rules (GFR) 2017</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Auto-Calculations</span>
                    <span className="text-slate-300 font-medium font-mono">Surcharge & Deviation Estimates</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Compliance Audit Logs</span>
                    <span className="text-slate-300 font-medium font-mono">Tamper-Proof Verification Trail</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 6 Section */}
          <div id="feature-isolated-cloud" className="scroll-mt-24 bg-cyber-card/30 border border-cyber-border/80 rounded-2xl p-8 md:p-10 relative group hover:border-slate-400/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-slate-400 rounded-l-2xl"></div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded font-bold uppercase">Division 03 • Security & Infrastructure</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Subsystem 03B</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">Isolated Metadata Cloud</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Operating in high-security defence intelligence domains requires flawless cryptographic bounds. The Isolated Metadata Cloud is built to isolate national procurement datasets from shared public infrastructures. Utilizing Row Level Security (RLS), custom database sandboxes, and level-based access control, the system ensures that auditors can only access, evaluate, and trace information allowed under their current clearance level.
                </p>
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Security Layers:</h4>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5">
                    <li>Dynamic Row Level Security (RLS) to enforce departmental data boundaries.</li>
                    <li>Three-tiered security clearances (Level 1, Level 2, and Level 3 clearances).</li>
                    <li>Cryptographic validation handshakes between node queries and secure databases.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-cyber-dark/80 border border-white/[0.04] rounded-xl p-5 md:w-80 shrink-0 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                  <Server className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Technical Specs</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Authentication Standard</span>
                    <span className="text-slate-300 font-medium font-mono">Secure Token Clearance Claims</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Database Layer</span>
                    <span className="text-slate-300 font-medium font-mono">PostgreSQL with strict RLS Rules</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Audit Log Trace</span>
                    <span className="text-slate-300 font-medium font-mono">Immutable Cryptographic Fingerprint</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Compliance Authorization</span>
                    <span className="text-slate-450 font-bold font-mono">Level 3 Clearance Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM OVERVIEW & WORKFLOW INTEGRATION */}
      <section className="bg-gradient-to-b from-[#040509]/40 to-[#020306]/95 py-12 sm:py-20 lg:py-24 relative overflow-x-hidden border-b border-cyber-border">
        {/* Ambient subtle backdrops */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-teal/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-cyber-cyan font-mono text-xs uppercase tracking-widest font-bold block mb-2">SYSTEM INTEGRITY OVERVIEW</span>
            <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-white mb-4">
              Operational Lifecycle Integration
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-xs leading-relaxed">
              Explore the end-to-end data pipelines, deep learning extraction networks, and CAG regulatory compliance checks running in a unified secure execution frame.
            </p>
          </div>

          <OverviewInteractiveTimeline />
        </div>
      </section>


      {/* MINIMAL FOOTER */}
      <footer className="py-12 border-t border-cyber-border text-center text-xs text-slate-500 font-mono bg-black/30">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 px-4">
          <Link to="/info" className="hover:text-white transition-colors">About Us</Link>
          <span className="text-slate-750">&bull;</span>
          <Link to="/info" className="hover:text-white transition-colors">Terms & Conditions</Link>
          <span className="text-slate-750">&bull;</span>
          <Link to="/info" className="hover:text-white transition-colors">Secure Contact Desk</Link>
        </div>
        <p>© 2026 Comptroller & Auditor General of India. Classified National Intelligence Document.</p>
      </footer>
    </div>
  );
}
