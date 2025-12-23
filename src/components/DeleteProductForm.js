'use client';

import { useState } from "react";

export default function DeleteProductForm({ productId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include", // Important for Clerk session
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product deleted successfully!");
        window.location.reload();
      } else {
        setError(data.error || "Failed to delete");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete Product"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}