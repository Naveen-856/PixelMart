import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getUserFromDB } from "@/lib/getUserFromDB";

export async function DELETE(request, context) {
  await connectDB();

  const user = await getUserFromDB();

  if (!user || !user.isActiveSeller) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // FIX: Await the context.params
  const params = await context.params;
  const id = params.id;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing product ID" }), { status: 400 });
  }

  const product = await Product.findById(id);

  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
  }

  if (product.sellerId.toString() !== user._id.toString()) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  await Product.findByIdAndDelete(id);

  return Response.json({ success: true, message: "Product deleted successfully" });
}