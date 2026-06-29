import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Filter, 
  Building2, 
  RefreshCw, 
  AlertOctagon, 
  Cpu, 
  HelpCircle,
  Database,
  BarChart4
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, LineChart, Line, Cell
} from "recharts";

export default function RiskAnalyticsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");

  const categories = ["All", "Radar & Sensors", "Ammunition", "Heavy Vehicles", "Logistic Supplies"];
  const riskLevels = ["All", "High", "Medium", "Low"];

  useEffect(() => {
    Promise.all([
      fetch("/api/contracts"),
      fetch("/api/vendors")
    ])
    .then(([resContracts, resVendors]) => Promise.all([resContracts.json(), resVendors.json()]))
    .then(([dataContracts, dataVendors]) => {
      setContracts(dataContracts);
      setVendors(dataVendors);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Filter logic
  const filteredContracts = contracts.filter(c => {
    if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
    if (selectedVendor !== "All" && c.vendorId !== selectedVendor) return false;
    if (selectedRiskLevel !== "All") {
      if (selectedRiskLevel === "High" && c.riskScore < 75) return false;
      if (selectedRiskLevel === "Medium" && (c.riskScore < 40 || c.riskScore >= 75)) return false;
      if (selectedRiskLevel === "Low" && c.riskScore >= 40) return false;
    }
    return true;
  });

  // Calculate timeline comparison data
  const comparisonData = filteredContracts.map(c => ({
    name: c.id,
    risk: c.riskScore,
    pricingDeviation: c.unitPriceDeviation,
    anomaly: c.anomalyScore,
    amount: c.amount
  }));

  // Scatter analysis structure
  const scatterData = filteredContracts.map(c => ({
    x: c.anomalyScore,
    y: c.unitPriceDeviation,
    z: c.amount,
    id: c.id,
    vendor: c.vendorName
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 select-none relative min-h-screen bg-[#030303] text-slate-100 overflow-x-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-cyber-border">
        <div>
          <h1 className="font-display font-medium text-xl sm:text-2xl tracking-normal text-white">Forensic Risk Analytics</h1>
          <p className="text-slate-450 text-xs font-sans mt-0.5">Custom analysis dashboards for cross-checking procurement trends and tender anomalies.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedCategory("All");
            setSelectedRiskLevel("All");
            setSelectedVendor("All");
          }}
          className="px-4 py-2 bg-cyber-card hover:bg-cyber-card-hover border border-cyber-border text-slate-300 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Audit Filters
        </button>
      </div>

      {/* FILTER TRAY SECTION */}
      <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Category Vetting */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-450 font-mono block mb-2">Category Segment</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-cyber-dark/85 border border-cyber-border rounded-lg text-sm text-slate-200 px-3.5 py-2 focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light focus:outline-none"
          >
            {categories.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Risk Threshold Vetting */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-450 font-mono block mb-2">Risk Status Boundary</label>
          <select 
            value={selectedRiskLevel} 
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="w-full bg-cyber-dark/85 border border-cyber-border rounded-lg text-sm text-slate-200 px-3.5 py-2 focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light focus:outline-none"
          >
            {riskLevels.map((r, idx) => (
              <option key={idx} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Vendor Matching */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-450 font-mono block mb-2">Vendor Unit Node</label>
          <select 
            value={selectedVendor} 
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="w-full bg-cyber-dark/85 border border-cyber-border rounded-lg text-sm text-slate-200 px-3.5 py-2 focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light focus:outline-none"
          >
            <option value="All">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* CORE GRAPH CONTAINERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Comparison Bar Chart (7 Columns) */}
        <div className="lg:col-span-7 p-6 bg-cyber-card border border-cyber-border rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-medium text-sm text-white uppercase tracking-wider">Multi-Variant Anomaly Analysis</h3>
            <span className="text-[10px] font-mono text-cyber-teal-light">Graphed: {filteredContracts.length} records</span>
          </div>

          <div className="h-56 sm:h-80 w-full min-w-0">
            {comparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3c5a" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#09090c", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", color: "#f8fafc" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
                  <Bar dataKey="risk" fill="#06b6d4" name="Risk Score (%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="pricingDeviation" fill="#f59e0b" name="Unit Price Deviation (%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="anomaly" fill="#f43f5e" name="Algorithmic Anomaly Index" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                NO FILTER ALIGNMENTS FOUND
              </div>
            )}
          </div>
        </div>

        {/* Scatter Matrix Analysis (5 Columns) */}
        <div className="lg:col-span-5 p-6 bg-cyber-card border border-cyber-border rounded-xl">
          <h3 className="font-display font-medium text-sm text-white uppercase tracking-wider mb-6">Pricing vs Anomaly Correlation Matrix</h3>

          <div className="h-56 sm:h-80 w-full min-w-0">
            {scatterData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3c5a" opacity={0.2} />
                  <XAxis type="number" dataKey="x" name="Anomaly Score" unit="%" stroke="#94a3b8" fontSize={10} />
                  <YAxis type="number" dataKey="y" name="Price Deviation" unit="%" stroke="#94a3b8" fontSize={10} />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="Contract Value (Cr)" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "#09090c", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px" }} />
                  <Scatter name="Contracts Catalog" data={scatterData} fill="#06b6d4">
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.x > 70 ? '#f43f5e' : '#06b6d4'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                SCATTER MATRIX SECURE PRE-LOAD EMPTY
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RISK RELATIONSHIPS & VENDOR NETWORKS REPORT */}
      <div className="p-6 bg-cyber-card border border-cyber-border rounded-xl">
        <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-cyber-border">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wide">Threat Risk Voids & Beneficial Ownership Maps</h4>
            <p className="text-xs text-slate-450 font-sans mt-0.5 font-medium">Algorithmic indicators calculated directly matching shell corporate structures.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          {/* Section A */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-350 uppercase tracking-wider font-mono">Cayman-Offshore Shell Network Overlay</h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our graph verification models flagged connected vendor indices **V-102 (Zenith Armaments Corp)** and **V-104 (Apex Shell Solutions)**. These entities share corresponding administrative beneficial records matching politically exposed directories. Tender requests awarded as emergency waivers bypass technical filters, indicating active collusion vectors.
            </p>
            <div className="p-3 bg-cyber-dark/85 border border-cyber-border rounded-xl">
              <span className="text-[10px] font-mono text-[#fbbf24] font-semibold block mb-1">NETWORK THREAT SUMMARY:</span>
              <p className="text-[11px] text-slate-300">
                Direct shareholder overlaps flagged under TAXCODE BA8829 and DF2210. Total exposed procurement value limits sum to **INR 23.8 Crore**.
              </p>
            </div>
          </div>

          {/* Section B */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-350 uppercase tracking-wider font-mono">Radar Price-Gouging Inspection Index</h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Contract parameters mapped on C-7310 point to a unit deviation of **140.20%**. By utilizing active memory indices parsed from international radar catalogs, our engine identified standard baseline pricing for high-band synthesizers values around INR 0.44 Crore as opposed to invoice charges averaging INR 1.07 Crore.
            </p>
            <div className="p-3 bg-cyber-dark/85 border border-cyber-border rounded-xl">
              <span className="text-[10px] font-mono text-cyan-400 font-semibold block mb-1">CYBER AUDITING METRIC:</span>
              <p className="text-[11px] text-slate-300">
                Calculated excess financial leakage represents **INR 28.30 Crore** with direct connection paths tracing through NovaTech parent hubs.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
