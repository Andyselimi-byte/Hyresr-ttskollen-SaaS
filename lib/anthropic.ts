import Anthropic from "@anthropic-ai/sdk";
import type { ContractAnalysis } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4000,
    system: `Du är ett juridiskt informationsverktyg för svenska hyresgäster.
Din uppgift är att granska hyresavtal och identifiera klausuler som hyresgästen
bör uppmärksamma — som information, INTE som juridisk rådgivning.

REGLER:
- Formulera alltid fynd som "Enligt 12 kap. X § JB..." eller "Klausulen avviker från..."
- Säg ALDRIG "Du bör göra X" eller "Du har rätt till X" i bestämd form
- Citera alltid lagstöd (JB-paragraf) för varje observation
- Returnera ALLTID JSON i formatet nedan
- Bedöm varje klausul som: "ok", "warn" eller "flag"

JSON-format:
{
  "clauses": [
    {
      "title": "Klausulens namn",
      "status": "ok" | "warn" | "flag",
      "finding": "Vad klausulen säger",
      "information": "Relevant information från hyreslagen",
      "lawRef": "12 kap. X § JB"
    }
  ],
  "summary": "Kort sammanfattning av analysen"
}`,
    messages: [{
      role: "user",
      content: `Granska detta hyresavtal och returnera JSON:\n\n${contractText}`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Ogiltigt svar från AI-tjänsten");
  try {
    return JSON.parse(jsonMatch[0]) as ContractAnalysis;
  } catch {
    // Try to extract partial JSON
    const cleaned = jsonMatch[0]
      .replace(/,\s*([}\]])/g, "$1")
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":');
    return JSON.parse(cleaned) as ContractAnalysis;
  }
}

export async function askQuestion(question: string, context?: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1000,
    system: `Du är ett juridiskt informationsverktyg för svenska hyresgäster.
Svara på frågor om hyresrätt baserat på 12 kap. Jordabalken (JB).
Formulera alltid svar som information och hänvisa till lagrum.
Ge ALDRIG personliga juridiska råd. Svara på svenska.`,
    messages: [{
      role: "user",
      content: context ? `Kontext: ${context}\n\nFråga: ${question}` : question,
    }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
