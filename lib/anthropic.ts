import Anthropic from "@anthropic-ai/sdk";
import type { ContractAnalysis } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 6000,
    system: `Du är ett juridiskt informationsverktyg för svenska hyresgäster specialiserat på 12 kap. Jordabalken (JB).
Granska hyresavtal NOGGRANT och returnera ENDAST giltig JSON utan annan text.

Analysera och hitta:
- Olagliga klausuler som strider mot 12 kap. JB (status: "flag")
- Oskäliga eller tveksamma villkor (status: "warn")
- Normala och godkända klausuler (status: "ok")
- Saknade skydd som borde finnas
- Ovanliga eller ensidiga villkor

Format (max 15 klausuler):
{"clauses":[{"title":"string","status":"ok|warn|flag","finding":"string (max 150 tecken)","information":"string (max 200 tecken)","lawRef":"string"}],"summary":"string (2-3 meningar om avtalet totalt)","riskLevel":"low|medium|high","recommendations":["string","string"]}

Viktiga lagrum att kontrollera:
- Besittningsskydd (46 §)
- Hyreshöjning och bruksvärde (55 §)
- Underhållsansvar (15 §)
- Andrahandsuthyrning (40 §)
- Störningar (25 §)
- Hyresvärdens tillträde (26 §)
- Depositionsregler
- Uppsägningstider (4-5 §)`,
    messages: [{
      role: "user",
      content: `Granska detta hyresavtal grundligt och identifiera alla viktiga klausuler, problem och rättigheter:\n\n${contractText.slice(0, 14000)}`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Ogiltigt svar från AI-tjänsten");

  let jsonStr = jsonMatch[0];

  // Remove trailing commas before ] or }
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

  // Try to parse, if fails truncate at last complete object
  try {
    return JSON.parse(jsonStr) as ContractAnalysis;
  } catch {
    // Find last complete clause by truncating at last }]
    const lastComplete = jsonStr.lastIndexOf("}]");
    if (lastComplete > 0) {
      const truncated = jsonStr.slice(0, lastComplete + 2) + ',"summary":"Analysen är ofullständig, försök igen."}';
      try {
        return JSON.parse(truncated) as ContractAnalysis;
      } catch {
        throw new Error("Kunde inte tolka AI-svaret");
      }
    }
    throw new Error("Kunde inte tolka AI-svaret");
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
