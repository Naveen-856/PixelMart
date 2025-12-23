import Stripe from "stripe";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, // add to .env
  api_secret: process.env.CLOUDINARY_API_SECRET, // add to .env
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await connectDB();

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const productId = session.metadata.productId;
    const buyerClerkId = session.metadata.buyerClerkId || session.client_reference_id;

    const product = await Product.findById(productId);
    const buyer = await User.findOne({ clerkId: buyerClerkId });

    if (!product || !buyer) return new Response("Not found", { status: 404 });

    // Generate signed URL (expires in 10 minutes)
    const signedUrl = cloudinary.utils.private_download_url(product.fileUrl, product.fileUrl.split(".").pop(), {
      expires_at: Math.floor(Date.now() / 1000) + 600, // 10 minutes
      attachment: true,
    });

    await Order.create({
      productId: product._id,
      buyerId: buyer._id,
      sellerId: product.sellerId,
      pricePaid: product.price,
      downloadUrl: signedUrl,
      downloadExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      stripeSessionId: session.id,
    });

    console.log(`Order created for buyer ${buyer._id}, download ready`);
  }

  return new Response("Success", { status: 200 });
}