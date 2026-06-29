import Link from "next/link";
import { BarChart2, BookOpen, FileText, Mail, ArrowRight, Shield, AlertTriangle, Star, Check, ChevronRight } from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

const FEATURES = [
  {
    href: "/dashboard/hyresanalys",
    icon: BarChart2,
    title: "Hyresanalys",
    description: "Jämför din hyra mot referenshyror för din stad. Ta reda på om du betalar för mycket och vad du kan göra åt det.",
    free: true,
  },
  {
    href: "/dashboard/rattigheter",
    icon: BookOpen,
    title: "Rättighetsguide",
    description: "20 kategorier med dina rättigheter som hyresgäst. Besittningsskydd, andrahand, störningar, renovering och mer.",
    free: true,
  },
  {
    href: "/dashboard/avtal",
    icon: FileText,
    title: "Avtalsgranskning",
    description: "Ladda upp ditt hyresavtal som PDF. AI analyserar alla klausuler och flaggar olagliga eller tveksamma villkor.",
    free: false,
  },
  {
    href: "/dashboard/brev",
    icon: Mail,
    title: "Brevgenerator",
    description: "AI skriver ett juridiskt korrekt brev anpassat till din situation — bestrida hyreshöjning, ansök om andrahand och mer.",
    free: false,
  },
];

const STATS = [
  { num: "1 av 3", desc: "hyresavtal innehåller minst en olaglig klausul" },
  { num: "73 %", desc: "av hyresgäster känner inte till sina rättigheter" },
  { num: "4 800 kr", desc: "genomsnittlig överbetald hyra per år i Stockholm" },
];

const MISSED_CLAUSES = [
  { title: "Olagliga renoveringsklausuler", desc: "Hyresvärdar skriver ofta in att du ska betala för normalt slitage. Det är olagligt.", law: "12 kap. 15 § JB", danger: true },
  { title: "Dolda avgifter utöver hyran", desc: "El, vatten och parkering ska vara tydligt specificerade. Otydliga avgifter kan bestridas.", law: "12 kap. 19 § JB", danger: true },
  { title: "Ogiltiga andrahandsförbud", desc: "Förbud mot andrahand kan vara utan verkan om du har skäliga skäl. Lagen är tvingande.", law: "12 kap. 40 § JB", danger: false },
  { title: "För kort uppsägningstid", desc: "Du har alltid rätt till minst 3 månaders uppsägningstid. Kortare tid i kontraktet gäller inte.", law: "12 kap. 4 § JB", danger: false },
  { title: "Klausuler mot besittningsskydd", desc: "Klausuler som försöker ta bort ditt besittningsskydd är nästan alltid ogiltiga efter 2 år.", law: "12 kap. 46 § JB", danger: true },
  { title: "Oskälig deposition", desc: "Depositionen ska återbetalas inom skälig tid. Hyresvärden kan bara hålla inne pengar för faktiska skador.", law: "12 kap. JB", danger: false },
];

const TESTIMONIALS = [
  { text: "Hittade tre olagliga klausuler i mitt hyresavtal på 5 minuter. Fick tillbaka 12 000 kr.", name: "Marcus L.", city: "Stockholm" },
  { text: "Slutligen förstår jag vad som gäller kring andrahandsuthyrning. Enkelt och tydligt.", name: "Fatima K.", city: "Göteborg" },
  { text: "Brevet till hyresvärden om hyreshöjningen var perfekt. Hyresvärden backade.", name: "Erik S.", city: "Malmö" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-[#e6f1fb] to-[#f0f6ff] border border-[#1a56a0]/15 p-8">
        <div className="inline-flex items-center gap-2 bg-white text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 shadow-sm">
          <Shield className="h-3.5 w-3.5" />
          Verktyg för 1,6 miljoner svenska hyresgäster
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          Visste du att <span className="text-[#1a56a0]">1 av 3</span><br className="hidden sm:block" /> hyresavtal är olagliga?
        </h1>
        <p className="text-gray-600 max-w-xl mb-6 leading-relaxed">
          Välj ett verktyg nedan för att analysera din hyra, granska ditt avtal eller skriva ett juridiskt brev — allt baserat på 12 kap. Jordabalken.
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          {["Gratis att komma igång", "Baserat på Jordabalken", "Inte juridisk rådgivning"].map(t => (
            <span key={t} className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200">
              <Check className="h-3.5 w-3.5 text-green-500" />{t}
            </span>
          ))}
        </div>
      </div>

      {/* Verktyg */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Dina verktyg</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ href, icon: Icon, title, description, free }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-3 p-5 bg-white border border-gray-200 rounded-2xl hover:border-[#1a56a0] hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#e6f1fb] group-hover:bg-[#1a56a0] transition-colors">
                  <Icon className="h-5 w-5 text-[#1a56a0] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${free ? "bg-green-100 text-green-700" : "bg-[#e6f1fb] text-[#1a56a0]"}`}>
                      {free ? "GRATIS" : "PREMIUM"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#1a56a0] pl-[3.75rem]">
                Öppna <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Statistik */}
      <div className="rounded-2xl bg-[#1a56a0] p-6">
        <h2 className="text-white font-bold text-lg mb-5">Varför det spelar roll</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
          {STATS.map(s => (
            <div key={s.num}>
              <p className="text-3xl font-bold mb-1">{s.num}</p>
              <p className="text-xs opacity-75 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vanliga fällor */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <AlertTriangle className="h-3.5 w-3.5" />
            Vanliga fällor
          </div>
          <h2 className="text-lg font-bold text-gray-900">Det här missar de flesta i sitt hyresavtal</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MISSED_CLAUSES.map(c => (
            <div key={c.title} className={`rounded-2xl p-4 border ${c.danger ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${c.danger ? "text-red-500" : "text-yellow-500"}`} />
                <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
              </div>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">{c.desc}</p>
              <span className="text-[10px] font-mono bg-white/80 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{c.law}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/dashboard/avtal" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#0c447c] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            Granska mitt avtal <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Recensioner */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
          </div>
          <h2 className="text-lg font-bold text-gray-900">Hyresgäster som fått hjälp</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm font-semibold text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-400">{t.city}</p>
            </div>
          ))}
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
