"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, Calculator, DollarSign, Percent } from "lucide-react";
import NumericInput from "@/components/NumericInput";
import ComparisonChart, { ComparisonScenario } from "@/components/ComparisonChart";
import Tooltip from "@/components/Tooltip";

interface FeeScenario {
  id: string;
  name: string;
  color: string;
  annualFeeRate: number;
  customReturnRate?: number;
  otherFees: {
    tradingFee: number;
    managementFee: number;
    performanceFee: number;
  };
}

interface FeeCalculation {
  year: number;
  totalValue: number;
  totalContributions: number;
  totalInterest: number;
  totalFees: number;
  feesThisYear: number;
}

export default function FeeCalculatorPage() {
  const [principal, setPrincipal] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [annualReturnRate, setAnnualReturnRate] = useState(7);
  const [years, setYears] = useState(30);
  
  const [scenarios, setScenarios] = useState<FeeScenario[]>([
    {
      id: "1",
      name: "Index Fund/ETF",
      color: "#10b981",
      annualFeeRate: 0.10,
      customReturnRate: 7.0,
      otherFees: { tradingFee: 0, managementFee: 0, performanceFee: 0 }
    },
    {
      id: "2", 
      name: "Target Date/Balanced Fund",
      color: "#f59e0b",
      annualFeeRate: 0.40,
      customReturnRate: 7.0,
      otherFees: { tradingFee: 0, managementFee: 0, performanceFee: 0 }
    },
    {
      id: "3",
      name: "Actively Managed Fund",
      color: "#ef4444",
      annualFeeRate: 0.77,
      customReturnRate: 7.0,
      otherFees: { tradingFee: 0, managementFee: 0, performanceFee: 4.0 }
    },
    {
      id: "4",
      name: "Poor Performing Fund",
      color: "#dc2626",
      annualFeeRate: 1.2,
      customReturnRate: 3.0,
      otherFees: { tradingFee: 0, managementFee: 0, performanceFee: 5.0 }
    },
    {
      id: "5",
      name: "Market Downturn Fund",
      color: "#7c2d12",
      annualFeeRate: 0.85,
      customReturnRate: -2.0,
      otherFees: { tradingFee: 0, managementFee: 0, performanceFee: 3.0 }
    }
  ]);

  const [selectedScenario, setSelectedScenario] = useState<string>("1");
  const [comparisonData, setComparisonData] = useState<ComparisonScenario[]>([]);

  const calculateFeeImpact = (scenario: FeeScenario): FeeCalculation[] => {
    const results: FeeCalculation[] = [];
    let currentValue = principal;
    let totalContributions = principal;
    let totalFees = 0;
    
    const effectiveReturnRate = scenario.customReturnRate ?? annualReturnRate;
    const monthlyReturn = (effectiveReturnRate / 100) / 12;
    const annualFeeRate = (scenario.annualFeeRate + 
      scenario.otherFees.tradingFee + 
      scenario.otherFees.managementFee) / 100;
    const loadFeeRate = scenario.otherFees.performanceFee / 100;
    
    // Apply load fee to initial investment
    const initialLoadFee = principal * loadFeeRate;
    currentValue -= initialLoadFee;
    totalFees += initialLoadFee;
    
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        results.push({
          year: 0,
          totalValue: currentValue,
          totalContributions: totalContributions,
          totalInterest: 0,
          totalFees: totalFees,
          feesThisYear: initialLoadFee
        });
        continue;
      }
      
      let yearFees = 0;
      
      for (let month = 0; month < 12; month++) {
        // Add monthly contribution
        currentValue += monthlyContribution;
        totalContributions += monthlyContribution;
        
        // Apply load fee to monthly contribution
        const monthlyLoadFee = monthlyContribution * loadFeeRate;
        currentValue -= monthlyLoadFee;
        yearFees += monthlyLoadFee;
        totalFees += monthlyLoadFee;
        
        // Apply market growth
        currentValue *= (1 + monthlyReturn);
        
        // Apply annual fee (divided by 12 for monthly)
        const monthlyFee = currentValue * (annualFeeRate / 12);
        currentValue -= monthlyFee;
        yearFees += monthlyFee;
        totalFees += monthlyFee;
      }
      
      results.push({
        year,
        totalValue: currentValue,
        totalContributions: totalContributions,
        totalInterest: currentValue - totalContributions,
        totalFees: totalFees,
        feesThisYear: yearFees
      });
    }
    
    return results;
  };

  const updateScenario = (id: string, updates: Partial<FeeScenario>) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id ? { ...scenario, ...updates } : scenario
    ));
  };

  useEffect(() => {
    const comparison = scenarios.map(scenario => {
      const calculations = calculateFeeImpact(scenario);
      return {
        id: scenario.id,
        name: scenario.name,
        color: scenario.color,
        settings: {
          principal,
          monthlyContribution,
          annualRate: scenario.customReturnRate ?? annualReturnRate,
          years
        },
        data: calculations.map(calc => ({
          year: calc.year,
          totalValue: calc.totalValue,
          totalContributions: calc.totalContributions,
          totalInterest: calc.totalInterest
        }))
      };
    });
    setComparisonData(comparison);
  }, [scenarios, principal, monthlyContribution, annualReturnRate, years]);

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);
  const selectedCalculation = selectedScenarioData ? calculateFeeImpact(selectedScenarioData) : [];
  const finalCalculation = selectedCalculation[selectedCalculation.length - 1];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fee Impact Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            See how investment fees compound over time and discover the true cost of different fee structures
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Key Insights</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li><strong>Fees compound against you:</strong> Unlike returns, fees are charged regardless of performance and reduce your growth potential.</li>
              <li><strong>Higher fees need higher returns:</strong> Actively managed funds must significantly outperform to justify their higher fees.</li>
              <li><strong>Fees eat into principal:</strong> During market downturns, fees continue to be charged even when your investments are losing money.</li>
              <li><strong>Small differences compound:</strong> A 1% difference in fees can cost hundreds of thousands over decades.</li>
            </ul>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NumericInput
              label="Initial Investment"
              value={principal}
              onChange={setPrincipal}
              prefix="$"
              className="focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <NumericInput
              label="Monthly Contribution"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              prefix="$"
              className="focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <NumericInput
              label="Expected Annual Return"
              value={annualReturnRate}
              onChange={setAnnualReturnRate}
              suffix="%"
              className="focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <NumericInput
              label="Investment Period"
              value={years}
              onChange={setYears}
              suffix="years"
              className="focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Fee Scenarios and Results in Horizontal Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Fee Scenarios */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Fee Scenarios
              </h2>
              
              <div className="space-y-2">
                {scenarios.map((scenario) => {
                  const isSelected = selectedScenario === scenario.id;
                  const totalAnnualFee = scenario.annualFeeRate + scenario.otherFees.tradingFee + scenario.otherFees.managementFee;
                  
                  return (
                    <div key={scenario.id} className={`border rounded-lg transition-all duration-200 ${isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                      <div 
                        className="p-3 cursor-pointer"
                        onClick={() => setSelectedScenario(scenario.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: scenario.color }}
                            />
                            <span className="text-sm font-semibold text-gray-900">
                              {scenario.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Total Fees</div>
                              <div className="text-sm font-bold text-red-600">
                                {formatPercent(totalAnnualFee)}
                                {scenario.otherFees.performanceFee > 0 && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    +{formatPercent(scenario.otherFees.performanceFee)} load
                                  </span>
                                )}
                              </div>
                            </div>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="selectedScenario"
                                value={scenario.id}
                                checked={isSelected}
                                onChange={(e) => setSelectedScenario(e.target.value)}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="px-3 pb-3 border-t border-blue-200 bg-white rounded-b-lg">
                          <div className="pt-3 space-y-3">
                            <div>
                              <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                                <span>Expense Ratio</span>
                                <Tooltip 
                                  title="Expense Ratio"
                                  content="The annual cost charged by a fund manager for managing the investment portfolio. Ranges from 0.05-0.15% for passive index funds to 0.50-2.00% for actively managed funds. Covers operational costs, research, and portfolio management."
                                  className="ml-1"
                                />
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={scenario.annualFeeRate}
                                  onChange={(e) => updateScenario(scenario.id, { annualFeeRate: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                  step="0.01"
                                  min="0"
                                  max="5"
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">%</span>
                              </div>
                            </div>
                            
                            <div>
                              <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                                <span>Load Fee</span>
                                <Tooltip 
                                  title="Load Fee"
                                  content="A sales charge paid when buying (front-load) or selling (back-load) mutual fund shares. Front-load typically 3-5.75% of investment amount. This is a one-time fee applied to each contribution. No-load funds charge no sales fees and are increasingly common."
                                  className="ml-1"
                                />
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={scenario.otherFees.performanceFee}
                                  onChange={(e) => updateScenario(scenario.id, { 
                                    otherFees: { ...scenario.otherFees, performanceFee: parseFloat(e.target.value) || 0 }
                                  })}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                  step="0.1"
                                  min="0"
                                  max="6"
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">%</span>
                              </div>
                            </div>
                            
                            <div>
                              <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                                <span>Expected Return</span>
                                <Tooltip 
                                  title="Expected Annual Return"
                                  content="The anticipated yearly return for this investment type. Index funds typically track market returns (~7% historically). Actively managed funds promise higher returns but often underperform after fees. Use negative values to simulate market downturns."
                                  className="ml-1"
                                />
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={scenario.customReturnRate ?? annualReturnRate}
                                  onChange={(e) => updateScenario(scenario.id, { 
                                    customReturnRate: parseFloat(e.target.value) || annualReturnRate
                                  })}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  step="0.1"
                                  min="-5"
                                  max="15"
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">%</span>
                              </div>
                            </div>
                            
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <span className="text-xs font-medium text-gray-600">Return: </span>
                              <span className="text-sm font-bold text-blue-600">
                                {formatPercent(scenario.customReturnRate ?? annualReturnRate)}
                              </span>
                              <span className="text-xs text-gray-600 mx-2">•</span>
                              <span className="text-xs font-medium text-gray-600">Total Annual Fees: </span>
                              <span className="text-sm font-bold text-red-600">
                                {formatPercent(totalAnnualFee)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {finalCalculation && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Fee Impact Analysis - {selectedScenarioData?.name}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-green-800 mb-1">Final Balance</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(finalCalculation.totalValue)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      After {years} years
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-red-800 mb-1">Total Fees Paid</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(finalCalculation.totalFees)}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Over {years} years
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">Fee Impact</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPercent((finalCalculation.totalFees / (finalCalculation.totalValue + finalCalculation.totalFees)) * 100)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Of potential returns
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-purple-800 mb-1">Contributions</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(finalCalculation.totalContributions)}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Total invested
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <Percent className="h-5 w-5 text-yellow-600 mr-2" />
                      <div>
                        <h3 className="text-sm font-semibold text-yellow-800">Fee Impact Summary</h3>
                        <p className="text-xs text-yellow-700 mt-1">
                          Fees reduced your potential portfolio value by <strong>{formatCurrency(finalCalculation.totalFees)}</strong> over {years} years.
                          This represents <strong>{formatPercent((finalCalculation.totalFees / (finalCalculation.totalValue + finalCalculation.totalFees)) * 100)}</strong> of what your portfolio could have been worth.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {(() => {
                    const baselineScenario = scenarios.find(s => s.id === "1");
                    const currentScenario = selectedScenarioData;
                    
                    if (!baselineScenario || !currentScenario || currentScenario.id === "1") return null;
                    
                    const baselineCalc = calculateFeeImpact(baselineScenario);
                    const baselineFinal = baselineCalc[baselineCalc.length - 1];
                    
                    const totalFeeRate = currentScenario.annualFeeRate + currentScenario.otherFees.tradingFee + currentScenario.otherFees.managementFee;
                    const baselineFeeRate = baselineScenario.annualFeeRate + baselineScenario.otherFees.tradingFee + baselineScenario.otherFees.managementFee;
                    const feeGap = totalFeeRate - baselineFeeRate;
                    const requiredExtraReturn = feeGap;
                    
                    const currentReturn = currentScenario.customReturnRate ?? annualReturnRate;
                    const baselineReturn = baselineScenario.customReturnRate ?? annualReturnRate;
                    const actualExtraReturn = currentReturn - baselineReturn;
                    
                    const breakEvenReturn = baselineReturn + requiredExtraReturn;
                    
                    const performanceDiff = finalCalculation.totalValue - baselineFinal.totalValue;
                    const isPerformingBetter = performanceDiff > 0;
                    
                    return (
                      <div className={`border-l-4 p-4 rounded-r-lg ${isPerformingBetter ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                        <div className="flex items-center">
                          <TrendingDown className={`h-5 w-5 mr-2 ${isPerformingBetter ? 'text-green-600' : 'text-red-600'}`} />
                          <div>
                            <h3 className={`text-sm font-semibold ${isPerformingBetter ? 'text-green-800' : 'text-red-800'}`}>
                              Breakeven Analysis vs {baselineScenario.name}
                            </h3>
                            <div className="text-xs mt-1 space-y-1">
                              <p className={isPerformingBetter ? 'text-green-700' : 'text-red-700'}>
                                <strong>Required return to break even:</strong> {formatPercent(breakEvenReturn)}
                              </p>
                              <p className={isPerformingBetter ? 'text-green-700' : 'text-red-700'}>
                                <strong>Actual return:</strong> {formatPercent(currentReturn)} 
                                ({actualExtraReturn >= 0 ? '+' : ''}{formatPercent(actualExtraReturn)} vs baseline)
                              </p>
                              <p className={isPerformingBetter ? 'text-green-700' : 'text-red-700'}>
                                <strong>Performance difference:</strong> {performanceDiff >= 0 ? '+' : ''}{formatCurrency(performanceDiff)}
                              </p>
                              {!isPerformingBetter && (
                                <p className="text-red-700 font-semibold">
                                  💡 This fund needs to return {formatPercent(requiredExtraReturn)} more than the baseline to justify its higher fees.
                                </p>
                              )}
                              {finalCalculation.totalValue < finalCalculation.totalContributions && (
                                <p className="text-red-800 font-bold bg-red-100 px-2 py-1 rounded">
                                  ⚠️ WARNING: This fund lost money even with your contributions! Final value is below total contributions.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Fee Education Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calculator className="h-6 w-6 mr-2" />
            Understanding Investment Fees
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <h3 className="font-semibold text-red-800">Expense Ratio</h3>
                <Tooltip 
                  title="Management Fee Details"
                  content="This is the most common fee. It's calculated as a percentage of your total investment and charged annually. For a $10,000 investment with a 1% expense ratio, you pay $100 per year."
                  className="ml-2"
                />
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Index funds: 0.05-0.15%</li>
                <li>• Target date funds: 0.30-0.50%</li>
                <li>• Active funds: 0.65-2.00%</li>
                <li>• Charged annually on total assets</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <h3 className="font-semibold text-orange-800">Load Fees</h3>
                <Tooltip 
                  title="Load Fee Details"
                  content="Sales charges that can be front-load (when you buy) or back-load (when you sell). A 5% front-load fee means only $950 of your $1,000 investment actually gets invested."
                  className="ml-2"
                />
              </div>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Front-load: 3-5.75%</li>
                <li>• Back-load: 5-6% (decreasing)</li>
                <li>• Applied to each purchase</li>
                <li>• Many funds are "no-load"</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <h3 className="font-semibold text-yellow-800">Performance Fees</h3>
                <Tooltip 
                  title="Performance Fee Details"
                  content="Additional fees charged when a fund exceeds its benchmark. Common in hedge funds (10-20% of excess returns). Usually includes a 'high water mark' to prevent double-charging."
                  className="ml-2"
                />
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Hedge funds: 10-20%</li>
                <li>• Only on excess returns</li>
                <li>• High water mark protection</li>
                <li>• Rare in mutual funds</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <h3 className="font-semibold text-blue-800">Trading Fees</h3>
                <Tooltip 
                  title="Trading Fee Details"
                  content="Charges for buying/selling securities. Typically $0-$20 per trade in retail accounts. For mutual funds, these costs are usually included in the expense ratio."
                  className="ml-2"
                />
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Retail: $0-$20 per trade</li>
                <li>• Often included in expense ratio</li>
                <li>• Higher with frequent trading</li>
                <li>• Many brokers offer $0 trades</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <h3 className="font-semibold text-purple-800">Rebalancing Costs</h3>
                <Tooltip 
                  title="Rebalancing Cost Details"
                  content="Expenses for adjusting portfolio allocations back to target percentages. Includes trading fees and potential tax implications. Typically 0.03-0.10% annually for automated services."
                  className="ml-2"
                />
              </div>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Automated: 0.03-0.10%</li>
                <li>• Includes trading costs</li>
                <li>• Tax implications possible</li>
                <li>• Higher for active management</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <h3 className="font-semibold text-gray-800">Hidden Costs</h3>
                <Tooltip 
                  title="Hidden Cost Details"
                  content="Costs not explicitly shown but affecting returns: bid-ask spreads, market impact, cash drag from holding uninvested cash, and tax inefficiency from frequent trading."
                  className="ml-2"
                />
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Bid-ask spreads</li>
                <li>• Market impact costs</li>
                <li>• Cash drag</li>
                <li>• Tax inefficiency</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-red-100 border border-red-300 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ The Compounding Effect of Fees</h3>
            <p className="text-sm text-red-700">
              Unlike investment returns, fees are charged regardless of performance and compound against you over time. 
              A seemingly small 1% difference in annual fees can cost hundreds of thousands of dollars over a 30-year investment period. 
              During market downturns, you continue paying fees even while your investments lose value, creating a "double hit" to your returns.
            </p>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Fee Impact Comparison
          </h2>
          <div className="w-full">
            <div className="min-h-[500px]">
              <ComparisonChart
                scenarios={comparisonData}
                width={900}
                height={500}
                strokeWidthConfig={{ base: 2, current: 3, hovered: 3, hoveredCurrent: 4 }}
                pointRadiusConfig={{ base: 2, current: 3, hovered: 4, hoveredCurrent: 5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}