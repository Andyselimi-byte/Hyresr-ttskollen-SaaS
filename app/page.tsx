import Link from "next/link";
import { Shield, BarChart2, BookOpen, FileText, Mail, Check, AlertTriangle, ArrowRight, Star, ChevronRight } from "lucide-react";

const MISSED_CLAUSES = [
  {
    title: "Olagliga renoveringsklausuler",
    desc: "Hyresvärdar skriver ofta in att du ska betala för normalt slitage. Det är olagligt — underhåll är hyresvärdens ansvar.",
    law: "12 kap. 15 § JB",
    danger: true,
  },
  {
    title: "Dolda avgifter utöver hyran",
    desc: "El, vatten, internet och parkering ska vara tydligt specificerade. Otydliga tilläggsavgifter kan bestridas.",
    law: "12 kap. 19 § JB",
    danger: true,
  },
  {
    title: "Ogiltiga andrahandsförbud",
    desc: "Förbud mot andrahandsuthyrning kan vara utan verkan om du har skäliga skäl. Lagen är tvingande.",
    law: "12 kap. 40 § JB",
    danger: false,
  },
  {
    title: "För kort uppsägningstid",
    desc: "Du har alltid rätt till minst 3 månaders uppsägningstid. Kortare tid i kontraktet gäller inte.",
    law: "12 kap. 4 § JB",
    danger: false,
  },
  {
    title: "Klausuler mot besittningsskydd",
    desc: "Klausuler som försöker ta bort ditt besittningsskydd är nästan alltid ogiltiga efter 2 år.",
    law: "12 kap. 46 § JB",
    danger: true,
  },
  {
    title: "Oskälig deposition",
    desc: "Depositionen ska återbetalas inom skälig tid. Hyresvärden kan bara hålla inne pengar för faktiska skador.",
    law: "12 kap. JB",
    danger: false,
  },
];

const STATS = [
  { num: "1 av 3", desc: "hyresavtal innehåller minst en olaglig klausul" },
  { num: "73 %", desc: "av hyresgäster känner inte till sina rättigheter fullt ut" },
  { num: "4 800 kr", desc: "genomsnittlig överbetald hyra per år i Stockholm" },
];

const FEATURES = [
  {
    icon: BarChart2,
    title: "Hyresanalys",
    desc: "Jämför din hyra mot referenshyror för din stad. Ta reda på om du betalar för mycket och vad du kan göra åt det.",
    free: true,
  },
  {
    icon: BookOpen,
    title: "Rättighetsguide",
    desc: "20 kategorier med dina rättigheter som hyresgäst. Besittningsskydd, andrahand, störningar, renovering och mer.",
    free: true,
  },
  {
    icon: FileText,
    title: "Avtalsgranskning",
    desc: "Ladda upp ditt hyresavtal som PDF. AI analyserar alla klausuler och flaggar olagliga eller tveksamma villkor.",
    free: false,
  },
  {
    icon: Mail,
    title: "Brevgenerator",
    desc: "AI skriver ett juridiskt korrekt brev anpassat till din situation — bestrida hyreshöjning, ansök om andrahand och mer.",
    free: false,
  },
];

const TESTIMONIALS = [
  {
    text: "Hittade tre olagliga klausuler i mitt hyresavtal på 5 minuter. Fick tillbaka 12 000 kr i för högt betald hyra.",
    name: "Marcus L.",
    city: "Stockholm",
  },
  {
    text: "Slutligen förstår jag vad som gäller kring andrahandsuthyrning. Enkelt och tydligt förklarat.",
    name: "Fatima K.",
    city: "Göteborg",
  },
  {
    text: "Brevet till hyresvärden om hyreshöjningen var perfekt formulerat. Hyresvärden backade.",
    name: "Erik S.",
    city: "Malmö",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#1a56a0]" />
            <span className="font-bold text-[#1a56a0] text-lg">Hyresrättskollen</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600 font-medium">
            <Link href="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
            <Link href="/kontakt" className="hover:text-gray-900 transition-colors">Kontakt</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium hidden sm:block">
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
            <Link
              href="/auth/register"
              className="bg-[#1a56a0] hover:bg-[#0c447c] text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
            >
              Granska mitt avtal gratis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="border border-gray-300 hover:border-[#1a56a0] text-gray-700 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              Logga in
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            {["Gratis att komma igång", "Baserat på Jordabalken", "Inte juridisk rådgivning"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Missed clauses */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <AlertTriangle className="h-3.5 w-3.5" />
              Vanliga fällor i hyresavtal
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Det här missar de flesta i sitt hyresavtal
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              De flesta skriver under utan att veta att dessa klausuler antingen är olagliga eller kan bestridas.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MISSED_CLAUSES.map(clause => (
              <div
                key={clause.title}
                className={`rounded-2xl p-5 border ${clause.danger ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${clause.danger ? "text-red-500" : "text-yellow-500"}`} />
                  <p className="font-semibold text-gray-900 text-sm">{clause.title}</p>
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{clause.desc}</p>
                <span className="text-[10px] font-mono bg-white/80 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                  {clause.law}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#0c447c] text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
            >
              Kontrollera mitt avtal nu <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-[#f8faff]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Allt du behöver som hyresgäst</h2>
            <p className="text-gray-500">Fyra verktyg som skyddar dig och din ekonomi.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.title}
                  href="/auth/register"
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#1a56a0] hover:shadow-lg transition-all"
                >
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

      {/* Testimonials */}
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
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-gradient-to-br from-[#1a56a0] to-[#0c447c]">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Betalar du för mycket i hyra?
          </h2>
          <p className="text-lg opacity-80 mb-8">
            Ta reda på det på 2 minuter — helt gratis.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold px-9 py-4 rounded-xl hover:bg-gray-100 transition-colors text-base"
          >
            Kom igång gratis <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-xs opacity-50 mt-4">Inget kreditkort krävs. Grundfunktionerna är alltid gratis.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#1a56a0]" />
            <span className="font-bold text-white">Hyresrättskollen</span>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link>
            <Link href="/integritetspolicy" className="hover:text-white transition-colors">Integritetspolicy</Link>
            <Link href="/anvandarvillkor" className="hover:text-white transition-colors">Användarvillkor</Link>
          </div>
          <p className="text-xs">© 2025 Hyresrättskollen</p>
        </div>
      </footer>
    </div>
  );
}
