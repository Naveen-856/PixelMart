import { getUserFromDB } from "@/lib/getUserFromDB";
import { redirect } from "next/navigation";
import Product from "@/models/Product";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import DeleteProductForm from "@/components/DeleteProductForm";

async function getSellerProducts(sellerId) {
  await connectDB();
  const products = await Product.find({ sellerId }).sort({ createdAt: -1 }).lean();
  return products.map(p => ({
    _id: p._id.toString(),
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    thumbnailUrl: p.thumbnailUrl,
    createdAt: p.createdAt.toISOString(),
  }));
}

export default async function SellerDashboard() {
  const user = await getUserFromDB();

  if (!user) redirect("/sign-in");
  if (!user.isActiveSeller) redirect("/packages");

  const products = await getSellerProducts(user._id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
              Seller Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Manage your products and track sales
            </p>
          </div>
          <Link
            href="/sell"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-xl"
          >
            + Upload New Product
          </Link>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-2xl">
            <p className="text-3xl font-bold text-gray-800 mb-6">
              No products uploaded yet
            </p>
            <p className="text-xl text-gray-600 mb-10">
              Start selling digital products today!
            </p>
            <Link
              href="/sell"
              className="inline-block bg-indigo-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-indigo-700 transition shadow-lg"
            >
              Upload Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition">
                <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200">
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-3">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-3xl font-extrabold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <DeleteProductForm productId={product._id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}