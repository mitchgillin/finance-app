import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { DollarSign, Settings } from "lucide-react";
import { SettingsProvider } from "../contexts/SettingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Finance Tools",
  description:
    "Comprehensive financial calculators and planning tools for your future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">
                  Finance Tools
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/compound-interest"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Compound Interest
                </Link>
                <Link
                  href="/retirement-simulator"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Retirement
                </Link>
                <Link
                  href="/risk-profile"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Risk Profile
                </Link>
                <Link
                  href="/goals"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Goals
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <SettingsProvider>
          <main>{children}</main>
        </SettingsProvider>

        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="h-6 w-6 text-green-400" />
                  <span className="text-lg font-bold">Finance Tools</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Empowering your financial future with professional-grade
                  calculators and planning tools.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Tools</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link
                      href="/compound-interest"
                      className="hover:text-white transition-colors"
                    >
                      Compound Interest Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/retirement-simulator"
                      className="hover:text-white transition-colors"
                    >
                      Retirement Simulator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/risk-profile"
                      className="hover:text-white transition-colors"
                    >
                      Risk Profile Quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings"
                      className="hover:text-white transition-colors"
                    >
                      Settings
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Learn</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Investment Basics
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Retirement Planning
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Risk Management
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Tax Strategies
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">About</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      How It Works
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Privacy Policy
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Terms of Use
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      Contact
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>
                &copy; 2024 Personal Finance Tools. Built with Next.js and
                Tailwind CSS.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
