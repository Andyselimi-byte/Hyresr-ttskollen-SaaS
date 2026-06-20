import Link from "next/link";
import { BarChart2, BookOpen, FileText, Mail, ArrowRight, Shield } from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

const FEATURES = [
  {
    href: "/dashboard/hyresanalys",
    icon: BarChart2,
    title: "Hyresanalys",
    description: "Jämför din hyra med SCB:s statistik för din stad och bostadsstorlek.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    href: "/dashboard/rattigheter",
    icon: BookOpen,
    title: "Rättighetsguide",
    description: "Sökbar guide till dina rättigheter som hyresgäst enligt Jordabalken.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    href: "/dashboard/avtal",
    icon: FileText,
    title: "Avtalsgranskning",
    description: "Ladda upp ditt hyresavtal för AI-driven analys av klausuler.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    premium: true,
  },
  {
    href: "/dashboard/brev",
    icon: Mail,
    title: "Brevgenerator",
    description: "Generera juridiskt korrekta brev för hyreshöjning, reparationskrav m.m.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-5 w-5 text-[#1a56a0]" />
          <h1 className="text-2xl font-bold text-gray-900">Välkommen till Hyresrättskollen</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Din hyresrätt. Dina rättigheter. Ditt skydd. — Välj ett verktyg nedan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ href, icon: Icon, title, description, color, bg, premium }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col gap-3 p-5 bg-white border border-gray-200 rounded-xl hover:border-[#1a56a0] hover:shadow-md transition-all"
          >
            {premium && (
              <span className="absolute top-3 right-3 text-[10px] font-semibold bg-[#1a56a0] text-white px-2 py-0.5 rounded-full">
                PREMIUM
              </span>
            )}
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-[#1a56a0] mt-auto">
              Öppna <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-5 bg-[#e6f1fb] border border-[#1a56a0]/20 rounded-xl">
        <h3 className="font-semibold text-[#1a56a0] mb-1">Om Hyresrättskollen</h3>
        <p className="text-sm text-[#1a56a0]/80">
          Sverige har 1,6 miljoner hyresgäster. Många känner inte till sina rättigheter.
          Hyresrättskollen är ett informationsverktyg som hjälper dig förstå Jordabalken —
          utan att ersätta juridisk rådgivning.
        </p>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
