import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, User, Lock, ArrowRight, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";
import { Component as SilkBackground } from "../components/ui/silk-background-animation";

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

// Beautifully crafted SVG Google Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

// Beautifully crafted SVG Microsoft Icon
const MicrosoftIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="10.5" height="10.5" fill="#F25022" />
    <rect x="11.5" width="10.5" height="10.5" fill="#7FBA00" />
    <rect y="11.5" width="10.5" height="10.5" fill="#00A1F1" />
    <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
  </svg>
);

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<"google" | "microsoft" | null>(null);
  const [message, setMessage] = useState("");
  const [supabaseLive, setSupabaseLive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/supabase/status")
      .then(async res => {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          return res.json();
        }
        return { configured: false };
      })
      .then(data => {
        if (data && data.configured) {
          setSupabaseLive(true);
        }
      })
      .catch(err => {
        console.error("Failed to fetch Supabase status inside login page", err);
      });
  }, []);

  useEffect(() => {
    const handleOauthMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'SUPABASE_OAUTH_SUCCESS') {
        const { accessToken, user, provider } = event.data;
        setSsoLoading(provider || "google");
        setError("");
        try {
          const res = await fetch("/api/auth/login-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken, user })
          });
          
          let data: any = {};
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await res.json();
          } else {
            const text = await res.text();
            throw new Error(text || `Server error (status: ${res.status})`);
          }

          if (!res.ok) throw new Error(data.error || "Failed to log in via secure token");

          onLoginSuccess(data.user);
          navigate("/dashboard");
        } catch (err: any) {
          setError(err.message || "Failed to complete secure session synchronization.");
        } finally {
          setSsoLoading(null);
        }
      }
    };

    window.addEventListener('message', handleOauthMessage);
    return () => window.removeEventListener('message', handleOauthMessage);
  }, [navigate, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please populate your designated official credentials.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server error (status: ${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }
      onLoginSuccess(data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Auditing node connection rejected.");
    } finally {
      setLoading(false);
    }
  };

  const handleSsoLogin = async (provider: "google" | "microsoft") => {
    setError("");
    setSsoLoading(provider);

    try {
      if (provider === "google" || provider === "microsoft") {
        const resUrl = await fetch(`/api/auth/${provider}-url`);
        
        let urlData: any = {};
        const contentType = resUrl.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          urlData = await resUrl.json();
        } else {
          const text = await resUrl.text();
          throw new Error(text || `Server error (status: ${resUrl.status})`);
        }

        if (urlData.supabaseConfigured && urlData.url) {
          const authWindow = window.open(
            urlData.url,
            `${provider}_oauth_popup`,
            "width=600,height=700"
          );
          if (!authWindow) {
            throw new Error("Popup blocked. Please enable popups for this site to complete authentication.");
          }
          // The window message event listener in useEffect will handle the session callback
          return;
        }
      }

      // Local mock simulation (or Microsoft Azure AD mock)
      const mockEmail = provider === "google" 
        ? "google-auditor@nic.in" 
        : "microsoft-auditor@nic.in";
      const dummyPass = "SSO_SECURE_TOKEN_PASS_9918";

      // Direct high-fidelity authentication with backend
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mockEmail, password: dummyPass })
      });
      
      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server error (status: ${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || `${provider} authentication failed.`);
      }

      // Elegant simulated SSO gateway handshake delay for visual premium feedback
      await new Promise((resolve) => setTimeout(resolve, 900));
      
      onLoginSuccess(data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || `Secure SSO handshake with ${provider} failed.`);
      setSsoLoading(null);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Input your official email first to dispatch recovery token.");
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server error (status: ${res.status})`);
      }

      setMessage(data.message || "Dispatched password recovery instructions.");
    } catch (err: any) {
      setError(err.message || "Recovery node unreachable.");
    }
  };

  return (
    <SilkBackground>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
          <div className="inline-flex justify-center mb-4 relative group">
            <div className="absolute inset-0 bg-cyber-teal/35 rounded-xl blur-md group-hover:bg-cyber-teal/50 transition duration-300 pointer-events-none"></div>
            <div className="relative p-3 bg-[#0d1527] rounded-xl border border-cyber-teal-light/35 shadow-lg shadow-cyber-teal/10">
              <ShieldAlert className="w-8 h-8 text-cyber-teal-light animate-pulse" />
            </div>
          </div>
          <h2 className="text-center font-sans font-semibold text-3xl tracking-tight text-white drop-shadow-sm">
            Auditor Gateway
          </h2>
          <p className="mt-2 text-center text-xs text-slate-400 font-mono tracking-widest uppercase">
            PROJECT CHAKRAVEK SECURE AUTHENTICATOR
          </p>
          {supabaseLive && (
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] text-emerald-400 font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SUPABASE VERIFICATION ACTIVE</span>
            </div>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-[#0b0f19]/90 border border-cyber-border/80 backdrop-blur-md py-8 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-3xl relative overflow-hidden group">
            {/* Subtle premium corner highlights */}
            <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-transparent via-cyber-teal-light/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-transparent via-cyber-teal-light/40 to-transparent"></div>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-sans flex items-start gap-2 animate-shake">
                <span className="shrink-0 mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-6 p-3.5 rounded-xl bg-teal-950/40 border border-cyber-teal-light/30 text-xs text-cyber-teal-light font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-teal-light" />
                <span>{message}</span>
              </div>
            )}

            {/* Direct SSO Login Options */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                disabled={loading || !!ssoLoading}
                onClick={() => handleSsoLogin("google")}
                className="w-full flex items-center justify-center py-2.5 px-4 bg-[#0f1422] hover:bg-[#161d31] border border-cyber-border hover:border-slate-500 text-slate-200 hover:text-white rounded-xl transition duration-200 text-sm font-medium shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group/sso"
              >
                {ssoLoading === "google" ? (
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin mr-3"></div>
                ) : (
                  <GoogleIcon />
                )}
                <span>
                  {ssoLoading === "google" ? "Verifying Google Key..." : "Sign in with Google Account"}
                </span>
              </button>
            </div>

            {/* Aesthetic Separator */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyber-border/50"></div>
              </div>
              <span className="relative px-3 bg-[#0b0f19] text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                or secure email sign-in
              </span>
            </div>

            {/* Credentials Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                  <span>Official Email Address</span>
                  <span className="text-slate-600 font-normal">SECURE NODE</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="auditor@nic.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-[#0d1220]/80 border border-cyber-border/80 focus:border-cyber-teal-light rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyber-teal transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                  <span>System Password</span>
                  <span className="text-slate-600 font-normal">ENCRYPTED</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-[#0d1220]/80 border border-cyber-border/80 focus:border-cyber-teal-light rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyber-teal transition-all font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-cyber-border bg-cyber-dark text-cyber-teal focus:ring-cyber-teal focus:ring-offset-0 focus:outline-none cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-slate-400 cursor-pointer select-none">
                    Remember Active Station
                  </label>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="font-medium text-cyber-teal-light hover:text-teal-400 focus:outline-none transition-colors"
                  >
                    Forgot Key?
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !!ssoLoading}
                  className="w-full bg-cyber-teal hover:bg-cyber-teal-light text-white font-medium py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-cyber-teal/15 hover:shadow-cyber-teal/30 focus:outline-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Authenticate Station</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-cyber-border/30 text-center flex flex-col items-center gap-1">
              <span className="text-xs text-slate-400">
                Not registered on project index?
              </span>
              <Link to="/signup" className="text-xs font-semibold text-cyber-gold-light hover:text-orange-400 transition-colors">
                Request Node Authorization (Sign Up)
              </Link>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
            <Cpu className="w-3.5 h-3.5" />
            <span>CAG CENTRAL DECRYPTION MATRIX v4.11</span>
          </div>
        </div>
      </div>
    </SilkBackground>
  );
}

