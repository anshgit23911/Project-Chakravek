import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/^#{1,6}\s*(.+)$/gm, '$1')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/^\s*\*\s+/gm, '• ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#`]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function formatReportText(text: string): string {
  if (!text) return "";
  const cleaned = cleanText(text);
  const lines = cleaned.split("\n");
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    // Section headers: uppercase line ending with colon or short all-caps title
    if ((trimmed.endsWith(":") && trimmed.length < 60) || (/^[0-9]+\.\s+[A-Z\s]+$/.test(trimmed)) || (/^[A-Z\s]{4,}$/.test(trimmed) && trimmed.length < 45)) {
      return `<strong class="text-white block mt-3 mb-1 text-xs tracking-wide uppercase">${trimmed}</strong>`;
    }
    if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
      return `<div class="pl-3 py-0.5 text-slate-300">• ${trimmed.replace(/^[•-]\s*/, "")}</div>`;
    }
    return line;
  });
  return processedLines.join("\n");
}
