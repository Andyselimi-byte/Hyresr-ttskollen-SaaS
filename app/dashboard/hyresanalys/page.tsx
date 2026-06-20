"use client";
import { useState } from "react";
import { BarChart2, TrendingUp, TrendingDown, Minus } from "lucide-react";
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
    ok:     { cls: "status-ok",     icon: TrendingDown, label: "Rimlig hyra" },
    warn:   { cls: "status-warn",   icon: Minus,        label: "Något över snittet" },
    danger: { cls: "status-danger", icon: TrendingUp,   label: "Potentiellt för hög" },
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 className="h-5 w-5 text-[#1a56a0]" />
          <h1 className="text-2xl font-bold text-gray-900">Hyresanalys</h1>
        </div>
        <p className="text-sm text-gray-500">
          Jämför din hyra mot SCB:s referenshyror för din stad och bostadsstorlek.
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Stad</label>
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
        return (
          <div className={`rounded-xl p-6 ${cfg.cls}`}>
            <div className="flex items-center gap-2 mb-4">
              <Icon className="h-5 w-5" />
              <h2 className="font-bold text-lg">{result.label}</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <p className="text-xs font-medium opacity-70 mb-1">Din hyra</p>
                <p className="text-xl font-bold">{result.currentRent.toLocaleString("sv-SE")} kr</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <p className="text-xs font-medium opacity-70 mb-1">Referenshyra</p>
                <p className="text-xl font-bold">{result.referenceRent.toLocaleString("sv-SE")} kr</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <p className="text-xs font-medium opacity-70 mb-1">Skillnad</p>
                <p className="text-xl font-bold">
                  {result.difference > 0 ? "+" : ""}{result.difference.toLocaleString("sv-SE")} kr
                </p>
                <p className="text-xs opacity-70">({result.differencePercent > 0 ? "+" : ""}{result.differencePercent}%)</p>
              </div>
            </div>

            {result.status === "danger" && (
              <div className="text-sm">
                <p className="font-medium mb-1">Vad kan du göra?</p>
                <p className="opacity-80">
                  Enligt 12 kap. 55 § JB kan hyran prövas av Hyresnämnden om den avviker
                  från bruksvärdet. Du kan ansöka om prövning kostnadsfritt.
                </p>
              </div>
            )}

            <p className="text-xs opacity-60 mt-3">
              Källa: SCB Hyresstatistik 2024. Referenshyra justerad för area ({form.area} m²).
            </p>
          </div>
        );
      })()}

      <DisclaimerBanner />
    </div>
  );
}
