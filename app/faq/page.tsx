"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    title: "Om tjänsten",
    items: [
      {
        q: "Är Hyresrättskollen juridisk rådgivning?",
        a: "Nej. Hyresrättskollen är ett informationsverktyg baserat på 12 kap. Jordabalken och SCB-statistik. Vi ersätter inte en jurist. Vid tvister rekommenderar vi Hyresnämnden eller Hyresgästföreningen.",
      },
      {
        q: "Hur fungerar avtalsgranskningen?",
        a: "Du laddar upp ditt hyresavtal som PDF. AI-modellen (Claude Opus) analyserar upp till 14 000 tecken och identifierar klausuler som är olagliga, tveksamma eller normala — med hänvisning till relevant lagrum i Jordabalken.",
      },
      {
        q: "Hur fungerar hyresanalysen?",
        a: "Du anger din hyra, stad och lägenhetsstorlek. Vi jämför mot referenshyror för din specifika kommun och visar om din hyra är rimlig, något hög eller potentiellt för hög — med konkreta råd om nästa steg.",
      },
      {
        q: "Vilka städer stöds i hyresanalysen?",
        a: "Vi stöder över 200 svenska kommuner med egna referenshyror. Städer utan specifika data jämförs mot ett nationellt genomsnitt.",
      },
    ],
  },
  {
    title: "Priser & betalning",
    items: [
      {
        q: "Vad är gratis och vad kostar det?",
        a: "Hyresanalysen och rättighetsguiden är helt gratis. Avtalsgranskning och brevgenerator kräver credits som köps i paket: 5 uppladdningar för 79 kr, 10 för 129 kr eller 25 för 199 kr.",
      },
      {
        q: "Kan jag få återbetalning?",
        a: "Ja, inom 14 dagar från köp om credits inte har använts. Kontakta oss på support@hyresrattskollen.se så löser vi det.",
      },
      {
        q: "Hur länge gäller mina credits?",
        a: "Credits förfaller inte — de finns kvar på ditt konto tills du använder dem.",
      },
    ],
  },
  {
    title: "Integritet & säkerhet",
    items: [
      {
        q: "Är mina uppladdade hyresavtal säkra?",
        a: "Ja. Dokument du laddar upp används enbart för AI-analysen och lagras inte permanent på våra servrar. Ingen tredje part får tillgång till dina dokument.",
      },
      {
        q: "Säljer ni mina personuppgifter?",
        a: "Aldrig. Vi säljer eller delar inte dina personuppgifter med tredje part. Läs vår integritetspolicy för fullständig information.",
      },
    ],
  },
  {
    title: "Praktiskt",
    items: [
      {
        q: "Mitt avtal är inte en PDF — vad gör jag?",
        a: "Du kan konvertera Word-filer och bilder till PDF gratis via t.ex. ilovepdf.com eller Smallpdf. Mobiler kan ofta skriva ut som PDF direkt.",
      },
      {
        q: "Vad händer om analysen verkar fel?",
        a: "AI kan göra misstag, särskilt på ovanliga formuleringar. Använd analysen som en startpunkt — kontakta alltid Hyresgästföreningen eller Hyresnämnden vid tvister.",
      },
      {
        q: "Hur kontaktar jag support?",
        a: "Besök vår kontaktsida eller maila support@hyresrattskollen.se. Vi svarar inom 1–2 arbetsdagar.",
      },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#1a56a0]" />
            <span className="font-bold text-[#1a56a0]">Hyresrättskollen</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/kontakt" className="text-gray-600 hover:text-gray-900 font-medium">Kontakt</Link>
            <Link href="/auth/register" className="bg-[#1a56a0] hover:bg-[#0c447c] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              Kom igång gratis
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Vanliga frågor</h1>
          <p className="text-gray-500">
            Hittar du inte svaret?{" "}
            <Link href="/kontakt" className="text-[#1a56a0] hover:underline">Kontakta oss</Link>
          </p>
        </div>

        <div className="space-y-8">
          {FAQ_CATEGORIES.map(cat => (
            <div key={cat.title}>
              <h2 className="text-sm font-bold text-[#1a56a0] uppercase tracking-widest mb-3">{cat.title}</h2>
              <div className="space-y-2">
                {cat.items.map((faq, i) => {
                  const key = `${cat.title}-${i}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                        onClick={() => setOpen(isOpen ? null : key)}
                      >
                        <span className="pr-4">{faq.q}</span>
                        {isOpen
                          ? <ChevronUp className="h-4 w-4 text-[#1a56a0] shrink-0" />
                          : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-[#1a56a0] to-[#0c447c] rounded-2xl p-8 text-center text-white">
          <h2 className="font-bold text-xl mb-2">Redo att kontrollera ditt avtal?</h2>
          <p className="text-sm opacity-80 mb-6">Kom igång gratis — ingen kortuppgift krävs.</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Kom igång gratis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
