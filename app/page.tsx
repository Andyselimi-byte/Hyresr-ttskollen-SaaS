"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  Shield, BarChart2, BookOpen, FileText, Mail,
  AlertTriangle, ArrowRight, ChevronRight,
  ChevronDown, ChevronUp, MessageSquare, CheckCircle, HelpCircle,
} from "lucide-react";

const MISSED_CLAUSES = [
  { title: "Olagliga renoveringsklausuler", desc: "Hyresvärdar skriver ofta in att du ska betala för normalt slitage. Det är olagligt — underhåll är hyresvärdens ansvar.", law: "12 kap. 15 § JB", danger: true },
  { title: "Dolda avgifter utöver hyran", desc: "El, vatten, internet och parkering ska vara tydligt specificerade. Otydliga tilläggsavgifter kan bestridas.", law: "12 kap. 19 § JB", danger: true },
  { title: "Ogiltiga andrahandsförbud", desc: "Förbud mot andrahandsuthyrning kan vara utan verkan om du har skäliga skäl. Lagen är tvingande.", law: "12 kap. 40 § JB", danger: false },
  { title: "För kort uppsägningstid", desc: "Du har alltid rätt till minst 3 månaders uppsägningstid. Kortare tid i kontraktet gäller inte.", law: "12 kap. 4 § JB", danger: false },
  { title: "Klausuler mot besittningsskydd", desc: "Klausuler som försöker ta bort ditt besittningsskydd är nästan alltid ogiltiga efter 2 år.", law: "12 kap. 46 § JB", danger: true },
  { title: "Oskälig deposition", desc: "Depositionen ska återbetalas inom skälig tid. Hyresvärden kan bara hålla inne pengar för faktiska skador.", law: "12 kap. JB", danger: false },
];

