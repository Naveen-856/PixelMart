import { Webhook } from "svix";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const POST = async (req) => {
  // Connect to DB first
  await connectDB();

  // Fix: Await headers() because it's a Promise in Next.js 15+
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response("Error verifying webhook", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, primary_email_address_id } = evt.data;

    const primaryEmailObj = email_addresses.find(
      (email) => email.id === primary_email_address_id
    );

    const email = primaryEmailObj?.email_address || null;

    if (!email) {
      return new Response("No email found", { status: 400 });
    }

    // Create or update user in my DB
    await User.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        email,
        role: "buyer",
        sellerExpiresAt: null,
      },
      { upsert: true, new: true }
    );

    console.log("User synced to DB:", id);
  }

  return new Response("Webhook received successfully", { status: 200 });
};