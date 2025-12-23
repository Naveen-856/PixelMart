import Stripe from "stripe";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await connectDB();

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Product purchase
    if (session.metadata.productId) {
      await Order.create({
        productId: session.metadata.productId,
        buyerId: session.metadata.buyerId,
        sellerId: session.metadata.sellerId,
        pricePaid: session.amount_total / 100,
        stripeSessionId: session.id,
      });
    }

    // Seller package purchase
    if (session.metadata.userId) {
      await User.findByIdAndUpdate(session.metadata.userId, {
        role: "seller",
        isActiveSeller: true,
        sellerExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      });
    }
  }

  return new Response("Success", { status: 200 });
}