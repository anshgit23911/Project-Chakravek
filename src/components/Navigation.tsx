import React, { useState, useEffect } from "react";
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
  Lock,
  Menu,
  X,
} from "lucide-react";

interface NavigationProps {
  user: any;
  onLogout: () => void;
  forcePublicHeader?: boolean;
}

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/analytics", label: "Risk Analytics", icon: TrendingUp },
  { path: "/contracts", label: "Contracts Portal", icon: FileSpreadsheet },
  { path: "/ai-advisor", label: "AI Advisor", icon: Cpu },
  { path: "/audit-observations", label: "CAG Inquiry Assistant", icon: HelpCircle },
  { path: "/audit-reports", label: "Audit Report Builder", icon: FileText },
  { path: "/data-management", label: "Data Management", icon: Database },
];

function SidebarContent({
  user,
  onLogout,
  onNavigate,
}: {
  user: any;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <>
      <div className="p-4 sm:p-5 flex flex-col gap-5 sm:gap-6 relative z-10 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl shadow-md shrink-0">
            <ShieldAlert className="w-5 h-5 text-cyber-teal" />
          </div>
          <div className="min-w-0">
            <span className="font-display font-semibold text-xs tracking-widest text-white block uppercase truncate">
              CHAKRAVEK AI
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyber-teal-light block mt-0.5 uppercase truncate">
              CAG DEFENCE AUDIT
            </span>
          </div>
        </div>

        <button
          onClick={() => go("/profile")}
          className={`w-full text-left p-3.5 bg-white/[0.02] hover:bg-white/[0.05] border rounded-xl flex items-center justify-between transition-all duration-200 group cursor-pointer min-h-11 ${
            location.pathname === "/profile"
              ? "border-cyber-teal/40 bg-white/[0.04]"
              : "border-white/[0.06] hover:border-white/[0.12]"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-cyber-teal/10 border border-cyber-teal-light/20 group-hover:border-cyber-teal-light/40 flex items-center justify-center shrink-0 transition-colors">
              <CircleUser className="w-4.5 h-4.5 text-cyber-teal-light" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-white transition-colors">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user.organization}</p>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded-lg bg-cyber-teal/10 border border-cyber-teal/20 group-hover:bg-cyber-teal/20 transition-colors shrink-0 hidden sm:block">
            <span className="text-[8px] font-mono font-medium text-cyber-teal-light uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </button>

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
                onClick={() => go(item.path)}
                className={`w-full group px-4 py-3 rounded-xl flex items-center gap-3.5 text-xs font-medium transition-all duration-200 border min-h-11 ${
                  isActive
                    ? "bg-white/[0.03] text-white border-white/[0.1] shadow-sm font-semibold"
                    : "text-slate-400 hover:bg-white/[0.01] hover:text-slate-200 border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive
                      ? "text-cyber-teal scale-110"
                      : "text-slate-450 group-hover:text-cyber-teal-light group-hover:scale-105"
                  }`}
                />
                <span className="text-left truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-teal shadow-[0_0_8px_rgba(20,184,166,0.6)] shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 sm:p-5 border-t border-white/[0.06] bg-[#050508]/40 relative z-10 shrink-0">
        <button
          onClick={() => {
            onLogout();
            onNavigate?.();
          }}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 min-h-11 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.06] border border-rose-500/15 hover:border-rose-500/30 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
        <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-slate-500 px-1 border-t border-white/[0.05] pt-3.5">
          <span className="flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-cyber-teal/60" /> 256-bit TLS
          </span>
          <span>v1.8.4</span>
        </div>
      </div>
    </>
  );
}

export default function Navigation({ user, onLogout, forcePublicHeader }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setPublicMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || publicMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, publicMenuOpen]);

  if (!user || forcePublicHeader) {
    return (
      <header
        id="public-header"
        className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4"
      >
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="p-2 bg-white/[0.03] rounded-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:border-cyber-teal/30 transition-colors shrink-0">
              <ShieldAlert className="w-5 h-5 text-cyber-teal" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-semibold text-xs sm:text-sm tracking-widest text-white block uppercase truncate">
                PROJECT CHAKRAVEK
              </span>
              <p className="text-[8px] sm:text-[9px] font-mono tracking-widest text-cyber-teal-light uppercase truncate">
                CAG AUDIT INTELLIGENCE
              </p>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-2 sm:gap-4 shrink-0">
            {user ? (
              <>
                <span className="text-xs text-slate-400 font-mono hidden md:inline max-w-[200px] truncate">
                  Node: <strong className="text-white">{user.name}</strong> ({user.role})
                </span>
                <Link
                  to="/dashboard"
                  className="text-xs text-cyber-teal-light hover:text-white px-4 py-2.5 min-h-11 inline-flex items-center rounded-xl transition duration-200 border border-cyber-teal/30 hover:border-cyber-teal-light/50 bg-cyber-teal/5 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-4 py-2.5 min-h-11 rounded-xl font-medium transition-all duration-200 cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs text-slate-300 hover:text-white px-4 py-2.5 min-h-11 inline-flex items-center rounded-xl transition duration-200 border border-white/[0.05] hover:border-white/[0.12] bg-white/[0.02] font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-xs bg-cyber-teal hover:bg-cyber-teal-light border border-cyber-teal-light/20 text-white px-4 sm:px-5 py-2.5 min-h-11 inline-flex items-center rounded-xl font-medium transition-all duration-200"
                >
                  <span className="hidden sm:inline">Register Corporate Node</span>
                  <span className="sm:hidden">Register</span>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setPublicMenuOpen(!publicMenuOpen)}
            className="sm:hidden p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {publicMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {publicMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
            {user ? (
              <>
                <p className="text-xs text-slate-400 font-mono px-1 pb-1">
                  Node: <strong className="text-white">{user.name}</strong>
                </p>
                <Link
                  to="/dashboard"
                  onClick={() => setPublicMenuOpen(false)}
                  className="text-xs text-cyber-teal-light px-4 py-3 min-h-11 flex items-center rounded-xl border border-cyber-teal/30 bg-cyber-teal/5 font-medium"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setPublicMenuOpen(false);
                  }}
                  className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 min-h-11 rounded-xl font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setPublicMenuOpen(false)}
                  className="text-xs text-slate-300 px-4 py-3 min-h-11 flex items-center rounded-xl border border-white/[0.05] bg-white/[0.02] font-medium"
                >
                  Auditor Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setPublicMenuOpen(false)}
                  className="text-xs bg-cyber-teal border border-cyber-teal-light/20 text-white px-4 py-3 min-h-11 flex items-center rounded-xl font-medium"
                >
                  Register Corporate Node
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    );
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 border-b border-white/[0.06] bg-[#050508]/95 backdrop-blur-xl px-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:text-white transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 min-w-0 flex-1 justify-center"
        >
          <ShieldAlert className="w-5 h-5 text-cyber-teal shrink-0" />
          <span className="font-display font-semibold text-xs tracking-widest text-white uppercase truncate">
            CHAKRAVEK AI
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-cyber-teal/10 border border-cyber-teal-light/20 shrink-0"
          aria-label="Profile"
        >
          <CircleUser className="w-5 h-5 text-cyber-teal-light" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-[min(100vw-3rem,19rem)] max-w-full h-full bg-[#050508]/98 border-r border-white/[0.06] backdrop-blur-xl flex flex-col shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyber-teal/[0.03] to-transparent pointer-events-none" />
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06] relative z-10 shrink-0">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Navigation</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent user={user} onLogout={onLogout} onNavigate={() => setMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        id="app-sidebar"
        className="hidden lg:flex w-64 xl:w-72 border-r border-white/[0.06] bg-[#050508]/95 backdrop-blur-xl min-h-screen flex-col justify-between shrink-0 relative"
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyber-teal/[0.03] to-transparent pointer-events-none" />
        <SidebarContent user={user} onLogout={onLogout} />
      </aside>
    </>
  );
}
