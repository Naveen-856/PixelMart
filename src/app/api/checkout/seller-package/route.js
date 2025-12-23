import Stripe from "stripe";
import { getUserFromDB } from "@/lib/getUserFromDB";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId } = await req.json();
    console.log("Received priceId:", priceId); // Debug

    const user = await getUserFromDB();
    console.log("User from DB:", user ? "Found" : "Not found"); // Debug

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized - please sign in" }), { 
        status: 401 
      });
    }

    if (!priceId || !priceId.startsWith("price_")) {
      return new Response(JSON.stringify({ error: "Invalid price ID" }), { 
        status: 400 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/packages?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/packages?canceled=true`,
      client_reference_id: user._id.toString(),
      metadata: {
        userId: user._id.toString(),
        clerkId: user.clerkId,
        packageType: "seller_subscription",
      },
    });

    console.log("Checkout session created:", session.id); // Debug

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500 
    });
  }
}