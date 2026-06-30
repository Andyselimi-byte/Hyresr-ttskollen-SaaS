"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Shield, BarChart2, BookOpen, FileText, Mail, Check,
  AlertTriangle, ArrowRight, Star, ChevronRight,
  ChevronDown, ChevronUp, Clock, MessageSquare, CheckCircle, HelpCircle,
} from "lucide-react";

const MISSED_CLAUSES = [
  { title: "Olagliga renoveringsklausuler", desc: "Hyresvärdar skriver ofta in att du ska betala för normalt slitage. Det är olagligt — underhåll är hyresvärdens ansvar.", law: "12 kap. 15 § JB", danger: true },
  { title: "Dolda avgifter utöver hyran", desc: "El, vatten, internet och parkering ska vara tydligt specificerade. Otydliga tilläggsavgifter kan bestridas.", law: "12 kap. 19 § JB", danger: true },
  { title: "Ogiltiga andrahandsförbud", desc: "Förbud mot andrahandsuthyrning kan vara utan verkan om du har skäliga skäl. Lagen är tvingande.", law: "12 kap. 40 § JB", danger: false },
  { title: "För kort uppsägningstid", desc: "Du har alltid rätt till minst 3 månaders uppsägningstid. Kortare tid i kontraktet gäller inte.", law: "12 kap. 4 § JB", danger: false },
  { title: "Klausuler mot besittningsskydd", desc: "Klausuler som försöker ta bort ditt besittningsskydd är nästan alltid ogiltiga efter 2 år.", law: "12 kap. 46 § JB", danger: true },
  { title: "Oskälig deposition", desc: "Depositionen ska återbetalas inom skälig tid. Hyresvärden kan bara hålla inne pengar för faktiska skador.", law: "12 kap. JB", danger: false },
];

const STATS = [
  { num: "1 av 3", desc: "hyresavtal innehåller minst en olaglig klausul" },
  { num: "73 %", desc: "av hyresgäster känner inte till sina rättigheter fullt ut" },
  { num: "4 800 kr", desc: "genomsnittlig överbetald hyra per år i Stockholm" },
];

const FEATURES = [
  { icon: BarChart2, title: "Hyresanalys", desc: "Jämför din hyra mot referenshyror för din stad. Ta reda på om du betalar för mycket och vad du kan göra åt det.", free: true },
  { icon: BookOpen,  title: "Rättighetsguide", desc: "20 kategorier med dina rättigheter som hyresgäst. Besittningsskydd, andrahand, störningar, renovering och mer.", free: true },
  { icon: FileText,  title: "Avtalsgranskning", desc: "Ladda upp ditt hyresavtal som PDF. AI analyserar alla klausuler och flaggar olagliga eller tveksamma villkor.", free: false },
  { icon: Mail,      title: "Brevgenerator", desc: "AI skriver ett juridiskt korrekt brev anpassat till din situation — bestrida hyreshöjning, ansök om andrahand och mer.", free: false },
];

const TESTIMONIALS = [
  { text: "Hittade tre olagliga klausuler i mitt hyresavtal på 5 minuter. Fick tillbaka 12 000 kr i för högt betald hyra.", name: "Marcus L.", city: "Stockholm" },
  { text: "Slutligen förstår jag vad som gäller kring andrahandsuthyrning. Enkelt och tydligt förklarat.", name: "Fatima K.", city: "Göteborg" },
  { text: "Brevet till hyresvärden om hyreshöjningen var perfekt formulerat. Hyresvärden backade.", name: "Erik S.", city: "Malmö" },
];

