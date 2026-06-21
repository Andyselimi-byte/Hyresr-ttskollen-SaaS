import Link from "next/link";
import { Shield } from "lucide-react";

export default function IntegritetspolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Shield className="h-5 w-5 text-[#1a56a0]" />
          <span className="font-bold text-[#1a56a0]">Hyresrättskollen</span>
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12 prose prose-gray">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Integritetspolicy</h1>
        <p className="text-sm text-gray-500 mb-8">Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Personuppgiftsansvarig</h2>
          <p className="text-gray-700">
            Hyresrättskollen ansvarar för behandlingen av dina personuppgifter.
            Kontakta oss på <a href="mailto:support@hyresrattskollen.se" className="text-[#1a56a0]">support@hyresrattskollen.se</a> vid frågor.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Vilka uppgifter vi samlar in</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li><strong>E-postadress</strong> — för att skapa och hantera ditt konto</li>
            <li><strong>Betalningsinformation</strong> — hanteras av Stripe, vi lagrar aldrig kortnummer</li>
            <li><strong>Uppladdade dokument</strong> — hyresavtal du väljer att ladda upp för analys</li>
            <li><strong>Användningsdata</strong> — anonymiserad statistik om hur tjänsten används</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Varför vi behandlar dina uppgifter</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>För att tillhandahålla tjänsten och ditt konto (avtalsgrund)</li>
            <li>För att hantera betalningar och prenumerationer (avtalsgrund)</li>
            <li>För att skicka viktiga meddelanden om tjänsten (berättigat intresse)</li>
            <li>För att förbättra tjänsten (berättigat intresse)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Hur länge vi sparar uppgifter</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Kontouppgifter — så länge kontot är aktivt</li>
            <li>Uppladdade avtal — raderas automatiskt efter 30 dagar</li>
            <li>Betalningshistorik — 7 år (bokföringskrav)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Dina rättigheter (GDPR)</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Rätt att få tillgång till dina uppgifter</li>
            <li>Rätt att rätta felaktiga uppgifter</li>
            <li>Rätt att radera ditt konto och alla uppgifter</li>
            <li>Rätt att invända mot behandling</li>
            <li>Rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY)</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Kontakta oss på <a href="mailto:support@hyresrattskollen.se" className="text-[#1a56a0]">support@hyresrattskollen.se</a> för att utöva dina rättigheter.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Tredjeparter</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li><strong>Supabase</strong> — databas och autentisering (EU-servrar)</li>
            <li><strong>Stripe</strong> — betalningshantering</li>
            <li><strong>Anthropic</strong> — AI-analys av avtal (data skickas ej vidare)</li>
            <li><strong>Vercel</strong> — hosting (EU-region)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
          <p className="text-gray-700">
            Vi använder enbart nödvändiga cookies för inloggning och sessionshantering.
            Vi använder inga spårningscookies eller reklamcookies.
          </p>
        </section>
      </div>
    </div>
  );
}
