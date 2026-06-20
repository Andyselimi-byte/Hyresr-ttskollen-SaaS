import { NextRequest, NextResponse } from "next/server";
import { analyzeRent } from "@/lib/rent-data";
import type { RentInput } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RentInput;
    const { rooms, area, city, currentRent } = body;

    if (!rooms || !area || !city || !currentRent) {
      return NextResponse.json({ error: "Alla fält är obligatoriska." }, { status: 400 });
    }
    if (area < 10 || area > 500) {
      return NextResponse.json({ error: "Ange en rimlig area (10–500 m²)." }, { status: 400 });
    }
    if (currentRent < 500 || currentRent > 100000) {
      return NextResponse.json({ error: "Ange en rimlig hyra (500–100 000 kr)." }, { status: 400 });
    }

    const result = analyzeRent({ rooms, area, city, currentRent });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Något gick fel. Försök igen." }, { status: 500 });
  }
}
