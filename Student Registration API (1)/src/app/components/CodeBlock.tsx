import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

export function CodeBlock({ code, language = "bash", label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs text-slate-400 font-mono">{label}</span>
          <span className="text-xs text-slate-500">{language}</span>
        </div>
      )}
      <div className="relative group">
        <pre className="p-4 text-sm text-slate-200 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {code}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied
            ? <Check size={14} className="text-emerald-400" />
            : <Copy size={14} className="text-slate-400" />}
        </button>
      </div>
    </div>
  );
}
