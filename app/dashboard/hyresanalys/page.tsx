"use client";
import { useState } from "react";
import { BarChart2, TrendingUp, TrendingDown, Minus, ArrowRight, Info } from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { CITIES } from "@/lib/rent-data";
import type { RentResult } from "@/types";

export default function HyresanalysPage() {
  const [form, setForm] = useState({ rooms: "2", area: "", city: "Stockholm", currentRent: "" });
  const [result, setResult] = useState<RentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rooms: Number(form.rooms),
          area: Number(form.area),
          city: form.city,
          currentRent: Number(form.currentRent),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Något gick fel");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  const statusConfig = {
    ok:     { cls: "status-ok",     icon: TrendingDown, label: "Rimlig hyra",         color: "text-green-700" },
    warn:   { cls: "status-warn",   icon: Minus,        label: "Något över snittet",  color: "text-yellow-700" },
    danger: { cls: "status-danger", icon: TrendingUp,   label: "Potentiellt för hög", color: "text-red-700" },
  };

  const actionSteps = {
    ok: [
      "Din hyra ligger inom normalt intervall för din stad och bostadsstorlek.",
      "Du har fortfarande rätt att begära prövning i Hyresnämnden om du anser att hyran är oskälig.",
      "Dokumentera din lägenhetsskick och spara alla hyresavier.",
    ],
    warn: [
      "Din hyra är något över referensvärdet — det kan vara värt att undersöka vidare.",
      "Jämför med liknande lägenheter i ditt område via Hyresnämndens statistik.",
      "Kontakta Hyresgästföreningen för kostnadsfri rådgivning.",
      "Överväg att begära en motivering från din hyresvärd.",
    ],
    danger: [
      "Din hyra avviker markant från bruksvärdet — du kan ha rätt att få den sänkt.",
      "Ansök om hyresprövning hos Hyresnämnden — det är kostnadsfritt.",
      "Samla in bevis: hyresavier, lägenhetsspecifikationer och jämförbara hyror i området.",
      "Kontakta Hyresgästföreningen (hyresgastforeningen.se) för juridisk hjälp.",
      "Använd brevgeneratorn för att skriva ett klagomålsbrev till din hyresvärd.",
    ],
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 className="h-5 w-5 text-[#1a56a0]" />
          <h1 className="text-2xl font-bold text-gray-900">Hyresanalys</h1>
        </div>
        <p className="text-sm text-gray-500">
          Jämför din hyra mot referenshyror för din stad och få konkreta råd om nästa steg.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Antal rum</label>
              <select
                value={form.rooms}
                onChange={e => setForm(f => ({ ...f, rooms: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
              >
                <option value="1">1 rok</option>
                <option value="2">2 rok</option>
                <option value="3">3 rok</option>
                <option value="4">4+ rok</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
              <input
                type="number"
                min="10"
                max="500"
                required
                value={form.area}
                onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                placeholder="t.ex. 58"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stad / Kommun</label>
            <select
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
            >
              {CITIES.map(city => <option key={city}>{city}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Din nuvarande hyra (kr/mån)</label>
            <input
              type="number"
              min="1000"
              max="100000"
              required
              value={form.currentRent}
              onChange={e => setForm(f => ({ ...f, currentRent: e.target.value }))}
              placeholder="t.ex. 9500"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {loading ? "Analyserar..." : "Analysera hyran"}
          </button>
        </form>
      </div>

      {result && (() => {
        const cfg = statusConfig[result.status];
        const Icon = cfg.icon;
        const steps = actionSteps[result.status];
        const overpayPerYear = result.difference > 0 ? result.difference * 12 : 0;

        return (
          <div className="space-y-4">
            {/* Result card */}
            <div className={`rounded-xl p-6 ${cfg.cls}`}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-5 w-5" />
                <h2 className="font-bold text-lg">{result.label}</h2>
              </div>

              {/* Huvudsiffror */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/60 rounded-xl p-3 text-center">
                  <p className="text-xs font-medium opacity-70 mb-1">Din hyra</p>
                  <p className="text-xl font-bold">{result.currentRent.toLocaleString("sv-SE")} kr</p>
                  <p className="text-xs opacity-60">{result.currentKvmRate} kr/m²</p>
                </div>
                <div className="bg-white/60 rounded-xl p-3 text-center">
                  <p className="text-xs font-medium opacity-70 mb-1">Referenshyra</p>
                  <p className="text-xl font-bold">{result.referenceRent.toLocaleString("sv-SE")} kr</p>
                  <p className="text-xs opacity-60">{result.kvmRate} kr/m²</p>
                </div>
                <div className="bg-white/60 rounded-xl p-3 text-center">
                  <p className="text-xs font-medium opacity-70 mb-1">Skillnad</p>
                  <p className="text-xl font-bold">
                    {result.difference > 0 ? "+" : ""}{result.difference.toLocaleString("sv-SE")} kr
                  </p>
                  <p className="text-xs opacity-70">({result.differencePercent > 0 ? "+" : ""}{result.differencePercent}%)</p>
                </div>
              </div>

              {/* Prisintervall-bar */}
              <div className="bg-white/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-xs opacity-70 mb-2">
                  <span>Rimligt intervall</span>
                  <span>{result.referenceMin.toLocaleString("sv-SE")} – {result.referenceMax.toLocaleString("sv-SE")} kr/mån</span>
                </div>
                <div className="relative h-3 bg-white/60 rounded-full overflow-hidden">
                  {/* Grön zon */}
                  <div className="absolute inset-0 bg-green-400/40 rounded-full" />
                  {/* Din hyra-markör */}
                  {(() => {
                    const min = result.referenceMin * 0.8;
                    const max = result.referenceMax * 1.4;
                    const pos = Math.min(100, Math.max(0, ((result.currentRent - min) / (max - min)) * 100));
                    return (
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-current rounded-full shadow"
                        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
                      />
                    );
                  })()}
                </div>
                <div className="flex justify-between text-[10px] opacity-50 mt-1">
                  <span>Låg</span>
                  <span>▲ Din hyra</span>
                  <span>Hög</span>
                </div>
              </div>

              {overpayPerYear > 0 && (
                <div className="bg-white/70 rounded-lg px-4 py-3 mb-3 text-sm font-medium">
                  Du betalar potentiellt <span className="font-bold">{overpayPerYear.toLocaleString("sv-SE")} kr för mycket per år</span>
                </div>
              )}

              <p className="text-xs opacity-50">
                Baserat på SCB:s hyresstatistik 2023–2024 för {form.city}, {form.area} m², {form.rooms} rok.
                Referenshyra = {result.kvmRate} kr/m² × {form.area} m².
              </p>
            </div>

            {/* Action steps */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-[#1a56a0]" />
                <h3 className="font-semibold text-gray-900 text-sm">Vad du kan göra</h3>
              </div>
              <ul className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <ArrowRight className="h-4 w-4 text-[#1a56a0] shrink-0 mt-0.5" />
                    {step}
                  </li>
                ))}
              </ul>
              {result.status === "danger" && (
                <a
                  href="/dashboard/brev"
                  className="mt-4 inline-flex items-center gap-2 bg-[#1a56a0] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0c447c] transition-colors"
                >
                  Skriv klagomålsbrev <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setResult(null)}
                className="text-sm text-[#1a56a0] hover:underline"
              >
                ← Gör ny analys
              </button>
            </div>
          </div>
        );
      })()}

      <DisclaimerBanner />
    </div>
  );
}
