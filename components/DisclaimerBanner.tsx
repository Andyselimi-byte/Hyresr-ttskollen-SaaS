"use client";
import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="flex gap-2 text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 mt-4">
      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <span>
        Hyresrättskollen är en informationstjänst och utgör inte juridisk rådgivning.
        Informationen är AI-genererad, baseras på 12 kap. JB (Jordabalken) och SCB-statistik,
        och kan innehålla fel. Vi lämnar inga garantier för att analysen är fullständig eller korrekt,
        och ansvarar inte för beslut som fattas utifrån den.
        Vid specifika tvister rekommenderas kontakt med jurist, Hyresgästföreningen eller Hyresnämnden.
      </span>
    </div>
  );
}
