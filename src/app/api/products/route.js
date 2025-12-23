import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { clerkId } = body;

  if (!clerkId) {
    return new Response(JSON.stringify({ error: "Missing clerkId" }), { status: 400 });
  }

  const dbUser = await User.findOne({ clerkId });

  if (!dbUser) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  // Manually check if seller is active
  const isActiveSeller = dbUser.role === "seller" &&
    dbUser.sellerExpiresAt &&
    new Date(dbUser.sellerExpiresAt) > new Date();

  if (!isActiveSeller) {
    return new Response(JSON.stringify({ error: "Unauthorized - not an active seller" }), { status: 401 });
  }

  try {
    const product = await Product.create({
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      thumbnailUrl: body.thumbnailUrl,
      fileUrl: body.fileUrl,
      sellerId: dbUser._id,
    });

    return Response.json({ success: true, product });
  } catch (error) {
    console.error("Product creation error:", error);
    return new Response(JSON.stringify({ error: "Failed to create product" }), { status: 500 });
  }
}