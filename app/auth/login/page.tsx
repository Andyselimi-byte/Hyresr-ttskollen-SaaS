"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Felaktigt e-post eller lösenord. Försök igen.");
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  }

  async function handleMagicLink() {
    if (!email) { setError("Ange din e-postadress först."); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
    });
    if (error) {
      setError("Kunde inte skicka magic link. Försök igen.");
    } else {
      setMagicSent(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Logga in</h1>
          <p className="text-gray-500 text-sm mt-1">Välkommen tillbaka</p>
        </div>

        {magicSent ? (
          <div className="bg-[#eaf3de] border border-[#97c459] rounded-xl p-5 text-center">
            <p className="font-semibold text-[#27500a] mb-1">Kolla din inbox!</p>
            <p className="text-sm text-[#27500a]/80">
              Vi har skickat en inloggningslänk till {email}.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <form onSubmit={handleLogin} className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lösenord</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                {loading ? "Loggar in..." : "Logga in"}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">eller</div>
            </div>

            <button
              onClick={handleMagicLink}
              disabled={loading}
              className="w-full border border-gray-300 hover:border-[#1a56a0] text-gray-700 hover:text-[#1a56a0] font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Skicka magic link
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Inget konto?{" "}
          <Link href="/auth/register" className="text-[#1a56a0] hover:underline font-medium">
            Registrera dig gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
