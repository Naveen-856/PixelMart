'use client';

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            <Image
              src="/pixel-mart-logo1.png"
              alt="DigiMarket"
              width={180}
              height={60}
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </Link>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-indigo-600 hover:text-indigo-700">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 ml-4">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard/buyer" className="text-gray-700 hover:text-indigo-600">
                My Purchases
              </Link>
              <Link href="/packages" className="text-gray-700 hover:text-indigo-600">
                Become a Seller
              </Link>
              <Link href="/sell" className="text-gray-700 hover:text-indigo-600">
                Sell
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}