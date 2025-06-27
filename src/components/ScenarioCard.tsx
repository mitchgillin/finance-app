"use client";

import React from "react";
import { X, TrendingUp, AlertTriangle, ArrowUp } from "lucide-react";
import { ComparisonScenario } from "./ComparisonChart";

interface ScenarioCardProps {
  scenario: ComparisonScenario;
  onRemove?: () => void;
  canRemove?: boolean;
}

export default function ScenarioCard({
  scenario,
  onRemove,
  canRemove = true,
}: ScenarioCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const finalValue = scenario.data[scenario.data.length - 1]?.totalValue || 0;
  const totalContributions =
    scenario.data[scenario.data.length - 1]?.totalContributions || 0;
  const totalInterest = finalValue - totalContributions;

  return (
    <div className="bg-white border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: scenario.color }}
          />
          <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
        </div>
        {canRemove && onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Final Value
            </span>
          </div>
          <div className="text-lg font-bold text-green-700">
            {formatCurrency(finalValue)}
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <ArrowUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Interest Earned
            </span>
          </div>
          <div className="text-lg font-bold text-blue-700">
            {formatCurrency(totalInterest)}
          </div>
        </div>
      </div>

      {/* Scenario Conditions */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Initial Investment:</span>
          <span className="font-medium">
            {formatCurrency(scenario.settings.principal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Monthly Contribution:</span>
          <span className="font-medium">
            {formatCurrency(scenario.settings.monthlyContribution)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Annual Rate:</span>
          <span className="font-medium">{scenario.settings.annualRate}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Time Period:</span>
          <span className="font-medium">{scenario.settings.years} years</span>
        </div>

        {/* Special Conditions */}
        {scenario.settings.earlyWithdrawal && (
          <div className="mt-3 p-2 bg-orange-50 rounded border-l-4 border-orange-400">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Early Withdrawal
              </span>
            </div>
            <div className="text-sm text-orange-700">
              {formatCurrency(scenario.settings.earlyWithdrawal.amount)} at year{" "}
              {scenario.settings.earlyWithdrawal.year}
            </div>
          </div>
        )}

        {scenario.settings.contributionChanges && (
          <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
            <div className="flex items-center space-x-2">
              <ArrowUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Contribution Changes
              </span>
            </div>
            {scenario.settings.contributionChanges.map((change, index) => (
              <div key={index} className="text-sm text-blue-700">
                {formatCurrency(change.newAmount)}/mo starting year{" "}
                {change.year}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ROI Indicator */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Return on Investment:</span>
          <span className="font-bold text-purple-600">
            {totalContributions > 0
              ? ((totalInterest / totalContributions) * 100).toFixed(1)
              : "0"}
            %
          </span>
        </div>
      </div>
    </div>
  );
}
