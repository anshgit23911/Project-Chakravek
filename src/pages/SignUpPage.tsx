import React, { useState } from "react";
import { Link, useNavigate as useNav } from "react-router-dom";
import { ShieldAlert, User, Building, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { Component as SilkBackground } from "../components/ui/silk-background-animation";

interface SignUpPageProps {
  onSignUpSuccess: (user: any) => void;
}

export default function SignUpPage({ onSignUpSuccess }: SignUpPageProps) {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Auditor");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNav();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !organization || !email || !password || !confirmPassword) {
      setError("Please populate all credential coordinates.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Credentials verification mismatch — passwords must align.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, organization, role, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "System node registration failed.");
      }
      onSignUpSuccess(data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Auditing mesh registration rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SilkBackground>
      <div className="min-h-screen flex flex-col justify-center py-10 sm:py-12 sm:px-6 lg:px-8 relative px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center text-center">
          <div className="p-2.5 bg-cyber-card rounded-lg border border-cyber-border shadow-sm">
            <ShieldAlert className="w-6 h-6 text-cyber-teal-light" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-display font-medium text-xl sm:text-2xl tracking-normal text-white">
          Request Node Authorization
        </h2>
        <p className="mt-1.5 text-center text-[10px] text-slate-400 font-mono tracking-wider">
          ESTABLISH SECURED TENDER COMPLIANCE STATION
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        <div className="bg-cyber-card border border-cyber-border py-6 sm:py-8 px-5 sm:px-8 shadow-2xl rounded-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-sans">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Full Audit Officer Name
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="S. K. Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 min-h-11 bg-cyber-dark/85 border border-cyber-border rounded-lg text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organization" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Official Organization
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    id="organization"
                    type="text"
                    required
                    placeholder="CAG Defence Wing IX"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 min-h-11 bg-cyber-dark/85 border border-cyber-border rounded-lg text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Govt / Official Email
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="officer@nic.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 min-h-11 bg-cyber-dark/85 border border-cyber-border rounded-lg text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  System Clearance Clearance
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                  </div>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 min-h-11 bg-cyber-dark/85 border border-cyber-border rounded-lg text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
                  >
                    <option value="Auditor">Official Auditor</option>
                    <option value="Caudit">Defence Vetting Coordinator</option>
                    <option value="Super Admin">CAG Super Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pass" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Set Access Cipher Key
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    id="pass"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 min-h-11 bg-cyber-dark/85 border border-cyber-border rounded-lg text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="conf-pass" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Confirm Cipher Key
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    id="conf-pass"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 min-h-11 bg-cyber-dark/85 border border-cyber-border rounded-lg text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyber-teal hover:bg-cyber-teal-light text-white font-medium py-3 min-h-11 px-4 rounded-lg border border-cyber-teal-light/10 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Register Encryption Node</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-cyber-border/40 text-center">
            <span className="text-xs text-slate-400">Credential set already whitelisted?</span>{" "}
            <Link to="/login" className="text-xs font-semibold text-cyber-gold-light hover:text-orange-405 transition-colors">
              Direct Sign In
            </Link>
          </div>
        </div>
      </div>
      </div>
    </SilkBackground>
  );
}
