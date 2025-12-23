import Stripe from "stripe";
import { getUserFromDB } from "@/lib/getUserFromDB";
import Product from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { productId } = await req.json();

  const buyer = await getUserFromDB();

  if (!buyer) {
    return new Response(JSON.stringify({ error: "Please sign in to purchase" }), { status: 401 });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            description: product.description.substring(0, 200) + "...",
            images: [product.thumbnailUrl],
          },
          unit_amount: Math.round(product.price * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/product/${productId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/product/${productId}?canceled=true`,
    metadata: {
      productId: product._id.toString(),
      buyerId: buyer._id.toString(),
      sellerId: product.sellerId.toString(),
    },
  });

  return Response.json({ url: session.url });
}