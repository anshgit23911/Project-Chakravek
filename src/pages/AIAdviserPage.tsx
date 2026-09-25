import React, { useState, useRef, useEffect } from "react";
import { 
  Cpu, 
  Send, 
  Sparkles, 
  Plus, 
  FileCheck2, 
  GitFork, 
  HelpCircle,
  FileSpreadsheet,
  AlertTriangle,
  ExternalLink,
  Bot,
  History,
  MessageSquare,
  Trash2,
  User,
  Copy,
  Check,
  ShieldAlert
} from "lucide-react";
import { ChatMessage } from "../types";
import AISettingsControl, { getAISettings } from "../components/AISettingsControl";

// Token highlighter for Contract IDs, Currency, and Deviations
function formatHighlightTokens(text: string): React.ReactNode {
  const tokenRegex = /\b([C|V]-\d{3,5}|GEM-[\w\d-]+|RT-[\w\d-]+|INR\s*[\d,.]+\s*(?:Crore|Cr|Lakh)?|₹\s*[\d,.]+\s*(?:Cr|Crore)?|[+-]?\d+(?:\.\d+)?%|\b(?:Risk Score|Anomaly Score|Anomaly Index)[:\s]+\d+(?:\/\d+)?)\b/gi;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    const tokenLower = token.toLowerCase();

    if (tokenLower.startsWith("c-") || tokenLower.startsWith("gem-") || tokenLower.startsWith("rt-") || tokenLower.startsWith("v-")) {
      parts.push(
        <span key={match.index} className="font-mono text-[11px] font-semibold text-cyber-teal-light bg-cyber-teal/15 px-1.5 py-0.5 rounded border border-cyber-teal-light/25 inline-block mx-0.5">
          {token}
        </span>
      );
    } else if (tokenLower.includes("inr") || tokenLower.includes("₹")) {
      parts.push(
        <span key={match.index} className="font-mono text-[11px] font-medium text-amber-300 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-500/25 inline-block mx-0.5">
          {token}
        </span>
      );
    } else if (token.includes("%") || tokenLower.includes("score") || tokenLower.includes("anomaly")) {
      const isNegativeOrHigh = token.includes("+") || parseInt(token) >= 70;
      parts.push(
        <span key={match.index} className={`font-mono text-[11px] font-medium px-1.5 py-0.5 rounded border inline-block mx-0.5 ${
          isNegativeOrHigh
            ? "text-rose-400 bg-rose-950/30 border-rose-800/30"
            : "text-emerald-400 bg-emerald-950/30 border-emerald-800/30"
        }`}>
          {token}
        </span>
      );
    } else {
      parts.push(<strong key={match.index} className="text-white font-medium">{token}</strong>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

// Structured Clean Advisory Renderer (Strips all *, #, ` and formats with executive typographic layout)
function FormattedAIResponse({ text }: { text: string }) {
  // Strip any residual asterisks, hashes, backticks
  const cleaned = text
    .replace(/^#{1,6}\s*(.+)$/gm, '$1')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/^\s*\*\s+/gm, '• ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#`]/g, '')
    .trim();

  const lines = cleaned.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-list`} className="space-y-1.5 my-2 pl-0.5">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal-light shrink-0 mt-1.5 shadow-[0_0_6px_rgba(20,240,240,0.5)]"></span>
              <span className="flex-1">{formatHighlightTokens(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(`flush-${idx}`);
      return;
    }

    // Bullet point check
    if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
      const itemText = trimmed.replace(/^[•-]\s*/, "");
      currentList.push(itemText);
      return;
    }

    flushList(`line-${idx}`);

    // Section header check
    const isHeader = 
      (trimmed.endsWith(":") && trimmed.length < 65) ||
      (/^[0-9]+\.\s+[A-Z\s&]+:?$/.test(trimmed)) ||
      (/^[A-Z\s&/:()-]{4,55}$/.test(trimmed) && !trimmed.includes("INR") && !trimmed.includes("CRORE") && !trimmed.includes("Crores"));

    if (isHeader) {
      elements.push(
        <div key={`header-${idx}`} className="pt-3 pb-1 first:pt-0">
          <div className="flex items-center gap-2 text-cyber-teal-light font-display text-[11px] font-bold tracking-wider uppercase pb-1 border-b border-cyber-teal/20">
            <span className="w-1.5 h-1.5 rounded-xs bg-cyber-teal-light"></span>
            <span>{trimmed.replace(/:$/, "")}</span>
          </div>
        </div>
      );
      return;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${idx}`} className="text-xs text-slate-200 leading-relaxed font-sans">
        {formatHighlightTokens(trimmed)}
      </p>
    );
  });

  flushList("final");

  return <div className="space-y-2">{elements}</div>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

export default function AIAdviserPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sampleQueries = [
    "Search CAG audit findings regarding emergency fast track procedure delivery delays.",
    "Explain what GFR Rule 144 requires for defense procurement.",
    "Find high-risk contracts with price deviation exceeding 50% in the GeM dataset.",
    "What red flags should I look for in shell vendors and single-bidder tenders?"
  ];

  // Helper to create initial welcome message
  const createInitialMessages = (): ChatMessage[] => [
    {
      id: "m-init-" + Math.floor(Math.random() * 10000),
      role: "assistant",
      query: "",
      response: "Hello! I am your CAG Defense Audit Advisor for Project Chakravek. You can ask me questions about defense procurement rules, evaluate pricing anomalies, inspect specific contracts and vendors, or discuss general auditing principles. How can I assist your audit review today?",
      createdAt: new Date().toISOString()
    }
  ];

  // Load chat sessions on mount
  useEffect(() => {
    const stored = localStorage.getItem("chakravek_chat_sessions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatSession[];
        if (parsed && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Failed to parse chat sessions", e);
      }
    }
    
    // Create initial session if none exists
    const defaultSession: ChatSession = {
      id: "session-init",
      title: "New Audit Consultation",
      messages: createInitialMessages(),
      createdAt: new Date().toISOString()
    };
    setSessions([defaultSession]);
    setActiveSessionId(defaultSession.id);
  }, []);

  // Sync sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("chakravek_chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Sync active messages when activeSessionId or sessions change
  useEffect(() => {
    const active = sessions.find(s => s.id === activeSessionId);
    if (active) {
      setMessages(active.messages);
    }
  }, [activeSessionId, sessions]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: "session-" + Math.floor(Math.random() * 100000),
      title: "New Handshake Session",
      messages: createInitialMessages(),
      createdAt: new Date().toISOString()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    
    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        const defaultSession: ChatSession = {
          id: "session-init",
          title: "New Handshake Session",
          messages: createInitialMessages(),
          createdAt: new Date().toISOString()
        };
        setSessions([defaultSession]);
        setActiveSessionId(defaultSession.id);
      }
    }
  };

  const handleClearAll = () => {
    const defaultSession: ChatSession = {
      id: "session-init",
      title: "New Handshake Session",
      messages: createInitialMessages(),
      createdAt: new Date().toISOString()
    };
    setSessions([defaultSession]);
    setActiveSessionId(defaultSession.id);
    localStorage.setItem("chakravek_chat_sessions", JSON.stringify([defaultSession]));
    setConfirmClear(false);
  };

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      const clean = text
        .replace(/^#{1,6}\s*(.+)$/gm, '$1')
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
        .replace(/^\s*\*\s+/gm, '• ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[*#`]/g, '')
        .trim();
      await navigator.clipboard.writeText(clean);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || sending) return;
    
    const userMessage: ChatMessage = {
      id: "msg-" + Math.floor(Math.random() * 10000),
      role: "user",
      query: text,
      response: "",
      createdAt: new Date().toISOString()
    };

    // Update active session with user message and update title if default
    setSessions(prevSessions => {
      return prevSessions.map(s => {
        if (s.id === activeSessionId) {
          const isDefaultTitle = s.title === "New Handshake Session";
          const newTitle = isDefaultTitle 
            ? (text.length > 30 ? text.substring(0, 30) + "..." : text)
            : s.title;
          return {
            ...s,
            title: newTitle,
            messages: [...s.messages, userMessage]
          };
        }
        return s;
      });
    });

    setInputVal("");
    setSending(true);

    const { provider, model } = getAISettings();

    try {
      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: text, 
          history: messages, 
          provider, 
          model 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Intelligence query timed out.");

      const botMessage: ChatMessage = {
        id: "msg-" + Math.floor(Math.random() * 10000),
        role: "assistant",
        query: text,
        response: data.response,
        citation: data.citation,
        createdAt: new Date().toISOString()
      };
      
      setSessions(prevSessions => {
        return prevSessions.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, botMessage]
            };
          }
          return s;
        });
      });
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: "msg-" + Math.floor(Math.random() * 10000),
        role: "assistant",
        query: text,
        response: `⚠️ CONNECTIONS FAULT: ${err.message || "Failed to trigger reasoning engine."}`,
        createdAt: new Date().toISOString()
      };
      
      setSessions(prevSessions => {
        return prevSessions.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, errorMessage]
            };
          }
          return s;
        });
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 select-none flex-1 flex flex-col min-h-0 relative bg-[#030303] text-slate-100 overflow-x-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyber-teal/20 via-cyber-cyan/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyber-rose/20 via-cyber-violet/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col min-h-0 space-y-6">
        {/* HEADER SEGMENT */}
        <div className="pb-4 border-b border-cyber-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display font-medium text-lg sm:text-2xl text-white flex items-center gap-2 sm:gap-3">
            <span className="p-1.5 rounded-lg bg-cyber-teal/10 border border-cyber-teal-light/30 shadow-[0_0_12px_rgba(20,240,240,0.15)] flex items-center justify-center shrink-0 animate-pulse">
              <Cpu className="w-5 h-5 text-cyber-teal-light" />
            </span>
            <span className="truncate">CAG Defense Audit Advisor</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Ask questions about defense contracts, audit guidelines, or flagged anomalies.</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyber-teal/15 text-cyber-teal-light border border-cyber-teal-light/25">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal-light animate-pulse"></span>
              Audit Intelligence Active: 31,500 Procurement Records Connected
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] text-slate-400 border border-white/[0.08]">
              CAG Cases &bull; GeM Orders &bull; eProcure Tenders
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AISettingsControl />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* CHAT HISTORY SIDEBAR (3 Columns) */}
        <div className="lg:col-span-3 bg-cyber-card border border-cyber-border rounded-xl flex flex-col justify-between overflow-hidden">
          {/* Top section: Header & New Chat Button */}
          <div className="p-4 border-b border-cyber-border space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="p-1 rounded bg-cyber-teal/10 border border-cyber-teal-light/20 flex items-center justify-center shrink-0">
                  <History className="w-3.5 h-3.5 text-cyber-teal-light" />
                </span>
                <span>Audit Consultations</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500 bg-cyber-dark px-1.5 py-0.5 rounded border border-cyber-border">
                {sessions.length} CHATS
              </span>
            </div>
            
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 bg-cyber-dark hover:bg-cyber-card-hover border border-cyber-border hover:border-cyber-teal-light/50 text-xs font-medium text-slate-350 hover:text-white rounded-lg transition-all group cursor-pointer"
            >
              <span className="p-0.5 rounded bg-cyber-teal/15 border border-cyber-teal-light/10 group-hover:border-cyber-teal-light/40 group-hover:scale-110 transition-all flex items-center justify-center shrink-0">
                <Plus className="w-3.5 h-3.5 text-cyber-teal-light" />
              </span>
              <span>New Audit Consultation</span>
            </button>
          </div>

          {/* Middle section: Sessions list */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 min-h-[150px]">
            {sessions.map(s => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`group relative flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isActive
                      ? "bg-cyber-teal/10 border-cyber-teal/40 text-white"
                      : "bg-transparent border-transparent hover:bg-cyber-dark/40 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden w-full pr-6">
                    <span className={`p-1 rounded flex items-center justify-center shrink-0 transition-all ${
                      isActive 
                        ? "bg-cyber-teal/20 border border-cyber-teal-light/35 shadow-[0_0_8px_rgba(20,240,240,0.2)]" 
                        : "bg-slate-900/50 border border-slate-850 group-hover:border-slate-700"
                    }`}>
                      <MessageSquare className={`w-3 h-3 shrink-0 ${isActive ? "text-cyber-teal-light" : "text-slate-500 group-hover:text-slate-350"}`} />
                    </span>
                    <span className="text-xs truncate font-sans font-medium">{s.title}</span>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 bg-red-950/20 hover:bg-red-900/60 border border-transparent hover:border-red-800/60 rounded text-slate-500 hover:text-red-450 transition-all flex items-center justify-center"
                    title="Delete session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom section: Clear All action */}
          <div className="p-3 bg-cyber-dark/30 border-t border-cyber-border flex justify-between items-center shrink-0">
            {confirmClear ? (
              <div className="flex items-center gap-1.5 w-full">
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-1.5 px-2 bg-red-950/60 hover:bg-red-900 border border-red-800/80 hover:border-red-600 text-[10px] font-bold text-red-200 rounded transition-all text-center"
                >
                  CONFIRM CLEAR ALL
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="py-1.5 px-2.5 bg-cyber-dark border border-cyber-border text-[10px] text-slate-400 rounded hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full py-1.5 px-2.5 text-center text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 hover:text-red-400 bg-transparent rounded hover:bg-red-950/20 hover:border hover:border-red-950/40 transition-all flex items-center justify-center gap-2 group"
              >
                <span className="p-0.5 rounded bg-transparent group-hover:bg-red-950/40 border border-transparent group-hover:border-red-900/30 flex items-center justify-center transition-all">
                  <Trash2 className="w-3 h-3 text-slate-555 group-hover:text-red-400" />
                </span>
                <span>Clear Audit History</span>
              </button>
            )}
          </div>
        </div>

        {/* CHAT WINDOW (6 Columns) */}
        <div className="lg:col-span-6 bg-cyber-card border border-cyber-border rounded-xl flex flex-col justify-between overflow-hidden relative">
          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-3.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`shrink-0 p-2.5 rounded-lg border flex items-center justify-center transition-all ${
                  m.role === "user" 
                    ? "bg-cyber-teal/15 border-cyber-teal-light/35 shadow-[0_0_8px_rgba(20,240,240,0.15)] order-2" 
                    : "bg-cyber-dark border-cyber-border shadow-[0_0_8px_rgba(255,255,255,0.03)]"
                }`}>
                  {m.role === "user" ? (
                    <User className="w-4 h-4 text-cyber-teal-light" />
                  ) : (
                    <Bot className="w-4 h-4 text-cyber-teal-light animate-pulse" />
                  )}
                </div>

                <div className={`max-w-[92%] sm:max-w-[85%] rounded-xl p-3.5 sm:p-4.5 space-y-2.5 ${
                  m.role === "user" 
                    ? "bg-cyber-teal/10 text-slate-100 border border-cyber-teal/30" 
                    : "bg-cyber-dark/60 text-slate-200 border border-cyber-border/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                }`}>
                  {m.role === "user" ? (
                    <p className="text-xs leading-relaxed font-sans text-white">{m.query}</p>
                  ) : (
                    <div>
                      {/* Assistant Header & Copy Action */}
                      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-cyber-border/40">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-cyber-teal-light uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal-light animate-pulse"></span>
                            CAG Audit Intelligence
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">• {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <button
                          onClick={() => handleCopyMessage(m.id, m.response)}
                          className="px-2 py-1 rounded bg-cyber-card hover:bg-cyber-card-hover border border-cyber-border text-slate-400 hover:text-white text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Copy clean advisory to clipboard"
                        >
                          {copiedMsgId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400 animate-pulse" />
                              <span className="text-emerald-400 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy Advisory</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Clean Executive Content */}
                      <FormattedAIResponse text={m.response} />

                      {/* Citations Block */}
                      {m.citation && (m.citation.contracts.length > 0 || m.citation.files.length > 0) && (
                        <div className="pt-3 border-t border-cyber-border/40 mt-3.5 font-mono text-[10px] space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-cyber-gold">
                            <span className="p-0.5 rounded bg-cyber-gold/10 border border-cyber-gold/25 flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-cyber-gold" />
                            </span>
                            <span className="tracking-wide">RAG EVIDENCE CITATIONS:</span>
                          </div>
                          {m.citation.contracts.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pl-4">
                              <span className="text-slate-400 text-[10px]">Tenders:</span>
                              {m.citation.contracts.map((cid, cidx) => (
                                <span key={cidx} className="px-1.5 py-0.5 rounded bg-cyber-teal/15 text-cyber-teal-light border border-cyber-teal-light/25 font-semibold text-[10px]">
                                  {cid}
                                </span>
                              ))}
                            </div>
                          )}
                          {m.citation.files.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pl-4">
                              <span className="text-slate-400 text-[10px]">Ingested Files:</span>
                              {m.citation.files.map((fid, fidx) => (
                                <span key={fidx} className="px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-750 text-[10px]">
                                  {fid}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg border bg-cyber-dark border-cyber-border shadow-[0_0_8px_rgba(20,240,240,0.1)] text-cyber-teal animate-pulse flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyber-teal-light" />
                </div>
                <div className="px-4 py-3 bg-cyber-dark/45 border border-cyber-border rounded-xl flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyber-teal-light rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-cyber-teal-light rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyber-teal-light rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[10px] font-mono text-slate-500 ml-1.5 uppercase font-semibold">Reviewing Defense Audit Records...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Typing field */}
          <div className="p-4 bg-cyber-dark/45 border-t border-cyber-border">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about defense tenders, pricing anomalies, GFR rules, or general audit questions..."
                className="w-full bg-cyber-dark border border-cyber-border rounded-lg pl-4 pr-14 py-3 min-h-11 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-teal focus:border-cyber-teal-light transition-all"
              />
              <button
                type="submit"
                disabled={sending}
                className="absolute right-2 p-2.5 min-h-11 min-w-11 bg-cyber-teal hover:bg-cyber-teal-light text-white rounded-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* SIDE BAR TEMPLATES RECOMMENDATIONS (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl">
            <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="p-1 rounded bg-cyber-teal/10 border border-cyber-teal-light/20 flex items-center justify-center shrink-0">
                <HelpCircle className="w-3 h-3 text-cyber-teal-light" />
              </span>
              <span>Suggested Inquiries</span>
            </h4>
            <div className="space-y-2">
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={sending}
                  className="w-full text-left p-3 bg-cyber-dark hover:bg-cyber-card-hover border border-cyber-border rounded-lg text-xs text-slate-350 hover:text-white transition-all font-sans leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl">
            <div className="flex items-center gap-2.5 text-cyber-gold mb-3">
              <span className="p-1 rounded bg-cyber-gold/10 border border-cyber-gold/25 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-cyber-gold" />
              </span>
              <h5 className="font-display text-xs font-semibold uppercase tracking-wider">Hallucination Preventions</h5>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
              All intelligence inquiries run under strict **top-k retrieval restrictions**. The model is guided to answer ONLY matching pre-vetted corporate records. Any unanchored question will be flagged.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
