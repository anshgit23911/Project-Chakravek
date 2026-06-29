import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  BookOpen, 
  PhoneCall, 
  Users, 
  Scale, 
  MapPin, 
  Mail, 
  ShieldAlert, 
  ArrowLeft,
  ChevronRight,
  Terminal,
  Lock,
  Globe,
  FileText
} from "lucide-react";

export default function InfoPage() {
  const [activeSection, setActiveSection] = useState<"about" | "terms" | "contact">("about");

  const sections = [
    { id: "about", label: "About Us", icon: Users },
    { id: "terms", label: "Terms & Conditions", icon: Scale },
    { id: "contact", label: "Secure Contact Desk", icon: PhoneCall },
  ] as const;

  const scrollToSection = (id: "about" | "terms" | "contact") => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#030303] text-slate-100 min-h-screen relative select-none">
      {/* Background radial effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/[0.03] rounded-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:border-cyber-teal/30 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
          </div>
          <div>
            <span className="font-display font-semibold text-xs tracking-widest text-white block uppercase">
               Return to Node
            </span>
            <p className="text-[9px] font-mono tracking-widest text-cyber-teal-light uppercase">PROJECT CHAKRAVEK</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-md bg-cyber-teal/10 border border-cyber-teal/20 text-[10px] font-mono text-cyber-teal-light uppercase tracking-widest">
            OFFICIAL INFORMATION PORTAL
          </span>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR NAVIGATION (4 columns on large screens) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
            <div className="p-6 bg-white/[0.01] border border-white/[0.06] rounded-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.01] blur-xl rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                <ShieldCheck className="w-5.5 h-5.5 text-indigo-400" />
                <div>
                  <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">Classification</h3>
                  <p className="text-[10px] font-mono text-slate-500">PROJECT HANDBOOK v1.8</p>
                </div>
              </div>

              {/* NAVIGATION BUTTONS */}
              <div className="space-y-2">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isCurrent = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all border ${
                        isCurrent 
                          ? "bg-white/[0.03] text-white border-white/[0.08] shadow-sm font-bold"
                          : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/[0.01]"
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isCurrent ? "text-indigo-400" : "text-slate-500"}`} />
                      <span>{sec.label}</span>
                      {isCurrent && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECURITY ADVISORY BOX */}
            <div className="p-5 bg-[#0a0505]/40 border border-rose-500/10 rounded-2xl text-xs space-y-3 font-mono">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Security Advisory</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Project Chakravek is a secure AI development node operated under strict Comptroller & Auditor General directives. External reverse-engineering or unauthorized credential sharing violates systemic parameters.
              </p>
            </div>
          </div>

          {/* DOCUMENT CONTENT PANEL (8 columns) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* SECTION 1: ABOUT US */}
            <section id="about" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold">MODULE I</span>
                  <h2 className="font-display font-medium text-2xl text-white tracking-tight">About Project Chakravek</h2>
                </div>
              </div>

              <div className="space-y-5 text-slate-300 text-sm leading-relaxed font-sans">
                <p>
                  <strong>Project Chakravek</strong> is a sovereign, state-of-the-art Defense Procurement Oversight and Audit Intelligence platform developed in alignment with the digital-first auditing mandate of the <strong>Comptroller & Auditor General (CAG) of India</strong>.
                </p>
                <p>
                  The initiative was established to address structural vulnerabilities in specialized high-value military acquisitions, where quick fast-track tenders, emergency imports, and proprietary component sourcing present heightened risks of price inflation, collusive bidding networks, and compliance gaps.
                </p>

                {/* Focus Specialists Area */}
                <div className="bg-[#07070a]/80 border border-white/[0.06] p-6 rounded-2xl space-y-4 my-6">
                  <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">Project Chakravek Vetting Panel</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/[0.01] border border-white/[0.05] rounded-xl text-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-500/30 mx-auto flex items-center justify-center mb-2 text-indigo-300 font-display font-bold text-sm">AK</div>
                      <h5 className="text-white text-xs font-medium">Auditor General Kumar</h5>
                      <p className="text-slate-500 text-[10px] mt-1">Lead Forensic Auditor, CAG Joint Wing</p>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/[0.05] rounded-xl text-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-500/30 mx-auto flex items-center justify-center mb-2 text-indigo-300 font-display font-bold text-sm">NS</div>
                      <h5 className="text-white text-xs font-medium">Colonel N. Singh</h5>
                      <p className="text-slate-500 text-[10px] mt-1">Military Sourcing Vetting Specialist</p>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/[0.05] rounded-xl text-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-500/30 mx-auto flex items-center justify-center mb-2 text-indigo-300 font-display font-bold text-sm">DR</div>
                      <h5 className="text-white text-xs font-medium">Dr. Deepa Rao</h5>
                      <p className="text-slate-500 text-[10px] mt-1">Principal AI Systems Architect</p>
                    </div>
                  </div>
                </div>

                <p>
                  By deploying neural vector embedding engines and direct rule-matching heuristics mapping to official <strong>General Financial Rules (GFR)</strong>, Project Chakravek empowers senior auditors, Joint Secretaries, and sourcing inspectors to isolate corrupt supply clusters and flag suspicious bid correlations before final disbursement authorization.
                </p>
              </div>
            </section>

            {/* SECTION 2: TERMS & CONDITIONS */}
            <section id="terms" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold">MODULE II</span>
                  <h2 className="font-display font-medium text-2xl text-white tracking-tight">Terms & Conditions of Service</h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
                <p>
                  Use of the Chakravek AI Core and its associated modules is strictly conditioned upon acceptance of the following security-level directives.
                </p>

                <div className="space-y-4 divide-y divide-white/[0.04]">
                  {/* Item 1 */}
                  <div className="pt-4 first:pt-0">
                    <h4 className="text-white text-xs font-semibold mb-2 flex items-center gap-2">
                      <span className="text-indigo-400 font-mono text-[10px]">2.1</span> 
                      <span>Classification & Secret Clearance Protocol</span>
                    </h4>
                    <p className="text-slate-400 text-xs pl-5 leading-relaxed">
                      All dashboards, risk scores, pricing calculations, and vendor networks generated on this platform constitute privileged national intelligence material. Sharing or displaying interfaces to non-cleared, third-party vendor representatives violates institutional protocols.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="pt-4">
                    <h4 className="text-white text-xs font-semibold mb-2 flex items-center gap-2">
                      <span className="text-indigo-400 font-mono text-[10px]">2.2</span> 
                      <span>Auditing Integrity Mandate</span>
                    </h4>
                    <p className="text-slate-400 text-xs pl-5 leading-relaxed">
                      Information processed via manual procurement ingestion or file vector uploads must match actual corporate ledgers. Attempting to deliberately inject false or altered records to skew or bypass active risk scoring indexes is audit-logged instantly.
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="pt-4">
                    <h4 className="text-white text-xs font-semibold mb-2 flex items-center gap-2">
                      <span className="text-indigo-400 font-mono text-[10px]">2.3</span> 
                      <span>General Financial Rules (GFR) Heuristic Conformity</span>
                    </h4>
                    <p className="text-slate-400 text-xs pl-5 leading-relaxed">
                      The rule-based checking engine simulates compliance matching according to official Indian Ministry of Finance guidelines. Discrepancies flagged by our AI systems are advisory drafts and do not replace physical verification checklists by authorized oversight committees.
                    </p>
                  </div>

                  {/* Item 4 */}
                  <div className="pt-4">
                    <h4 className="text-white text-xs font-semibold mb-2 flex items-center gap-2">
                      <span className="text-indigo-400 font-mono text-[10px]">2.4</span> 
                      <span>Database Configuration Security</span>
                    </h4>
                    <p className="text-slate-400 text-xs pl-5 leading-relaxed">
                      If establishing an external cloud data stream (e.g., Supabase or custom PostgreSQL server), the user retains full responsibility for configuring correct Row Level Security (RLS) constraints to prevent leaks of proprietary vendor bid structures.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: CONTACT SECURE DESK */}
            <section id="contact" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold">MODULE III</span>
                  <h2 className="font-display font-medium text-2xl text-white tracking-tight">Secure Operations Desk</h2>
                </div>
              </div>

              <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-sans">
                <p>
                  For technical setup guidance, API key allocations, user verification queries, or to report suspected data breaches, please connect with our secure operational desk.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone Secure Line */}
                  <div className="p-4 bg-white/[0.01] border border-white/[0.06] rounded-xl flex items-start gap-3">
                    <PhoneCall className="w-5 h-5 text-indigo-450 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white text-xs font-semibold">Joint CAG Technical Command</h4>
                      <p className="text-slate-400 text-xs mt-1">Sovereign Direct Secure Hotline:</p>
                      <span className="text-xs font-mono font-bold text-indigo-300 mt-0.5 block">1800-CHAKRAVEK-CAG</span>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">Mon - Fri, 09:00 - 18:00 IST</p>
                    </div>
                  </div>

                  {/* Email Channel */}
                  <div className="p-4 bg-white/[0.01] border border-white/[0.06] rounded-xl flex items-start gap-3">
                    <Mail className="w-5 h-5 text-indigo-450 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white text-xs font-semibold">Encrypted Operations Inbox</h4>
                      <p className="text-slate-400 text-xs mt-1">Official Govemment Node Email:</p>
                      <span className="text-xs font-mono font-bold text-indigo-300 mt-0.5 block">secure-ops@cakravek.nic.in</span>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">Restricted Domain Inbound Only</p>
                    </div>
                  </div>
                </div>

                {/* HQ Address Panel */}
                <div className="p-5 bg-white/[0.01] border border-white/[0.06] rounded-xl flex items-start gap-3.5">
                  <MapPin className="w-5.5 h-5.5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white text-xs font-semibold">Central HQ Coordinates</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Office of the Comptroller & Auditor General of India, <br />
                      Pocket 9, Deen Dayal Upadhyaya Marg, <br />
                      New Delhi, Delhi 110124
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-2 block">
                      SECURE METROPOLITAN NODE &bull; ZONE A AUDITING AREA
                    </span>
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/[0.05] text-center text-xs text-slate-500 font-mono bg-black/60 relative z-10">
        <p className="mb-2">© 2026 Comptroller & Auditor General of India. Classified National Intelligence Document.</p>
        <p className="text-[10px] text-slate-600">Authorized personnel access only. Under security scanning protocols.</p>
      </footer>
    </div>
  );
}
