"use client";
import { useState } from "react";
import { Lock } from "lucide-react";

interface PremiumGateProps {
  children: React.ReactNode;
  isPremium: boolean;
  featureName: string;
}

export function PremiumGate({ children, isPremium, featureName }: PremiumGateProps) {
  const [showModal, setShowModal] = useState(false);

  if (isPremium) return <>{children}</>;

  return (
    <>
      <div
        className="relative cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <div className="pointer-events-none opacity-40 select-none">{children}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg">
          <Lock className="h-8 w-8 text-[#1a56a0] mb-2" />
          <p className="text-sm font-medium text-gray-700">Premium-funktion</p>
          <p className="text-xs text-gray-500 mt-1">Klicka för att uppgradera</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e6f1fb] mb-4">
                <Lock className="h-8 w-8 text-[#1a56a0]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Premium krävs</h2>
              <p className="text-gray-600 mt-2">
                {featureName} är en Premium-funktion. Uppgradera för att få tillgång.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> Obegränsad avtalsanalys med AI
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> Obegränsad hyresanalys
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> Obegränsad brevgenerering
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> Prioriterad support
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border-2 border-[#1a56a0] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#1a56a0]">79 kr</p>
                <p className="text-xs text-gray-500">per månad</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                <p className="text-2xl font-bold text-gray-700">758 kr</p>
                <p className="text-xs text-gray-500">per år (spara 20%)</p>
              </div>
            </div>

            <button
              onClick={() => { window.location.href = "/api/stripe/checkout"; }}
              className="w-full bg-[#1a56a0] hover:bg-[#0c447c] text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Uppgradera till Premium
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
