'use client';

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const packages = [
  {
    name: "Starter",
    price: 19,
    priceId: "price_1SfeRlBShum5VtwLPD3kK1a6", // ← REPLACE WITH REAL RECURRING PRICE ID
    description: "Everything you need to get started.",
    features: [
      "Custom domains",
      "Edge content delivery",
      "Advanced analytics",
      "Quarterly workshops",
      "Single sign-on (SSO)",
      "Priority phone support",
    ],
  },
  {
    name: "Growth",
    price: 49,
    priceId: "price_1SfeSYBShum5VtwLnQ18xJU7", // ← REPLACE
    description: "All the extras for your growing team.",
    features: [
      "Custom domains",
      "Edge content delivery",
      "Advanced analytics",
      "Quarterly workshops",
      "Single sign-on (SSO)",
      "Priority phone support",
    ],
    popular: true,
  },
  {
    name: "Scale",
    price: 99,
    priceId: "price_1SfeTABShum5VtwL9oGUkGqb", // ← REPLACE
    description: "Added flexibility at scale.",
    features: [
      "Custom domains",
      "Edge content delivery",
      "Advanced analytics",
      "Quarterly workshops",
      "Single sign-on (SSO)",
      "Priority phone support",
    ],
  },
];

export default function PackagesPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState("");

  const handleSelect = async (pkg) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setLoading(pkg.name);

    try {
      const res = await fetch("/api/checkout/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: pkg.priceId }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "Checkout failed"));
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Pricing that grows with your team size
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {packages.map((pkg) => (
          <div key={pkg.name} className={`relative bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border ${pkg.popular ? "border-purple-500 shadow-2xl shadow-purple-500/20" : "border-gray-700"}`}>
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <p className="text-purple-400 text-lg font-medium mb-2">{pkg.name}</p>
              <p className="text-gray-400 text-sm mb-6">{pkg.description}</p>
              <div className="mb-8">
                <span className="text-6xl font-extrabold text-white">${pkg.price}</span>
                <span className="text-gray-400 ml-2">USD per month</span>
              </div>
              <button
                onClick={() => handleSelect(pkg)}
                disabled={loading === pkg.name}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
              >
                {loading === pkg.name ? "Processing..." : "Start a free trial"}
              </button>
            </div>

            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-300 font-medium mb-4">Start selling with:</p>
              <ul className="space-y-3 text-left">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}