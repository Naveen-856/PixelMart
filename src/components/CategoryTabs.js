'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CategoryTabs({ categories, selected }) {
  const searchParams = useSearchParams();

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b-2 border-gray-100 sticky top-20 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-8 py-4">
          {categories.map((cat) => {
            const isActive = selected === cat || (cat === "All" && !selected);
            const params = new URLSearchParams(searchParams);
            params.set("category", cat === "All" ? "" : cat);

            return (
              <Link
                key={cat}
                href={`/?${params.toString()}`}
                scroll={false}
                className={`relative whitespace-nowrap pb-4 px-2 font-semibold text-base transition-all duration-300 ${isActive
                    ? "text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text scale-105"
                    : "text-gray-600 hover:text-indigo-600 hover:scale-105"
                  }`}
              >
                {cat === "All" ? "All Products" : cat}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full shadow-lg animate-gradient bg-300%"></span>
                )}
                {!isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}