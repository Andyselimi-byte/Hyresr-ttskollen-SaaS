"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { User, Mail, CreditCard, Trash2, AlertTriangle, CheckCircle, LogOut } from "lucide-react";

export default function ProfilPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm" | "deleting" | "done">("idle");
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();
      setCredits(profile?.credits ?? 0);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete() {
    if (deleteInput !== "RADERA") {
      setDeleteError("Skriv RADERA för att bekräfta.");
      return;
    }
    setDeleteStep("deleting");
    const res = await fetch("/api/auth/delete-account", { method: "DELETE" });
    if (res.ok) {
      setDeleteStep("done");
      setTimeout(() => router.push("/"), 2000);
    } else {
      const data = await res.json();
      setDeleteError(data.error ?? "Något gick fel. Försök igen.");
      setDeleteStep("confirm");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Laddar...
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-5 w-5 text-[#1a56a0]" />
          <h1 className="text-2xl font-bold text-gray-900">Min profil</h1>
        </div>
        <p className="text-sm text-gray-500">Kontoinformation och inställningar.</p>
      </div>

      {/* Kontoinformation */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm">Kontoinformation</h2>
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400">E-postadress</p>
            <p className="text-gray-700">{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <CreditCard className="h-4 w-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Credits kvar</p>
            <p className="text-gray-700">{credits} uppladdningar</p>
          </div>
        </div>
      </div>

      {/* Logga ut */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h2 className="font-semibold text-gray-900 text-sm mb-3">Session</h2>
        <a href="/api/auth/logout" className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition-colors">
          <LogOut className="h-4 w-4" /> Logga ut
        </a>
      </div>

      {/* Radera konto */}
      <div className="bg-white border border-red-200 rounded-xl p-5">
        <h2 className="font-semibold text-red-700 text-sm mb-1 flex items-center gap-2">
          <Trash2 className="h-4 w-4" /> Radera konto
        </h2>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Om du raderar ditt konto tas alla dina uppgifter bort permanent, inklusive oanvända credits.
          Åtgärden kan inte ångras.
        </p>

        {deleteStep === "idle" && (
          <button
            onClick={() => setDeleteStep("confirm")}
            className="text-sm text-red-600 border border-red-300 hover:bg-red-50 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Radera mitt konto
          </button>
        )}

        {deleteStep === "confirm" && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">
                Skriv <strong>RADERA</strong> nedan för att bekräfta att du vill ta bort ditt konto permanent.
              </p>
            </div>
            <input
              value={deleteInput}
              onChange={e => { setDeleteInput(e.target.value); setDeleteError(""); }}
              placeholder="RADERA"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {deleteError && <p className="text-xs text-red-600">{deleteError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="text-sm bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Bekräfta radering
              </button>
              <button
                onClick={() => { setDeleteStep("idle"); setDeleteInput(""); setDeleteError(""); }}
                className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        )}

        {deleteStep === "deleting" && (
          <p className="text-sm text-gray-500">Raderar konto...</p>
        )}

        {deleteStep === "done" && (
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle className="h-4 w-4" />
            Kontot är raderat. Du omdirigeras...
          </div>
        )}
      </div>
    </div>
  );
}
