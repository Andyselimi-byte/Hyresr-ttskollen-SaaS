import Link from "next/link";
import { Shield, BarChart2, BookOpen, FileText, Mail, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#1a56a0]" />
            <span className="font-bold text-[#1a56a0] text-lg">Hyresrättskollen</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Logga in
            </Link>
            <Link
              href="/auth/register"
              className="text-sm bg-[#1a56a0] hover:bg-[#0c447c] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Kom igång gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-[#e6f1fb] text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Shield className="h-3.5 w-3.5" />
          Verktyg för 1,6 miljoner svenska hyresgäster
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Din hyresrätt.{" "}
          <span className="text-[#1a56a0]">Dina rättigheter.</span>{" "}
          Ditt skydd.
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
          Hyresrättskollen hjälper dig förstå din hyra, dina rättigheter och ditt avtal —
          baserat på Jordabalken och SCB-statistik.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/register"
            className="bg-[#1a56a0] hover:bg-[#0c447c] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Kom igång gratis
          </Link>
          <Link
            href="/auth/login"
            className="border border-gray-300 hover:border-[#1a56a0] text-gray-700 hover:text-[#1a56a0] font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Logga in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BarChart2, title: "Hyresanalys", desc: "Jämför mot SCB:s referenshyror för din stad och storlek.", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: BookOpen,  title: "Rättighetsguide", desc: "Sökbar guide till dina rättigheter enligt Jordabalken.", color: "text-green-600", bg: "bg-green-50" },
            { icon: FileText,  title: "Avtalsgranskning", desc: "AI-driven analys av ditt hyresavtal — markerar problematiska klausuler.", color: "text-purple-600", bg: "bg-purple-50" },
            { icon: Mail,      title: "Brevgenerator", desc: "Professionella brev för hyreshöjning, reparationskrav m.m.", color: "text-orange-600", bg: "bg-orange-50" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${bg} mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 border-t border-gray-100 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Enkel, transparent prissättning</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
              <p className="text-sm font-semibold text-gray-500 mb-1">GRATIS</p>
              <p className="text-3xl font-bold text-gray-900 mb-4">0 kr</p>
              {["2 hyresanalyser/mån", "Rättighetsguide", "2 brev/mån"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" /> {f}
                </div>
              ))}
              <Link href="/auth/register" className="mt-4 block text-center border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:border-[#1a56a0] transition-colors text-sm">
                Kom igång
              </Link>
            </div>
            <div className="bg-[#1a56a0] rounded-xl p-6 text-left text-white">
              <p className="text-sm font-semibold text-white/70 mb-1">PREMIUM</p>
              <p className="text-3xl font-bold mb-4">79 kr<span className="text-lg font-normal text-white/70">/mån</span></p>
              {["Obegränsad hyresanalys", "AI-avtalsgranskning", "Obegränsade brev", "Prioriterad support"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm mb-2">
                  <Check className="h-4 w-4 text-white/80 shrink-0" /> {f}
                </div>
              ))}
              <Link href="/auth/register" className="mt-4 block text-center bg-white text-[#1a56a0] font-semibold py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                Starta Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center text-xs text-gray-400">
          <p className="mb-2">
            Hyresrättskollen är en informationstjänst och utgör inte juridisk rådgivning.
            Informationen baseras på 12 kap. JB (Jordabalken) och SCB-statistik.
          </p>
          <p>© {new Date().getFullYear()} Hyresrättskollen</p>
        </div>
      </footer>
    </div>
  );
}
