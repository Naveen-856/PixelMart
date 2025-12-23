'use client';

import { useState } from "react";

export default function DownloadButton({ product }) {
  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [message, setMessage] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setMessage("");
    setDownloadReady(false);

    try {
      const res = await fetch("/api/download-signed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage("Error: " + (data.error || "Failed to download file"));
        return;
      }

      // Get the file as a blob
      const blob = await res.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Get filename from Content-Disposition header or use product title
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = product.title || 'download';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage("Download started successfully! 🎉");
      setDownloadReady(true);
    } catch (err) {
      console.error("Download error:", err);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl p-8 text-center shadow-lg">
      <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <p className="text-green-800 font-bold text-2xl mb-2">
        Thank you for your purchase! 🎉
      </p>
      <p className="text-gray-700 mb-8 text-lg">
        Click the button below to download your file securely.
      </p>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

        {/* Content */}
        <span className="relative z-10 flex items-center gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Preparing download...
            </>
          ) : (
            <>
              <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download File Now
            </>
          )}
        </span>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-shimmer bg-300% opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300 pointer-events-none"></div>
      </button>

      {message && (
        <div className={`mt-6 p-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 ${message.includes("Error") ? "bg-red-100 text-red-700 border-2 border-red-300" : "bg-green-100 text-green-800 border-2 border-green-300"}`}>
          {message.includes("Error") ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {message}
        </div>
      )}
    </div>
  );
}
