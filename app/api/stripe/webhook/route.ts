import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "placeholder");
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const credits = parseInt(session.metadata?.credits ?? "0", 10);

      if (userId && credits > 0) {
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", userId)
          .single();

        const currentCredits = data?.credits ?? 0;
        await supabase
          .from("profiles")
          .update({ credits: currentCredits + credits })
          .eq("id", userId);
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe-webhook]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