const FAQS = [
  { q: "Är Hyresrättskollen juridisk rådgivning?", a: "Nej. Hyresrättskollen är ett informationsverktyg baserat på 12 kap. Jordabalken och SCB-statistik. Vi ersätter inte en jurist. Vid tvister rekommenderar vi Hyresnämnden eller Hyresgästföreningen." },
  { q: "Hur fungerar avtalsgranskningen?", a: "Du laddar upp ditt hyresavtal som PDF. AI-modellen analyserar upp till 14 000 tecken och identifierar klausuler som är olagliga, tveksamma eller normala — med hänvisning till relevant lagrum i Jordabalken." },
  { q: "Hur fungerar hyresanalysen?", a: "Du anger din hyra, stad och lägenhetsstorlek. Vi jämför mot referenshyror för din specifika kommun och visar om din hyra är rimlig, något hög eller potentiellt för hög — med konkreta råd om nästa steg." },
  { q: "Vad är gratis och vad kostar det?", a: "Hyresanalysen och rättighetsguiden är helt gratis. Avtalsgranskning och brevgenerator kräver credits som köps i paket: 5 uppladdningar för 79 kr, 10 för 129 kr eller 25 för 199 kr." },
  { q: "Är mina uppladdade hyresavtal säkra?", a: "Ja. Dokument du laddar upp används enbart för AI-analysen och lagras inte permanent på våra servrar. Ingen tredje part får tillgång till dina dokument." },
  { q: "Kan jag få återbetalning?", a: "Ja, inom 14 dagar från köp om credits inte har använts. Kontakta oss på support@hyresrattskollen.se så löser vi det." },
  { q: "Mitt avtal är inte en PDF — vad gör jag?", a: "Du kan konvertera Word-filer och bilder till PDF gratis via t.ex. ilovepdf.com eller Smallpdf. Mobiler kan ofta skriva ut som PDF direkt." },
  { q: "Hur lång tid tar analysen?", a: "Avtalsgranskningen tar vanligtvis 20–40 sekunder beroende på avtalets längd. Hyresanalysen är omedelbar." },
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
    <div className="min-h-screen bg-white">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#1a56a0]" />
            <span className="font-bold text-[#1a56a0] text-lg">Hyresrättskollen</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600 font-medium">
            <a href="#funktioner" className="hover:text-gray-900 transition-colors">Funktioner</a>
            <a href="#faq"        className="hover:text-gray-900 transition-colors">FAQ</a>
            <a href="#kontakt"    className="hover:text-gray-900 transition-colors">Kontakt</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium hidden sm:block">Logga in</Link>
            <Link href="/auth/register" className="text-sm bg-[#1a56a0] hover:bg-[#0c447c] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              Kom igång gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-[#f0f6ff] to-white px-6 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#e6f1fb] text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Shield className="h-3.5 w-3.5" />
            Verktyg för 1,6 miljoner svenska hyresgäster
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
            Visste du att <span className="text-[#1a56a0]">1 av 3</span><br />
            hyresavtal är olagliga?
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Hyresrättskollen analyserar ditt avtal, jämför din hyra och skriver juridiska brev åt dig —
            så att du slipper betala för mycket eller skriva på villkor du inte behöver acceptera.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/auth/register" className="bg-[#1a56a0] hover:bg-[#0c447c] text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-base flex items-center justify-center gap-2">
              Granska mitt avtal gratis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/auth/login" className="border border-gray-300 hover:border-[#1a56a0] text-gray-700 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base">
              Logga in
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-400">
            {["Gratis att komma igång", "Baserat på Jordabalken", "Inte juridisk rådgivning"].map(t => (
              <span key={t} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#1a56a0] px-6 py-14">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
          {STATS.map(s => (
            <div key={s.num}>
              <p className="text-4xl font-bold mb-2">{s.num}</p>
              <p className="text-sm opacity-75 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Vanliga fällor ── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <AlertTriangle className="h-3.5 w-3.5" />
              Vanliga fällor i hyresavtal
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Det här missar de flesta i sitt hyresavtal</h2>
            <p className="text-gray-500 max-w-xl mx-auto">De flesta skriver under utan att veta att dessa klausuler antingen är olagliga eller kan bestridas.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MISSED_CLAUSES.map(c => (
              <div key={c.title} className={`rounded-2xl p-5 border ${c.danger ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${c.danger ? "text-red-500" : "text-yellow-500"}`} />
                  <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{c.desc}</p>
                <span className="text-[10px] font-mono bg-white/80 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{c.law}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#0c447c] text-white font-bold px-7 py-3.5 rounded-xl transition-colors">
              Kontrollera mitt avtal nu <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Funktioner ── */}
      <section id="funktioner" className="px-6 py-20 bg-[#f8faff]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Allt du behöver som hyresgäst</h2>
            <p className="text-gray-500">Fyra verktyg som skyddar dig och din ekonomi.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <Link key={f.title} href="/auth/register" className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#1a56a0] hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#e6f1fb] group-hover:bg-[#1a56a0] transition-colors">
                      <Icon className="h-6 w-6 text-[#1a56a0] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="font-bold text-gray-900">{f.title}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.free ? "bg-green-100 text-green-700" : "bg-[#e6f1fb] text-[#1a56a0]"}`}>
                          {f.free ? "GRATIS" : "PREMIUM"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Recensioner ── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Hyresgäster som fått hjälp</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-6 py-20 bg-[#f8faff]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Vanliga frågor</h2>
            <p className="text-gray-500">Allt du undrar om tjänsten — samlat på ett ställe.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 text-[#1a56a0] shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kontakt ── */}
      <section id="kontakt" className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Kontakta oss</h2>
            <p className="text-gray-500">Har du frågor om din hyra, dina rättigheter eller tjänsten?</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* Info */}
            <div className="space-y-4">
              {[
                { icon: Mail,           title: "E-post",       desc: "support@hyresrattskollen.se", sub: "Svarar inom 1–2 arbetsdagar" },
                { icon: Clock,          title: "Öppettider",   desc: "Mån–Fre, 09:00–17:00",       sub: "Helger svarar vi nästa vardag" },
                { icon: MessageSquare,  title: "Snabba svar",  desc: "Kolla FAQ-sektionen ovan",    sub: "Många svar finns redan där" },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-5">
                    <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#e6f1fb]">
                      <Icon className="h-5 w-5 text-[#1a56a0]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-sm text-[#1a56a0] font-medium">{item.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                );
              })}
              <div className="bg-[#f0f6ff] border border-[#1a56a0]/20 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-[#1a56a0] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Behöver du juridisk hjälp?</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Vi ger inte juridisk rådgivning. Kontakta <strong>Hyresnämnden</strong> (kostnadsfritt) eller <strong>Hyresgästföreningen</strong> för rättshjälp.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              {sent ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Meddelande skickat!</h3>
                  <p className="text-sm text-gray-500 mb-6">Vi återkommer inom 1–2 arbetsdagar.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="text-sm text-[#1a56a0] hover:underline">
                    Skicka ett nytt meddelande
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-gray-900 text-lg mb-5">Skicka ett meddelande</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Namn</label>
                        <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Anna Andersson"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">E-post</label>
                        <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="anna@example.com"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ämne</label>
                      <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] bg-white">
                        <option value="">Välj ett ämne...</option>
                        <option>Fråga om hyresanalys</option>
                        <option>Fråga om avtalsgranskning</option>
                        <option>Problem med betalning</option>
                        <option>Tekniskt problem</option>
                        <option>Annan fråga</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Meddelande</label>
                      <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Beskriv din fråga..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none" />
                    </div>
                    <button type="submit" disabled={sending}
                      className="w-full bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                      {sending ? "Skickar..." : <><span>Skicka meddelande</span><ArrowRight className="h-4 w-4" /></>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 bg-gradient-to-br from-[#1a56a0] to-[#0c447c]">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Betalar du för mycket i hyra?</h2>
          <p className="text-lg opacity-80 mb-8">Ta reda på det på 2 minuter — helt gratis.</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold px-9 py-4 rounded-xl hover:bg-gray-100 transition-colors text-base">
            Kom igång gratis <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-xs opacity-50 mt-4">Inget kreditkort krävs. Grundfunktionerna är alltid gratis.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#1a56a0]" />
            <span className="font-bold text-white">Hyresrättskollen</span>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            <a href="#faq"     className="hover:text-white transition-colors">FAQ</a>
            <a href="#kontakt" className="hover:text-white transition-colors">Kontakt</a>
            <Link href="/integritetspolicy" className="hover:text-white transition-colors">Integritetspolicy</Link>
            <Link href="/anvandarvillkor"   className="hover:text-white transition-colors">Användarvillkor</Link>
          </div>
          <p className="text-xs">© 2025 Hyresrättskollen</p>
        </div>
      </footer>
    </div>
  );
}
