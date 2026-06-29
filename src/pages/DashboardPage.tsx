import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Building2, 
  ShieldAlert, 
  TrendingUp, 
  FileCheck2, 
  Search, 
  AlertTriangle,
  BadgeAlert,
  Loader2,
  ListFilter,
  Flame,
  ArrowRight
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => {
        if (!res.ok) throw new Error("Could not retrieve audit statistics");
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="w-10 h-10 text-cyber-teal-light animate-spin mb-4" />
        <span className="text-sm font-mono text-slate-400">CONNECTING SECURE DATABASE CHANNELS...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-center">
        <div className="max-w-md mx-auto p-6 bg-red-950/20 border border-red-500/30 rounded-xl">
          <BadgeAlert className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">Security Connection Failure</h3>
          <p className="text-xs text-red-300 mt-2 font-mono">{error}</p>
        </div>
      </div>
    );
  }

  const COLORS = ["#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e", "#f97316"];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 select-none relative min-h-screen bg-[#030303] text-slate-100 overflow-x-hidden">
      {/* Background ambient glowing shapes mimicking shape-landing-hero */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      {/* EXECUTIVE SUMMARY BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.06] relative z-10">
        <div>
          <h1 className="font-display font-semibold text-xl sm:text-2xl tracking-tight text-white">Procurement Intelligence Base</h1>
          <p className="text-slate-450 text-xs mt-1">Real-time Comptroller & Auditor General (CAG) compliance monitoring dashboard.</p>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-xs text-cyber-teal-light px-4 py-2 bg-cyber-teal/10 border border-cyber-teal/20 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-cyber-teal-light animate-pulse shadow-[0_0_8px_rgba(100,116,139,0.4)]"></span>
          SYS SECURE NODE: REG-9921 ONLINE
        </div>
      </div>

      {/* METRIC CARD CONTAINERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {/* Metric 1 */}
        <div className="p-5 bg-cyber-card border border-cyber-border backdrop-blur-md hover:border-cyber-teal/30 rounded-2xl transition-all duration-300 group shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Monitored Contracts</span>
            <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl group-hover:text-cyber-teal-light transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">{stats ? stats.totalContractsCount : 0}</p>
          <div className="text-[10px] text-slate-500 font-mono mt-3">Active military acquisitions</div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-cyber-card border border-cyber-border backdrop-blur-md hover:border-cyber-rose/30 rounded-2xl transition-all duration-300 group relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-rose/[0.03] blur-2xl rounded-full"></div>
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">High Risk Alerts</span>
            <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-cyber-rose group-hover:text-cyber-rose/80 transition-colors">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-bold text-2xl sm:text-3xl text-cyber-rose mt-1">{stats ? stats.highRiskContracts : 0}</p>
          <div className="text-[10px] text-cyber-rose/80 font-semibold font-mono mt-3 flex items-center gap-1">
            <span>Risk Score &gt; 75</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-cyber-card border border-cyber-border backdrop-blur-md hover:border-cyber-gold/30 rounded-2xl transition-all duration-300 group relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-gold/[0.03] blur-2xl rounded-full"></div>
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Flagged Vendors</span>
            <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-cyber-gold group-hover:text-cyber-gold-light transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-bold text-2xl sm:text-3xl text-cyber-gold mt-1">{stats ? stats.flaggedVendors : 0}</p>
          <div className="text-[10px] text-slate-500 font-mono mt-3">Entities with active shell markers</div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-cyber-card border border-cyber-border backdrop-blur-md hover:border-cyber-cyan/30 rounded-2xl transition-all duration-300 group shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Investigations</span>
            <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl group-hover:text-cyber-cyan transition-colors">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">{stats ? stats.openInvestigations : 0}</p>
          <div className="text-[10px] text-slate-500 font-mono mt-3">Active forensic tribunal assets</div>
        </div>
      </div>

      {/* CHARTS CONTAINER BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Trend Area Chart (8 Columns) */}
        <div className="lg:col-span-8 p-6 bg-cyber-card border border-cyber-border backdrop-blur-md rounded-2xl shadow-xl">
          <h3 className="font-display font-medium text-sm text-white mb-6 uppercase tracking-wider">Historical Fraud Risk Trend</h3>
          <div className="h-56 sm:h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats ? stats.trend : []}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#09090c", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", color: "#f8fafc" }} 
                  itemStyle={{ color: "#06b6d4" }}
                />
                <Area type="monotone" dataKey="avgRisk" stroke="#06b6d4" fillOpacity={1} fill="url(#riskGrad)" strokeWidth={2} name="Global Trend Risk Index" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Category Risk Variance (4 Columns) */}
        <div className="lg:col-span-4 p-6 bg-cyber-card border border-cyber-border backdrop-blur-md rounded-2xl shadow-xl">
          <h3 className="font-display font-medium text-sm text-white mb-6 uppercase tracking-wider">Category Risk Variance</h3>
          <div className="h-56 sm:h-72 w-full min-w-0 flex flex-col justify-between">
            <ResponsiveContainer width="100%" height="75%">
              <PieChart>
                <Pie
                  data={stats ? stats.categoryRisk : []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.categoryRisk || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#09090c", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(stats?.categoryRisk || []).map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="truncate">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Risk Score distribution (5 Columns) */}
        <div className="lg:col-span-5 p-6 bg-cyber-card border border-cyber-border backdrop-blur-md rounded-2xl shadow-xl">
          <h3 className="font-display font-medium text-sm text-white mb-6 uppercase tracking-wider">Audit Score Distribution</h3>
          <div className="h-52 sm:h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats ? stats.riskDistribution : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" opacity={0.2} />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#09090c", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px" }} />
                <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Contracts Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Realtime Alert Table (7 Columns) */}
        <div className="lg:col-span-7 p-6 bg-cyber-card border border-cyber-border backdrop-blur-md rounded-2xl flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-medium text-sm text-white uppercase tracking-wider">Critical Audit Trigger Log</h3>
              <span className="text-[9px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">REALTIME SECURE</span>
            </div>
            
            <div className="space-y-3.5">
              {(stats?.alerts || []).map((alert: any) => (
                <div key={alert.id} className="p-3.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-start gap-3.5 transition-colors">
                  <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 tracking-wide leading-relaxed">
                      {alert.message}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1.5 block">STATION INDICATOR: {alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-400">Active vetting protocols: <strong>3 core markers</strong> matching patterns.</span>
            <Link to="/contracts" className="text-xs font-mono font-medium text-cyber-teal hover:text-cyber-teal-light transition-colors flex items-center gap-1">
              <span>Inspect Contracts Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
