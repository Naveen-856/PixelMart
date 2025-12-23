import { v2 as cloudinary } from "cloudinary";
import { getUserFromDB } from "@/lib/getUserFromDB";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { connectDB } from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  await connectDB();

  const buyer = await getUserFromDB();
  if (!buyer) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { productId } = await req.json();

  const product = await Product.findById(productId);
  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
  }

  const order = await Order.findOne({
    productId,
    buyerId: buyer._id,
  });

  if (!order) {
    return new Response(JSON.stringify({ error: "You have not purchased this product" }), { status: 403 });
  }

  console.log("File URL:", product.fileUrl);

  try {
    // Directly fetch the file from its stored URL
    const fileResponse = await fetch(product.fileUrl);

    console.log("File fetch response status:", fileResponse.status);

    if (!fileResponse.ok) {
      console.error("Failed to download file:", fileResponse.status);
      const errorText = await fileResponse.text();
      console.error("Error response:", errorText);

      return new Response(
        JSON.stringify({ error: `Failed to download file (HTTP ${fileResponse.status})` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the file as a buffer
    const fileBuffer = await fileResponse.arrayBuffer();

    // Extract extension from URL
    const urlParts = product.fileUrl.split('.');
    const extension = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params

    // Determine content type based on extension
    const contentTypeMap = {
      'pdf': 'application/pdf',
      'zip': 'application/zip',
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
    };

    const contentType = contentTypeMap[extension.toLowerCase()] || 'application/octet-stream';
    const filename = `${product.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`;

    console.log("Download successful, streaming to user:", filename);

    // Stream the file to the user with proper headers
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'private, no-cache',
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new Response(
      JSON.stringify({ error: "Download failed. Please try again." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}