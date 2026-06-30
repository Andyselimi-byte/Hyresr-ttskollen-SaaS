"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Shield, BarChart2, BookOpen, FileText, Mail, Check,
  AlertTriangle, ArrowRight, ChevronRight,
  ChevronDown, ChevronUp, MessageSquare, CheckCircle, HelpCircle, LogOut,
} from "lucide-react";
import { ReviewModal } from "@/components/ReviewModal";
import { PricingModal } from "@/components/PricingModal";

function ReviewTrigger({ onCredits }: { onCredits: (n: number) => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const credits = searchParams.get("credits_added");
    if (credits) {
      onCredits(Number(credits));
      router.replace("/dashboard");
    }
  }, [searchParams, router, onCredits]);
  return null;
}

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
  { href: "/dashboard/hyresanalys", icon: BarChart2, title: "Hyresanalys", desc: "Jämför din hyra mot referenshyror för din stad. Ta reda på om du betalar för mycket och vad du kan göra åt det.", free: true },
  { href: "/dashboard/rattigheter", icon: BookOpen, title: "Rättighetsguide", desc: "20 kategorier med dina rättigheter som hyresgäst. Besittningsskydd, andrahand, störningar, renovering och mer.", free: true },
  { href: "/dashboard/avtal", icon: FileText, title: "Avtalsgranskning", desc: "Ladda upp ditt hyresavtal som PDF. AI analyserar alla klausuler och flaggar olagliga eller tveksamma villkor.", free: false },
  { href: "/dashboard/brev", icon: Mail, title: "Brevgenerator", desc: "AI skriver ett juridiskt korrekt brev anpassat till din situation — bestrida hyreshöjning, ansök om andrahand och mer.", free: false },
];

const FAQS = [
  {
    q: "Är Hyresrättskollen juridisk rådgivning?",
    a: "Nej, Hyresrättskollen ersätter inte en jurist eller juridisk rådgivning. Tjänsten är ett informationsverktyg som hjälper dig förstå vad som gäller enligt 12 kap. Jordabalken och jämföra din hyra mot SCB:s statistik. Om du har en aktiv tvist med din hyresvärd bör du vända dig till Hyresnämnden (kostnadsfritt) eller Hyresgästföreningen, som kan ge dig personlig juridisk hjälp.",
  },
  {
    q: "Hur fungerar avtalsgranskningen?",
    a: "Du laddar upp ditt hyresavtal som PDF. Systemet läser igenom dokumentet och analyserar varje klausul mot gällande regler i Jordabalken. Resultatet visar vilka villkor som är normala, vilka som är tveksamma och vilka som sannolikt är ogiltiga — med hänvisning till vilket lagrum som gäller. Du får även en sammanfattning och konkreta rekommendationer om vad du kan göra. Analysen tar vanligtvis 20–40 sekunder.",
  },
  {
    q: "Hur fungerar hyresanalysen?",
    a: "Du anger din nuvarande hyra, antal rum, area och vilken ort/kommun du bor i. Verktyget räknar sedan ut en referenshyra baserat på SCB:s hyresstatistik för din specifika kommun, justerad för antal rum och area. Du ser direkt om din hyra ligger inom ett rimligt intervall, är något hög eller avviker så pass mycket att det kan vara värt att kontakta Hyresnämnden. Du får också konkreta råd om vad du kan göra beroende på utfallet.",
  },
  {
    q: "Vad är gratis och vad kostar det?",
    a: "Hyresanalysen och rättighetsguiden är helt gratis — du behöver inte ens skapa ett konto för att använda dem. Avtalsgranskning och brevgenerator kräver credits som köps i paket: 5 uppladdningar för 79 kr, 10 för 129 kr eller 25 för 199 kr. Credits förfaller inte och delas inte mellan konton. Du betalar bara för det du faktiskt använder — ingen prenumeration.",
  },
  {
    q: "Är mina uppladdade hyresavtal säkra?",
    a: "Ja. Dokument du laddar upp skickas krypterat och används enbart för att genomföra den aktuella analysen. Vi lagrar inte dina PDF-filer permanent på våra servrar och delar dem inte med någon tredje part. Analysen sker via en AI-modell som inte sparar eller lär sig av dina dokument.",
  },
  {
    q: "Kan jag få återbetalning?",
    a: "Ja, vi erbjuder återbetalning inom 14 dagar från köpdatumet, förutsatt att du inte har använt några av dina credits. Hör av dig till support@hyresrattskollen.se med din e-postadress och så hanterar vi det manuellt — vanligtvis inom 1–2 arbetsdagar.",
  },
  {
    q: "Mitt avtal är inte en PDF — vad gör jag?",
    a: "Om ditt avtal är i Word-format (.docx) kan du öppna det och skriva ut det som PDF — välj 'Skriv ut' och sedan 'Spara som PDF' som skrivare. Har du fått avtalet som bild (foto eller scan) kan du använda en gratistjänst som ilovepdf.com för att konvertera det. De flesta moderna smartphones kan också skapa PDF direkt via fotofunktionen. Kontakta oss på support om du behöver hjälp med konverteringen.",
  },
  {
    q: "Varför stämmer inte referenshyran exakt med vad grannen betalar?",
    a: "Referenshyrorna baseras på SCB:s statistik och Hyresnämndens genomsnittsvärden per kommun. I verkligheten påverkas hyran av många faktorer som vi inte kan ta hänsyn till — lägenhetens skick, tillgång till hiss, balkong, parkeringsplats, renoveringshistorik och mer. Verktyget ger dig en indikation, inte ett exakt juridiskt utlåtande. Om du vill veta exakt vad din hyra borde vara kan du ansöka om hyresprövning hos Hyresnämnden.",
  },
];

