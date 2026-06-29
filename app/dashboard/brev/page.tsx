"use client";
import { useState } from "react";
import { Mail, Copy, Download, Check, TrendingUp, Users, Wrench, FileText, Loader2, Sparkles } from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PremiumGate } from "@/components/PremiumGate";
import { LETTER_TEMPLATES } from "@/lib/letter-templates";

const ICONS: Record<string, React.ElementType> = { TrendingUp, Users, Wrench, FileText };

export default function BrevPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [letterText, setLetterText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const template = LETTER_TEMPLATES.find(t => t.id === selectedId);

  function selectTemplate(id: string) {
    setSelectedId(id);
    setFields({});
    setCopied(false);
    setLetterText("");
    setGenerated(false);
    setError("");
  }

  async function handleGenerate() {
    if (!template) return;
    const missing = template.fields.filter(f => !fields[f.key]?.trim());
    if (missing.length > 0) {
      setError(`Fyll i: ${missing.map(f => f.label).join(", ")}`);
      return;
    }
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selectedId, fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Något gick fel");
      setLetterText(data.text);
      setGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel. Försök igen.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownload() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(letterText, 170);
    doc.text(lines, 20, 20);
    doc.save(`${template?.id ?? "brev"}.pdf`);
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="h-5 w-5 text-[#1a56a0]" />
          <h1 className="text-2xl font-bold text-gray-900">Brevgenerator</h1>
        </div>
        <p className="text-sm text-gray-500">
          AI skriver ett juridiskt anpassat brev baserat på din specifika situation.
        </p>
      </div>

      <PremiumGate featureName="Brevgenerator">
      {!selectedId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LETTER_TEMPLATES.map(tmpl => {
            const Icon = ICONS[tmpl.icon] ?? FileText;
            return (
              <button
                key={tmpl.id}
                onClick={() => selectTemplate(tmpl.id)}
                className="text-left flex gap-4 items-start p-5 bg-white border border-gray-200 rounded-xl hover:border-[#1a56a0] hover:shadow-md transition-all"
              >
                <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#e6f1fb]">
                  <Icon className="h-5 w-5 text-[#1a56a0]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{tmpl.name}</p>
                  <p className="text-xs text-gray-500">{tmpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {template && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">{template.name}</h2>
              <button
                onClick={() => setSelectedId(null)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Byt mall
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {template.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={fields[field.key] ?? ""}
                      onChange={e => setFields(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
                    />
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      value={fields[field.key] ?? ""}
                      onChange={e => setFields(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                    />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {generating
                ? <><Loader2 className="h-4 w-4 animate-spin" /> AI skriver brevet...</>
                : <><Sparkles className="h-4 w-4" /> {generated ? "Generera nytt brev" : "Generera brev med AI"}</>
              }
            </button>
          </div>

          <div>
            <div className="bg-gray-900 rounded-xl p-5 mb-3 min-h-[200px]">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                  <p className="text-xs text-gray-400">AI anpassar brevet till din situation...</p>
                </div>
              ) : (
                <pre className="text-xs text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
                  {letterText || "Fyll i fälten och klicka 'Generera brev med AI' för ett skräddarsytt brev..."}
                </pre>
              )}
            </div>
            {letterText && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-[#1a56a0] text-gray-700 hover:text-[#1a56a0] text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Kopierat!" : "Kopiera"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a56a0] hover:bg-[#0c447c] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Ladda ner PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <DisclaimerBanner />
      </PremiumGate>
    </div>
  );
}
