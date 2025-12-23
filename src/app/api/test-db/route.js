import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  return Response.json({ message: "DB connected!", success: true });
}