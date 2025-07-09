"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, TrendingUp, BarChart3, Plus, X } from "lucide-react";

// Mock fund data - in a real app this would come from an API
const mockFunds = [
  {
    symbol: "VTSAX",
    name: "Vanguard Total Stock Market Index Fund Admiral Shares",
    type: "Stock Index Fund",
    expenseRatio: 0.03,
    minimumInvestment: 3000,
    returns: {
      "1Y": 10.5,
      "3Y": 7.2,
      "5Y": 9.1,
      "10Y": 11.3
    },
    description: "Seeks to track the performance of the CRSP US Total Market Index."
  },
  {
    symbol: "VTIAX",
    name: "Vanguard Total International Stock Index Fund Admiral Shares",
    type: "International Stock Index Fund",
    expenseRatio: 0.11,
    minimumInvestment: 3000,
    returns: {
      "1Y": 6.8,
      "3Y": 4.1,
      "5Y": 5.9,
      "10Y": 7.4
    },
    description: "Seeks to track the performance of the FTSE Global All Cap ex US Index."
  },
  {
    symbol: "VBTLX",
    name: "Vanguard Total Bond Market Index Fund Admiral Shares",
    type: "Bond Index Fund",
    expenseRatio: 0.05,
    minimumInvestment: 3000,
    returns: {
      "1Y": -1.2,
      "3Y": -2.8,
      "5Y": 1.1,
      "10Y": 2.4
    },
    description: "Seeks to track the performance of the Bloomberg US Aggregate Float Adjusted Index."
  },
  {
    symbol: "FXNAX",
    name: "Fidelity U.S. Bond Index Fund",
    type: "Bond Index Fund",
    expenseRatio: 0.025,
    minimumInvestment: 0,
    returns: {
      "1Y": -0.9,
      "3Y": -2.5,
      "5Y": 1.3,
      "10Y": 2.6
    },
    description: "Seeks to provide investment results that correspond to the total return of the Bloomberg US Aggregate Bond Index."
  },
  {
    symbol: "FZROX",
    name: "Fidelity ZERO Total Market Index Fund",
    type: "Stock Index Fund",
    expenseRatio: 0.00,
    minimumInvestment: 0,
    returns: {
      "1Y": 10.8,
      "3Y": 7.5,
      "5Y": 9.3,
      "10Y": 11.1
    },
    description: "Seeks to provide investment results that correspond to the total return of the Fidelity U.S. Total Investable Market Index."
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    type: "Stock ETF",
    expenseRatio: 0.095,
    minimumInvestment: 0,
    returns: {
      "1Y": 11.2,
      "3Y": 8.1,
      "5Y": 10.4,
      "10Y": 12.9
    },
    description: "Seeks to provide investment results that correspond to the price and yield performance of the S&P 500 Index."
  }
];

interface Fund {
  symbol: string;
  name: string;
  type: string;
  expenseRatio: number;
  minimumInvestment: number;
  returns: {
    [key: string]: number;
  };
  description: string;
}

