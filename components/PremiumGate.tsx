"use client";
import { useEffect, useState } from "react";
import { Lock, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface PremiumGateProps {
  children: React.ReactNode;
  featureName: string;
}

export function PremiumGate({ children, featureName }: PremiumGateProps) {
  const [status, setStatus] = useState<"loading" | "free" | "premium">("loading");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus("free"); return; }
      const { data } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single();
      setStatus(data?.subscription_status === "active" ? "premium" : "free");
    }
    check();
  }, []);

  if (status === "loading") {
    return <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Laddar...</div>;
  }

  if (status === "premium") return <>{children}</>;

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setShowModal(true)}>
        <div className="pointer-events-none opacity-30 select-none blur-sm">{children}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e6f1fb] mb-3">
            <Lock className="h-7 w-7 text-[#1a56a0]" />
          </div>
          <p className="text-base font-semibold text-gray-900">Premium-funktion</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">Uppgradera för att använda {featureName}</p>
          <button className="bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#0c447c] transition-colors">
            Lås upp — 79 kr/mån
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
              <h2 className="text-xl font-bold text-gray-900">Uppgradera till Premium</h2>
              <p className="text-gray-500 mt-2 text-sm">
                {featureName} kräver ett Premium-konto.
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {["Obegränsad AI-avtalsanalys", "Obegränsad hyresanalys", "Obegränsad brevgenerering", "Prioriterad support"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500 font-bold">✓</span> {f}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
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
              Uppgradera nu
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
