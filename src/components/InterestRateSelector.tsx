"use client";

import React, { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { TrendingDown, TrendingUp, Activity } from "lucide-react";

interface InterestRateSelectorProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function InterestRateSelector({
  label = "Interest Rate",
  value,
  onChange,
  className = "",
}: InterestRateSelectorProps) {
  const { interestRatePresets, riskProfile, getRecommendedRate } =
    useSettings();
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(value.toString());

  const presetOptions = [
    {
      key: "conservative",
      label: "Conservative",
      value: interestRatePresets.conservative,
      icon: TrendingDown,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Lower risk, stable returns",
    },
    {
      key: "average",
      label: "Average",
      value: interestRatePresets.average,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Balanced approach",
    },
    {
      key: "optimistic",
      label: "Optimistic",
      value: interestRatePresets.optimistic,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Higher potential returns",
    },
  ];

  const handlePresetClick = (presetValue: number) => {
    setIsCustom(false);
    onChange(presetValue);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    setCustomValue(value.toString());
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCustomValue(inputValue);

    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue);
    }
  };

  const isPresetSelected = (presetValue: number) => {
    return !isCustom && Math.abs(value - presetValue) < 0.01;
  };

  const isCustomSelected = () => {
    return (
      isCustom ||
      !presetOptions.some((preset) => Math.abs(value - preset.value) < 0.01)
    );
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>

      {/* Risk Profile Recommendation */}
      {riskProfile && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-800">
                Based on your {riskProfile.profile} risk profile:
              </div>
              <div className="text-sm text-blue-600">
                {getRecommendedRate().toFixed(1)}% recommended rate
              </div>
            </div>
            <button
              onClick={() => onChange(getRecommendedRate())}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              Use Recommended
            </button>
          </div>
        </div>
      )}

      {/* No Risk Profile Prompt */}
      {!riskProfile && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-800">
                Get personalized rate recommendations
              </div>
              <div className="text-sm text-purple-600">
                Take our quick Risk Profile quiz for tailored suggestions
              </div>
            </div>
            <a
              href="/risk-profile"
              className="text-xs bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition-colors"
            >
              Take Quiz
            </a>
          </div>
        </div>
      )}

      {/* Preset Options */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {presetOptions.map((preset) => {
          const Icon = preset.icon;
          const isSelected = isPresetSelected(preset.value);

          return (
            <button
              key={preset.key}
              onClick={() => handlePresetClick(preset.value)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                isSelected
                  ? `${preset.borderColor} ${preset.bgColor}`
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon
                  className={`h-5 w-5 ${
                    isSelected ? preset.color : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-lg font-bold ${
                    isSelected ? preset.color : "text-gray-600"
                  }`}
                >
                  {preset.value}%
                </span>
              </div>
              <div
                className={`font-medium mb-1 ${
                  isSelected ? preset.color : "text-gray-700"
                }`}
              >
                {preset.label}
              </div>
              <div className="text-xs text-gray-500">{preset.description}</div>
            </button>
          );
        })}
      </div>

      {/* Custom Option */}
      <div className="mb-2">
        <button
          onClick={handleCustomClick}
          className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
            isCustomSelected()
              ? "border-orange-200 bg-orange-50 text-orange-600"
              : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">Custom Rate</span>
            {isCustomSelected() && (
              <span className="text-lg font-bold">{value}%</span>
            )}
          </div>
        </button>
      </div>

      {/* Custom Input */}
      {isCustom && (
        <div className="mt-3">
          <div className="relative">
            <input
              type="number"
              value={customValue}
              onChange={handleCustomValueChange}
              min="0"
              max="50"
              step="0.1"
              className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter custom rate"
              autoFocus
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Enter a custom interest rate between 0% and 50%
          </div>
        </div>
      )}
    </div>
  );
}
