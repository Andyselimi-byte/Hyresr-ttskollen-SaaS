"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { FileText, Upload, AlertCircle, CheckCircle, AlertTriangle, Loader2, ShieldAlert, ShieldCheck, Shield, Download, Clock, Trash2, ChevronRight } from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PremiumGate } from "@/components/PremiumGate";
import { generateAnalysisPdf } from "@/lib/generateAnalysisPdf";
import { createClient } from "@/lib/supabase";
import type { ContractAnalysis } from "@/types";

interface HistoryItem {
  id: string;
  file_name: string | null;
  summary: string | null;
  risk_level: string | null;
  analysis: ContractAnalysis;
  created_at: string;
}

const STATUS_CONFIG = {
  ok:   { icon: CheckCircle,   cls: "bg-[#eaf3de] border-[#97c459] text-[#27500a]",  badge: "bg-[#97c459] text-white", label: "OK" },
  warn: { icon: AlertTriangle, cls: "bg-[#faeeda] border-[#ef9f27] text-[#633806]",  badge: "bg-[#ef9f27] text-white", label: "Notera" },
  flag: { icon: AlertCircle,   cls: "bg-[#fcebeb] border-[#f09595] text-[#791f1f]",  badge: "bg-[#f09595] text-white", label: "Uppmärksamma" },
};

const RISK_CONFIG = {
  low:    { label: "Låg risk", cls: "bg-green-100 text-green-800 border-green-300", icon: ShieldCheck },
  medium: { label: "Medelhög risk", cls: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Shield },
  high:   { label: "Hög risk", cls: "bg-red-100 text-red-800 border-red-300", icon: ShieldAlert },
};

