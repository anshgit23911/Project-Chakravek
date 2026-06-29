import React, { useState, useEffect } from "react";
import { 
  Database, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Loader2,
  Cpu,
  FileText,
  Sparkles,
  Link,
  Server,
  RefreshCw,
  Download,
  UploadCloud,
  AlertCircle,
  Terminal,
  Copy,
  ArrowLeftRight,
  HardDrive
} from "lucide-react";
import { UploadedFile } from "../types";

export default function DataManagementPage() {
  // Supabase Configuration & Sync States
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncDirection, setSyncDirection] = useState<"import" | "export" | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [showSchema, setShowSchema] = useState(false);
  const [copied, setCopied] = useState(false);

  // Ingestion States
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // New Contract Upload Manual State
  const [manualTitle, setManualTitle] = useState("");
  const [manualVendor, setManualVendor] = useState("V-102"); // default
  const [manualAmount, setManualAmount] = useState("");
  const [manualDept, setManualDept] = useState("DRDO Command");
  const [manualCat, setManualCat] = useState("Ammunition");
  const [manualDesc, setManualDesc] = useState("");
  const [manualSuccessMsg, setManualSuccessMsg] = useState("");

  const fetchSupabaseStatus = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/supabase/status");
      const data = await res.json();
      setDbStatus(data);
      if (data.configured) {
        setSupabaseUrl(data.url || "");
        setSupabaseAnonKey(data.anonKey || "");
      }
    } catch (err) {
      console.error("Failed to fetch Supabase status", err);
    } finally {
      setChecking(false);
    }
  };

  const handleConfigureSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setErrMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/supabase/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: supabaseUrl, anonKey: supabaseAnonKey })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Configuration failed");
      setSuccessMsg("Supabase client initialized and verified successfully!");
      fetchSupabaseStatus();
    } catch (err: any) {
      setErrMsg(err.message || "Failed to configure Supabase");
    } finally {
      setChecking(false);
    }
  };

  const handleSync = async (direction: "import" | "export") => {
    setSyncing(true);
    setSyncDirection(direction);
    setErrMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/supabase/${direction}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Sync ${direction} failed`);
      setSuccessMsg(data.message || `Sync ${direction} completed successfully!`);
      fetchSupabaseStatus();
    } catch (err: any) {
      setErrMsg(err.message || `Failed to sync: ${direction}`);
    } finally {
      setSyncing(false);
      setSyncDirection(null);
    }
  };

  const schemaSql = `-- PROJECT CHAKRAVEK SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'Auditor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.vendors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    risk_score INT DEFAULT 0,
    flagged_contracts_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    registered_at DATE NOT NULL,
    tax_id VARCHAR(100) UNIQUE NOT NULL,
    owner_nationality VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    matches_peps BOOLEAN DEFAULT FALSE,
    connected_vendors TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.contracts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    vendor_id VARCHAR(50) REFERENCES public.vendors(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    department VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Executed',
    risk_score INT DEFAULT 0,
    flag_reasons TEXT[] DEFAULT ARRAY[]::TEXT[],
    flagged_count INT DEFAULT 0,
    anomaly_score INT DEFAULT 0,
    unit_price_deviation NUMERIC(6, 2) DEFAULT 0.0,
    registered_date DATE NOT NULL,
    evidence TEXT[] DEFAULT ARRAY[]::TEXT[],
    ai_explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id VARCHAR(50) REFERENCES public.contracts(id) ON DELETE CASCADE UNIQUE,
    overall_risk INT DEFAULT 0,
    vendor_risk INT DEFAULT 0,
    direct_flag_risk INT DEFAULT 0,
    price_risk INT DEFAULT 0,
    entity_network_risk INT DEFAULT 0,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    contract_id VARCHAR(50) REFERENCES public.contracts(id) ON DELETE CASCADE,
    generated_content TEXT NOT NULL,
    generated_by VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.audit_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id VARCHAR(50) REFERENCES public.contracts(id) ON DELETE CASCADE,
    vendor_id VARCHAR(50) REFERENCES public.vendors(id) ON DELETE CASCADE,
    formal_title VARCHAR(255) NOT NULL,
    regulatory_reference TEXT NOT NULL,
    observation_text TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    row_count INT,
    metadata JSONB DEFAULT '{}'::JSONB,
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id VARCHAR(50) REFERENCES public.contracts(id) ON DELETE CASCADE,
    investigator_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Open',
    notes TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/files")
      .then(res => res.json())
      .then(filesData => {
        setFiles(filesData || []);
      })
      .catch(err => console.error("Initialization failed: ", err))
      .finally(() => setLoading(false));

    fetchSupabaseStatus();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      await simulateUpload(droppedFile.name, droppedFile.size);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      await simulateUpload(selected.name, selected.size);
    }
  };

  const simulateUpload = async (name: string, size: number) => {
    setUploading(true);
    const sizeStr = (size / (1024 * 1024)).toFixed(2) + " MB";
    
    try {
      const res = await fetch("/api/admin/upload-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: name,
          fileType: name.endsWith(".csv") ? "CSV Dataset" : "PDF Document",
          fileSize: sizeStr,
          rowCount: Math.floor(Math.random() * 300 + 50)
        })
      });
      
      const updatedRes = await fetch("/api/admin/files");
      const updatedData = await updatedRes.json();
      setFiles(updatedData);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualAmount) return;

    try {
      const res = await fetch("/api/contracts/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualTitle,
          vendorId: manualVendor,
          amount: manualAmount,
          department: manualDept,
          category: manualCat,
          description: manualDesc
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Contract ingestion pipeline failed.");

      setManualSuccessMsg(`Contract registered successfully: ${data.contract.id}`);
      setManualTitle("");
      setManualAmount("");
      setManualDesc("");
      setTimeout(() => setManualSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 select-none flex-1 min-h-screen bg-[#030303] text-slate-100 overflow-x-hidden relative">
      {/* Background Radial Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-white/[0.06] gap-4 relative z-10">
        <div>
          <h1 className="font-display font-medium text-lg sm:text-2xl text-white flex items-center gap-2 sm:gap-3">
            <Database className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-teal shrink-0" />
            <span className="truncate">Data Management & Ledger Hub</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Upload defense procurement guidelines, ingest active contract sheets, or register manual audits securely.</p>
        </div>
      </div>

      {/* LEDGER INGESTION & UPLOAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FILE UPLOAD DRAG BOX (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`p-10 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center transition-all min-h-[220px] cursor-pointer ${
              dragActive 
                ? "border-indigo-500 bg-indigo-500/10" 
                : "border-white/[0.08] bg-white/[0.01] hover:border-indigo-500/30"
            }`}
          >
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block animate-pulse">INDEXING SECURE EMBEDDINGS MEMORY VECTORIZERS...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-white/[0.02] border border-white/[0.08] text-indigo-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Drag & Drop Tender Spreadsheet Files</h4>
                  <p className="text-xs text-slate-400 font-mono mt-1">Supports standard CSV sheets or military PDF audit instructions.</p>
                </div>
                <div>
                  <label className="px-4 py-2 border border-white/[0.08] hover:bg-white/[0.04] rounded-lg text-xs font-mono text-slate-300 font-semibold cursor-pointer transition-colors block max-w-fit mx-auto">
                    <span>Choose File Manually</span>
                    <input 
                      type="file" 
                      onChange={handleFileInput}
                      accept=".csv,.pdf" 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* ACTIVE INGESTION INDEX FILES LISTING */}
          <div className="p-5 bg-[#07070a]/80 border border-white/[0.06] rounded-xl">
            <h3 className="font-display text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>ACTIVE KNOWLEDGE REPOSITORY FILES</span>
            </h3>
            
            {loading ? (
              <div className="text-center font-mono text-xs text-slate-500 py-6 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                <span>RETRIEVING FILES INDEX GRAPH...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="p-3.5 bg-white/[0.01] border border-white/[0.06] rounded-xl flex items-center justify-between hover:border-white/[0.12] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/[0.02] border border-white/[0.08] text-indigo-300 rounded-lg">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white">{file.fileName}</span>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-0.5">
                          <span>{file.fileSize}</span> &bull; 
                          <span>INGESTED: {file.indexedAt}</span>
                          {file.rowCount && (
                            <> &bull; <span>{file.rowCount} rows processed</span></>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                      VECTORIZED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MANUAL CONTRACT INGESTION FORM (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="p-5 bg-[#07070a]/80 border border-white/[0.06] rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 mb-1 border-b border-white/[0.06] pb-3">
              <Cpu className="w-4.5 h-4.5 animate-pulse text-indigo-400" />
              <h3 className="font-display text-xs font-bold uppercase tracking-wider">Manual Procurement Ingestion</h3>
            </div>

            {manualSuccessMsg && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-300 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{manualSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5 font-mono">Tender Title</label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g., Tactical Marine Hydrophones S-9"
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-white text-xs font-sans transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5 font-mono">Value (INR Cr)</label>
                  <input
                    type="number"
                    required
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    placeholder="24.8"
                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-white text-xs font-sans transition-all placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5 font-mono">Vetted Supplier</label>
                  <select
                    value={manualVendor}
                    onChange={(e) => setManualVendor(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-slate-300 text-xs font-sans transition-all"
                  >
                    <option value="V-101">AeroDef Jet Tech (V-101)</option>
                    <option value="V-102">Zenith Armaments (V-102)</option>
                    <option value="V-103">Kalyani Armor (V-103)</option>
                    <option value="V-104">Apex Shell (V-104)</option>
                    <option value="V-105">NovaTech Microwave (V-105)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5 font-mono">Department</label>
                  <input
                    type="text"
                    value={manualDept}
                    onChange={(e) => setManualDept(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-white text-xs font-sans transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5 font-mono">Category</label>
                  <select
                    value={manualCat}
                    onChange={(e) => setManualCat(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-slate-300 text-xs font-sans transition-all"
                  >
                    <option value="Radar & Sensors">Radar & Sensors</option>
                    <option value="Ammunition">Ammunition</option>
                    <option value="Heavy Vehicles">Heavy Vehicles</option>
                    <option value="Logistic Supplies">Logistic Supplies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5 font-mono">Technical Brief Specifications</label>
                <textarea
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  rows={4}
                  placeholder="Provide primary payload specs, delivery timeline details, or tender references..."
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-white text-xs font-sans transition-all placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ingest Record to active Memory</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SUPABASE CONNECTION & SYNC ENGINE */}
      <div className="border border-white/[0.06] bg-[#07070a]/90 backdrop-blur-md rounded-xl p-6 space-y-6 relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Database className="w-24 h-24 text-indigo-400" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Server className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <span>Supabase Live Database Interconnect</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono text-indigo-300 uppercase tracking-widest">
                  Active Sync Engine
                </span>
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Enable persistent multi-user storage by synchronizing your secure CAG procurement ledger with Supabase.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={fetchSupabaseStatus}
              disabled={checking}
              className="p-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] rounded-lg text-slate-300 transition-colors cursor-pointer"
              title="Refresh connection state"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin text-indigo-400" : ""}`} />
            </button>
            {dbStatus?.configured ? (
              dbStatus?.isLive ? (
                <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE & SECURED</span>
                </div>
              ) : (
                <div className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-semibold text-amber-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>SCHEMA SETUP NEEDED</span>
                </div>
              )
            ) : (
              <div className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-mono font-semibold text-rose-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>OFFLINE (LOCAL MODE)</span>
              </div>
            )}
          </div>
        </div>

        {/* NOTIFICATION MESSAGES */}
        {successMsg && (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errMsg && (
          <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-mono flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="flex-1">{errMsg}</span>
          </div>
        )}

        {dbStatus?.error && (
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-300 font-mono flex flex-col gap-1">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Database Handshake Status Code:</span>
            </div>
            <p className="pl-6 text-slate-400 leading-relaxed">{dbStatus.error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CONFIGURATION COLUMN (7 COLUMNS) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-5 bg-white/[0.01] border border-white/[0.06] rounded-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 font-mono">
                <Link className="w-4 h-4 text-indigo-400" />
                <span>API ENDPOINT CONFIGURATION</span>
              </h3>
              
              <form onSubmit={handleConfigureSupabase} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5 font-mono">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    required
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project-id.supabase.co"
                    className="w-full bg-[#030303] border border-white/[0.08] rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-white text-xs font-mono placeholder:text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5 font-mono">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    required
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-[#030303] border border-white/[0.08] rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-white text-xs font-mono placeholder:text-slate-700"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={checking}
                    className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-indigo-500/30 text-white font-semibold rounded-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    {checking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                        <span>Verifying Cloud Ingress Handshake...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 text-indigo-400" />
                        <span>Connect & Initialize Client</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* EXPANDABLE SCHEMA HELPER */}
            <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01]">
              <button
                onClick={() => setShowSchema(!showSchema)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Terminal className="w-4.5 h-4.5 text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Database Table Schema Blueprint</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Click to view SQL code to execute inside Supabase dashboard.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                  {showSchema ? "Hide Schema" : "Show Schema"}
                </span>
              </button>

              {showSchema && (
                <div className="p-4 border-t border-white/[0.06] space-y-3 bg-[#030303]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">SQL Schema Script</span>
                    <button
                      onClick={handleCopySchema}
                      className="px-3 py-1.5 bg-white/[0.03] hover:bg-indigo-500/10 border border-white/[0.08] hover:border-indigo-500/25 text-white rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy DDL SQL</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg text-[10px] font-mono text-slate-400 overflow-x-auto max-h-48 leading-relaxed">
                    {schemaSql}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* DUAL MODE PERSISTENT STATE REPLICATION CARD (6 COLUMNS) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 bg-white/[0.01] border border-white/[0.06] rounded-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 font-mono">
                <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
                <span>STATE REPLICATION METRICS</span>
              </h3>

              <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-[#030303]">
                <table className="w-full min-w-[480px] text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/[0.06]">
                      <th className="p-3 text-[9px] uppercase tracking-wider font-mono text-slate-400 font-bold">Secure Table Ledger</th>
                      <th className="p-3 text-[9px] uppercase tracking-wider font-mono text-slate-400 font-bold text-center">Local Cache</th>
                      <th className="p-3 text-[9px] uppercase tracking-wider font-mono text-slate-400 font-bold text-center">Cloud Database</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-xs">
                    {[
                      { key: "users", label: "Users Registry" },
                      { key: "vendors", label: "Procurement Vendors" },
                      { key: "contracts", label: "Active Contracts" },
                      { key: "risk_scores", label: "Risk Assessments" },
                      { key: "audit_reports", label: "Audit Reports" },
                      { key: "audit_observations", label: "Audit Observations" },
                      { key: "uploaded_files", label: "Knowledge Base" },
                      { key: "investigations", label: "Auditor Investigations" }
                    ].map((row) => {
                      const localCount = dbStatus?.localCounts?.[row.key] ?? 0;
                      const dbCount = dbStatus?.dbCounts?.[row.key] ?? 0;
                      const isSynced = dbStatus?.isLive && localCount === dbCount && localCount > 0;

                      return (
                        <tr key={row.key} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-3 font-semibold text-white">{row.label}</td>
                          <td className="p-3 text-center font-mono text-indigo-300 font-bold">{localCount}</td>
                          <td className="p-3 text-center font-mono text-slate-300">
                            {!dbStatus?.configured ? (
                              <span className="text-slate-600">-</span>
                            ) : !dbStatus?.isLive ? (
                              <span className="text-amber-500/60" title="Setup schema first">?</span>
                            ) : (
                              <span className={isSynced ? "text-emerald-400 font-bold" : "text-indigo-300 font-medium"}>
                                {dbCount}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ACTION OPERATIONS BOX */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => handleSync("export")}
                  disabled={syncing || !dbStatus?.isLive}
                  className={`py-3 px-4 border text-white font-semibold rounded-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                    dbStatus?.isLive 
                      ? "bg-indigo-600 hover:bg-indigo-500 border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]" 
                      : "bg-white/[0.01] text-slate-500 border-white/[0.05] cursor-not-allowed"
                  }`}
                  title={dbStatus?.isLive ? "Push all local files, contracts and vendor cache records up to Supabase" : "Please configure a live Supabase connection first"}
                >
                  {syncing && syncDirection === "export" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Uplinking Ledger...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 text-indigo-200" />
                      <span>Sync Cache &rarr; Supabase</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSync("import")}
                  disabled={syncing || !dbStatus?.isLive}
                  className={`py-3 px-4 border text-white font-semibold rounded-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                    dbStatus?.isLive 
                      ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]" 
                      : "bg-white/[0.01] text-slate-500 border-white/[0.05] cursor-not-allowed"
                  }`}
                  title={dbStatus?.isLive ? "Fetch records from Supabase tables to replace local cache memory" : "Please configure a live Supabase connection first"}
                >
                  {syncing && syncDirection === "import" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Downlinking Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-200" />
                      <span>Supabase &rarr; Local Cache</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

