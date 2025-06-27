import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Settings,
  Target,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <DollarSign className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Personal Finance Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Make smarter financial decisions with our comprehensive suite of
            calculators and planning tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Compound Interest Calculator */}
          <Link href="/compound-interest" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-4">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Compound Interest Calculator
              </h3>
              <p className="text-gray-600 text-center mb-6">
                See how your money can grow over time with the power of compound
                interest
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  Calculate Growth
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Retirement Simulator */}
          <Link href="/retirement-simulator" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Retirement Simulator
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Plan for your future and see if you&apos;re on track for your
                retirement goals
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700">
                  Plan Retirement
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Risk Profile Quiz */}
          <Link href="/risk-profile" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="bg-purple-100 rounded-full p-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Risk Profile Quiz
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Discover your investment risk tolerance and get personalized
                recommendations
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                  Take Quiz
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Goals */}
          <Link href="/goals" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="bg-orange-100 rounded-full p-4">
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Financial Goals
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Set, track, and achieve your financial milestones with smart
                progress tracking
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                  Manage Goals
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Settings */}
          <Link href="/settings" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-full p-4">
                  <Settings className="h-8 w-8 text-gray-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Settings
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Customize interest rate presets and other app preferences
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-gray-600 font-medium group-hover:text-gray-700">
                  Configure App
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Use Our Tools?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Accurate Calculations
              </h3>
              <p className="text-gray-600">
                Professional-grade financial calculations you can trust
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Visual Insights
              </h3>
              <p className="text-gray-600">
                Clear charts and graphs to understand your financial future
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Personalized Results
              </h3>
              <p className="text-gray-600">
                Tailored recommendations based on your unique situation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
