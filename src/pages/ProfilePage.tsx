import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Fingerprint, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Lock,
  Globe
} from "lucide-react";
import { Component as SilkBackground } from "../components/ui/silk-background-animation";

interface ProfilePageProps {
  user: any;
  onProfileUpdate: (updatedUser: any) => void;
}

export default function ProfilePage({ user, onProfileUpdate }: ProfilePageProps) {
  const [name, setName] = useState(user?.name || "");
  const [organization, setOrganization] = useState(user?.organization || "");
  const [role, setRole] = useState(user?.role || "Auditor");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsUpdating(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, organization, role })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      // Small simulated latency for smooth premium feedback
      await new Promise(resolve => setTimeout(resolve, 600));

      onProfileUpdate(data.user);
      setSuccessMsg("Station credentials revised and synchronised successfully.");
    } catch (err: any) {
      setError(err.message || "Could not revise profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Generate a mock node ID based on user ID or email
  const nodeId = `NODE-IND-${user?.id?.toUpperCase() || "9921"}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 select-none relative min-h-screen bg-[#030303] text-slate-100 overflow-x-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.06] relative z-10">
        <div>
          <h1 className="font-display font-semibold text-xl sm:text-2xl tracking-tight text-white">Auditor Profile</h1>
          <p className="text-slate-400 text-xs mt-1">Manage credentials, review active clearances, and edit station details.</p>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-xs text-cyber-teal-light px-4 py-2 bg-cyber-teal/10 border border-cyber-teal/20 rounded-xl">
          <Fingerprint className="w-4 h-4 text-cyber-teal animate-pulse" />
          <span>{nodeId}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* LEFT COLUMN: Holographic Badge & Clearance Stats (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Holographic ID Badge */}
          <div className="bg-gradient-to-br from-[#0c0d16]/90 to-[#07080c]/90 border border-white/[0.08] rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
            {/* Holographic scanner effect line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-teal/40 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>
            
            {/* Soft backdrop glow inside the card */}
            <div className="absolute -right-12 -bottom-12 w-36 h-36 bg-gradient-to-br from-cyber-teal/10 to-cyber-cyan/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>

            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">Station Connected</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Digital Audit ID</span>
            </div>

            <div className="flex items-start gap-4">
              {/* Profile Avatar Placeholder */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyber-teal/20 to-cyber-cyan/20 border border-white/[0.1] flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden">
                <User className="w-8 h-8 text-cyber-teal-light" />
                <div className="absolute inset-0 bg-cyber-teal/10 mix-blend-overlay" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-white tracking-tight truncate">{user?.name}</h3>
                <p className="text-xs text-cyber-teal-light font-mono mt-0.5 truncate uppercase tracking-wider">{user?.role} clearance</p>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{user?.organization}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barcode representation */}
            <div className="mt-6 pt-5 border-t border-white/[0.05] flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">CAG Cryptographic Node</p>
                <div className="h-6 flex items-end gap-0.5 opacity-60">
                  <div className="w-0.5 h-full bg-slate-400" />
                  <div className="w-1.5 h-full bg-slate-400" />
                  <div className="w-0.5 h-4 bg-slate-400" />
                  <div className="w-1 h-5 bg-slate-400" />
                  <div className="w-0.5 h-full bg-slate-400" />
                  <div className="w-2 h-3 bg-slate-400" />
                  <div className="w-0.5 h-5 bg-slate-400" />
                  <div className="w-1 h-full bg-slate-400" />
                  <div className="w-0.5 h-2 bg-slate-400" />
                  <div className="w-1.5 h-5 bg-slate-400" />
                  <div className="w-0.5 h-full bg-slate-400" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">Level 3 Audit</span>
                <span className="text-[9px] font-mono text-cyber-teal-light uppercase tracking-widest font-semibold">Authorized</span>
              </div>
            </div>
          </div>

          {/* Clearance details & stats */}
          <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyber-teal-light" />
              Security Specifications
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">System Duty</p>
                <p className="font-semibold text-slate-200 mt-1">Defense Procurement</p>
              </div>
              <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Session Key</p>
                <p className="font-semibold text-slate-200 mt-1 font-mono">SHA-256 Valid</p>
              </div>
              <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Node IP Address</p>
                <p className="font-semibold text-slate-200 mt-1 font-mono">10.140.24.11</p>
              </div>
              <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">Vetting Protocol</p>
                <p className="font-semibold text-emerald-400 mt-1">Active / Live</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Profile editor and active handshakes (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Revision form */}
          <div className="bg-white/[0.01] border border-white/[0.06] backdrop-blur-md rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="font-display font-medium text-base text-white mb-6 uppercase tracking-wider pb-3 border-b border-white/[0.05]">
              Revise Station Coordinates
            </h3>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-sans flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-teal-950/40 border border-cyber-teal-light/30 text-xs text-cyber-teal-light font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-teal-light shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Full Name / Identifier
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-[#0d1220]/40 border border-white/[0.06] focus:border-cyber-teal-light rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyber-teal-light transition-all"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Assigned CAG Bureau / Organization
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-[#0d1220]/40 border border-white/[0.06] focus:border-cyber-teal-light rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyber-teal-light transition-all"
                    placeholder="Enter bureau or organization"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Clearance Level / Role
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Cpu className="h-4 w-4 text-slate-500" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-[#0d1220]/90 border border-white/[0.06] focus:border-cyber-teal-light rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyber-teal-light transition-all cursor-pointer"
                  >
                    <option value="Auditor">Auditor (Level 1 Clearance)</option>
                    <option value="Caudit">Caudit Representative (Level 2 Clearance)</option>
                    <option value="Super Admin">Comptroller Super Admin (Level 3 Clearance)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-cyber-teal hover:bg-cyber-teal-light text-white font-medium py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-cyber-teal/15 hover:shadow-cyber-teal/30 border border-cyber-teal-light/10"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synchronizing credentials...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Revision Coordinates</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Handshakes log (Simple elegant container, not styled like code terminal) */}
          <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyber-rose" />
              Active Node Handshakes
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs p-2.5 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                <span className="text-slate-400 font-medium">CAG Central Database</span>
                <span className="text-[10px] font-mono bg-cyber-teal/10 text-cyber-teal-light border border-cyber-teal/20 px-2 py-0.5 rounded-lg font-semibold uppercase">SECURELY RESOLVED</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                <span className="text-slate-400 font-medium">Project Index Registry</span>
                <span className="text-[10px] font-mono bg-cyber-teal/10 text-cyber-teal-light border border-cyber-teal/20 px-2 py-0.5 rounded-lg font-semibold uppercase">SYNCHRONISED</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                <span className="text-slate-400 font-medium">Corporate Vetting Tunnel</span>
                <span className="text-[10px] font-mono bg-cyber-rose/10 text-cyber-rose border border-cyber-rose/20 px-2 py-0.5 rounded-lg font-semibold uppercase">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