export default function DashboardHomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [reviewCredits, setReviewCredits] = useState<number | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSent(true);
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-white">

      <Suspense fallback={null}>
        <ReviewTrigger onCredits={setReviewCredits} />
      </Suspense>
      {reviewCredits !== null && (
        <ReviewModal credits={reviewCredits} onClose={() => setReviewCredits(null)} />
      )}
      {pricingOpen && <PricingModal onClose={() => setPricingOpen(false)} />}

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="h-6 w-6 text-[#1a56a0]" />
            <span className="font-bold text-[#1a56a0] text-lg">Hyresrättskollen</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600 font-medium">
            <a href="#verktyg"   className="hover:text-gray-900 transition-colors">Verktyg</a>
            <a href="#faq"       className="hover:text-gray-900 transition-colors">FAQ</a>
            <a href="#kontakt"   className="hover:text-gray-900 transition-colors">Kontakt</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPricingOpen(true)} className="hidden sm:flex items-center gap-1.5 text-sm bg-[#1a56a0] hover:bg-[#0c447c] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              Köp uppladdningar
            </button>
            <a href="/api/auth/logout" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors">
              <LogOut className="h-4 w-4" /> Logga ut
            </a>
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
            Välj ett verktyg nedan för att analysera din hyra, granska ditt avtal eller skriva ett juridiskt brev — allt baserat på 12 kap. Jordabalken.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <a href="#verktyg" className="bg-[#1a56a0] hover:bg-[#0c447c] text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-base flex items-center justify-center gap-2">
              Se mina verktyg <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#faq" className="border border-gray-300 hover:border-[#1a56a0] text-gray-700 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base">
              Vanliga frågor
            </a>
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
            <Link href="/dashboard/avtal" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#0c447c] text-white font-bold px-7 py-3.5 rounded-xl transition-colors">
              Kontrollera mitt avtal nu <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Verktyg ── */}
      <section id="verktyg" className="px-6 py-20 bg-[#f8faff]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Dina verktyg</h2>
            <p className="text-gray-500">Allt du behöver som hyresgäst — samlat på ett ställe.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <Link key={f.href} href={f.href} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#1a56a0] hover:shadow-lg transition-all">
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
            <div className="space-y-4">
              {[
                { icon: Mail,          title: "E-post",      desc: "support@hyresrattskollen.se", sub: "Vi svarar så snart vi kan" },
                { icon: MessageSquare, title: "Snabba svar", desc: "Kolla FAQ-sektionen ovan",    sub: "Många svar finns redan där" },
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Redo att granska ditt avtal?</h2>
          <p className="text-lg opacity-80 mb-8">Välj ett verktyg och kom igång direkt.</p>
          <a href="#verktyg" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold px-9 py-4 rounded-xl hover:bg-gray-100 transition-colors text-base">
            Se mina verktyg <ArrowRight className="h-5 w-5" />
          </a>
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