export default function FundComparison() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFunds, setSelectedFunds] = useState<Fund[]>([]);

  const filteredFunds = mockFunds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFund = (fund: Fund) => {
    if (selectedFunds.length < 4 && !selectedFunds.find(f => f.symbol === fund.symbol)) {
      setSelectedFunds([...selectedFunds, fund]);
    }
  };

  const removeFund = (symbol: string) => {
    setSelectedFunds(selectedFunds.filter(fund => fund.symbol !== symbol));
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "No minimum";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getReturnColor = (returnValue: number) => {
    if (returnValue > 0) return "text-green-600";
    if (returnValue < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Fund Comparison
            </h1>
          </div>
          <p className="text-gray-600">
            Compare mutual funds and ETFs to make informed investment decisions.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by fund name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFunds.map((fund) => (
              <div
                key={fund.symbol}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{fund.symbol}</h3>
                    <p className="text-sm text-gray-600">{fund.type}</p>
                  </div>
                  <button
                    onClick={() => addFund(fund)}
                    disabled={selectedFunds.length >= 4 || selectedFunds.find(f => f.symbol === fund.symbol) !== undefined}
                    className="p-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    title="Add to comparison"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{fund.name}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expense Ratio:</span>
                  <span className="font-medium">{fund.expenseRatio}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1Y Return:</span>
                  <span className={`font-medium ${getReturnColor(fund.returns["1Y"])}`}>
                    {fund.returns["1Y"]}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Funds for Comparison */}
        {selectedFunds.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Fund Comparison ({selectedFunds.length}/4)
              </h2>
              <button
                onClick={() => setSelectedFunds([])}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Fund</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Expense Ratio</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Min Investment</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">1Y Return</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">3Y Return</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">5Y Return</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">10Y Return</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFunds.map((fund) => (
                    <tr key={fund.symbol} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{fund.symbol}</div>
                          <div className="text-sm text-gray-600 max-w-xs truncate">{fund.name}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{fund.type}</td>
                      <td className="py-3 px-4 text-sm font-medium">{fund.expenseRatio}%</td>
                      <td className="py-3 px-4 text-sm">{formatCurrency(fund.minimumInvestment)}</td>
                      <td className={`py-3 px-4 text-sm font-medium ${getReturnColor(fund.returns["1Y"])}`}>
                        {fund.returns["1Y"]}%
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium ${getReturnColor(fund.returns["3Y"])}`}>
                        {fund.returns["3Y"]}%
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium ${getReturnColor(fund.returns["5Y"])}`}>
                        {fund.returns["5Y"]}%
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium ${getReturnColor(fund.returns["10Y"])}`}>
                        {fund.returns["10Y"]}%
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => removeFund(fund.symbol)}
                          className="text-red-600 hover:text-red-700"
                          title="Remove from comparison"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Analysis Summary */}
            {selectedFunds.length > 1 && (
              <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Lowest Expense Ratio</h3>
                  <div className="text-sm text-blue-700">
                    {selectedFunds.reduce((lowest, fund) => 
                      fund.expenseRatio < lowest.expenseRatio ? fund : lowest
                    ).symbol} - {selectedFunds.reduce((lowest, fund) => 
                      fund.expenseRatio < lowest.expenseRatio ? fund : lowest
                    ).expenseRatio}%
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Best 1Y Return</h3>
                  <div className="text-sm text-green-700">
                    {selectedFunds.reduce((best, fund) => 
                      fund.returns["1Y"] > best.returns["1Y"] ? fund : best
                    ).symbol} - {selectedFunds.reduce((best, fund) => 
                      fund.returns["1Y"] > best.returns["1Y"] ? fund : best
                    ).returns["1Y"]}%
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Best 5Y Return</h3>
                  <div className="text-sm text-purple-700">
                    {selectedFunds.reduce((best, fund) => 
                      fund.returns["5Y"] > best.returns["5Y"] ? fund : best
                    ).symbol} - {selectedFunds.reduce((best, fund) => 
                      fund.returns["5Y"] > best.returns["5Y"] ? fund : best
                    ).returns["5Y"]}%
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Lowest Min Investment</h3>
                  <div className="text-sm text-orange-700">
                    {selectedFunds.reduce((lowest, fund) => 
                      fund.minimumInvestment < lowest.minimumInvestment ? fund : lowest
                    ).symbol} - {formatCurrency(selectedFunds.reduce((lowest, fund) => 
                      fund.minimumInvestment < lowest.minimumInvestment ? fund : lowest
                    ).minimumInvestment)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Educational Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Understanding Fund Metrics
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Key Metrics to Compare
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Expense Ratio:</strong> Annual fee charged by the fund
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Historical Returns:</strong> Past performance over different periods
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Minimum Investment:</strong> Required initial investment amount
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Fund Type:</strong> Asset class and investment strategy
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Investment Tips
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Lower expense ratios mean more money stays invested
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Past performance doesn't guarantee future results
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Diversification across asset classes reduces risk
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Consider your investment timeline and risk tolerance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}