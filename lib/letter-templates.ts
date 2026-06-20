import type { LetterTemplate } from "@/types";

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: "bestrida-hyreshojning",
    name: "Bestrida hyreshöjning",
    icon: "TrendingUp",
    description: "Protestera mot oskälig hyreshöjning",
    fields: [
      { key: "hyresvardNamn", label: "Hyresvärdens namn/bolag", placeholder: "AB Fastigheter" },
      { key: "din_adress", label: "Din adress", placeholder: "Storgatan 1, 111 11 Stockholm" },
      { key: "nuvarandeHyra", label: "Nuvarande hyra (kr/mån)", placeholder: "8500" },
      { key: "nyHyra", label: "Ny aviserad hyra (kr/mån)", placeholder: "9200" },
      { key: "ikrafttradandeDatum", label: "Ikraftträdandedatum", placeholder: "2025-04-01", type: "date" },
    ],
    template: (f) => `Till: ${f.hyresvardNamn}
Datum: ${new Date().toLocaleDateString("sv-SE")}
Ärende: Bestridande av aviserad hyreshöjning

Jag, [Ditt namn], boende på ${f.din_adress}, bestrider er aviserade hyreshöjning
från ${f.nuvarandeHyra} kr till ${f.nyHyra} kr per månad med ikraftträdande ${f.ikrafttradandeDatum}.

Jag begär att den föreslagna hyreshöjningen omprövas i enlighet med bruksvärdesprincipen
(12 kap. 55 § JB). Min nuvarande hyra bedöms som skälig i förhållande till jämförbara
lägenheter i området.

Om ni inte kan motivera höjningen med hänvisning till likvärdiga bostäders hyror
förbehåller jag mig rätten att ansöka om prövning i Hyresnämnden.

Jag önskar svar senast inom 14 dagar.

Med vänlig hälsning,
[Ditt namn]
[Telefon / e-post]`,
  },
  {
    id: "andrahand-ansokan",
    name: "Ansök andrahandsuthyrning",
    icon: "Users",
    description: "Begäran om tillstånd att hyra ut",
    fields: [
      { key: "hyresvardNamn", label: "Hyresvärdens namn/bolag", placeholder: "AB Fastigheter" },
      { key: "din_adress", label: "Din adress", placeholder: "Storgatan 1, 111 11 Stockholm" },
      { key: "startDatum", label: "Startdatum", placeholder: "2025-03-01", type: "date" },
      { key: "slutDatum", label: "Slutdatum", placeholder: "2025-08-31", type: "date" },
      { key: "skal", label: "Skäl för andrahandsuthyrning", placeholder: "arbete på annan ort", type: "textarea" },
      { key: "andrahandsgastNamn", label: "Tilltänkt andrahandsgäst", placeholder: "Anna Svensson" },
    ],
    template: (f) => `Till: ${f.hyresvardNamn}
Datum: ${new Date().toLocaleDateString("sv-SE")}
Ärende: Ansökan om tillstånd för andrahandsuthyrning

Jag, [Ditt namn], boende på ${f.din_adress}, ansöker härmed om tillstånd att hyra ut
min lägenhet i andra hand under perioden ${f.startDatum}–${f.slutDatum}.

Skälet till min ansökan är ${f.skal}.

Den tilltänkte andrahandshyresgästen är ${f.andrahandsgastNamn}. Uthyrning sker till
en hyra som inte överstiger min egna hyra.

Enligt 12 kap. 40 § JB har jag rätt att ansöka om tillstånd, och en vägran ska
motiveras. Om tillstånd inte beviljas inom 4 veckor avser jag ansöka om prövning
i Hyresnämnden.

Med vänlig hälsning,
[Ditt namn]
[Telefon / e-post]`,
  },
  {
    id: "krav-reparation",
    name: "Kräv reparation",
    icon: "Wrench",
    description: "Fel eller brist i lägenheten",
    fields: [
      { key: "hyresvardNamn", label: "Hyresvärdens namn/bolag", placeholder: "AB Fastigheter" },
      { key: "din_adress", label: "Din adress", placeholder: "Storgatan 1, 111 11 Stockholm" },
      { key: "felBeskrivning", label: "Beskrivning av felet", placeholder: "Läckande kran i badrummet...", type: "textarea" },
      { key: "felDatum", label: "Datum felet uppkom", placeholder: "2025-01-15", type: "date" },
      { key: "atgardsFrist", label: "Begärd åtgärdsfrist", placeholder: "2025-02-15", type: "date" },
    ],
    template: (f) => `Till: ${f.hyresvardNamn}
Datum: ${new Date().toLocaleDateString("sv-SE")}
Ärende: Krav på åtgärd av fel och brist i lägenheten

Jag, [Ditt namn], boende på ${f.din_adress}, uppmärksammar Er på följande fel
som uppkommit ${f.felDatum}:

${f.felBeskrivning}

Enligt 12 kap. 15 § JB ansvarar hyresvärden för att lägenheten hålls i gott
bruksskick under hela hyrestiden. Jag begär att felet åtgärdas senast
${f.atgardsFrist}.

Om åtgärd inte sker förbehåller jag mig rätten att kräva hyresnedsättning och
att anmäla ärendet till Hyresnämnden.

Med vänlig hälsning,
[Ditt namn]
[Telefon / e-post]`,
  },
  {
    id: "protestera-klausul",
    name: "Protestera mot klausul",
    icon: "FileText",
    description: "Ifrågasätt avtalsinskränkning",
    fields: [
      { key: "hyresvardNamn", label: "Hyresvärdens namn/bolag", placeholder: "AB Fastigheter" },
      { key: "din_adress", label: "Din adress", placeholder: "Storgatan 1, 111 11 Stockholm" },
      { key: "klausulBeskrivning", label: "Klausulens lydelse", placeholder: "Hyresgäst äger ej rätt att...", type: "textarea" },
      { key: "lagstod", label: "Lagstöd (JB-paragraf)", placeholder: "12 kap. 40 §" },
    ],
    template: (f) => `Till: ${f.hyresvardNamn}
Datum: ${new Date().toLocaleDateString("sv-SE")}
Ärende: Ifrågasättande av avtalsklausul

Jag, [Ditt namn], boende på ${f.din_adress}, uppmärksammar Er på att
mitt hyresavtal innehåller följande klausul: "${f.klausulBeskrivning}".

Enligt ${f.lagstod} (JB) är sådana avtalsklausuler utan verkan i den mån de
inskränker mina lagstadgade rättigheter som hyresgäst. Hyreslagen är tvingande
till hyresgästens förmån och kan inte avtalas bort.

Jag förväntar mig att Ni respekterar mina lagstadgade rättigheter.

Med vänlig hälsning,
[Ditt namn]
[Telefon / e-post]`,
  },
];
