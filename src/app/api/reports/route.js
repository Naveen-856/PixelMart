import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import { getUserFromDB } from "@/lib/getUserFromDB";

export async function POST(req) {
  await connectDB();

  const user = await getUserFromDB();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const { productId, reason, details } = body;

  if (!productId || !reason) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  await Report.create({
    productId,
    reporterId: user._id,
    reason,
    details: details || "",
  });

  return Response.json({ success: true });
}