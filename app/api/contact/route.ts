import { NextRequest, NextResponse } from "next/server";

const SUPPORT_TO = "support@hyresrättskollen.se";
// Resend kräver en avsändare på en verifierad domän. Tills domänen verifierats
// kan onboarding@resend.dev användas för test.
const SUPPORT_FROM = process.env.CONTACT_FROM ?? "Hyresrättskollen <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, botAnswer } = await request.json() as {
      name?: string; email?: string; subject?: string; message?: string; botAnswer?: string;
    };

    if (!email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "E-post och meddelande krävs." }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Meddelandet är för långt." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Ingen mejltjänst konfigurerad än — logga och svara tydligt
      console.error("[contact] RESEND_API_KEY saknas — meddelande kunde inte skickas");
      return NextResponse.json(
        { error: "E-postfunktionen är inte aktiverad än. Mejla oss direkt på support@hyresrättskollen.se." },
        { status: 503 }
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const html = `
      <h2>Nytt meddelande via Hyresrättskollen</h2>
      <p><strong>Namn:</strong> ${escapeHtml(name ?? "—")}</p>
      <p><strong>E-post:</strong> ${escapeHtml(email)}</p>
      <p><strong>Ämne:</strong> ${escapeHtml(subject ?? "—")}</p>
      <hr />
      <p><strong>Meddelande:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      ${botAnswer ? `<hr /><p><strong>Chatbotens svar (som användaren inte ansåg räckte):</strong></p><p>${escapeHtml(botAnswer).replace(/\n/g, "<br />")}</p>` : ""}
    `;

    const { error } = await resend.emails.send({
      from: SUPPORT_FROM,
      to: SUPPORT_TO,
      replyTo: email,
      subject: `[Kontakt] ${subject || "Nytt meddelande"} — ${name || email}`,
      html,
    });

    if (error) {
      console.error("[contact] Resend-fel:", error);
      return NextResponse.json({ error: "Kunde inte skicka meddelandet. Försök igen senare." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Något gick fel. Försök igen." }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
