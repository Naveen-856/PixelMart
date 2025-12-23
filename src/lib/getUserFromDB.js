import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const getUserFromDB = async () => {
  await connectDB();

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null; // Not logged in
  }

  const dbUser = await User.findOne({ clerkId: clerkUser.id });

  if (!dbUser) {
    return null; // Should not happen (webhook creates it), but safe
  }

  // Check if seller subscription is active
  const isActiveSeller =
    dbUser.role === "seller" &&
    dbUser.sellerExpiresAt &&
    new Date(dbUser.sellerExpiresAt) > new Date();

  return {
    ...dbUser.toObject(),
    isActiveSeller: dbUser.role === "seller" ? isActiveSeller : false,
  };
};