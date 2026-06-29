import React, { useState } from "react";
import { 
  Database, 
  Cpu, 
  Shield, 
  FileCheck2, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Network
} from "lucide-react";

interface Step {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  details: {
    purpose: string;
    inputs: string[];
    processing: string[];
    output: string;
    sampleDataTitle: string;
    sampleDataInput: React.ReactNode;
    sampleDataOutput: React.ReactNode;
  };
}

export default function OverviewInteractiveTimeline() {
  const [activeStep, setActiveStep] = useState<string>("ingest");

  const steps: Step[] = [
    {
      id: "ingest",
      number: "01",
      title: "Data Ingestion & Inflow",
      shortDesc: "Consolidation of MCA, PAN, GST registries, contracts, and tenders.",
      icon: Database,
      color: "text-cyber-teal-light",
      bgColor: "bg-cyber-teal/5",
      borderColor: "border-cyber-teal/30",
      accentColor: "bg-cyber-teal",
      details: {
        purpose: "Aggregates and sanitizes multi-source structured and unstructured data into a singular unified knowledge index.",
        inputs: [
          "Ministry of Corporate Affairs (MCA) registries",
          "Tax identification databases (PAN & GST)",
          "Historic Indian defense procurement tender files",
          "Raw financial balance sheets & contractor ledgers"
        ],
        processing: [
          "Document table structure extraction via PDF scrapers",
          "Fuzzy name matching and alphanumeric tax identification matching",
          "Deduplication and schema alignment into centralized relational tables"
        ],
        output: "Unified Audit-Ready Entity Ledger (UAREL)",
        sampleDataTitle: "Raw Tender Inflow Database Match",
        sampleDataInput: (
          <div className="font-mono text-[10px] text-slate-400 space-y-2">
            <div className="text-slate-500 border-b border-white/[0.04] pb-1 flex justify-between">
              <span>RAW FILE ID: TND-882-IN</span>
              <span className="text-cyber-teal-light">✓ INGESTED</span>
            </div>
            <div>
              <span className="text-white">Bidder:</span> "Kavach Defense Systems Ltd"
            </div>
            <div>
              <span className="text-white">Director:</span> "Vikram Saxena" (PAN: APXPS****K)
            </div>
            <div>
              <span className="text-white">Registered Addr:</span> "Flat 3A, Defence Colony, New Delhi"
            </div>
            <div className="pt-1 border-t border-white/[0.04] flex justify-between">
              <span>Related Entity Match:</span>
              <span className="text-cyber-teal-light">2 records found</span>
            </div>
          </div>
        ),
        sampleDataOutput: (
          <div className="font-mono text-[10px] text-slate-400 space-y-2">
            <div className="text-slate-500 border-b border-white/[0.04] pb-1 flex justify-between">
              <span>INDEX: ENT-KVH-39</span>
              <span className="text-cyber-teal-light font-bold">✓ INDEXED</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div>
                <span className="text-slate-500 block">UID CLAIM:</span>
                <span className="text-white font-semibold">91A-KVCH-DEL</span>
              </div>
              <div>
                <span className="text-slate-500 block">GST STATUS:</span>
                <span className="text-cyber-teal-light font-semibold">ACTIVE</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block">CONNECTED ADDRESSES:</span>
                <span className="text-slate-300">New Delhi (Primary), Port Louis (Holding)</span>
              </div>
            </div>
          </div>
        )
      }
    },
    {
      id: "reason",
      number: "02",
      title: "Deep Reasoning & Risks",
      shortDesc: "Entity resolution, linkage graphs, and price deviation scoring.",
      icon: Cpu,
      color: "text-cyber-cyan-light",
      bgColor: "bg-cyber-cyan/5",
      borderColor: "border-cyber-cyan/30",
      accentColor: "bg-cyber-cyan",
      details: {
        purpose: "Executes deep network analysis to trace ownership structures and calculates price anomalies against procurement benchmarks.",
        inputs: [
          "Unified Entity Ledger records",
          "Historical defense product price catalogs",
          "Inter-corporate director and shareholding links"
        ],
        processing: [
          "Multi-hop graph linkage modeling to identify circular shareholding",
          "Anomalous price detection utilizing standard median deviation algorithms",
          "Flagging front companies representing blacklisted or artificial competitors"
        ],
        output: "Audit Risk Scorecard & Corporate Linkage Map",
        sampleDataTitle: "Entity-Resolution & Price Deviation Analysis",
        sampleDataInput: (
          <div className="font-mono text-[10px] text-slate-400 space-y-2">
            <div className="text-slate-500 border-b border-white/[0.04] pb-1 flex justify-between">
              <span>EVALUATION: BID-009A</span>
              <span className="text-amber-400">⚡ PROCESSING</span>
            </div>
            <div>
              <span className="text-white">Product:</span> Tactical Radio VHF Transceiver
            </div>
            <div>
              <span className="text-white">Unit Price:</span> ₹4.2 Lakhs/unit
            </div>
            <div>
              <span className="text-white">Co-Bidders:</span> Kavach Systems, Veda Defence, Astro Ltd
            </div>
          </div>
        ),
        sampleDataOutput: (
          <div className="font-mono text-[10px] text-slate-400 space-y-1">
            <div className="text-slate-500 border-b border-white/[0.04] pb-1 flex justify-between">
              <span>RISK REPORT: FLAG-88</span>
              <span className="text-rose-500 font-bold">⚠ HIGH RISK</span>
            </div>
            <div className="flex justify-between items-center text-[9px] pt-1">
              <span className="text-slate-500">PRICE DEVIATION:</span>
              <span className="text-rose-400 font-bold">+184% vs benchmark</span>
            </div>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-500">COLLUSIVE BIDDING:</span>
              <span className="text-rose-400 font-bold">Detected</span>
            </div>
            <div className="text-[8px] bg-rose-950/20 border border-rose-900/40 p-1.5 rounded text-rose-300 mt-1">
              Direct linkage detected: Director V. Saxena owns 42% shareholding in ASTRO Ltd and Veda Defence is registered at same address.
            </div>
          </div>
        )
      }
    },
    {
      id: "vet",
      number: "03",
      title: "CAG Protocol & GFR Vetting",
      shortDesc: "Vetting against GFR 2017 rules (144, 161, 173) and regulatory guidelines.",
      icon: Shield,
      color: "text-cyber-gold-light",
      bgColor: "bg-cyber-gold/5",
      borderColor: "border-cyber-gold/30",
      accentColor: "bg-cyber-gold",
      details: {
        purpose: "Vets transactions against General Financial Rules (GFR) 2017 with hard deterministic rules to guarantee structural compliance.",
        inputs: [
          "Tender bidding metrics & emergency pretext logs",
          "General Financial Rules (GFR) 2017 corpus",
          "Indian Defense Manual 2020 guidelines"
        ],
        processing: [
          "Evaluation of GFR Rule 144 compliance (geopolitical bidder registries)",
          "Vetting of GFR Rule 161 (bypassing open tenders using emergency waivers)",
          "Vetting of GFR Rule 173 (technical criteria restriction checking)"
        ],
        output: "GFR Rule Compliance Attestation Statement",
        sampleDataTitle: "GFR Statutory Compliance Evaluator",
        sampleDataInput: (
          <div className="font-mono text-[10px] text-slate-400 space-y-2">
            <div className="text-slate-500 border-b border-white/[0.04] pb-1 flex justify-between">
              <span>RULE COMPLIANCE MATCH</span>
              <span className="text-cyan-400 font-mono">STANDARDS ACTIVE</span>
            </div>
            <div>
              <span className="text-white">Evaluated Rule:</span> GFR Rule 161 (Open Tender Waiver)
            </div>
            <div>
              <span className="text-white">Pretext Used:</span> "Urgent Tactical Deployment Requirement"
            </div>
            <div>
              <span className="text-white">Sanctioning Officer:</span> Def-Acq Sec. (L1 Clearance)
            </div>
          </div>
        ),
        sampleDataOutput: (
          <div className="font-mono text-[10px] text-slate-400 space-y-1">
            <div className="text-slate-500 border-b border-white/[0.04] pb-1 flex justify-between">
              <span>COMPLIANCE RULING</span>
              <span className="text-amber-500 font-bold">⚠ CONDITIONAL BREACH</span>
            </div>
            <div className="text-[8px] text-slate-300 space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Rule Code:</span>
                <span className="text-white font-mono">GFR-2017-R161-A</span>
              </div>
              <p className="text-slate-400 bg-black/40 p-1.5 rounded leading-normal border border-white/[0.02]">
                Emergency waiver is INVALID for acquisitions exceeding ₹100 Cr without prior cabinet committee on security clearance.
              </p>
            </div>
          </div>
        )
      }
    },
    {
      id: "report",
      number: "04",
      title: "Drafting & Reporting",
      shortDesc: "Automatic generation of CAG inquiry templates, audit reports, and logs.",
      icon: FileCheck2,
      color: "text-cyber-rose-light",
      bgColor: "bg-cyber-rose/5",
      borderColor: "border-cyber-rose/30",
      accentColor: "bg-cyber-rose",
      details: {
        purpose: "Automates the generation of official Comptroller and Auditor General inquiry documents with flawless formatting and hard-grounded evidence.",
        inputs: [
          "System flags, price deviations, and linkage data",
          "Official CAG report templates & inquiry memo guidelines",
          "Validated audit history database"
        ],
        processing: [
          "Natural language synthesis into formal auditing prose",
          "Automatic layout formatting conforming to standard government memo formats",
          "Cryptographic verification of source file attachments and evidence links"
        ],
        output: "Comptroller & Auditor General Audit Inquiry Memo (PDF/DOC)",
        sampleDataTitle: "Synthesized Audit Inquiry Memorandum",
        sampleDataInput: (
          <div className="font-mono text-[10px] text-slate-400 space-y-2">
            <div className="text-slate-500 border-b border-white/[0.04] pb-1 flex justify-between">
              <span>REPORT BUILD DESK</span>
              <span className="text-slate-400 font-mono">IDLE</span>
            </div>
            <div className="text-xs text-center py-4 text-slate-500">
              Ready to compile report based on verified evidence in Subsystems 01 and 02.
            </div>
          </div>
        ),
        sampleDataOutput: (
          <div className="font-serif text-[9px] text-slate-300 p-2.5 bg-white/5 border border-white/[0.05] rounded shadow-inner leading-relaxed space-y-1.5">
            <div className="text-center font-bold text-[8px] border-b border-white/10 pb-1 text-white uppercase font-sans tracking-wider">
              OFFICE OF THE CAG OF INDIA • DEPT. OF DEFENCE ACQUISITIONS
            </div>
            <p>
              <strong>Ref No:</strong> CAG/DEF/2026/AQ-882 <span className="float-right"><strong>Date:</strong> 28-06-2026</span>
            </p>
            <p className="text-[8px] italic">
              <strong>Sub:</strong> Inquiry into irregular bid concentration and price inflation in tender no. TND-882-IN.
            </p>
            <p className="text-[8px] text-slate-400 font-sans">
              Pursuant to GFR Rule 173 and 161, attention is drawn to the bids submitted by Kavach Defense Systems. Analysis shows a price inflation of 184% over historic catalog levels, combined with indirect shareholdings linking ASTRO Ltd...
            </p>
          </div>
        )
      }
    }
  ];

  const currentStep = steps.find(s => s.id === activeStep) || steps[0];
  const StepIcon = currentStep.icon;

  return (
    <div className="w-full space-y-12">
      {/* Tab Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {steps.map((step) => {
          const IconComponent = step.icon;
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`text-left p-5 rounded-xl border transition-all duration-300 h-full flex flex-col justify-between group relative overflow-hidden ${
                isActive 
                  ? `${step.bgColor} ${step.borderColor} shadow-[0_0_20px_rgba(255,255,255,0.02)] scale-[1.02] border-opacity-100` 
                  : "bg-cyber-card/15 border-cyber-border/40 hover:border-cyber-border hover:bg-cyber-card/30"
              }`}
            >
              {/* Highlight bar */}
              <div className={`absolute top-0 left-0 w-full h-[3px] transition-transform duration-300 ${step.accentColor} ${
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
              }`} />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs text-slate-500 font-bold">{step.number}</span>
                  <div className={`p-1.5 rounded-lg ${isActive ? "bg-white/5 text-white" : "text-slate-500 group-hover:text-white transition-colors"}`}>
                    <IconComponent className={`w-4 h-4 ${isActive ? step.color : ""}`} />
                  </div>
                </div>
                <h3 className={`text-sm font-semibold tracking-wide mb-1 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                  {step.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                  {step.shortDesc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Block */}
      <div className="bg-cyber-card/25 border border-cyber-border/60 rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-x-hidden">
        {/* Abstract subtle color accent */}
        <div className={`absolute -right-24 -bottom-24 w-80 h-80 ${currentStep.id === 'ingest' ? 'bg-cyber-teal/5' : currentStep.id === 'reason' ? 'bg-cyber-cyan/5' : currentStep.id === 'vet' ? 'bg-cyber-gold/5' : 'bg-cyber-rose/5'} rounded-full blur-3xl pointer-events-none transition-all duration-500`}></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Detailed explanations */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${currentStep.bgColor} border ${currentStep.borderColor}`}>
                <StepIcon className={`w-5 h-5 ${currentStep.color}`} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">OPERATION FOCUS • STEP {currentStep.number}</span>
                <h4 className="text-lg sm:text-xl font-semibold text-white tracking-wide">{currentStep.title}</h4>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {currentStep.details.purpose}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-white uppercase border-b border-white/[0.04] pb-1.5 block">Input Channels & Ingestion</span>
                <ul className="space-y-2">
                  {currentStep.details.inputs.map((input, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-400 leading-normal">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${currentStep.accentColor}`} />
                      <span>{input}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-white uppercase border-b border-white/[0.04] pb-1.5 block">Deep Processing Subsystem</span>
                <ul className="space-y-2">
                  {currentStep.details.processing.map((proc, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-400 leading-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                      <span>{proc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block">INTELLIGENCE NODE OUTPUT RESULT</span>
                <span className="text-xs font-mono font-bold text-white tracking-wide">{currentStep.details.output}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <Server className="w-3.5 h-3.5" />
                <span>Isolated Execution Environment</span>
              </div>
            </div>
          </div>

          {/* Code sandbox / Pipeline mock demonstration */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#040509]/80 border border-white/[0.04] rounded-xl overflow-hidden shadow-2xl h-full min-h-[340px]">
            {/* Window control banner */}
            <div className="bg-cyber-dark px-4 py-2.5 border-b border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                <span className="text-[9px] font-mono text-slate-500 uppercase ml-2 tracking-wider">Node Terminal • Subsystem {currentStep.number}</span>
              </div>
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Inflow vs Outflow mock playground content */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
              {/* Box 1: Ingest state */}
              <div className="bg-white/[0.01] border border-white/[0.03] rounded-lg p-3">
                <div className="text-[9px] font-mono font-bold text-slate-500 mb-2 uppercase tracking-widest">
                  [INPUT RAW DATASTREAM]
                </div>
                {currentStep.details.sampleDataInput}
              </div>

              {/* Transition arrow */}
              <div className="flex justify-center items-center relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-white/[0.04]" />
                </div>
                <div className="relative bg-cyber-dark/90 px-3 py-1 border border-white/[0.04] rounded-full text-[9px] font-mono text-slate-500 flex items-center gap-1.5 shadow-md">
                  <span>PROCESSED BY AI ENGINE</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Box 2: Verified output state */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
                <div className="text-[9px] font-mono font-bold text-slate-500 mb-2 uppercase tracking-widest flex items-center justify-between">
                  <span>[OUTPUT VERIFIED STATE]</span>
                  <div className="flex items-center gap-1 text-[8px] text-cyber-teal-light">
                    <CheckCircle2 className="w-2 h-2" />
                    <span>GROUNDED DEEP REASONING</span>
                  </div>
                </div>
                {currentStep.details.sampleDataOutput}
              </div>
            </div>

            {/* Footer indicator */}
            <div className="bg-cyber-dark/40 border-t border-white/[0.03] px-4 py-2 flex justify-between items-center">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                PROJECT CHAKRAVEK SECURITY PROTOCOL
              </span>
              <span className="text-[8px] font-mono text-cyber-teal-light font-bold">
                ENCRYPTED & COMPLIANT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
