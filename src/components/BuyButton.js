'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuyButton({ product }) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout error: " + (data.error || "Unknown"));
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-xl hover:bg-indigo-700 transition disabled:opacity-50"
    >
      {loading ? "Processing..." : `Buy Now for $${product.price.toFixed(2)}`}
    </button>
  );
}