"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Shield, BarChart2, BookOpen, FileText, Mail, Check,
  ChevronDown, ChevronUp, Clock, MessageSquare, CheckCircle, HelpCircle, ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: BarChart2,
    title: "Hyresanalys",
    desc: "Ange din hyra, storlek och ort. Vi jämför mot referenshyror baserade på SCB:s statistik och berättar om du betalar rätt.",
    free: true,
    href: "/auth/register",
  },
  {
    icon: BookOpen,
    title: "Rättighetsguide",
    desc: "En lättläst guide till dina rättigheter som hyresgäst — besittningsskydd, andrahand, störningar, renovering och mer.",
    free: true,
    href: "/auth/register",
  },
  {
    icon: FileText,
    title: "Avtalsgranskning",
    desc: "Ladda upp ditt hyresavtal som PDF. Vi går igenom klausulerna och markerar sådant som kan vara olagligt eller oskäligt.",
    free: false,
    href: "/auth/register",
  },
  {
    icon: Mail,
    title: "Brevgenerator",
    desc: "Välj situation, fyll i dina uppgifter och få ett färdigt brev att skicka till din hyresvärd — korrekt formulerat med rätt lagrum.",
    free: false,
    href: "/auth/register",
  },
];

const MISSED_CLAUSES = [
  {
    title: "Ansvar för normalt slitage",
    desc: "Du som hyresgäst ansvarar inte för normalt slitage. En klausul som säger annat strider mot 12 kap. 15 § Jordabalken.",
    law: "12 kap. 15 § JB",
  },
  {
    title: "Otydliga tilläggsavgifter",
    desc: "El, vatten, parkering och internet ska specificeras separat i avtalet. Otydliga eller öppna avgifter kan bestridas.",
    law: "12 kap. 19 § JB",
  },
  {
    title: "Förbud mot andrahandsuthyrning",
    desc: "Har du skäliga skäl — t.ex. studier, arbete på annan ort eller samboendeprövning — har du ofta rätt att hyra ut i andra hand.",
    law: "12 kap. 40 § JB",
  },
  {
    title: "För kort uppsägningstid",
    desc: "Som hyresgäst har du alltid rätt till minst tre månaders uppsägningstid, oavsett vad avtalet säger.",
    law: "12 kap. 4 § JB",
  },
  {
    title: "Klausuler om besittningsskydd",
    desc: "Efter två år har du som hyresgäst som regel besittningsskydd. Villkor i avtalet som försöker ta bort det är ogiltiga.",
    law: "12 kap. 46 § JB",
  },
  {
    title: "Deposition som inte återbetalas",
    desc: "Hyresvärden ska återbetala din deposition efter flytt. Pengar får bara hållas inne för faktiska, dokumenterade skador.",
    law: "12 kap. JB",
  },
];

