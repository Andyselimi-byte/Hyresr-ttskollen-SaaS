"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Shield } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hej! Jag är din hyresrättsassistent. Ställ en fråga om din hyra, ditt avtal eller dina rättigheter som hyresgäst." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function handleSend() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.answer ?? "Något gick fel. Försök igen." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Kunde inte ansluta. Kontrollera din internetanslutning." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{ width: 340, height: 480, background: "#fff", border: "1px solid #e5e7eb" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: "#0f172a" }}>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" style={{ color: "#60a5fa" }} />
              <span className="text-sm font-semibold text-white">Hyresrättsassistenten</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#1a56a0", color: "#fff" }}>GRATIS</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: "#f8faff" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="text-sm leading-relaxed rounded-2xl px-3 py-2 max-w-[85%]"
                  style={m.role === "user"
                    ? { background: "#1a56a0", color: "#fff", borderBottomRightRadius: 4 }
                    : { background: "#fff", color: "#1e293b", border: "1px solid #e5e7eb", borderBottomLeftRadius: 4 }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="text-sm px-3 py-2 rounded-2xl" style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#94a3b8" }}>
                  Skriver...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-1.5 text-center shrink-0" style={{ background: "#f0f6ff", borderTop: "1px solid #e5e7eb" }}>
            <p className="text-[10px]" style={{ color: "#94a3b8" }}>Ej juridisk rådgivning • Baserat på 12 kap. Jordabalken</p>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 shrink-0" style={{ background: "#fff", borderTop: "1px solid #e5e7eb" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Skriv din fråga..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] bg-gray-50"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
              style={{ background: "#1a56a0" }}
            >
              <Send className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ background: "#1a56a0" }}
        aria-label="Öppna chatt"
      >
        {open ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
      </button>
    </>
  );
}
