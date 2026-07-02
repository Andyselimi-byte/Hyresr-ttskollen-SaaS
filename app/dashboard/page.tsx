"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BarChart2, BookOpen, FileText, Mail,
  ArrowRight, CreditCard, Shield, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
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

const TOOLS = [
  {
    href: "/dashboard/hyresanalys",
    icon: BarChart2,
    title: "Hyresanalys",
    desc: "Jämför din hyra mot SCB-data för din stad och lägenhetsstorlek.",
    free: true,
    cta: "Analysera hyra",
  },
  {
    href: "/dashboard/rattigheter",
    icon: BookOpen,
    title: "Rättighetsguide",
    desc: "20 ämnen om dina rättigheter — besittningsskydd, andrahand, störningar och mer.",
    free: true,
    cta: "Läs guide",
  },
  {
    href: "/dashboard/avtal",
    icon: FileText,
    title: "Avtalsgranskning",
    desc: "Ladda upp ditt hyresavtal som PDF och få en AI-analys av alla klausuler.",
    free: false,
    cta: "Granska avtal",
  },
  {
    href: "/dashboard/brev",
    icon: Mail,
    title: "Brevgenerator",
    desc: "Generera ett juridiskt korrekt brev anpassat till din situation.",
    free: false,
    cta: "Skriv brev",
  },
];

export default function DashboardHomePage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [reviewCredits, setReviewCredits] = useState<number | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      setCredits(data?.credits ?? 0);
    }
    load();
  }, []);

  const firstName = email.split("@")[0] ?? "";

  return (
    <div className="max-w-4xl space-y-8">
      <Suspense fallback={null}>
        <ReviewTrigger onCredits={setReviewCredits} />
      </Suspense>

      {reviewCredits !== null && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-sm text-green-700 font-medium">
          ✓ {reviewCredits} credits har lagts till på ditt konto.
        </div>
      )}

      <ReviewModal />
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />

      {/* Välkomsthälsning */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
          Välkommen{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-sm text-gray-500">Välj ett verktyg nedan för att komma igång.</p>
      </div>

      {/* Credits-banner */}
      <div className="flex items-center justify-between bg-[#f0f6ff] border border-[#1a56a0]/20 rounded-xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#e6f1fb] rounded-lg flex items-center justify-center shrink-0">
            <CreditCard className="h-4 w-4 text-[#1a56a0]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {credits === null ? "Laddar..." : `${credits} credits kvar`}
            </p>
            <p className="text-xs text-gray-500">Används för avtalsgranskning och brevgenerator</p>
          </div>
        </div>
        <button
          onClick={() => setPricingOpen(true)}
          className="text-sm font-semibold text-[#1a56a0] hover:text-[#0c447c] flex items-center gap-1 transition-colors"
        >
          Köp credits <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Verktyg */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-[#1a56a0] mb-4">Dina verktyg</p>
        <div className="grid sm:grid-cols-2 gap-px bg-gray-200 rounded-xl overflow-hidden">
          {TOOLS.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white p-6 hover:bg-[#f8faff] transition-colors flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-[#e6f1fb] group-hover:bg-[#1a56a0] rounded-lg flex items-center justify-center transition-colors">
                    <Icon className="h-5 w-5 text-[#1a56a0] group-hover:text-white transition-colors" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                    tool.free
                      ? "bg-green-50 text-green-700"
                      : "bg-[#e6f1fb] text-[#1a56a0]"
                  }`}>
                    {tool.free ? "GRATIS" : "CREDITS"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{tool.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                </div>
                <span className="text-xs font-semibold text-[#1a56a0] flex items-center gap-1 mt-auto">
                  {tool.cta} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info-ruta */}
      <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-5">
        <Shield className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Hyresrättskollen är ett informationsverktyg baserat på 12 kap. Jordabalken och SCB-statistik.
          Tjänsten ersätter inte juridisk rådgivning. Vid tvister — kontakta{" "}
          <a href="https://www.domstol.se/hyresnamnden" target="_blank" rel="noopener noreferrer"
            className="text-[#1a56a0] hover:underline font-medium">Hyresnämnden</a>{" "}
          (kostnadsfritt) eller Hyresgästföreningen.
        </p>
      </div>
    </div>
  );
}
