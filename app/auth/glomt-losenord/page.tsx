"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function GlomtLosenordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/nytt-losenord`,
    });
    if (error) {
      setError("Kunde inte skicka återställningsmail. Kontrollera e-postadressen.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80">
            <Shield className="h-7 w-7 text-[#1a56a0]" />
            <span className="text-xl font-bold text-[#1a56a0]">Hyresrättskollen</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Glömt lösenord?</h1>
          <p className="text-gray-500 text-sm mt-1">Vi skickar en återställningslänk till din e-post</p>
        </div>

        {sent ? (
          <div className="bg-[#eaf3de] border border-[#97c459] rounded-xl p-5 text-center">
            <p className="font-semibold text-[#27500a] mb-1">Mail skickat!</p>
            <p className="text-sm text-[#27500a]/80">
              Kolla din e-post ({email}) och klicka på länken för att välja nytt lösenord.
            </p>
            <Link href="/auth/login" className="inline-block mt-3 text-sm font-medium text-[#1a56a0] hover:underline">
              Tillbaka till inloggning →
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-post</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="din@epost.se"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                {loading ? "Skickar..." : "Skicka återställningslänk"}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/auth/login" className="text-[#1a56a0] hover:underline font-medium">
            ← Tillbaka till inloggning
          </Link>
        </p>
      </div>
    </div>
  );
}
