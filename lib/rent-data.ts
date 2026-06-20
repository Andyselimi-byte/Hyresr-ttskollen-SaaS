import type { RentInput, RentResult } from "@/types";

export const REFERENCE_RENTS: Record<string, Record<number, number>> = {
  Stockholm:    { 1: 6200, 2: 7800, 3: 9600, 4: 13200 },
  Göteborg:     { 1: 5500, 2: 7000, 3: 8600, 4: 11800 },
  Malmö:        { 1: 4800, 2: 6100, 3: 7600, 4: 10200 },
  Uppsala:      { 1: 5200, 2: 6800, 3: 8200, 4: 11000 },
  "Annan stad": { 1: 4500, 2: 5800, 3: 7100, 4: 9500  },
};

export const CITIES = Object.keys(REFERENCE_RENTS);

// Reference rents above are based on 50 m². Scale proportionally.
const BASE_AREA = 50;

export function analyzeRent(input: RentInput): RentResult {
  const cityRents = REFERENCE_RENTS[input.city] ?? REFERENCE_RENTS["Annan stad"];
  const rooms = Math.min(Math.max(input.rooms, 1), 4);
  const baseRent = cityRents[rooms];
  const referenceRent = Math.round(baseRent * (input.area / BASE_AREA));
  const difference = input.currentRent - referenceRent;
  const differencePercent = Math.round((difference / referenceRent) * 100);

  let status: RentResult["status"];
  let label: string;

  if (differencePercent <= 5) {
    status = "ok";
    label = "Hyran ser rimlig ut";
  } else if (differencePercent <= 15) {
    status = "warn";
    label = "Något över snittet";
  } else {
    status = "danger";
    label = "Potentiellt för hög hyra — kan prövas i Hyresnämnden";
  }

  return { currentRent: input.currentRent, referenceRent, difference, differencePercent, status, label };
}
