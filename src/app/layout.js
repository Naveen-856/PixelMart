// src/app/layout.js
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { currentUser } from "@clerk/nextjs/server";
import { getUserFromDB } from "@/lib/getUserFromDB";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PixelMart",
  description: "Premium digital marketplace",
};

export default async function RootLayout({ children }) {
  // Ensure DB user exists for every signed-in user on every page load
  const clerkUser = await currentUser();
  if (clerkUser) {
    await getUserFromDB(); // Creates/updates DB record if needed
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script src="https://widget.cloudinary.com/v2.0/global/all.js" async></script>
        </head>
        <body className={`${inter.className} bg-gradient-to-b from-gray-50 to-white min-h-screen`}>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-gray-900 text-white py-8 text-center mt-auto">
            <p className="text-sm">© 2025 DigiMarket. All rights reserved.</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}