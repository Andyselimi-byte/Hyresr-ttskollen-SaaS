"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Lösenordet måste vara minst 8 tecken."); return; }
    if (!agreed) { setError("Du måste godkänna användarvillkoren för att fortsätta."); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
    });
    if (error) {
      setError("Kunde inte skapa konto. E-posten kan redan vara registrerad.");
    } else {
      setSuccess(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Skapa konto</h1>
          <p className="text-gray-500 text-sm mt-1">Gratis — kom igång direkt</p>
        </div>

        {success ? (
          <div className="bg-[#eaf3de] border border-[#97c459] rounded-xl p-5 text-center">
            <p className="font-semibold text-[#27500a] mb-1">Konto skapat!</p>
            <p className="text-sm text-[#27500a]/80">
              Kontrollera din e-post ({email}) för att bekräfta ditt konto.
            </p>
            <Link
              href="/auth/login"
              className="inline-block mt-3 text-sm font-medium text-[#1a56a0] hover:underline"
            >
              Till inloggning →
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <form onSubmit={handleRegister} className="space-y-4">
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
                  placeholder="Minst 8 tecken"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-[#1a56a0]"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Jag har läst och godkänner{" "}
                  <Link href="/anvandarvillkor" target="_blank" className="text-[#1a56a0] underline">användarvillkoren</Link>
                  {" "}och{" "}
                  <Link href="/integritetspolicy" target="_blank" className="text-[#1a56a0] underline">integritetspolicyn</Link>.
                  Jag förstår att Hyresrättskollen är ett informationsverktyg och inte juridisk rådgivning.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                {loading ? "Skapar konto..." : "Skapa gratis konto"}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Har du redan ett konto?{" "}
          <Link href="/auth/login" className="text-[#1a56a0] hover:underline font-medium">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  );
}
