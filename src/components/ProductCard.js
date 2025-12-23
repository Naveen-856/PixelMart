import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const categoryColors = {
    'Ebooks': 'bg-gradient-to-r from-blue-500 to-cyan-500',
    'Courses': 'bg-gradient-to-r from-purple-500 to-pink-500',
    'Templates': 'bg-gradient-to-r from-green-500 to-emerald-500',
    'Resume / Portfolio / Cover Letter': 'bg-gradient-to-r from-orange-500 to-red-500',
    'UI Kits': 'bg-gradient-to-r from-indigo-500 to-purple-500',
    'Wallpaper': 'bg-gradient-to-r from-pink-500 to-rose-500',
    'Music': 'bg-gradient-to-r from-violet-500 to-purple-500',
    'Projects': 'bg-gradient-to-r from-teal-500 to-cyan-500',
    'Other': 'bg-gradient-to-r from-gray-500 to-slate-500',
  };

  const categoryColor = categoryColors[product.category] || categoryColors['Other'];

  return (
    <Link href={`/product/${product._id}`} className="group block">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] relative">
        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 bg-shimmer bg-300% opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300 z-10 pointer-events-none"></div>

        <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden">
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-6 relative">
          <span className={`inline-block px-4 py-2 ${categoryColor} text-white text-xs font-bold rounded-full mb-3 shadow-md`}>
            {product.category}
          </span>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
            {product.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex justify-between items-center">
            <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </p>
            <div className="flex items-center text-sm font-semibold text-gray-500 group-hover:text-indigo-600 transition-colors duration-300">
              <span className="mr-2">View Details</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}