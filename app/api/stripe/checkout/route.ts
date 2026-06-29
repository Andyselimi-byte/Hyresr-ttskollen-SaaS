import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const PACKAGES: Record<string, { price: number; credits: number }> = {
  "5":  { price: 7900,  credits: 5  },
  "10": { price: 12900, credits: 10 },
  "25": { price: 19900, credits: 25 },
};

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const pkg = request.nextUrl.searchParams.get("pkg") ?? "10";
    const packageInfo = PACKAGES[pkg] ?? PACKAGES["10"];

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "sek",
          unit_amount: packageInfo.price,
          product_data: {
            name: `${packageInfo.credits} uppladdningar — Hyresrättskollen`,
            description: `${packageInfo.credits} AI-analyser och brev`,
          },
        },
        quantity: 1,
      }],
      metadata: {
        supabase_user_id: user.id,
        credits: String(packageInfo.credits),
      },
      success_url: `${request.nextUrl.origin}/dashboard?credits_added=${packageInfo.credits}`,
      cancel_url: `${request.nextUrl.origin}/dashboard`,
    });

    return NextResponse.redirect(session.url!);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[stripe-checkout]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
