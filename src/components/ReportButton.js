'use client';

import { useState } from "react";

const reasons = [
  "Copyright infringement",
  "Inappropriate content",
  "Scam/Fraud",
  "Broken file",
  "False description",
  "Other",
];

export default function ReportButton({ productId }) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        reason,
        details: details.trim(),
      }),
    });

    if (res.ok) {
      setMessage("Report submitted successfully. Thank you!");
      setTimeout(() => {
        setShowModal(false);
        setReason(reasons[0]);
        setDetails("");
      }, 2000);
    } else {
      setMessage("Error submitting report. Try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-red-600 hover:text-red-800 font-medium transition"
      >
        Report Product
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Report Product
            </h3>
            <p className="text-gray-600 mb-8">
              Help keep DigiMarket safe. Tell us why this product should be reviewed.
            </p>

            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:border-indigo-500 transition text-lg"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Additional details (optional)
              </label>
              <textarea
                rows={5}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:border-indigo-500 transition text-lg"
                placeholder="Provide more information..."
              />
            </div>

            {message && (
              <div className={`p-6 rounded-2xl text-center text-xl font-bold mb-6 ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {message}
              </div>
            )}

            <div className="flex justify-end gap-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-4 border-2 border-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-red-700 hover:to-pink-700 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}