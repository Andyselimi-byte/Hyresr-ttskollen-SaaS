"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield, Mail, Clock, CheckCircle, ArrowRight, MessageSquare, HelpCircle, Sparkles, Send } from "lucide-react";

type Step = "form" | "botAnswer" | "sent" | "resolved";

export default function KontaktPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [botAnswer, setBotAnswer] = useState("");
  const [error, setError] = useState("");

  function reset() {
    setForm({ name: "", email: "", subject: "", message: "" });
    setBotAnswer("");
    setError("");
    setStep("form");
  }

  // Steg 1: fråga chatboten först
  async function handleAskBot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: form.message }),
      });
      const data = await res.json();
      setBotAnswer(data.answer ?? "Jag kunde tyvärr inte besvara din fråga just nu.");
      setStep("botAnswer");
    } catch {
      // Om boten strular, gå direkt till att skicka till oss
      setStep("botAnswer");
      setBotAnswer("");
    } finally {
      setLoading(false);
    }
  }

  // Steg 2b: användaren nöjd med botens svar
  function handleResolved() {
    setStep("resolved");
  }

  // Steg 2a: skicka vidare till oss
  async function handleSendToUs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, botAnswer }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Kunde inte skicka meddelandet.");
      } else {
        setStep("sent");
      }
    } catch {
      setError("Kunde inte skicka meddelandet. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#1a56a0]" />
            <span className="font-bold text-[#1a56a0]">Hyresrättskollen</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 font-medium">FAQ</Link>
            <Link href="/auth/register" className="bg-[#1a56a0] hover:bg-[#0c447c] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              Kom igång gratis
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Kontakta oss</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Har du frågor om din hyra, dina rättigheter eller tjänsten? Vi hjälper dig gärna.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left */}
          <div>
            <div className="space-y-5 mb-10">
              {[
                {
                  icon: Mail,
                  title: "E-post",
                  desc: "support@hyresrattskollen.se",
                  sub: "Svarar inom 1–2 arbetsdagar",
                },
                {
                  icon: Clock,
                  title: "Svarstid",
                  desc: "Mån–Fre, 09:00–17:00",
                  sub: "Helger svarar vi nästa vardag",
                },
                {
                  icon: MessageSquare,
                  title: "Vanliga frågor",
                  desc: "Kolla FAQ-sidan först",
                  sub: "Många svar finns redan där",
                  href: "/faq",
                },
              ].map(item => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#1a56a0] transition-colors">
                    <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#e6f1fb]">
                      <Icon className="h-5 w-5 text-[#1a56a0]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-sm text-[#1a56a0] font-medium">{item.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                );
                return item.href
                  ? <Link key={item.title} href={item.href}>{content}</Link>
                  : <div key={item.title}>{content}</div>;
              })}
            </div>

            <div className="bg-[#f0f6ff] border border-[#1a56a0]/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-[#1a56a0] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Juridisk hjälp</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Hyresrättskollen ger inte juridisk rådgivning. För tvister,
                    kontakta <strong>Hyresnämnden</strong> (kostnadsfritt) eller{" "}
                    <strong>Hyresgästföreningen</strong> för rättshjälp.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-7">
            {step === "sent" && (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h2 className="font-bold text-gray-900 text-lg mb-2">Meddelande skickat!</h2>
                <p className="text-sm text-gray-500 mb-6">Vi återkommer inom 1–2 arbetsdagar.</p>
                <button onClick={reset} className="text-sm text-[#1a56a0] hover:underline">
                  Skicka ett nytt meddelande
                </button>
              </div>
            )}

            {step === "resolved" && (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h2 className="font-bold text-gray-900 text-lg mb-2">Vad kul att det löste sig!</h2>
                <p className="text-sm text-gray-500 mb-6">Hör av dig igen om du undrar något mer.</p>
                <button onClick={reset} className="text-sm text-[#1a56a0] hover:underline">
                  Ställ en ny fråga
                </button>
              </div>
            )}

            {step === "botAnswer" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#1a56a0]" />
                  <h2 className="font-bold text-gray-900 text-lg">Vår assistent svarar</h2>
                </div>
                <div className="bg-[#f8faff] border border-[#1a56a0]/15 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {botAnswer || "Assistenten kunde inte svara just nu — vill du skicka frågan till oss istället?"}
                </div>
                <p className="text-[11px] text-gray-400">Automatiskt svar — inte juridisk rådgivning.</p>

                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

                <div className="pt-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">Löste detta din fråga?</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleResolved}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" /> Ja, tack!
                    </button>
                    <button
                      onClick={handleSendToUs}
                      disabled={loading}
                      className="flex-1 bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? "Skickar..." : <><Send className="h-4 w-4" /> Nej, skicka till er</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "form" && (
              <>
                <h2 className="font-bold text-gray-900 text-lg mb-1">Ställ din fråga</h2>
                <p className="text-xs text-gray-500 mb-5">Vår assistent svarar direkt — räcker inte svaret skickas frågan vidare till oss.</p>
                <form onSubmit={handleAskBot} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Namn</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Anna Andersson"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">E-post</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="anna@example.com"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ämne</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] bg-white"
                    >
                      <option value="">Välj ett ämne...</option>
                      <option>Fråga om hyresanalys</option>
                      <option>Fråga om avtalsgranskning</option>
                      <option>Problem med betalning</option>
                      <option>Tekniskt problem</option>
                      <option>Annan fråga</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Din fråga</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Beskriv din fråga eller ditt problem..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? "Frågar assistenten..." : <><Sparkles className="h-4 w-4" /> Fråga assistenten</>}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Du kan också maila direkt till{" "}
                    <a href="mailto:support@hyresrattskollen.se" className="text-[#1a56a0] hover:underline">
                      support@hyresrattskollen.se
                    </a>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
