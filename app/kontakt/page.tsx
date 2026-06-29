"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield, Mail, Clock, CheckCircle, ArrowRight, MessageSquare, HelpCircle } from "lucide-react";

export default function KontaktPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
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
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h2 className="font-bold text-gray-900 text-lg mb-2">Meddelande skickat!</h2>
                <p className="text-sm text-gray-500 mb-6">Vi återkommer inom 1–2 arbetsdagar.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="text-sm text-[#1a56a0] hover:underline"
                >
                  Skicka ett nytt meddelande
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-gray-900 text-lg mb-5">Skicka ett meddelande</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Meddelande</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Beskriv din fråga eller ditt problem..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? "Skickar..." : <><span>Skicka meddelande</span> <ArrowRight className="h-4 w-4" /></>}
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
