import { getUserFromDB } from "@/lib/getUserFromDB";
import { redirect } from "next/navigation";
import SellForm from "@/components/SellForm";

export default async function SellPage() {
  const user = await getUserFromDB();

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.isActiveSeller) {
    redirect("/packages");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Upload New Product
          </h1>
          <p className="text-xl text-gray-600">
            Share your digital creations with the world
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
          <SellForm />
        </div>
      </div>
    </div>
  );
}