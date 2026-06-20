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
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const status = sub.status === "active" ? "premium" : "free";
        await supabase
          .from("profiles")
          .update({ subscription_status: status })
          .eq("stripe_customer_id", customerId);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("profiles")
          .update({ subscription_status: "free" })
          .eq("stripe_customer_id", sub.customer as string);
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe-webhook]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
