import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Info, 
  AlertTriangle, 
  X, 
  ChevronRight, 
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Sparkles, 
  Briefcase,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Database,
  ArrowRight,
  Flame,
  User,
  ExternalLink
} from "lucide-react";
import { Contract } from "../types";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  
  // Drawer state
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [detailBreakdown, setDetailBreakdown] = useState<any>(null);

  useEffect(() => {
    fetch("/api/contracts")
      .then(res => res.json())
      .then(data => {
        setContracts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleOpenDrawer = async (contract: Contract) => {
    setSelectedContract(contract);
    setDrawerLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contract.id}`);
      const data = await res.json();
      setDetailBreakdown(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDrawerLoading(false);
    }
  };

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleRiskChange = (val: string) => {
    setSelectedRisk(val);
    setCurrentPage(1);
  };

  const filtered = contracts.filter(c => {
    // Search match
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      c.id.toLowerCase().includes(q) || 
      c.title.toLowerCase().includes(q) || 
      c.vendorName.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);

    // Category match
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;

    // Risk match
    let matchesRisk = true;
    if (selectedRisk === "High") matchesRisk = c.riskScore >= 75;
    else if (selectedRisk === "Medium") matchesRisk = c.riskScore >= 40 && c.riskScore < 75;
    else if (selectedRisk === "Low") matchesRisk = c.riskScore < 40;

    return matchesSearch && matchesCategory && matchesRisk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedContracts = filtered.slice(startIndex, startIndex + pageSize);
  const totalValueCr = filtered.reduce((acc, c) => acc + (c.amount || 0), 0);
  const highRiskCount = filtered.filter(c => c.riskScore >= 75).length;

  const categories = [
    "All", 
    "Radar & Sensors", 
    "Ammunition", 
    "Heavy Vehicles", 
    "Logistic Supplies", 
    "Procurement Auditing", 
    "General Procurement"
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 select-none relative flex-1 min-h-screen bg-[#030303] text-slate-100 overflow-x-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* HEADER BAR */}
        <div className="pb-6 border-b border-cyber-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-medium text-xl sm:text-2xl tracking-normal text-white">Defence Contracts Index</h1>
          <p className="text-slate-400 text-xs mt-1">Search, vet, and investigate advanced military acquisition tenders flagged by Project Chakravek AI.</p>
        </div>
      </div>

      {/* SEARCH AND VETTING OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input (6 Columns) */}
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search across all 31,500 contracts by ID, title, department, vendor..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-cyber-card/65 border border-cyber-border rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
          />
        </div>

        {/* Category Select (3 Columns) */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full bg-cyber-card/65 border border-cyber-border rounded-lg px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>
        </div>

        {/* Risk Select (3 Columns) */}
        <div className="md:col-span-3">
          <select
            value={selectedRisk}
            onChange={(e) => handleRiskChange(e.target.value)}
            className="w-full bg-cyber-card/65 border border-cyber-border rounded-lg px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk (&ge;75)</option>
            <option value="Medium">Medium Risk (40-74)</option>
            <option value="Low">Low Risk (&lt;40)</option>
          </select>
        </div>
      </div>

      {/* DATASET METRICS SUMMARY BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-cyber-card/40 border border-cyber-border/70 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Total Indexed: <strong className="text-white font-semibold">{filtered.length.toLocaleString()}</strong> contracts</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-cyber-rose">Flagged Anomalies: <strong className="font-semibold">{highRiskCount.toLocaleString()}</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-cyber-teal-light">Cumulative Value: <strong className="font-semibold">₹{totalValueCr.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Page Size:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-cyber-dark border border-cyber-border rounded px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyber-teal"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={250}>250 / page</option>
          </select>
        </div>
      </div>

      {/* CONTRACTS ANALYSIS DATA GRID */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-mono flex flex-col items-center justify-center">
          <div className="w-6 h-6 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin mb-3"></div>
          LOADING RELATIONAL PROCUREMENT DIRECTORIES...
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-cyber-card border border-cyber-border rounded-xl spill-hidden overflow-x-auto -mx-1 px-1">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm font-sans">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-dark/45 font-mono text-xs uppercase tracking-wider text-slate-450">
                  <th className="p-4">Tender ID</th>
                  <th className="p-4">Procurement Item & Dept</th>
                  <th className="p-4">Vendor Partner</th>
                  <th className="p-4 text-right">Value (INR)</th>
                  <th className="p-4 text-center">Threat Risk Score</th>
                  <th className="p-4">Audit Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContracts.map((c) => {
                  // Risk label classes
                  let riskColor = "text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/25";
                  if (c.riskScore >= 75) {
                    riskColor = "text-cyber-rose bg-cyber-rose/10 border-cyber-rose/25";
                  } else if (c.riskScore >= 40) {
                    riskColor = "text-cyber-gold bg-cyber-gold/10 border-cyber-gold/25";
                  }

                  // Status colors
                  const statusColors: Record<string, string> = {
                    "Draft": "text-slate-400 bg-slate-900/60 border-slate-800/80",
                    "Approved": "text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20",
                    "Executed": "text-cyber-teal-light bg-cyber-teal/10 border-cyber-teal/20",
                    "Suspended": "text-cyber-rose bg-cyber-rose/10 border-cyber-rose/20",
                    "Under Audit": "text-cyber-gold bg-cyber-gold/10 border-cyber-gold/20",
                  };

                  return (
                    <tr 
                      key={c.id} 
                      className="border-b border-cyber-border/40 hover:bg-cyber-dark/25 transition-colors cursor-pointer"
                      onClick={() => handleOpenDrawer(c)}
                    >
                      <td className="p-4 font-mono font-bold text-cyber-teal-light">{c.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px] lg:max-w-[280px]">{c.title}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{c.department} &bull; {c.category}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-200">{c.vendorName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {c.vendorId}</div>
                      </td>
                      <td className="p-4 text-right font-mono font-semibold text-slate-100">
                        ₹{c.amount.toFixed(2)} Cr
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-mono font-semibold ${riskColor}`}>
                          {c.riskScore}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium ${statusColors[c.status] || "text-slate-400"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleOpenDrawer(c)}
                          className="px-3.5 py-2 min-h-11 bg-cyber-dark hover:bg-cyber-card-hover border border-cyber-border text-xs text-slate-300 font-semibold rounded-lg flex items-center gap-1 mx-auto transition-colors"
                        >
                          <span>Investigate</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs font-mono text-slate-500">
                      NO COMPLIANCE ENTRIES ALIGN WITH YOUR VETTING PARAMETERS.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS BAR */}
          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-cyber-card border border-cyber-border rounded-xl">
              <div className="text-xs font-mono text-slate-400">
                Showing <span className="text-white font-semibold">{(startIndex + 1).toLocaleString()}</span> to <span className="text-white font-semibold">{Math.min(startIndex + pageSize, filtered.length).toLocaleString()}</span> of <span className="text-white font-semibold">{filtered.length.toLocaleString()}</span> entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={safeCurrentPage === 1}
                  className="p-2 min-h-10 min-w-10 rounded-lg bg-cyber-dark border border-cyber-border text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="px-3 py-2 min-h-10 rounded-lg bg-cyber-dark border border-cyber-border text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <span className="px-3 py-2 text-xs font-mono text-cyber-teal-light bg-cyber-teal/10 border border-cyber-teal/20 rounded-lg">
                  Page {safeCurrentPage.toLocaleString()} of {totalPages.toLocaleString()}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="px-3 py-2 min-h-10 rounded-lg bg-cyber-dark border border-cyber-border text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safeCurrentPage === totalPages}
                  className="p-2 min-h-10 min-w-10 rounded-lg bg-cyber-dark border border-cyber-border text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RIGHT SLIDE OUT DRAWER DETALL PANEL */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay backdrop */}
          <div
            onClick={() => setSelectedContract(null)}
            className="absolute inset-0 bg-cyber-bg/75 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Drawer Body */}
          <div className="relative w-full sm:max-w-xl bg-cyber-dark border-l border-cyber-border h-full shadow-2xl overflow-y-auto flex flex-col justify-between z-50">
            {/* Header */}
            <div className="p-5 border-b border-cyber-border bg-cyber-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono bg-cyber-teal/15 text-cyber-teal-light border border-cyber-teal-light/20 px-2 py-0.5 rounded">
                  CASE VETTING
                </span>
                <span className="text-sm font-mono font-semibold text-cyber-teal-light">{selectedContract.id}</span>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="p-2.5 min-h-11 min-w-11 text-slate-400 hover:text-white rounded-lg hover:bg-cyber-card-hover transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main content scroll segment */}
            <div className="p-6 space-y-6 flex-1">
              <div>
                <h2 className="font-display font-medium text-lg text-white leading-snug">{selectedContract.title}</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">{selectedContract.department} &bull; {selectedContract.category}</p>
              </div>

              {/* Row Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-y border-cyber-border/40 py-4 font-mono text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">TOTAL VALUE</span>
                  <span className="text-sm font-semibold text-white">₹{selectedContract.amount} Cr</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">RISK SCORE</span>
                  <span className="text-sm font-semibold text-amber-505 text-orange-400">{selectedContract.riskScore}/100</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">DEVIATION</span>
                  <span className={`text-sm font-semibold ${selectedContract.unitPriceDeviation > 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {selectedContract.unitPriceDeviation > 0 ? `+${selectedContract.unitPriceDeviation}%` : `${selectedContract.unitPriceDeviation}%`}
                  </span>
                </div>
              </div>

              {/* Vendor SectorCard */}
              <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-[#fbbf24] uppercase font-bold block">VENDOR TARGET DATA</span>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyber-navy/80 border border-cyber-teal-light/20 rounded-lg">
                    <User className="w-5 h-5 text-cyber-teal-light" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{selectedContract.vendorName}</h4>
                    <span className="text-[10px] font-mono text-slate-500">ID Code: {selectedContract.vendorId}</span>
                  </div>
                </div>
              </div>

              {/* Flagged Red Marks */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono tracking-widest text-red-400 uppercase font-bold block">Chakravek Flag Indicators</span>
                {selectedContract.flagReasons.length > 0 ? (
                  <div className="space-y-2">
                    {selectedContract.flagReasons.map((reason, idx) => (
                      <div key={idx} className="p-3 bg-red-950/15 border-l-3 border-l-red-500 border border-cyber-border rounded-r-lg flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-300 leading-normal font-sans">{reason}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/15 border-l-3 border-l-emerald-500 border border-cyber-border rounded-r-lg text-xs text-slate-400 font-mono">
                    NO SUSPICIOUS MARKERS DETECTED
                  </div>
                )}
              </div>

              {/* Audit Trials / Supporting Evidence */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-slate-450 uppercase font-bold block">Supporting Evidence Trail</span>
                <div className="space-y-2">
                  {selectedContract.evidence.map((ev, idx) => (
                    <div key={idx} className="p-3 bg-cyber-dark/85 border border-cyber-border rounded-xl text-xs text-slate-300 font-mono leading-relaxed">
                      &bull; {ev}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Reasoning Summary */}
              <div className="p-4 bg-gradient-to-r from-cyber-navy/45 to-cyber-dark border border-cyber-border rounded-xl space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyber-teal/5 blur-xl rounded-full"></div>
                <div className="flex items-center gap-2 text-cyber-teal-light">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Chakravek AI explanation</span>
                </div>
                {drawerLoading ? (
                  <div className="w-4 h-4 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedContract.aiExplanation}</p>
                )}
              </div>
            </div>

            {/* Foot Trigger actions in Drawer */}
            <div className="p-4 sm:p-5 border-t border-cyber-border bg-cyber-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-slate-500">Last updated: {selectedContract.registeredDate}</span>
              <button
                onClick={() => setSelectedContract(null)}
                className="px-4 py-2.5 min-h-11 bg-cyber-teal hover:bg-cyber-teal-light border border-cyber-teal-light/20 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all w-full sm:w-auto"
              >
                <span>Complete Auditing</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
