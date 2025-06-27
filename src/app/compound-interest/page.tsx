"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  BarChart3,
  Plus,
  X,
} from "lucide-react";
import NumericInput from "@/components/NumericInput";
import InterestRateSelector from "@/components/InterestRateSelector";
import ScenarioCard from "@/components/ScenarioCard";
import ComparisonChart, {
  ComparisonScenario,
  ScenarioSettings,
} from "@/components/ComparisonChart";
import { useSettings } from "@/contexts/SettingsContext";
import CompoundInterestCalculator from "@/utils/CompoundInterest";

export default function CompoundInterest() {
  const { getRecommendedRate, riskProfile } = useSettings();
  const [activeTab, setActiveTab] = useState<"calculator" | "comparison">(
    "calculator"
  );
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(30);

  // Comparison scenarios state
  const [scenarios, setScenarios] = useState<ComparisonScenario[]>([
    {
      id: "1",
      name: "Current Settings",
      color: "#3b82f6",
      settings: {
        principal: 10000,
        monthlyContribution: 500,
        annualRate: 7,
        years: 30,
      },
      data: [],
    },
  ]);

  // Custom scenario form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customScenario, setCustomScenario] = useState<ScenarioSettings>({
    principal: 10000,
    monthlyContribution: 500,
    annualRate: 7,
    years: 30,
  });
  const [customScenarioName, setCustomScenarioName] = useState("");

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

  // Generate yearly breakdown for chart with advanced scenarios
  const generateYearlyData = (settings: ScenarioSettings) => {
    const data = [];
    const annualRate = settings.annualRate / 100;
    const totalMonths = settings.years * 12;

    // Create periods array for the utility
    const periods = [];

    for (let month = 1; month <= totalMonths; month++) {
      const currentYear = Math.ceil(month / 12);
      let monthlyContribution = settings.monthlyContribution;
      let monthlyWithdrawal = 0;

      // Check for contribution changes
      if (settings.contributionChanges) {
        const change = settings.contributionChanges.find(
          (c) => c.year <= currentYear
        );
        if (change) {
          monthlyContribution = change.newAmount;
        }
      }

      // Check for early withdrawal
      if (
        settings.earlyWithdrawal &&
        settings.earlyWithdrawal.year === currentYear &&
        month === currentYear * 12 // Apply withdrawal at end of year
      ) {
        monthlyWithdrawal = settings.earlyWithdrawal.amount;
      }

      periods.push({
        interestRate: annualRate / 12,
        contribution: monthlyContribution,
        withdrawal: monthlyWithdrawal,
      });
    }

    // Calculate using utility
    const calculator = new CompoundInterestCalculator(
      settings.principal,
      periods
    );
    const results = calculator.calculate();

    // Add initial data point (year 0)
    data.push({
      year: 0,
      totalValue: settings.principal,
      totalContributions: settings.principal,
      totalInterest: 0,
    });

    // Generate yearly data points from monthly results
    let cumulativeContributions = settings.principal;
    let cumulativeWithdrawals = 0;

    for (let year = 1; year <= settings.years; year++) {
      const monthIndex = year * 12 - 1; // Zero-based index for last month of year

      if (monthIndex < results.periods.length) {
        const periodResult = results.periods[monthIndex];

        // Calculate cumulative contributions up to this point
        for (
          let m = (year - 1) * 12;
          m < year * 12 && m < results.periods.length;
          m++
        ) {
          cumulativeContributions += results.periods[m].contribution;
          cumulativeWithdrawals += results.periods[m].withdrawal;
        }

        const netContributions =
          cumulativeContributions - cumulativeWithdrawals;
        const totalInterest = periodResult.balance - netContributions;

        data.push({
          year,
          totalValue: Math.max(0, periodResult.balance),
          totalContributions: cumulativeContributions,
          totalInterest: Math.max(0, totalInterest),
        });
      }
    }

    return data;
  };

  // Simple generation for backward compatibility
  const generateSimpleYearlyData = (
    principalAmount = principal,
    monthlyAmount = monthlyContribution,
    rate = annualRate,
    timeYears = years
  ) => {
    return generateYearlyData({
      principal: principalAmount,
      monthlyContribution: monthlyAmount,
      annualRate: rate,
      years: timeYears,
    });
  };

  // Update current scenario when parameters change
  useEffect(() => {
    const currentSettings: ScenarioSettings = {
      principal,
      monthlyContribution,
      annualRate,
      years,
    };
    const currentData = generateYearlyData(currentSettings);
    setScenarios((prevScenarios) =>
      prevScenarios.map((scenario) =>
        scenario.id === "1"
          ? { ...scenario, settings: currentSettings, data: currentData }
          : scenario
      )
    );
  }, [principal, monthlyContribution, annualRate, years]);

  // Dynamic color palette
  const getColorPalette = () => [
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
    "#ec4899", // Pink
    "#6366f1", // Indigo
    "#14b8a6", // Teal
    "#dc2626", // Dark Red
    "#059669", // Dark Green
    "#d97706", // Dark Amber
    "#7c3aed", // Dark Purple
    "#0891b2", // Dark Cyan
  ];

  // Functions for comparison scenarios
  const addScenario = (name: string, settings: ScenarioSettings) => {
    const colors = getColorPalette();

    setScenarios((prev) => {
      const colorIndex = (prev.length - 1) % colors.length; // Use prev.length for accurate count
      const newScenario: ComparisonScenario = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        color: colors[colorIndex],
        settings,
        data: generateYearlyData(settings),
      };
      return [...prev, newScenario];
    });
  };

  const addCustomScenario = () => {
    if (customScenarioName.trim()) {
      addScenario(customScenarioName, customScenario);
      setCustomScenarioName("");
      setCustomScenario({
        principal: 10000,
        monthlyContribution: 500,
        annualRate: 7,
        years: 30,
      });
      setShowCustomForm(false);
    }
  };

  const removeScenario = (id: string) => {
    if (id !== "1") {
      // Don't allow removing the current settings scenario
      setScenarios((prev) => prev.filter((scenario) => scenario.id !== id));
    }
  };

  const addPresetScenarios = () => {
    const colors = getColorPalette();

    // Create all preset scenarios with proper color assignment
    const presetScenarios = [
      {
        name: "Higher Contributions (+$200/mo)",
        settings: {
          principal,
          monthlyContribution: monthlyContribution + 200,
          annualRate,
          years,
        },
        color: colors[0], // Red
      },
      {
        name: "Early Withdrawal ($50k at year 15)",
        settings: {
          principal,
          monthlyContribution,
          annualRate,
          years,
          earlyWithdrawal: {
            year: Math.floor(years / 2),
            amount: 50000,
          },
        },
        color: colors[1], // Green
      },
      {
        name: "Late Catch-up (2x contributions after year 20)",
        settings: {
          principal,
          monthlyContribution,
          annualRate,
          years,
          contributionChanges: [
            {
              year: Math.max(20, years - 10),
              newAmount: monthlyContribution * 2,
            },
          ],
        },
        color: colors[2], // Amber
      },
      {
        name: "Conservative Rate (4%)",
        settings: {
          principal,
          monthlyContribution,
          annualRate: 4,
          years,
        },
        color: colors[3], // Purple
      },
      {
        name: "Start 10 Years Earlier",
        settings: {
          principal,
          monthlyContribution,
          annualRate,
          years: years + 10,
        },
        color: colors[4], // Cyan
      },
      {
        name: "Optimistic Rate (10%)",
        settings: {
          principal,
          monthlyContribution,
          annualRate: 10,
          years,
        },
        color: colors[5], // Orange
      },
    ];

    // Create scenario objects with data
    const newScenarios = presetScenarios.map((preset, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      name: preset.name,
      color: preset.color,
      settings: preset.settings,
      data: generateYearlyData(preset.settings),
    }));

    // Update scenarios: keep current scenario and add all presets
    setScenarios((prev) => [
      ...prev.filter((scenario) => scenario.id === "1"), // Keep current scenario
      ...newScenarios, // Add all preset scenarios
    ]);
  };

  const yearlyData = generateSimpleYearlyData();
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
          <p className="text-gray-600 mb-6">
            See how your money can grow over time with compound interest and
            regular contributions.
          </p>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("calculator")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "calculator"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Calculator className="h-4 w-4 inline-block mr-2" />
                Calculator
              </button>
              <button
                onClick={() => setActiveTab("comparison")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "comparison"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BarChart3 className="h-4 w-4 inline-block mr-2" />
                Scenario Comparison
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "calculator" && (
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
                  <span className="text-gray-700 font-medium">
                    Final Balance
                  </span>
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
                    Compound interest is often called the &quot;eighth wonder of
                    the world&quot; because your money grows exponentially over
                    time. The interest you earn also earns interest, creating a
                    snowball effect.
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
                    Consistent monthly contributions can dramatically increase
                    your final balance. This strategy, called dollar-cost
                    averaging, also helps reduce investment risk.
                  </p>
                  <p className="text-gray-600">
                    Even increasing your contribution by $50-100 per month can
                    add tens of thousands to your final balance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comparison" && (
          <div className="space-y-8">
            {/* Control Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Scenario Comparison
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCustomForm(!showCustomForm)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Custom Scenario</span>
                  </button>
                  <button
                    onClick={addPresetScenarios}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Common Scenarios
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
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

              {/* Custom Scenario Form */}
              {showCustomForm && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Create Custom Scenario
                    </h3>
                    <button
                      onClick={() => setShowCustomForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Scenario name..."
                      value={customScenarioName}
                      onChange={(e) => setCustomScenarioName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <div className="grid md:grid-cols-4 gap-4">
                      <NumericInput
                        label="Initial Investment"
                        value={customScenario.principal}
                        onChange={(value) =>
                          setCustomScenario((prev) => ({
                            ...prev,
                            principal: value,
                          }))
                        }
                        min={0}
                        step={1000}
                        prefix="$"
                        defaultValue={0}
                      />
                      <NumericInput
                        label="Monthly Contribution"
                        value={customScenario.monthlyContribution}
                        onChange={(value) =>
                          setCustomScenario((prev) => ({
                            ...prev,
                            monthlyContribution: value,
                          }))
                        }
                        min={0}
                        step={50}
                        prefix="$"
                        defaultValue={0}
                      />
                      <InterestRateSelector
                        label="Annual Interest Rate"
                        value={customScenario.annualRate}
                        onChange={(value) =>
                          setCustomScenario((prev) => ({
                            ...prev,
                            annualRate: value,
                          }))
                        }
                      />
                      <NumericInput
                        label="Investment Period"
                        value={customScenario.years}
                        onChange={(value) =>
                          setCustomScenario((prev) => ({
                            ...prev,
                            years: value,
                          }))
                        }
                        min={1}
                        max={50}
                        step={1}
                        suffix="years"
                        defaultValue={1}
                      />
                    </div>

                    {/* Advanced Options */}
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Early Withdrawal (Optional)
                        </label>
                        <div className="flex space-x-2">
                          <NumericInput
                            label="Amount"
                            value={customScenario.earlyWithdrawal?.amount || 0}
                            onChange={(value) =>
                              setCustomScenario((prev) => ({
                                ...prev,
                                earlyWithdrawal: {
                                  year: prev.earlyWithdrawal?.year || 10,
                                  amount: value,
                                },
                              }))
                            }
                            min={0}
                            step={1000}
                            prefix="$"
                            defaultValue={0}
                          />
                          <NumericInput
                            label="Year"
                            value={customScenario.earlyWithdrawal?.year || 10}
                            onChange={(value) =>
                              setCustomScenario((prev) => ({
                                ...prev,
                                earlyWithdrawal: {
                                  amount: prev.earlyWithdrawal?.amount || 0,
                                  year: value,
                                },
                              }))
                            }
                            min={1}
                            max={customScenario.years}
                            step={1}
                            suffix="year"
                            defaultValue={10}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contribution Change (Optional)
                        </label>
                        <div className="flex space-x-2">
                          <NumericInput
                            label="New Amount"
                            value={
                              customScenario.contributionChanges?.[0]
                                ?.newAmount || 0
                            }
                            onChange={(value) =>
                              setCustomScenario((prev) => ({
                                ...prev,
                                contributionChanges: [
                                  {
                                    year:
                                      prev.contributionChanges?.[0]?.year || 20,
                                    newAmount: value,
                                  },
                                ],
                              }))
                            }
                            min={0}
                            step={50}
                            prefix="$"
                            defaultValue={0}
                          />
                          <NumericInput
                            label="Starting Year"
                            value={
                              customScenario.contributionChanges?.[0]?.year ||
                              20
                            }
                            onChange={(value) =>
                              setCustomScenario((prev) => ({
                                ...prev,
                                contributionChanges: [
                                  {
                                    newAmount:
                                      prev.contributionChanges?.[0]
                                        ?.newAmount || 0,
                                    year: value,
                                  },
                                ],
                              }))
                            }
                            min={1}
                            max={customScenario.years}
                            step={1}
                            suffix="year"
                            defaultValue={20}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowCustomForm(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addCustomScenario}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        disabled={!customScenarioName.trim()}
                      >
                        Add Scenario
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Scenarios Grid */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onRemove={() => removeScenario(scenario.id)}
                  canRemove={scenario.id !== "1"}
                />
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Growth Comparison Over Time
              </h3>
              <div className="overflow-x-auto">
                <ComparisonChart
                  scenarios={scenarios}
                  width={800}
                  height={400}
                  strokeWidthConfig={{
                    base: 3,
                    current: 4,
                    hovered: 4,
                    hoveredCurrent: 5,
                  }}
                  pointRadiusConfig={{
                    base: 3,
                    current: 4,
                    hovered: 5,
                    hoveredCurrent: 6,
                  }}
                />
              </div>

              {/* Chart insights */}
              {scenarios.length > 1 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Key Insights:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • Thicker solid line shows your current settings scenario
                    </li>
                    <li>
                      • Dashed lines represent alternative scenarios for
                      comparison
                    </li>
                    <li>
                      • Data points highlight start and end values for each
                      scenario
                    </li>
                    <li>• Hover over data points to see detailed values</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