export default function AvtalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [contractType, setContractType] = useState("");
  const [housingForm, setHousingForm] = useState("");
  const [signedDate, setSignedDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const CONTRACT_TYPES = ["Hyresrätt (förstahand)", "Andrahandskontrakt", "Bostadsrättsavtal", "Lokalhyra"];
  const HOUSING_FORMS = ["Hyresrätt i andra hand", "Bostadsrätt", "Villa / radhus", "Ägarlägenhet"];

  const loadHistory = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("contract_analyses")
      .select("id, file_name, summary, risk_level, analysis, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setHistory(data as HistoryItem[]);
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  async function deleteHistoryItem(id: string) {
    const supabase = createClient();
    await supabase.from("contract_analyses").delete().eq("id", id);
    setHistory(h => h.filter(item => item.id !== id));
  }

  function handleFile(f: File) {
    const n = f.name.toLowerCase();
    const isImg = /\.(jpe?g|png|webp|gif)$/.test(n) || f.type.startsWith("image/");
    const okType = f.type === "application/pdf" || n.endsWith(".pdf") || n.endsWith(".docx") ||
      f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || isImg;
    if (n.endsWith(".doc") && !n.endsWith(".docx")) { setError("Gamla .doc-filer stöds inte. Spara om som .docx eller PDF."); return; }
    if (!okType) { setError("Endast PDF, Word (.docx) och bilder (JPG/PNG) accepteras."); return; }
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
      if (contractType) formData.append("contractType", contractType);
      if (housingForm) formData.append("housingForm", housingForm);
      if (signedDate) formData.append("signedDate", signedDate);
      const res = await fetch("/api/analyze-contract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Något gick fel");
      setAnalysis(data);
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Okänt fel");
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

  const riskCfg = analysis?.riskLevel ? RISK_CONFIG[analysis.riskLevel] : null;

  function handleDownloadPdf() {
    if (!analysis) return;
    const doc = generateAnalysisPdf(analysis);
    const stamp = new Date().toISOString().slice(0, 10);
    doc.save(`Hyresrattskollen-avtalsanalys-${stamp}.pdf`);
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-5 w-5 text-[#1a56a0]" />
          <h1 className="text-2xl font-bold text-gray-900">Avtalsgranskning</h1>
          <span className="text-[10px] font-semibold bg-[#1a56a0] text-white px-2 py-0.5 rounded-full">PREMIUM</span>
        </div>
        <p className="text-sm text-gray-500">
          Ladda upp ditt hyresavtal (PDF) för djupgående AI-analys av alla klausuler och dina rättigheter.
        </p>
      </div>
      <PremiumGate featureName="Avtalsgranskning">

      {!analysis && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          {/* Kontext-fält — hjälper AI:n bedöma mot rätt regelverk */}
          <div className="mb-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Kontraktstyp</label>
              <div className="flex flex-wrap gap-2">
                {CONTRACT_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setContractType(c => c === t ? "" : t)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      contractType === t
                        ? "bg-[#1a56a0] border-[#1a56a0] text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:border-[#1a56a0]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Boendeform</label>
              <div className="flex flex-wrap gap-2">
                {HOUSING_FORMS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setHousingForm(c => c === t ? "" : t)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      housingForm === t
                        ? "bg-[#1a56a0] border-[#1a56a0] text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:border-[#1a56a0]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Datum då hyresavtalet ingicks</label>
              <input
                type="date"
                value={signedDate}
                onChange={e => setSignedDate(e.target.value)}
                className="w-full sm:w-56 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
              />
              {signedDate && (
                <p className="mt-2 text-xs flex items-center gap-1.5 text-gray-500">
                  <AlertCircle className="h-3.5 w-3.5 text-[#1a56a0]" />
                  {signedDate >= "2026-07-01"
                    ? "Bedöms mot nya hyreslagen (i kraft från 1 juli 2026)."
                    : "Bedöms mot reglerna som gällde före 1 juli 2026."}
                </p>
              )}
            </div>
          </div>

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
              {file ? file.name : "Dra och släpp ditt kontrakt eller foto här"}
            </p>
            <p className="text-xs text-gray-400">eller klicka för att välja fil — PDF, Word (.docx) eller foto (JPG/PNG), max 10 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
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
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyserar avtal — detta tar ca 30 sekunder...</> : "Analysera avtal"}
            </button>
          )}
        </div>
      )}

      {/* Historik — tidigare analyser sparade i kontot */}
      {!analysis && history.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-[#1a56a0]" />
            <h2 className="text-sm font-semibold text-gray-700">Dina tidigare analyser</h2>
            <span className="text-[10px] font-medium text-gray-400">({history.length})</span>
          </div>
          <div className="space-y-2">
            {history.map(item => {
              const cfg = item.risk_level ? RISK_CONFIG[item.risk_level as keyof typeof RISK_CONFIG] : null;
              return (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-[#1a56a0] transition-colors"
                >
                  <button
                    onClick={() => { setAnalysis(item.analysis); setFile(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="flex-1 flex items-center gap-3 text-left min-w-0"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-[#e6f1fb] flex items-center justify-center">
                      <FileText className="h-4 w-4 text-[#1a56a0]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.file_name || "Avtalsanalys"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" })}
                        {" · "}
                        {new Date(item.created_at).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {cfg && (
                      <span className={`shrink-0 hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${cfg.cls}`}>
                        <cfg.icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { const doc = generateAnalysisPdf(item.analysis); doc.save(`Hyresrattskollen-avtalsanalys-${item.created_at.slice(0, 10)}.pdf`); }}
                    className="shrink-0 p-2 text-gray-400 hover:text-[#1a56a0] rounded-lg hover:bg-gray-50 transition-colors"
                    title="Ladda ner som PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="shrink-0 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Ta bort"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 hidden sm:block" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analysis && grouped && (
        <div className="space-y-6">
          {/* Summary card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">Sammanfattning</h2>
                <p className="text-sm text-gray-700">{analysis.summary}</p>
              </div>
              {riskCfg && (
                <div className={`shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${riskCfg.cls}`}>
                  <riskCfg.icon className="h-3.5 w-3.5" />
                  {riskCfg.label}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-3 text-xs font-medium">
                <span className="bg-[#eaf3de] text-[#27500a] px-2 py-1 rounded">{grouped.ok.length} OK</span>
                <span className="bg-[#faeeda] text-[#633806] px-2 py-1 rounded">{grouped.warn.length} Notera</span>
                <span className="bg-[#fcebeb] text-[#791f1f] px-2 py-1 rounded">{grouped.flag.length} Uppmärksamma</span>
              </div>
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#0c447c] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                Ladda ner som PDF
              </button>
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="bg-[#e6f1fb] border border-[#1a56a0]/20 rounded-xl p-5">
              <h3 className="font-semibold text-[#1a56a0] mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Rekommenderade åtgärder
              </h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="shrink-0 font-bold text-[#1a56a0] mt-0.5">{i + 1}.</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clauses */}
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
      </PremiumGate>
    </div>
  );
}
