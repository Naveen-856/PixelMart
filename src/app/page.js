import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryTabs from "@/components/CategoryTabs";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

async function getProducts(category = "All", search = "") {
  await connectDB();
  let query = {};
  if (category !== "All") query.category = category;
  if (search) query.$or = [
    { title: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } },
  ];
  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  return products.map(p => ({ ...p, _id: p._id.toString() }));
}

const categories = ["All", "Ebooks", "Courses", "Templates", "Resume / Portfolio / Cover Letter", "UI Kits", "Wallpaper", "Music", "Projects", "Other"];

export default async function Home({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.category || "All";
  const searchQuery = resolvedSearchParams.search || "";
  const products = await getProducts(selectedCategory, searchQuery);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-32 px-4 text-center overflow-hidden animate-gradient bg-300%">
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 animate-slide-in-up">
            Discover Premium <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">Digital Products</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed">
            High-quality ebooks, courses, templates, music, UI kits, wallpapers and more — created by talented creators worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/packages"
              className="group relative inline-block bg-white text-indigo-600 px-10 py-4 rounded-full font-extrabold text-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-glow-lg hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">Start Selling Today</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="#products"
              className="group inline-block bg-transparent border-4 border-white text-white px-10 py-4 rounded-full font-extrabold text-2xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300 shadow-lg hover:scale-105"
            >
              Explore Products
              <svg className="inline-block ml-2 w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {resolvedSearchParams.success === "true" && (
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-8 text-center">
            <p className="text-3xl font-bold text-green-800">
              Payment Successful! 🎉
            </p>
            <p className="text-xl text-green-700 mt-4">
              Your product is ready for download.
            </p>
          </div>
        </div>
      )}

      {resolvedSearchParams.package_success === "true" && (
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-8 text-center">
            <p className="text-3xl font-bold text-green-800">
              Welcome, Seller! 🎉
            </p>
            <p className="text-xl text-green-700 mt-4">
              You can now upload and sell products.
            </p>
            <Link href="/sell" className="inline-block mt-6 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold">
              Upload Your First Product
            </Link>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="sticky top-20 z-20">
        <CategoryTabs categories={categories} selected={selectedCategory} />
      </div>

      {/* Products Section */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-32 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl border border-gray-100">
              <div className="mb-8">
                <div className="inline-block p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
                  <svg className="w-24 h-24 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                No products found
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto">
                Be the first to upload something amazing and start earning!
              </p>
              <Link
                href="/sell"
                className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Upload Your Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}