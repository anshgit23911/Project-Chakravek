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
  User
} from "lucide-react";
import { ChatMessage } from "../types";
import AISettingsControl, { getAISettings } from "../components/AISettingsControl";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const sampleQueries = [
    "Show vendors registered after 2022 that won contracts above ₹5 crore.",
    "List contracts with unusually high unit pricing.",
    "Identify vendors linked to multiple flagged contracts."
  ];

  // Helper to create initial welcome message
  const createInitialMessages = (): ChatMessage[] => [
    {
      id: "m-init-" + Math.floor(Math.random() * 10000),
      role: "assistant",
      query: "",
      response: "Secure terminal handshake configured. I am the Comptroller and Auditor General (CAG) AI audit agent. You can ask me conversational logic inquiries about defense contracts, offshore networks, or price-gouging deviations registered under our current indices.",
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
      title: "New Handshake Session",
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
            <span className="truncate">Chakravek Conversational Advisement Node</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Ask RAG questions from uploaded procurement datasets and central audit records.</p>
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
                <span>Audit Sessions</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500 bg-cyber-dark px-1.5 py-0.5 rounded border border-cyber-border">
                {sessions.length} CHATS
              </span>
            </div>
            
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 bg-cyber-dark hover:bg-cyber-card-hover border border-cyber-border hover:border-cyber-teal-light/50 text-xs font-medium text-slate-350 hover:text-white rounded-lg transition-all group"
            >
              <span className="p-0.5 rounded bg-cyber-teal/15 border border-cyber-teal-light/10 group-hover:border-cyber-teal-light/40 group-hover:scale-110 transition-all flex items-center justify-center shrink-0">
                <Plus className="w-3.5 h-3.5 text-cyber-teal-light" />
              </span>
              <span>New Handshake Node</span>
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

                <div className={`max-w-[92%] sm:max-w-[80%] rounded-xl p-3 sm:p-4 space-y-2 ${
                  m.role === "user" 
                    ? "bg-cyber-teal/10 text-slate-100 border border-cyber-teal/30" 
                    : "bg-cyber-dark/45 text-slate-300 border border-cyber-border/80"
                }`}>
                  <p className="text-xs leading-relaxed font-sans whitespace-pre-wrap">{m.role === "user" ? m.query : m.response}</p>
                  
                  {/* Citations block */}
                  {m.citation && (
                    <div className="pt-3 border-t border-cyber-border/40 mt-3 font-mono text-[10px] space-y-1.5 text-slate-400">
                      <div className="flex items-center gap-1.5 font-bold text-cyber-gold">
                        <span className="p-0.5 rounded bg-cyber-gold/10 border border-cyber-gold/25 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-cyber-gold" />
                        </span>
                        <span>INTELLIGENCE SOURCE REFERENCES:</span>
                      </div>
                      {m.citation.contracts.length > 0 && (
                        <div className="pl-5">
                          <strong>Exposed Contracts:</strong> {m.citation.contracts.join(", ")}
                        </div>
                      )}
                      {m.citation.files.length > 0 && (
                        <div className="pl-5">
                          <strong>Reference Material:</strong> {m.citation.files.join(", ")}
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
                  <span className="text-[10px] font-mono text-slate-500 ml-1.5 uppercase font-semibold">RAG Retrieval Vetting...</span>
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
                placeholder="Ask Project Chakravek AI Core about procurement anomalies..."
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
              <span>Vetted Inquiries</span>
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
