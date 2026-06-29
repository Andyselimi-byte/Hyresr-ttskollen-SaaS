"use client";
import { useEffect, useState } from "react";
import { Lock, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface PremiumGateProps {
  children: React.ReactNode;
  featureName: string;
}

const PACKAGES = [
  { credits: 5,  price: 79,  label: "Bas",      highlight: false },
  { credits: 10, price: 129, label: "Standard",  highlight: true  },
  { credits: 25, price: 199, label: "Premium",   highlight: false },
];

export function PremiumGate({ children, featureName }: PremiumGateProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCredits(0); return; }
      const { data } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();
      setCredits(data?.credits ?? 0);
    }
    check();
  }, []);

  if (credits === null) {
    return <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Laddar...</div>;
  }

  if (credits > 0) return <>{children}</>;

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setShowModal(true)}>
        <div className="pointer-events-none opacity-30 select-none blur-sm">{children}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e6f1fb] mb-3">
            <Lock className="h-7 w-7 text-[#1a56a0]" />
          </div>
          <p className="text-base font-semibold text-gray-900">Premium-funktion</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">Köp uppladdningar för att använda {featureName}</p>
          <button className="bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#0c447c] transition-colors">
            Köp uppladdningar
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e6f1fb] mb-4">
                <Crown className="h-8 w-8 text-[#1a56a0]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Köp uppladdningar</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Välj ett paket för att använda {featureName}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {PACKAGES.map(pkg => (
                <button
                  key={pkg.credits}
                  onClick={() => { window.location.href = `/api/stripe/checkout?pkg=${pkg.credits}`; }}
                  className={`rounded-xl p-4 text-center border-2 transition-all hover:shadow-md ${
                    pkg.highlight
                      ? "border-[#1a56a0] bg-[#e6f1fb]"
                      : "border-gray-200 hover:border-[#1a56a0]"
                  }`}
                >
                  {pkg.highlight && (
                    <span className="text-[10px] font-bold text-white bg-[#1a56a0] px-2 py-0.5 rounded-full block mb-2">
                      POPULÄR
                    </span>
                  )}
                  <p className="text-2xl font-bold text-gray-900">{pkg.credits}</p>
                  <p className="text-xs text-gray-500 mb-2">uppladdningar</p>
                  <p className="text-lg font-bold text-[#1a56a0]">{pkg.price} kr</p>
                  <p className="text-[10px] text-gray-400">{Math.round(pkg.price / pkg.credits)} kr/st</p>
                </button>
              ))}
            </div>

            <div className="space-y-1.5 mb-5">
              {["AI-avtalsanalys", "Brevgenerering", "Giltiga i 1 år"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold">✓</span> {f}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
