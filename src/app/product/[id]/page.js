import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Image from "next/image";
import BuyButton from "@/components/BuyButton";
import ReportButton from "@/components/ReportButton";
import { getUserFromDB } from "@/lib/getUserFromDB";

async function getProduct(id) {
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return null;

  return {
    ...product,
    _id: product._id.toString(),
    sellerId: product.sellerId ? product.sellerId.toString() : null,
  };
}

async function getOrder(productId, buyer) {
  if (!buyer) return null;
  await connectDB();
  const order = await Order.findOne({
    productId,
    buyerId: buyer._id,
  }).lean();
  return order;
}

export default async function ProductPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const product = await getProduct(resolvedParams.id);
  const buyer = await getUserFromDB();
  const order = await getOrder(resolvedParams.id, buyer);

  const success = resolvedSearchParams.success === "true";
  const showDownload = order || success;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-12 bg-white rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-xl text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Thumbnail */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
            <div className="relative aspect-square">
              <Image
                src={product.thumbnailUrl}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <span className="inline-block px-6 py-3 bg-purple-100 text-purple-800 rounded-full text-lg font-medium mb-6">
                {product.category}
              </span>

              <h1 className="text-5xl font-extrabold text-gray-900 mb-8">
                {product.title}
              </h1>

              <div className="text-6xl font-extrabold text-indigo-600 mb-10">
                ${product.price.toFixed(2)}
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Description</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {product.description || "No description provided by the seller."}
                </p>
              </div>

              {success && (
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-8 text-center mb-10 border-2 border-green-300">
                  <p className="text-3xl font-bold text-green-800 mb-2">
                    Payment Successful! 🎉
                  </p>
                  <p className="text-xl text-green-700">
                    Your file is ready for download below.
                  </p>
                </div>
              )}

              <div className="mb-10">
                {showDownload ? (
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-center text-white shadow-2xl">
                    <p className="text-4xl font-extrabold mb-8">
                      Thank you for your purchase!
                    </p>
                    <a
                      href={product.fileUrl}
                      download
                      className="inline-block bg-white text-indigo-600 px-12 py-6 rounded-2xl font-extrabold text-2xl hover:bg-gray-100 transition shadow-xl"
                    >
                      Download File Now
                    </a>
                    <p className="mt-6 text-indigo-200 text-lg">
                      Secure direct download
                    </p>
                  </div>
                ) : (
                  <BuyButton product={product} />
                )}
              </div>

              <div className="text-center">
                <ReportButton productId={product._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}