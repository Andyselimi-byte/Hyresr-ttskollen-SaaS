"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "Är Hyresrättskollen juridisk rådgivning?",
    a: "Nej. Hyresrättskollen är ett informationsverktyg baserat på 12 kap. Jordabalken och SCB-statistik. Vi ersätter inte en jurist. Vid tvister rekommenderar vi Hyresnämnden eller Hyresgästföreningen.",
  },
  {
    q: "Hur fungerar hyresanalysen?",
    a: "Du anger din hyra, stad och lägenhetsstorlek. Vi jämför din hyra mot SCB:s referensvärden för din stad och visar om din hyra är normal, hög eller låg.",
  },
  {
    q: "Är mina uppladdade hyresavtal säkra?",
    a: "Ja. Dokument du laddar upp används enbart för AI-analysen och raderas automatiskt efter 30 dagar. Vi säljer eller delar aldrig dina dokument.",
  },
  {
    q: "Vad ingår i gratisversionen?",
    a: "Gratisversionen inkluderar 2 hyresanalyser per månad, rättighetsguiden och 2 brevmallar. Avtalsanalys (PDF-uppladdning) kräver premium.",
  },
  {
    q: "Hur avslutar jag min prenumeration?",
    a: "Du kan avsluta när som helst via Mina inställningar i appen. Din tillgång fortsätter till slutet av betalningsperioden. Ingen bindningstid.",
  },
  {
    q: "Kan jag få återbetalning?",
    a: "Ja, inom 14 dagar från köp om tjänsten inte använts. Kontakta oss på support@hyresrattskollen.se.",
  },
  {
    q: "Vilka städer stöds i hyresanalysen?",
    a: "Stockholm, Göteborg, Malmö och Uppsala har specifika referensvärden. Övriga städer använder ett nationellt genomsnitt.",
  },
  {
    q: "Hur kontaktar jag support?",
    a: "Skicka ett mail till support@hyresrattskollen.se så svarar vi inom 1–2 arbetsdagar.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Shield className="h-5 w-5 text-[#1a56a0]" />
          <span className="font-bold text-[#1a56a0]">Hyresrättskollen</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vanliga frågor</h1>
        <p className="text-gray-500 mb-10">Hittar du inte svaret? Maila oss på <a href="mailto:support@hyresrattskollen.se" className="text-[#1a56a0]">support@hyresrattskollen.se</a></p>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                {open === i ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#edf3fb] rounded-xl p-6 text-center">
          <h2 className="font-semibold text-gray-900 mb-1">Behöver du mer hjälp?</h2>
          <p className="text-sm text-gray-600 mb-4">Vårt supportteam svarar inom 1–2 arbetsdagar.</p>
          <a
            href="mailto:support@hyresrattskollen.se"
            className="inline-block bg-[#1a56a0] hover:bg-[#0c447c] text-white font-semibold px-6 py-2 rounded-lg text-sm"
          >
            Kontakta support
          </a>
        </div>
      </div>
    </div>
  );
}
