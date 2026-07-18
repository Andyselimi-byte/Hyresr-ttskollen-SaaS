"use client";
import { X, Check, Crown, Zap } from "lucide-react";

const PACKAGES = [
  { pkg: "1",  credits: 1,  price: 79,  label: "Bas",      desc: "Perfekt för att prova", highlight: false },
  { pkg: "3",  credits: 3,  price: 129, label: "Standard",  desc: "Mest populärt",         highlight: true  },
  { pkg: "5",  credits: 5,  price: 199, label: "Premium",   desc: "Bäst värde per upload", highlight: false },
];

const INCLUDED = [
  "AI-avtalsgranskning (PDF)",
  "AI-brevgenerator",
  "Riskbedömning + rekommendationer",
  "Ladda ner som PDF",
];

interface Props {
  onClose: () => void;
}

export function PricingModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#1a56a0] to-[#0c447c] px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-300" />
              <span className="font-bold text-lg">Köp uppladdningar</span>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-white/75">Välj ett paket — credits används för avtalsgranskning och brevgenerator.</p>
        </div>

        {/* Packages */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {PACKAGES.map(p => (
              <a
                key={p.pkg}
                href={`/api/stripe/checkout?pkg=${p.pkg}`}
                className={`relative flex flex-col items-center text-center rounded-2xl border-2 p-4 transition-all hover:shadow-lg ${
                  p.highlight
                    ? "border-[#1a56a0] bg-[#f0f6ff] shadow-md"
                    : "border-gray-200 hover:border-[#1a56a0]"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a56a0] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                    POPULÄR
                  </div>
                )}
                <p className="font-bold text-gray-900 mb-0.5">{p.label}</p>
                <p className="text-xs text-gray-400 mb-3">{p.desc}</p>
                <p className="text-3xl font-bold text-gray-900 mb-0.5">{p.price} <span className="text-base font-normal text-gray-400">kr</span></p>
                <p className="text-xs text-gray-500 mb-4">{p.credits} uppladdningar</p>
                <div className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
                  p.highlight
                    ? "bg-[#1a56a0] text-white hover:bg-[#0c447c]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                  Välj {p.label}
                </div>
              </a>
            ))}
          </div>

          {/* What's included */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-[#1a56a0]" />
              <p className="text-sm font-semibold text-gray-700">Ingår i alla paket</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INCLUDED.map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Credits förfaller inte. Säker betalning via Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
