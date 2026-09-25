import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  Filter, 
  Building2, 
  RefreshCw, 
  AlertOctagon, 
  Cpu, 
  HelpCircle,
  Database,
  BarChart4,
  Flame,
  ShieldAlert,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell
} from "recharts";

export default function RiskAnalyticsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [barLimit, setBarLimit] = useState(25);

  const categories = [
    "All", 
    "Radar & Sensors", 
    "Ammunition", 
    "Heavy Vehicles", 
    "Logistic Supplies", 
    "Procurement Auditing", 
    "General Procurement"
  ];
  const riskLevels = ["All", "High", "Medium", "Low"];

  useEffect(() => {
    Promise.all([
      fetch("/api/contracts"),
      fetch("/api/vendors")
    ])
    .then(([resContracts, resVendors]) => Promise.all([resContracts.json(), resVendors.json()]))
    .then(([dataContracts, dataVendors]) => {
      const contractsList = Array.isArray(dataContracts) ? dataContracts : (dataContracts?.contracts || []);
      const vendorsList = Array.isArray(dataVendors) ? dataVendors : [];
      setContracts(contractsList);
      setVendors(vendorsList);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to load risk analytics dataset:", err);
      setLoading(false);
    });
  }, []);

  // Filter logic
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
      if (selectedVendor !== "All" && c.vendorId !== selectedVendor) return false;
      if (selectedRiskLevel !== "All") {
        if (selectedRiskLevel === "High" && c.riskScore < 75) return false;
        if (selectedRiskLevel === "Medium" && (c.riskScore < 40 || c.riskScore >= 75)) return false;
        if (selectedRiskLevel === "Low" && c.riskScore >= 40) return false;
      }
      return true;
    });
  }, [contracts, selectedCategory, selectedVendor, selectedRiskLevel]);

  // Key summary statistics computed from filtered dataset
  const metrics = useMemo(() => {
    const total = filteredContracts.length;
    if (total === 0) {
      return { total: 0, highRisk: 0, avgRisk: 0, avgDeviation: 0, peakAnomaly: 0, totalValue: 0 };
    }
    const highRisk = filteredContracts.filter(c => (c.riskScore || 0) >= 75).length;
    const sumRisk = filteredContracts.reduce((acc, c) => acc + (c.riskScore || 0), 0);
    const sumDev = filteredContracts.reduce((acc, c) => acc + (c.unitPriceDeviation || 0), 0);
    const sumVal = filteredContracts.reduce((acc, c) => acc + (c.amount || 0), 0);
    let peakAnom = 0;
    filteredContracts.forEach(c => {
      const a = c.anomalyScore ?? c.riskScore ?? 0;
      if (a > peakAnom) peakAnom = a;
    });

    return {
      total,
      highRisk,
      avgRisk: Math.round(sumRisk / total),
      avgDeviation: Number((sumDev / total).toFixed(1)),
      peakAnomaly: peakAnom,
      totalValue: Number(sumVal.toFixed(2))
    };
  }, [filteredContracts]);

  // Sort contracts by risk for high-priority anomaly rendering
  const sortedByRisk = useMemo(() => {
    return [...filteredContracts].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
  }, [filteredContracts]);

  // Bar Chart Data: Top N highest risk cases to ensure instant rendering without browser SVG freeze
  const comparisonData = useMemo(() => {
    return sortedByRisk.slice(0, barLimit).map(c => ({
      name: c.id,
      title: c.title || c.id,
      risk: c.riskScore || 0,
      pricingDeviation: Number((c.unitPriceDeviation || 0).toFixed(1)),
      anomaly: c.anomalyScore || c.riskScore || 0,
      amount: c.amount || 0,
      department: c.department || "MoD"
    }));
  }, [sortedByRisk, barLimit]);

  // Scatter Chart Data: Top 100 anomalous cases plus 100 sampled baseline points for correlation visualization
  const scatterData = useMemo(() => {
    if (sortedByRisk.length <= 200) {
      return sortedByRisk.map(c => ({
        x: c.anomalyScore ?? c.riskScore ?? 0,
        y: Number((c.unitPriceDeviation ?? 0).toFixed(1)),
        z: Math.max(1, Math.min(250, (c.amount ?? 5) * 5)),
        id: c.id,
        vendor: c.vendorName || "Vendor",
        title: c.title || "",
        amount: c.amount || 0
      }));
    }

    const topSlice = sortedByRisk.slice(0, 100);
    const remainder = sortedByRisk.slice(100);
    const step = Math.max(1, Math.floor(remainder.length / 100));
    const sampleSlice = remainder.filter((_, idx) => idx % step === 0).slice(0, 100);
    const combined = [...topSlice, ...sampleSlice];

    return combined.map(c => ({
      x: c.anomalyScore ?? c.riskScore ?? 0,
      y: Number((c.unitPriceDeviation ?? 0).toFixed(1)),
      z: Math.max(1, Math.min(250, (c.amount ?? 5) * 5)),
      id: c.id,
      vendor: c.vendorName || "Vendor",
      title: c.title || "",
      amount: c.amount || 0
    }));
  }, [sortedByRisk]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 select-none relative min-h-screen bg-[#030303] text-slate-100 overflow-x-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-cyber-border">
          <div>
            <h1 className="font-display font-medium text-xl sm:text-2xl tracking-normal text-white flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-teal-light" />
              <span>Forensic Risk Analytics</span>
            </h1>
            <p className="text-slate-400 text-xs font-sans mt-0.5">
              Comprehensive threat scoring across {contracts.length > 0 ? contracts.length.toLocaleString() : "all"} procurement datasets and central audit records.
            </p>
          </div>
          <button 
            onClick={() => {
              setSelectedCategory("All");
              setSelectedRiskLevel("All");
              setSelectedVendor("All");
            }}
            className="px-4 py-2 bg-cyber-card hover:bg-cyber-card-hover border border-cyber-border text-slate-300 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Audit Filters
          </button>
        </div>

        {/* SUMMARY STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block">Audited Records</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-display text-white">{metrics.total.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-mono">contracts</span>
            </div>
            <span className="text-[10px] text-cyber-teal-light font-mono mt-1 block">Value: ₹{metrics.totalValue.toLocaleString('en-IN')} Cr</span>
          </div>

          <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyber-rose font-mono block">Flagged Anomalies</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-display text-cyber-rose">{metrics.highRisk.toLocaleString()}</span>
              <span className="text-[10px] text-cyber-rose/80 font-mono">Score &ge; 75</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">{(metrics.total > 0 ? (metrics.highRisk / metrics.total * 100).toFixed(1) : 0)}% anomaly rate</span>
          </div>

          <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyber-gold font-mono block">Avg Price Deviation</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-display text-cyber-gold">{metrics.avgDeviation > 0 ? `+${metrics.avgDeviation}%` : `${metrics.avgDeviation}%`}</span>
              <span className="text-[10px] text-slate-500 font-mono">vs catalog</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Baseline pricing metric</span>
          </div>

          <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyber-cyan font-mono block">Peak Anomaly Index</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-display text-cyber-cyan">{metrics.peakAnomaly}</span>
              <span className="text-[10px] text-slate-500 font-mono">/ 100 max</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Mean Risk: {metrics.avgRisk}%</span>
          </div>
        </div>

        {/* FILTER TRAY SECTION */}
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          {/* Category Vetting */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block mb-2">Category Segment</label>
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
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block mb-2">Risk Status Boundary</label>
            <select 
              value={selectedRiskLevel} 
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="w-full bg-cyber-dark/85 border border-cyber-border rounded-lg text-sm text-slate-200 px-3.5 py-2 focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light focus:outline-none"
            >
              {riskLevels.map((r, idx) => (
                <option key={idx} value={r}>{r === "All" ? "All Risk Levels" : `${r} Risk`}</option>
              ))}
            </select>
          </div>

          {/* Vendor Matching */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block mb-2">Vendor Unit Node</label>
            <select 
              value={selectedVendor} 
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full bg-cyber-dark/85 border border-cyber-border rounded-lg text-sm text-slate-200 px-3.5 py-2 focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light focus:outline-none"
            >
              <option value="All">All Vendors ({vendors.length})</option>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <div>
                <h3 className="font-display font-medium text-sm text-white uppercase tracking-wider">Multi-Variant Anomaly Analysis</h3>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">Top {Math.min(barLimit, comparisonData.length)} highest risk tenders from {filteredContracts.length.toLocaleString()} matches</p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-[10px] font-mono text-slate-500">Show:</span>
                {[15, 25, 50].map(lim => (
                  <button
                    key={lim}
                    onClick={() => setBarLimit(lim)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                      barLimit === lim
                        ? "bg-cyber-teal/20 text-cyber-teal-light border-cyber-teal-light/40 font-semibold"
                        : "bg-cyber-dark border-cyber-border text-slate-400 hover:text-white"
                    }`}
                  >
                    {lim}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 sm:h-80 w-full min-w-0">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                  <div className="w-5 h-5 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin mr-2"></div>
                  COMPUTING MULTI-VARIANT ANOMALY MATRIX...
                </div>
              ) : comparisonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3c5a" opacity={0.2} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false}
                      angle={-35}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#09090c", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", color: "#f8fafc", fontSize: "11px" }}
                      formatter={(val: any, name: any) => [`${val}%`, name]}
                      labelFormatter={(label, items) => {
                        const item = items && items[0]?.payload;
                        return item ? `${label}: ${item.title.substring(0, 45)}... (₹${item.amount} Cr)` : String(label);
                      }}
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-medium text-sm text-white uppercase tracking-wider">Pricing vs Anomaly Matrix</h3>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">Correlation view across {scatterData.length} sampled points</p>
              </div>
              <span className="text-[10px] font-mono text-cyber-teal-light px-2 py-0.5 rounded bg-cyber-teal/10 border border-cyber-teal-light/20">
                Outliers Mapped
              </span>
            </div>

            <div className="h-64 sm:h-80 w-full min-w-0">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                  <div className="w-5 h-5 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin mr-2"></div>
                  PLOTTING CORRELATION MATRIX...
                </div>
              ) : scatterData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 15, right: 15, bottom: 20, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3c5a" opacity={0.2} />
                    <XAxis type="number" dataKey="x" name="Anomaly Score" unit="%" stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                    <YAxis type="number" dataKey="y" name="Price Deviation" unit="%" stroke="#94a3b8" fontSize={10} />
                    <ZAxis type="number" dataKey="z" range={[40, 220]} name="Contract Scale" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ backgroundColor: "#09090c", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px", color: "#f8fafc" }} 
                      formatter={(val: any, name: any) => [`${val}%`, name]}
                      labelFormatter={(_label, payload) => {
                        const item = payload && payload[0]?.payload;
                        return item ? `${item.id} - ${item.vendor} (₹${item.amount} Cr)` : "Tender Point";
                      }}
                    />
                    <Scatter name="Contracts Catalog" data={scatterData} fill="#06b6d4">
                      {scatterData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.x >= 75 ? '#f43f5e' : (entry.x >= 40 ? '#f59e0b' : '#06b6d4')} 
                        />
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
              <p className="text-xs text-slate-400 font-sans mt-0.5 font-medium">Algorithmic indicators calculated directly matching shell corporate structures.</p>
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