const FEATURES = [
  { icon: BarChart2, title: "Hyresanalys", desc: "Jämför din hyra mot referenshyror för din stad. Ta reda på om du betalar för mycket och vad du kan göra åt det.", free: true },
  { icon: BookOpen,  title: "Rättighetsguide", desc: "20 kategorier med dina rättigheter som hyresgäst. Besittningsskydd, andrahand, störningar, renovering och mer.", free: true },
  { icon: FileText,  title: "Avtalsgranskning", desc: "Ladda upp ditt hyresavtal som PDF. AI analyserar alla klausuler och flaggar olagliga eller tveksamma villkor.", free: false },
  { icon: Mail,      title: "Brevgenerator", desc: "AI skriver ett juridiskt korrekt brev anpassat till din situation — bestrida hyreshöjning, ansök om andrahand och mer.", free: false },
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
    a: "Hyresanalysen och rättighetsguiden är helt gratis — du behöver inte ens skapa ett konto för att använda dem. Avtalsgranskning och brevgenerator kräver credits som köps i paket: 5 uppladdningar för 79 kr, 10 för 129 kr eller 25 för 199 kr. Credits förfaller inte. Du betalar bara för det du faktiskt använder — ingen prenumeration.",
  },
  {
    q: "Är mina uppladdade hyresavtal säkra?",
    a: "Ja. Dokument du laddar upp skickas krypterat och används enbart för att genomföra den aktuella analysen. Vi lagrar inte dina PDF-filer permanent på våra servrar och delar dem inte med någon tredje part. Analysen sker via en AI-modell som inte sparar eller lär sig av dina dokument.",
  },
  {
    q: "Kan jag få återbetalning?",
    a: "Ja, vi erbjuder återbetalning inom 14 dagar från köpdatumet, förutsatt att du inte har använt några av dina credits. Hör av dig till support@hyresrattskollen.se med din e-postadress och så hanterar vi det manuellt — vanligtvis inom ett par dagar.",
  },
  {
    q: "Mitt avtal är inte en PDF — vad gör jag?",
    a: "Om ditt avtal är i Word-format (.docx) kan du öppna det och skriva ut det som PDF — välj 'Skriv ut' och sedan 'Spara som PDF' som skrivare. Har du fått avtalet som bild (foto eller scan) kan du använda en gratistjänst som ilovepdf.com för att konvertera det. De flesta moderna smartphones kan också skapa PDF direkt via fotofunktionen.",
  },
  {
    q: "Varför stämmer inte referenshyran exakt med vad grannen betalar?",
    a: "Referenshyrorna baseras på SCB:s statistik och Hyresnämndens genomsnittsvärden per kommun. I verkligheten påverkas hyran av många faktorer som vi inte kan ta hänsyn till — lägenhetens skick, tillgång till hiss, balkong, parkeringsplats, renoveringshistorik och mer. Verktyget ger dig en indikation, inte ett exakt juridiskt utlåtande. Vill du veta exakt vad din hyra borde vara kan du ansöka om hyresprövning hos Hyresnämnden.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
  }, []);

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
    <div className="min-h-screen" style={{ background: "#0f172a" }}>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-slate-800 px-6 py-4" style={{ background: "#0f172a" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Shield className="h-5 w-5 text-[#60a5fa]" />
            <span className="font-semibold text-white text-base tracking-tight">Hyresrättskollen</span>
          </Link>
          <div className="hidden sm:flex items-center gap-8 text-sm text-slate-400">
            <a href="#funktioner" className="hover:text-white transition-colors">Funktioner</a>
            <a href="#faq"        className="hover:text-white transition-colors">FAQ</a>
            <a href="#kontakt"    className="hover:text-white transition-colors">Kontakt</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white font-medium hidden sm:block transition-colors">
              Logga in
            </Link>
            <Link href="/auth/register"
              className="text-sm font-semibold px-4 py-2 rounded-md transition-colors"
              style={{ background: "#1a56a0", color: "#fff" }}
              onMouseOver={e => (e.currentTarget.style.background = "#0c447c")}
              onMouseOut={e => (e.currentTarget.style.background = "#1a56a0")}>
              Kom igång
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-24" style={{ background: "#0f172a" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-8" style={{ color: "#1a56a0" }}>
            Verktyg för 1,6 miljoner svenska hyresgäster
          </p>
          <div className="grid lg:grid-cols-2 gap-16 items-end">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold leading-none tracking-tight mb-6" style={{ color: "#fff" }}>
                Visste du att{" "}
                <span style={{ color: "#60a5fa" }}>1&nbsp;av&nbsp;3</span>
                <br />hyresavtal
                <br />är olagliga?
              </h1>
              <div className="w-10 h-0.5 mb-6" style={{ background: "#1a56a0" }} />
              <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: "#94a3b8" }}>
                Välj ett verktyg nedan för att analysera din hyra, granska ditt avtal eller
                skriva ett juridiskt brev — allt baserat på 12 kap. Jordabalken.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/register"
                  className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-md text-sm transition-colors"
                  style={{ background: "#1a56a0", color: "#fff" }}
                  onMouseOver={e => (e.currentTarget.style.background = "#0c447c")}
                  onMouseOut={e => (e.currentTarget.style.background = "#1a56a0")}>
                  Se mina verktyg <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#faq"
                  className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-md text-sm transition-colors"
                  style={{ border: "1px solid #334155", color: "#94a3b8" }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = "#475569")}
                  onMouseOut={e => (e.currentTarget.style.borderColor = "#334155")}>
                  Vanliga frågor
                </a>
              </div>
            </div>

            {/* Right: 3 stats stacked */}
            <div className="divide-y" style={{ borderColor: "#1e293b" }}>
              {[
                { num: "1 av 3", label: "hyresavtal innehåller minst en olaglig klausul" },
                { num: "73 %",   label: "av hyresgäster känner inte till sina rättigheter" },
                { num: "4 800 kr", label: "genomsnittlig överbetald hyra per år i Stockholm" },
              ].map((s, i) => (
                <div key={i} className="flex items-baseline gap-6 py-5">
                  <span className="text-3xl font-bold tracking-tight tabular-nums shrink-0"
                    style={{ color: i === 0 ? "#60a5fa" : "#e2e8f0", minWidth: 90 }}>{s.num}</span>
                  <span className="text-sm" style={{ color: "#64748b" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-6 mt-12 pt-8" style={{ borderTop: "1px solid #1e293b" }}>
            {["Gratis att komma igång", "Baserat på Jordabalken", "Inte juridisk rådgivning"].map(t => (
              <span key={t} className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
                <span className="w-1 h-1 rounded-full inline-block" style={{ background: "#1a56a0" }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── White break ── */}
      <div style={{ background: "#fff" }}>

        {/* ── Vanliga fällor ── */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6"
              style={{ borderBottom: "1px solid #e5e7eb" }}>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#1a56a0" }}>
                  Vanliga fällor
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Det här missar de flesta i sitt avtal
                </h2>
              </div>
              <p className="text-sm text-gray-400 max-w-xs sm:text-right hidden sm:block">
                De flesta skriver under utan att veta att dessa klausuler är olagliga eller kan bestridas.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", background: "#e5e7eb" }}>
              {MISSED_CLAUSES.map((c, i) => (
                <div key={c.title} className="bg-white p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-mono text-gray-300">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.danger ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                    }`}>
                      {c.danger ? "OLAGLIGT" : "TVEKSAMT"}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-2">{c.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{c.desc}</p>
                  <span className="text-[10px] font-mono" style={{ color: "#1a56a0" }}>{c.law}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-md text-sm text-white transition-colors"
                style={{ background: "#1a56a0" }}
                onMouseOver={e => (e.currentTarget.style.background = "#0c447c")}
                onMouseOut={e => (e.currentTarget.style.background = "#1a56a0")}>
                Kontrollera mitt avtal <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Funktioner ── */}
        <section id="funktioner" className="px-6 py-20" style={{ background: "#f8faff" }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6"
              style={{ borderBottom: "1px solid #e5e7eb" }}>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#1a56a0" }}>
                  Verktyg
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Allt du behöver som hyresgäst
                </h2>
              </div>
              <p className="text-sm text-gray-400 max-w-xs sm:text-right hidden sm:block">
                Fyra verktyg som skyddar dig och din ekonomi.
              </p>
            </div>
            <div className="grid sm:grid-cols-2" style={{ gap: "1px", background: "#e5e7eb" }}>
              {FEATURES.map(f => {
                const Icon = f.icon;
                return (
                  <Link key={f.title} href="/auth/register"
                    className="group bg-white p-8 flex flex-col gap-4 transition-colors hover:bg-[#f0f6ff]">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center transition-colors"
                        style={{ background: "#e6f1fb" }}
                        onMouseOver={e => (e.currentTarget.style.background = "#1a56a0")}
                        onMouseOut={e => (e.currentTarget.style.background = "#e6f1fb")}>
                        <Icon className="h-5 w-5" style={{ color: "#1a56a0" }} />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                        f.free ? "bg-green-50 text-green-700" : "bg-[#e6f1fb] text-[#1a56a0]"
                      }`}>
                        {f.free ? "GRATIS" : "CREDITS"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1.5">{f.title}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                    </div>
                    <span className="text-xs font-semibold flex items-center gap-1 mt-auto" style={{ color: "#1a56a0" }}>
                      Kom igång <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="px-6 py-20 bg-white" style={{ borderTop: "1px solid #e5e7eb" }}>
          <div className="max-w-6xl mx-auto">
            <div className="pb-6 mb-2" style={{ borderBottom: "1px solid #e5e7eb" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#1a56a0" }}>
                Frågor & svar
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Vanliga frågor</h2>
            </div>
            <div style={{ borderBottom: "1px solid #e5e7eb" }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <button
                    className="w-full flex items-center justify-between py-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-medium text-gray-900 pr-6 text-sm sm:text-base">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="h-4 w-4 shrink-0" style={{ color: "#1a56a0" }} />
                      : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="pb-5 text-sm text-gray-500 leading-relaxed max-w-3xl">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Kontakt ── */}
        <section id="kontakt" className="px-6 py-20" style={{ background: "#f8faff", borderTop: "1px solid #e5e7eb" }}>
          <div className="max-w-6xl mx-auto">
            <div className="pb-6 mb-10" style={{ borderBottom: "1px solid #e5e7eb" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#1a56a0" }}>
                Kontakt
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Kontakta oss</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-4">
                {[
                  { icon: Mail,          title: "E-post",      desc: "support@hyresrattskollen.se", sub: "Vi svarar så snart vi kan" },
                  { icon: MessageSquare, title: "Snabba svar", desc: "Kolla FAQ-sektionen ovan",    sub: "Många svar finns redan där" },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-4 bg-white border border-gray-200 p-5 rounded-md">
                      <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ background: "#e6f1fb" }}>
                        <Icon className="h-4 w-4" style={{ color: "#1a56a0" }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-sm font-medium" style={{ color: "#1a56a0" }}>{item.desc}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  );
                })}
                <div className="bg-white border border-gray-200 p-5 rounded-md">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#1a56a0" }} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Behöver du juridisk hjälp?</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Vi ger inte juridisk rådgivning. Kontakta <strong>Hyresnämnden</strong> (kostnadsfritt) eller{" "}
                        <strong>Hyresgästföreningen</strong> för rättshjälp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-md p-7">
                {sent ? (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Meddelande skickat!</h3>
                    <p className="text-sm text-gray-500 mb-6">Vi återkommer så snart vi kan.</p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="text-sm hover:underline" style={{ color: "#1a56a0" }}>
                      Skicka ett nytt meddelande
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-900 mb-5">Skicka ett meddelande</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Namn</label>
                          <input required value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Anna Andersson"
                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">E-post</label>
                          <input required type="email" value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="anna@example.com"
                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Ämne</label>
                        <select required value={form.subject}
                          onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] bg-white">
                          <option value="">Välj ett ämne...</option>
                          <option>Fråga om hyresanalys</option>
                          <option>Fråga om avtalsgranskning</option>
                          <option>Problem med betalning</option>
                          <option>Tekniskt problem</option>
                          <option>Annan fråga</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Meddelande</label>
                        <textarea required rows={4} value={form.message}
                          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                          placeholder="Beskriv din fråga..."
                          className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none" />
                      </div>
                      <button type="submit" disabled={sending}
                        className="w-full text-white font-semibold py-3 rounded-md text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                        style={{ background: "#1a56a0" }}
                        onMouseOver={e => !sending && (e.currentTarget.style.background = "#0c447c")}
                        onMouseOut={e => (e.currentTarget.style.background = "#1a56a0")}>
                        {sending ? "Skickar..." : <><span>Skicka meddelande</span><ArrowRight className="h-4 w-4" /></>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>{/* end white break */}

      {/* ── CTA ── */}
      <section className="px-6 py-24" style={{ background: "#0f172a", borderTop: "1px solid #1e293b" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#1a56a0" }}>
              Kom igång idag
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2" style={{ color: "#fff" }}>
              Betalar du för mycket i hyra?
            </h2>
            <p className="text-base" style={{ color: "#64748b" }}>Ta reda på det på 2 minuter — helt gratis.</p>
          </div>
          <div className="flex flex-col items-center gap-3 shrink-0">
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-md text-base whitespace-nowrap transition-colors"
              style={{ background: "#fff", color: "#1a56a0" }}
              onMouseOver={e => (e.currentTarget.style.background = "#e6f1fb")}
              onMouseOut={e => (e.currentTarget.style.background = "#fff")}>
              Kom igång gratis <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-xs" style={{ color: "#334155" }}>Inget kreditkort. Alltid gratis att börja.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-10" style={{ background: "#020617", borderTop: "1px solid #0f172a" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: "#1a56a0" }} />
            <span className="font-semibold text-white">Hyresrättskollen</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#faq"     className="text-xs text-slate-500 hover:text-white transition-colors">FAQ</a>
            <a href="#kontakt" className="text-xs text-slate-500 hover:text-white transition-colors">Kontakt</a>
            <Link href="/integritetspolicy" className="text-xs text-slate-500 hover:text-white transition-colors">Integritetspolicy</Link>
            <Link href="/anvandarvillkor"   className="text-xs text-slate-500 hover:text-white transition-colors">Användarvillkor</Link>
          </div>
          <p className="text-xs text-slate-600">© 2025 Hyresrättskollen</p>
        </div>
      </footer>

    </div>
  );
}
