"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";
import NumericInput from "../../components/NumericInput";
import InterestRateSelector from "../../components/InterestRateSelector";
import { useSettings } from "../../contexts/SettingsContext";

export default function CompoundInterestCalculator() {
  const { getRecommendedRate, riskProfile } = useSettings();
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(30);

  // Initialize with recommended rate if risk profile exists
  useEffect(() => {
    if (riskProfile) {
      setAnnualRate(getRecommendedRate());
    }
  }, [riskProfile, getRecommendedRate]);

  const calculateCompoundInterest = () => {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    // Future value of initial principal
    const principalValue = principal * Math.pow(1 + monthlyRate, totalMonths);

    // Future value of monthly contributions (annuity)
    const contributionValue =
      monthlyContribution *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    const totalValue = principalValue + contributionValue;
    const totalContributions = principal + monthlyContribution * totalMonths;
    const totalInterest = totalValue - totalContributions;

    return {
      totalValue,
      totalContributions,
      totalInterest,
      interestPercentage: (totalInterest / totalContributions) * 100,
    };
  };

  const results = calculateCompoundInterest();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate yearly breakdown for chart
  const generateYearlyData = () => {
    const data = [];
    const monthlyRate = annualRate / 100 / 12;

    for (let year = 0; year <= years; year++) {
      const months = year * 12;
      const principalValue = principal * Math.pow(1 + monthlyRate, months);
      const contributionValue =
        months > 0
          ? monthlyContribution *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
          : 0;

      const totalValue = principalValue + contributionValue;
      const totalContributions = principal + monthlyContribution * months;
      const totalInterest = totalValue - totalContributions;

      data.push({
        year,
        totalValue,
        totalContributions,
        totalInterest,
      });
    }
    return data;
  };

  const yearlyData = generateYearlyData();
  const maxValue = Math.max(...yearlyData.map((d) => d.totalValue));

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
            <Calculator className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Compound Interest Calculator
            </h1>
          </div>
          <p className="text-gray-600">
            See how your money can grow over time with compound interest and
            regular contributions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Investment Details
            </h2>

            <div className="space-y-6">
              <NumericInput
                label="Initial Investment"
                value={principal}
                onChange={setPrincipal}
                min={0}
                step={1000}
                prefix="$"
                defaultValue={0}
              />

              <NumericInput
                label="Monthly Contribution"
                value={monthlyContribution}
                onChange={setMonthlyContribution}
                min={0}
                step={50}
                prefix="$"
                defaultValue={0}
              />

              <InterestRateSelector
                label="Annual Interest Rate"
                value={annualRate}
                onChange={setAnnualRate}
              />

              <NumericInput
                label="Investment Period"
                value={years}
                onChange={setYears}
                min={1}
                max={50}
                step={1}
                suffix="years"
                defaultValue={1}
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Results
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Final Balance</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(results.totalValue)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Total Contributions
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  {formatCurrency(results.totalContributions)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Interest Earned
                </span>
                <span className="text-lg font-semibold text-purple-600">
                  {formatCurrency(results.totalInterest)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Return on Investment
                </span>
                <span className="text-lg font-semibold text-yellow-600">
                  {results.interestPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Simple Chart */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Growth Over Time
              </h3>
              <div className="space-y-2">
                {yearlyData
                  .filter(
                    (_, index) =>
                      index % Math.ceil(years / 10) === 0 || index === years
                  )
                  .map((data) => (
                    <div
                      key={data.year}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-12 text-sm text-gray-600 font-medium">
                        Year {data.year}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${
                              (data.totalContributions / maxValue) * 100
                            }%`,
                          }}
                        />
                        <div
                          className="bg-green-500 h-full rounded-full absolute top-0 transition-all duration-1000 ease-out"
                          style={{
                            left: `${
                              (data.totalContributions / maxValue) * 100
                            }%`,
                            width: `${(data.totalInterest / maxValue) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="w-24 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(data.totalValue)}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span className="text-gray-600">Contributions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-gray-600">Interest</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Understanding Compound Interest
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                The Power of Time
              </h3>
              <p className="text-gray-600 mb-4">
                Compound interest is often called the &quot;eighth wonder of the
                world&quot; because your money grows exponentially over time.
                The interest you earn also earns interest, creating a snowball
                effect.
              </p>
              <p className="text-gray-600">
                Starting early is crucial - even small amounts can grow
                significantly given enough time.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Regular Contributions Matter
              </h3>
              <p className="text-gray-600 mb-4">
                Consistent monthly contributions can dramatically increase your
                final balance. This strategy, called dollar-cost averaging, also
                helps reduce investment risk.
              </p>
              <p className="text-gray-600">
                Even increasing your contribution by $50-100 per month can add
                tens of thousands to your final balance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
