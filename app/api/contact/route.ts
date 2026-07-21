import { NextRequest, NextResponse } from "next/server";

// Mottagare — dit kontaktmeddelanden skickas
const SUPPORT_TO = process.env.CONTACT_TO ?? "support@hyresrättskollen.se";

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

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.error("[contact] SMTP-uppgifter saknas i miljövariabler");
      return NextResponse.json(
        { error: "E-postfunktionen är inte aktiverad än. Mejla oss direkt på support@hyresrättskollen.se." },
        { status: 503 }
      );
    }

    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: true, // SSL/TLS på port 465
      auth: { user, pass },
    });

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

    try {
      await transporter.sendMail({
        from: `"Hyresrättskollen" <${user}>`,
        to: SUPPORT_TO,
        replyTo: email,
        subject: `[Kontakt] ${subject || "Nytt meddelande"} — ${name || email}`,
        html,
      });
    } catch (mailErr) {
      console.error("[contact] SMTP-fel:", mailErr instanceof Error ? mailErr.message : mailErr);
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
