import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReportText(text: string): string {
  if (!text) return "";
  const lines = text.split("\n");
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) {
      // It's a header line
      // Remove all '#' symbols and any leading spaces
      const cleanLine = trimmed.replace(/^#+\s*/, "");
      // Remove any '*' from the header line
      const cleanLineNoStars = cleanLine.replace(/\*/g, "").trim();
      return `<b>${cleanLineNoStars}</b>`;
    } else {
      // It's a regular line
      let processedLine = line;
      // If it starts with a bullet like '* ', convert to standard bullet '-'
      if (trimmed.startsWith("*")) {
        processedLine = line.replace(/^\s*\*\s*/, "- ");
      }
      // Remove all remaining '*' characters
      return processedLine.replace(/\*/g, "");
    }
  });
  return processedLines.join("\n");
}
