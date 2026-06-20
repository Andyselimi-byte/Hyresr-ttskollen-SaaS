"use client";
import { useState, useRef } from "react";
import { FileText, Upload, AlertCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import type { ContractAnalysis } from "@/types";

const STATUS_CONFIG = {
  ok:   { icon: CheckCircle,   cls: "bg-[#eaf3de] border-[#97c459] text-[#27500a]",  badge: "bg-[#97c459] text-white", label: "OK" },
  warn: { icon: AlertTriangle, cls: "bg-[#faeeda] border-[#ef9f27] text-[#633806]",  badge: "bg-[#ef9f27] text-white", label: "Notera" },
  flag: { icon: AlertCircle,   cls: "bg-[#fcebeb] border-[#f09595] text-[#791f1f]",  badge: "bg-[#f09595] text-white", label: "Uppmärksamma" },
};

export default function AvtalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.type !== "application/pdf") { setError("Endast PDF-filer accepteras."); return; }
    if (f.size > 10 * 1024 * 1024) { setError("Filen är för stor. Maxstorlek är 10 MB."); return; }
    setError("");
    setFile(f);
    setAnalysis(null);
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/analyze-contract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Något gick fel");
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  const grouped = analysis
    ? {
        ok:   analysis.clauses.filter(c => c.status === "ok"),
        warn: analysis.clauses.filter(c => c.status === "warn"),
        flag: analysis.clauses.filter(c => c.status === "flag"),
      }
    : null;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-5 w-5 text-[#1a56a0]" />
          <h1 className="text-2xl font-bold text-gray-900">Avtalsgranskning</h1>
          <span className="text-[10px] font-semibold bg-[#1a56a0] text-white px-2 py-0.5 rounded-full">PREMIUM</span>
        </div>
        <p className="text-sm text-gray-500">
          Ladda upp ditt hyresavtal (PDF) för AI-driven analys av klausuler.
        </p>
      </div>

      {!analysis && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              dragging ? "border-[#1a56a0] bg-[#e6f1fb]" : "border-gray-300 hover:border-[#1a56a0] hover:bg-gray-50"
            }`}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {file ? file.name : "Dra och släpp PDF här"}
            </p>
            <p className="text-xs text-gray-400">eller klicka för att välja fil — max 10 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {file && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-4 w-full bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyserar avtal...</> : "Analysera avtal"}
            </button>
          )}
        </div>
      )}

      {analysis && grouped && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Sammanfattning</h2>
            <p className="text-sm text-gray-700">{analysis.summary}</p>
            <div className="flex gap-3 mt-3 text-xs font-medium">
              <span className="bg-[#eaf3de] text-[#27500a] px-2 py-1 rounded">{grouped.ok.length} OK</span>
              <span className="bg-[#faeeda] text-[#633806] px-2 py-1 rounded">{grouped.warn.length} Notera</span>
              <span className="bg-[#fcebeb] text-[#791f1f] px-2 py-1 rounded">{grouped.flag.length} Uppmärksamma</span>
            </div>
          </div>

          {(["flag", "warn", "ok"] as const).map(status => {
            const clauses = grouped[status];
            if (clauses.length === 0) return null;
            const cfg = STATUS_CONFIG[status];
            const Icon = cfg.icon;
            return (
              <div key={status}>
                <h3 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {status === "flag" ? "Uppmärksamma" : status === "warn" ? "Notera" : "OK"}
                </h3>
                <div className="space-y-3">
                  {clauses.map((clause, i) => (
                    <div key={i} className={`border rounded-xl p-4 ${cfg.cls}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{clause.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm mb-2 opacity-90">{clause.finding}</p>
                      <p className="text-xs opacity-75 mb-2">{clause.information}</p>
                      <span className="text-[10px] font-mono bg-black/10 px-2 py-0.5 rounded-full">
                        {clause.lawRef}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <button
            onClick={() => { setAnalysis(null); setFile(null); }}
            className="text-sm text-[#1a56a0] hover:underline"
          >
            ← Analysera ett annat avtal
          </button>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
