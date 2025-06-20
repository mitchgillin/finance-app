"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import NumericInput from "../../components/NumericInput";
import InterestRateSelector from "../../components/InterestRateSelector";
import { useSettings } from "../../contexts/SettingsContext";

export default function RetirementSimulator() {
  const { getRecommendedRate, riskProfile } = useSettings();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [desiredRetirementIncome, setDesiredRetirementIncome] = useState(80000);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [inflationRate, setInflationRate] = useState(3);

  // Initialize with recommended rate if risk profile exists
  useEffect(() => {
    if (riskProfile) {
      setExpectedReturn(getRecommendedRate());
    }
  }, [riskProfile, getRecommendedRate]);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const retirementYears = lifeExpectancy - retirementAge;
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12;

    // Future value of current savings
    const futureCurrentSavings =
      currentSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Future value of monthly contributions
    const futureContributions =
      monthlyContribution *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    const totalAtRetirement = futureCurrentSavings + futureContributions;

    // Adjust desired income for inflation
    const inflationMultiplier = Math.pow(
      1 + inflationRate / 100,
      yearsToRetirement
    );
    const adjustedDesiredIncome = desiredRetirementIncome * inflationMultiplier;

    // Calculate if savings will last through retirement
    const totalNeeded = adjustedDesiredIncome * retirementYears;
    const shortfall = totalNeeded - totalAtRetirement;

    // Calculate sustainable withdrawal rate (4% rule)
    const sustainableAnnualWithdrawal = totalAtRetirement * 0.04;
    const sustainableMonthlyWithdrawal = sustainableAnnualWithdrawal / 12;

    return {
      totalAtRetirement,
      adjustedDesiredIncome,
      totalNeeded,
      shortfall,
      sustainableAnnualWithdrawal,
      sustainableMonthlyWithdrawal,
      yearsToRetirement,
      retirementYears,
      totalContributions: currentSavings + monthlyContribution * totalMonths,
      interestEarned:
        totalAtRetirement - currentSavings - monthlyContribution * totalMonths,
    };
  };

  const results = calculateRetirement();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = () => {
    if (results.shortfall <= 0) return "text-green-600";
    if (results.shortfall < results.totalAtRetirement * 0.2)
      return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = () => {
    if (results.shortfall <= 0)
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    return <AlertCircle className="h-6 w-6 text-yellow-600" />;
  };

  const getStatusMessage = () => {
    if (results.shortfall <= 0) {
      return "Great! You're on track for your retirement goals.";
    }
    if (results.shortfall < results.totalAtRetirement * 0.2) {
      return "You're close to your goals, but consider increasing contributions.";
    }
    return "You may need to adjust your retirement plan or increase savings.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Retirement Simulator
            </h1>
          </div>
          <p className="text-gray-600">
            Plan for your retirement and see if you&apos;re on track to meet
            your financial goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Personal Details
            </h2>

            <div className="space-y-4">
              <NumericInput
                label="Current Age"
                value={currentAge}
                onChange={setCurrentAge}
                min={18}
                max={80}
                defaultValue={30}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              <NumericInput
                label="Retirement Age"
                value={retirementAge}
                onChange={setRetirementAge}
                min={currentAge + 1}
                max={85}
                defaultValue={65}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              <NumericInput
                label="Life Expectancy"
                value={lifeExpectancy}
                onChange={setLifeExpectancy}
                min={retirementAge + 1}
                max={100}
                defaultValue={85}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Financial Details
            </h2>

            <div className="space-y-4">
              <NumericInput
                label="Current Retirement Savings"
                value={currentSavings}
                onChange={setCurrentSavings}
                min={0}
                step={1000}
                prefix="$"
                defaultValue={0}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              <NumericInput
                label="Monthly Contribution"
                value={monthlyContribution}
                onChange={setMonthlyContribution}
                min={0}
                step={50}
                prefix="$"
                defaultValue={0}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              <InterestRateSelector
                label="Expected Annual Return"
                value={expectedReturn}
                onChange={setExpectedReturn}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              <NumericInput
                label="Desired Annual Income in Retirement"
                value={desiredRetirementIncome}
                onChange={setDesiredRetirementIncome}
                min={0}
                step={1000}
                prefix="$"
                defaultValue={0}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              <NumericInput
                label="Expected Inflation Rate"
                value={inflationRate}
                onChange={setInflationRate}
                min={0}
                max={10}
                step={0.1}
                suffix="%"
                defaultValue={3}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Retirement Projection
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  Total at Retirement
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(results.totalAtRetirement)}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  Sustainable Annual Income
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {formatCurrency(results.sustainableAnnualWithdrawal)}
                </div>
                <div className="text-xs text-gray-500">
                  Based on 4% withdrawal rule
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  Inflation-Adjusted Goal
                </div>
                <div className="text-lg font-semibold text-yellow-600">
                  {formatCurrency(results.adjustedDesiredIncome)}
                </div>
              </div>

              {results.shortfall > 0 ? (
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    Projected Shortfall
                  </div>
                  <div className="text-lg font-semibold text-red-600">
                    {formatCurrency(results.shortfall)}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Surplus</div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(Math.abs(results.shortfall))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            {getStatusIcon()}
            <h2 className="text-2xl font-semibold text-gray-900 ml-3">
              Retirement Status
            </h2>
          </div>

          <div className={`text-lg mb-6 ${getStatusColor()}`}>
            {getStatusMessage()}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {results.yearsToRetirement}
              </div>
              <div className="text-sm text-gray-600">Years to Retirement</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {results.retirementYears}
              </div>
              <div className="text-sm text-gray-600">Years in Retirement</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(results.sustainableMonthlyWithdrawal)}
              </div>
              <div className="text-sm text-gray-600">
                Monthly Income Available
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Recommendations
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                If You&apos;re Behind
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Increase monthly contributions by 1-2% annually
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Consider working a few extra years
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Look into catch-up contributions if you&apos;re over 50
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Review and reduce current expenses
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                If You&apos;re On Track
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Stay consistent with your contributions
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Review your investment allocation annually
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Consider tax-advantaged accounts (401k, IRA)
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Don&apos;t forget about healthcare costs in retirement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