const FAQS = [
  {
    q: "Är Hyresrättskollen juridisk rådgivning?",
    a: "Nej. Vi är ett informationsverktyg som hjälper dig förstå vad som står i din hyressituation — baserat på 12 kap. Jordabalken och SCB:s statistik. Har du en tvist rekommenderar vi Hyresnämnden eller Hyresgästföreningen.",
  },
  {
    q: "Hur fungerar hyresanalysen?",
    a: "Du anger din hyra, antal rum, area och ort. Vi räknar ut ett referensvärde i kr/m² baserat på SCB:s hyresstatistik för din kommun och visar om din hyra är rimlig — med konkreta råd om vad du kan göra om den inte är det.",
  },
  {
    q: "Vad händer med mitt avtal när jag laddar upp det?",
    a: "Dokumentet används bara för att genomföra analysen. Det sparas inte permanent hos oss och delas inte med någon tredje part.",
  },
  {
    q: "Vad kostar det?",
    a: "Hyresanalysen och rättighetsguiden är gratis. Avtalsgranskning och brevgenerator kräver credits: 5 uppladdningar för 79 kr, 10 för 129 kr eller 25 för 199 kr.",
  },
  {
    q: "Kan jag få pengarna tillbaka?",
    a: "Ja, inom 14 dagar från köp om du inte har använt dina credits. Hör av dig till support@hyresrattskollen.se.",
  },
  {
    q: "Mitt avtal är inte en PDF — vad gör jag?",
    a: "Du kan konvertera Word-dokument och bilder till PDF kostnadsfritt via t.ex. ilovepdf.com. De flesta telefoner kan också skriva ut ett dokument direkt som PDF.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSent(true);
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#1a56a0]" />
            <span className="font-bold text-[#1a56a0] text-base">Hyresrättskollen</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <a href="#verktyg" className="hover:text-gray-800">Verktyg</a>
            <a href="#rattigheter" className="hover:text-gray-800">Rättigheter</a>
            <a href="#faq" className="hover:text-gray-800">FAQ</a>
            <a href="#kontakt" className="hover:text-gray-800">Kontakt</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-800">Logga in</Link>
            <Link href="/auth/register" className="text-sm bg-[#1a56a0] hover:bg-[#0c447c] text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Skapa konto
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-gray-100 px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-[#1a56a0] font-medium mb-4">För Sveriges hyresgäster</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Förstå din hyra.<br />Känn till dina rättigheter.
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl leading-relaxed">
            Hyresrättskollen är ett gratis verktyg som hjälper dig jämföra din hyra, förstå vad som gäller
            enligt Jordabalken och agera om något inte stämmer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] hover:bg-[#0c447c] text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Kom igång — det är gratis
            </Link>
            <a href="#verktyg" className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:border-gray-400 font-medium px-6 py-3 rounded-lg transition-colors">
              Se vad vi erbjuder
            </a>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-gray-400">
            {["Gratis grundfunktioner", "Baserat på Jordabalken", "Inte juridisk rådgivning"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500 shrink-0" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Verktyg */}
      <section id="verktyg" className="px-6 py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vad du kan göra</h2>
            <p className="text-gray-500">Fyra verktyg — två av dem helt gratis.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <Link key={f.title} href={f.href}
                  className="group flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#e6f1fb] transition-colors">
                    <Icon className="h-5 w-5 text-gray-500 group-hover:text-[#1a56a0] transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{f.title}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${f.free ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {f.free ? "Gratis" : "Credits"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rättigheter */}
      <section id="rattigheter" className="px-6 py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vad många hyresgäster inte känner till</h2>
            <p className="text-gray-500 max-w-xl">
              Dessa villkor dyker ofta upp i hyresavtal — men är antingen olagliga eller kan bestridas.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MISSED_CLAUSES.map(c => (
              <div key={c.title} className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-900 text-sm mb-2">{c.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{c.desc}</p>
                <span className="text-[10px] font-mono text-gray-400 border border-gray-200 px-2 py-0.5 rounded">{c.law}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/auth/register" className="inline-flex items-center gap-2 text-sm font-medium text-[#1a56a0] hover:underline">
              Granska mitt avtal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Priser */}
      <section className="px-6 py-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Priser</h2>
            <p className="text-gray-500">Grundverktygen är gratis. Credits behövs bara för avtalsgranskning och brev.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "Bas", credits: 5, price: 79, desc: "Prova tjänsten" },
              { name: "Standard", credits: 10, price: 129, desc: "Mest populärt", highlight: true },
              { name: "Premium", credits: 25, price: 199, desc: "Bäst värde" },
            ].map(p => (
              <Link
                key={p.name}
                href="/auth/register"
                className={`block p-5 rounded-xl border transition-colors ${p.highlight ? "border-[#1a56a0] bg-[#f8faff]" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  {p.highlight && <span className="text-[10px] font-semibold bg-[#1a56a0] text-white px-2 py-0.5 rounded">Populärt</span>}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-0.5">{p.price} <span className="text-sm font-normal text-gray-400">kr</span></p>
                <p className="text-sm text-gray-400 mb-3">{p.credits} uppladdningar</p>
                <p className="text-xs text-gray-400">{p.desc}</p>
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Credits förfaller inte. Säker betalning via Stripe.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Vanliga frågor</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-500 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="px-6 py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Kontakt</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Har du frågor om tjänsten, din hyra eller tekniska problem? Hör av dig — vi svarar inom ett par arbetsdagar.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail,          label: "E-post",     value: "support@hyresrattskollen.se" },
                { icon: Clock,         label: "Svarstid",   value: "Mån–Fre, vanligtvis 1–2 dagar" },
                { icon: MessageSquare, label: "Snabbare",   value: "Kolla FAQ-sektionen ovan" },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm text-gray-700">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex gap-3">
                <HelpCircle className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  Vi ger inte juridisk rådgivning. Vid hyrestvister — kontakta{" "}
                  <strong className="text-gray-700">Hyresnämnden</strong> (kostnadsfritt) eller{" "}
                  <strong className="text-gray-700">Hyresgästföreningen</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <p className="font-medium text-gray-900 mb-1">Meddelande skickat</p>
                <p className="text-sm text-gray-400">Vi hör av oss inom 1–2 arbetsdagar.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-4 text-sm text-[#1a56a0] hover:underline">Skicka nytt meddelande</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Namn</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Anna Andersson"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">E-post</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="anna@example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ämne</label>
                  <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] bg-white">
                    <option value="">Välj...</option>
                    <option>Fråga om hyresanalys</option>
                    <option>Fråga om avtalsgranskning</option>
                    <option>Problem med betalning</option>
                    <option>Tekniskt problem</option>
                    <option>Annat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Meddelande</label>
                  <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Beskriv din fråga..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                  {sending ? "Skickar..." : "Skicka"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#1a56a0]" />
            <span className="font-medium text-gray-600">Hyresrättskollen</span>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            <a href="#faq" className="hover:text-gray-600">FAQ</a>
            <a href="#kontakt" className="hover:text-gray-600">Kontakt</a>
            <Link href="/integritetspolicy" className="hover:text-gray-600">Integritetspolicy</Link>
            <Link href="/anvandarvillkor" className="hover:text-gray-600">Användarvillkor</Link>
          </div>
          <p className="text-xs">© 2025 Hyresrättskollen</p>
        </div>
      </footer>
    </div>
  );
}
