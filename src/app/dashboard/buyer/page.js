import { getUserFromDB } from "@/lib/getUserFromDB";
import { redirect } from "next/navigation";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";

async function getBuyerPurchases(buyerId) {
  await connectDB();

  const orders = await Order.find({ buyerId }).sort({ purchasedAt: -1 }).lean();

  const productIds = orders.map(o => o.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();

  const productMap = {};
  products.forEach(p => {
    productMap[p._id.toString()] = {
      ...p,
      _id: p._id.toString(),
      sellerId: p.sellerId?.toString(),
    };
  });

  return orders.map(o => ({
    ...o,
    _id: o._id.toString(),
    productId: o.productId.toString(),
    product: productMap[o.productId.toString()],
  }));
}

export default async function BuyerDashboard() {
  const user = await getUserFromDB();

  if (!user) {
    redirect("/sign-in");
  }

  const purchases = await getBuyerPurchases(user._id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            My Purchases
          </h1>
          <p className="text-xl text-gray-600">
            Access all your digital products in one place
          </p>
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-32 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl border border-gray-100">
            <div className="inline-block p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
              <svg className="w-24 h-24 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              No purchases yet
            </p>
            <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto">
              Start exploring and buy your first digital product!
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {purchases.map((purchase) => {
              if (!purchase.product) return null;

              return (
                <div key={purchase._id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                    {/* Thumbnail */}
                    <div className="md:col-span-1">
                      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden group">
                        <Image
                          src={purchase.product.thumbnailUrl}
                          alt={purchase.product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-md">
                            {purchase.product.category}
                          </span>
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Purchased on {new Date(purchase.purchasedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-3xl font-extrabold text-gray-900 mb-4 hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300">
                          {purchase.product.title}
                        </h3>

                        <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
                          ${purchase.pricePaid.toFixed(2)}
                        </p>
                      </div>

                      <a
                        href={purchase.product.fileUrl}
                        download
                        className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl text-center hover:scale-105 active:scale-95 overflow-hidden"
                      >
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                        {/* Content */}
                        <span className="relative z-10 flex items-center gap-3">
                          <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download File Again
                        </span>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-shimmer bg-300% opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300 pointer-events-none"></div>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}