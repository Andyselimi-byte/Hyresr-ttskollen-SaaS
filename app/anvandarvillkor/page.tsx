import Link from "next/link";
import { Shield } from "lucide-react";

export default function AnvandarvillkorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Shield className="h-5 w-5 text-[#1a56a0]" />
          <span className="font-bold text-[#1a56a0]">Hyresrättskollen</span>
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Användarvillkor</h1>
        <p className="text-sm text-gray-500 mb-8">Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}</p>

        <div className="bg-[#faeeda] border border-[#ef9f27] rounded-xl p-5 mb-8">
          <p className="text-[#633806] font-semibold text-sm">
            ⚠️ Viktigt: Hyresrättskollen är en informationstjänst och utgör INTE juridisk rådgivning.
            All information baseras på 12 kap. Jordabalken och SCB-statistik.
            Vid specifika tvister ska du alltid kontakta en certifierad jurist eller Hyresnämnden.
          </p>
        </div>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Tjänsten</h2>
            <p>Hyresrättskollen tillhandahåller verktyg för svenska hyresgäster att:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Analysera sin hyra mot referensvärden</li>
              <li>Ta del av information om hyresgästers rättigheter</li>
              <li>Granska hyresavtal med AI-stöd</li>
              <li>Generera brevmallar</li>
            </ul>
            <p className="mt-3">Tjänsten är en informationstjänst och ersätter inte professionell juridisk rådgivning.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Konto och ansvar</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Du ansvarar för att hålla dina inloggningsuppgifter säkra</li>
              <li>Du får inte dela ditt konto med andra</li>
              <li>Du ansvarar för all aktivitet på ditt konto</li>
              <li>Du måste vara minst 18 år för att använda tjänsten</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Betalning och prenumeration</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Premium-prenumeration kostar 79 kr/månad eller 758 kr/år</li>
              <li>Betalning sker via Stripe med kortbetalning</li>
              <li>Prenumerationen förnyas automatiskt tills du avslutar</li>
              <li>Du kan avsluta när som helst — tillgång kvarstår till periodens slut</li>
              <li>Återbetalning beviljas inom 14 dagar från köp om tjänsten ej använts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Ansvarsbegränsning</h2>
            <p>Hyresrättskollen ansvarar inte för:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Beslut som fattas baserat på information från tjänsten</li>
              <li>Juridiska konsekvenser av att använda genererade brev</li>
              <li>Felaktigheter i AI-analysen av hyresavtal</li>
              <li>Förändringar i lagstiftning som inte återspeglas omedelbart</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Uppladdade dokument</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Dokument du laddar upp används enbart för att tillhandahålla analysen</li>
              <li>Vi säljer eller delar aldrig dina dokument med tredje part</li>
              <li>Uppladdade avtal raderas automatiskt efter 30 dagar</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Avsluta konto</h2>
            <p>
              Du kan när som helst begära radering av ditt konto och alla associerade uppgifter
              via e-post till{" "}
              <a href="mailto:support@hyresrattskollen.se" className="text-[#1a56a0]">
                support@hyresrattskollen.se
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Tillämplig lag</h2>
            <p>Dessa villkor regleras av svensk lag. Tvister avgörs i svensk domstol.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Kontakt</h2>
            <p>
              Frågor om användarvillkoren skickas till{" "}
              <a href="mailto:support@hyresrattskollen.se" className="text-[#1a56a0]">
                support@hyresrattskollen.se
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
