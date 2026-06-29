import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  TrendingUp, 
  FileSpreadsheet, 
  Cpu, 
  FileText, 
  HelpCircle, 
  Database, 
  LogOut, 
  CircleUser, 
  Lock
} from "lucide-react";

interface NavigationProps {
  user: any;
  onLogout: () => void;
  forcePublicHeader?: boolean;
}

export default function Navigation({ user, onLogout, forcePublicHeader }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/analytics", label: "Risk Analytics", icon: TrendingUp },
    { path: "/contracts", label: "Contracts Portal", icon: FileSpreadsheet },
    { path: "/ai-advisor", label: "AI Advisor", icon: Cpu },
    { path: "/audit-observations", label: "CAG Inquiry Assistant", icon: HelpCircle },
    { path: "/audit-reports", label: "Audit Report Builder", icon: FileText },
    { path: "/data-management", label: "Data Management", icon: Database },
  ];

  if (!user || forcePublicHeader) {
    return (
      <header id="public-header" className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/[0.03] rounded-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:border-cyber-teal/30 transition-colors">
            <ShieldAlert className="w-5 h-5 text-cyber-teal" />
          </div>
          <div>
            <span className="font-display font-semibold text-sm tracking-widest text-white block uppercase">
              PROJECT CHAKRAVEK
            </span>
            <p className="text-[9px] font-mono tracking-widest text-cyber-teal-light uppercase">CAG AUDIT INTELLIGENCE</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Node: <strong className="text-white">{user.name}</strong> ({user.role})
              </span>
              <Link 
                to="/dashboard" 
                className="text-xs text-cyber-teal-light hover:text-white px-4 py-2 rounded-xl transition duration-200 border border-cyber-teal/30 hover:border-cyber-teal-light/50 bg-cyber-teal/5 font-medium"
              >
                Go to Dashboard
              </Link>
              <button 
                onClick={onLogout}
                className="text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-xs text-slate-300 hover:text-white px-4 py-2 rounded-xl transition duration-200 border border-white/[0.05] hover:border-white/[0.12] bg-white/[0.02] font-medium"
              >
                Auditor Sign In
              </Link>
              <Link 
                to="/signup" 
                className="text-xs bg-cyber-teal hover:bg-cyber-teal-light border border-cyber-teal-light/20 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Register Corporate Node
              </Link>
            </>
          )}
        </div>
      </header>
    );
  }

  return (
    <aside id="app-sidebar" className="w-76 border-r border-white/[0.06] bg-[#050508]/95 backdrop-blur-xl min-h-screen flex flex-col justify-between shrink-0 relative">
      {/* Background radial glow */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyber-teal/[0.03] to-transparent pointer-events-none" />
      
      <div className="p-5 flex flex-col gap-6 relative z-10">
        {/* LOGO SECTOR */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl shadow-md">
            <ShieldAlert className="w-5.5 h-5.5 text-cyber-teal" />
          </div>
          <div>
            <span className="font-display font-semibold text-xs tracking-widest text-white block uppercase">
              CHAKRAVEK AI
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyber-teal-light block mt-0.5 uppercase">
              CAG DEFENCE AUDIT
            </span>
          </div>
        </div>

        {/* ACCOUNT PROFILE BAR */}
        <button
          onClick={() => navigate("/profile")}
          className={`w-full text-left p-3.5 bg-white/[0.02] hover:bg-white/[0.05] border rounded-xl flex items-center justify-between transition-all duration-200 group cursor-pointer ${
            location.pathname === "/profile" ? "border-cyber-teal/40 bg-white/[0.04]" : "border-white/[0.06] hover:border-white/[0.12]"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-cyber-teal/10 border border-cyber-teal-light/20 group-hover:border-cyber-teal-light/40 flex items-center justify-center shrink-0 transition-colors">
              <CircleUser className="w-4.5 h-4.5 text-cyber-teal-light" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-white transition-colors">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user.organization}</p>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded-lg bg-cyber-teal/10 border border-cyber-teal/20 group-hover:bg-cyber-teal/20 transition-colors shrink-0">
            <span className="text-[8px] font-mono font-medium text-cyber-teal-light uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </button>

        {/* RECT NAV ITEMS */}
        <nav className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-2 block">
            Core Modules
          </span>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full group px-4 py-2.5 rounded-xl flex items-center gap-3.5 text-xs font-medium transition-all duration-200 border ${
                  isActive 
                    ? "bg-white/[0.03] text-white border-white/[0.1] shadow-sm font-semibold" 
                    : "text-slate-400 hover:bg-white/[0.01] hover:text-slate-200 border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'text-cyber-teal scale-110' : 'text-slate-450 group-hover:text-cyber-teal-light group-hover:scale-105'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-teal shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* DISCONNECT SECTOR */}
      <div className="p-5 border-t border-white/[0.06] bg-[#050508]/40 relative z-10">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.06] border border-rose-500/15 hover:border-rose-500/30 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
        <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-slate-500 px-1 border-t border-white/[0.05] pt-3.5">
          <span className="flex items-center gap-1"><Lock className="w-2.5 h-2.5 text-cyber-teal/60" /> 256-bit TLS</span>
          <span>v1.8.4</span>
        </div>
      </div>
    </aside>
  );
}
