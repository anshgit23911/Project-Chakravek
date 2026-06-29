import React, { useState, useEffect } from "react";
import { Settings, Cpu, Sparkles, Check } from "lucide-react";

export interface AISettings {
  provider: "groq";
  model: string;
}

export function getAISettings(): AISettings {
  if (typeof window === "undefined") {
    return { provider: "groq", model: "llama-3.3-70b-versatile" };
  }
  const model = localStorage.getItem("cag_ai_model") || "llama-3.3-70b-versatile";
  return { provider: "groq", model };
}

export function saveAISettings(settings: AISettings) {
  localStorage.setItem("cag_ai_provider", "groq");
  localStorage.setItem("cag_ai_model", settings.model);
}

interface AISettingsControlProps {
  onChange?: (settings: AISettings) => void;
  className?: string;
}

export default function AISettingsControl({ onChange, className = "" }: AISettingsControlProps) {
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const settings = getAISettings();
    setModel(settings.model);
  }, []);

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    const updated: AISettings = { provider: "groq", model: newModel };
    saveAISettings(updated);
    if (onChange) onChange(updated);
  };

  const groqModels = [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 (70B) - High Quality" },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 (8B) - Lightning Fast" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B - MoE Balance" },
  ];

  return (
    <div className={`relative ${className}`} id="ai-settings-control-panel">
      {/* Settings Toggle Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyber-border bg-cyber-dark/85 text-xs text-slate-300 hover:text-white hover:border-cyber-teal-light transition duration-150"
        title="AI Engine Parameters"
      >
        <Settings className={`w-3.5 h-3.5 text-cyber-teal-light ${isOpen ? "rotate-90" : ""} transition-transform duration-300`} />
        <span className="font-mono">Engine: <span className="text-cyber-teal-light uppercase font-bold">GROQ</span> ({model.split('-').slice(0, 2).join('-')})</span>
      </button>

      {/* Settings Dropdown Card */}
      {isOpen && (
        <>
          {/* Invisible clickaway backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-72 bg-cyber-card border border-cyber-border rounded-xl shadow-2xl p-4 z-50 animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border pb-2.5">
              <span className="font-display font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyber-teal-light" />
                Groq Inference Router
              </span>
              <span className="text-[9px] font-mono bg-cyber-teal/10 text-cyber-teal-light px-2 py-0.5 rounded-full uppercase">Active</span>
            </div>

            {/* Provider Label (Static since only Groq is available) */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold font-mono text-slate-450 tracking-wider">AI Host Provider</span>
              <div className="p-2 bg-cyber-teal/15 border border-cyber-teal rounded-lg text-xs flex items-center justify-between">
                <span className="font-semibold text-white">Groq Cloud API</span>
                <Sparkles className="w-3.5 h-3.5 text-cyber-gold animate-pulse" />
              </div>
            </div>

            {/* Model Picker */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold font-mono text-slate-450 tracking-wider">Active Reasoner Model</span>
              <div className="space-y-1.5">
                {groqModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleModelChange(m.id)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-left transition-all flex items-center justify-between ${
                      model === m.id
                        ? "bg-cyber-navy/80 border-cyber-teal-light text-cyber-teal-light font-medium"
                        : "bg-cyber-dark border-cyber-border text-slate-400 hover:bg-cyber-navy/20 hover:text-slate-200"
                    }`}
                  >
                    <span className="truncate">{m.name}</span>
                    {model === m.id && <Check className="w-3.5 h-3.5 text-cyber-teal-light shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-cyber-border pt-2 text-[10px] text-slate-500 font-mono text-center leading-normal">
              <span>Requires <code className="text-slate-350">GROQ_API_KEY</code> set in environments. Local rules fallback enabled.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
