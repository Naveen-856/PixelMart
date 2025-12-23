'use client';

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const categories = [
  "Ebooks",
  "Courses",
  "Templates",
  "Resume / Portfolio / Cover Letter",
  "UI Kits",
  "Wallpaper",
  "Music",
  "Projects",
  "Other",
];

export default function SellForm() {
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const openWidget = (type) => {
    if (!window.cloudinary) {
      setMessage("Cloudinary widget loading... try again in a few seconds");
      return;
    }

    const isThumbnail = type === "thumbnail";

    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: isThumbnail
          ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_THUMBNAIL
          : process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_FILE,
        sources: ["local", "url"],
        multiple: false,
        cropping: isThumbnail,
        croppingAspectRatio: isThumbnail ? 1.6 : undefined,
        folder: isThumbnail ? "thumbnails" : "digital-products",
        resource_type: isThumbnail ? "image" : "raw",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const url = result.info.secure_url;
          if (isThumbnail) {
            setThumbnailUrl(url);
          } else {
            setFileUrl(url);
          }
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnailUrl || !fileUrl) {
      setMessage("Please upload both thumbnail and product file");
      return;
    }

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        price: parseFloat(price),
        category,
        thumbnailUrl,
        fileUrl,
        clerkId: user.id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Product uploaded successfully! 🎉");
      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory(categories[0]);
      setThumbnailUrl("");
      setFileUrl("");
    } else {
      setMessage("Error: " + (data.error || "Upload failed"));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div className="group">
        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Product Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-lg group-hover:border-gray-300 bg-gradient-to-br from-white to-gray-50"
          placeholder="e.g., Ultimate Resume Template Pack"
        />
      </div>

      {/* Description */}
      <div className="group">
        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Description
        </label>
        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-lg group-hover:border-gray-300 bg-gradient-to-br from-white to-gray-50 resize-none"
          placeholder="Describe your product, what it includes, who it's for..."
        />
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg group-hover:border-gray-300 bg-gradient-to-br from-white to-gray-50"
            placeholder="19.99"
          />
        </div>

        <div className="group">
          <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg group-hover:border-gray-300 bg-gradient-to-br from-white to-gray-50 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Thumbnail Image
        </label>
        <button
          type="button"
          onClick={() => openWidget("thumbnail")}
          className="group w-full border-4 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-indigo-500 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
        >
          {thumbnailUrl ? (
            <div className="space-y-4">
              <img src={thumbnailUrl} alt="Thumbnail" className="mx-auto max-h-64 rounded-2xl shadow-2xl ring-4 ring-green-200" />
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thumbnail Ready!
              </div>
            </div>
          ) : (
            <div>
              <div className="inline-block p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-16 w-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xl text-gray-700 font-semibold mb-2">
                Click to upload thumbnail
              </p>
              <p className="text-gray-500 text-sm">
                Recommended: 1280x720 • JPG or PNG
              </p>
            </div>
          )}
        </button>
      </div>

      {/* Product File Upload */}
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Digital Product File
        </label>
        <button
          type="button"
          onClick={() => openWidget("file")}
          className="group w-full border-4 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300"
        >
          {fileUrl ? (
            <div className="space-y-4">
              <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xl">
                File Ready!
              </div>
              <p className="text-gray-600 text-sm break-all px-4">
                {fileUrl.split("/").pop()}
              </p>
            </div>
          ) : (
            <div>
              <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-16 w-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-xl text-gray-700 font-semibold mb-2">
                Click to upload your product file
              </p>
              <p className="text-gray-500 text-sm">
                PDF, ZIP, MP3, MP4, etc. • Max 100MB
              </p>
            </div>
          )}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-6 rounded-2xl text-center text-lg font-bold shadow-lg ${message.includes("success") ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300" : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-2 border-red-300"}`}>
          <div className="flex items-center justify-center gap-3">
            {message.includes("success") ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {message}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !thumbnailUrl || !fileUrl}
        className="group relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-6 rounded-2xl font-extrabold text-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing Product...
            </>
          ) : (
            <>
              <svg className="w-7 h-7 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Publish Product
            </>
          )}
        </span>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-shimmer bg-300% opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300 pointer-events-none"></div>
      </button>
    </form>
  );
}