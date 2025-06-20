"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  RotateCcw,
  Save,
  TrendingDown,
  Activity,
  TrendingUp,
} from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import NumericInput from "../../components/NumericInput";

export default function SettingsPage() {
  const {
    interestRatePresets,
    updateInterestRatePresets,
    resetToDefaults,
    riskProfile,
    clearRiskProfile,
  } = useSettings();
  const [localPresets, setLocalPresets] = useState(interestRatePresets);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateInterestRatePresets(localPresets);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    resetToDefaults();
    setLocalPresets({
      conservative: 4.0,
      average: 7.0,
      optimistic: 10.0,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const hasChanges =
    localPresets.conservative !== interestRatePresets.conservative ||
    localPresets.average !== interestRatePresets.average ||
    localPresets.optimistic !== interestRatePresets.optimistic;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
            <Settings className="h-8 w-8 text-gray-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">App Settings</h1>
          </div>
          <p className="text-gray-600">
            Customize the default interest rate presets used throughout the app.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Risk Profile Information */}
          {riskProfile && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your Risk Profile
              </h2>
              <p className="text-gray-600 mb-6">
                Completed on {riskProfile.completedAt.toLocaleDateString()}
              </p>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                <div>
                  <span className="text-lg font-semibold text-blue-800">
                    {riskProfile.profile}
                  </span>
                  <div className="text-sm text-blue-600">
                    Risk Score: {riskProfile.score} | Expected Return:{" "}
                    {riskProfile.expectedReturn}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/risk-profile"
                    className="text-xs bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Retake Quiz
                  </Link>
                  <button
                    onClick={clearRiskProfile}
                    className="text-xs bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Clear Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {!riskProfile && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">
                Take the Risk Profile Quiz
              </h2>
              <p className="text-blue-600 mb-4">
                Get personalized interest rate recommendations based on your
                risk tolerance.
              </p>
              <Link
                href="/risk-profile"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Quiz
              </Link>
            </div>
          )}

          {/* Interest Rate Presets */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Interest Rate Presets
            </h2>
            <p className="text-gray-600 mb-8">
              These rates will be used as defaults in all financial calculators.
              Adjust them to match your investment expectations.
            </p>

            <div className="space-y-8">
              {/* Conservative */}
              <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                <div className="flex items-center mb-4">
                  <TrendingDown className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Conservative
                    </h3>
                    <p className="text-sm text-blue-600">
                      Lower risk, stable returns (e.g., bonds, CDs)
                    </p>
                  </div>
                </div>
                <NumericInput
                  label=""
                  value={localPresets.conservative}
                  onChange={(value) =>
                    setLocalPresets((prev) => ({
                      ...prev,
                      conservative: value,
                    }))
                  }
                  min={0}
                  max={15}
                  step={0.1}
                  suffix="%"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Average */}
              <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                <div className="flex items-center mb-4">
                  <Activity className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Average
                    </h3>
                    <p className="text-sm text-green-600">
                      Balanced approach (e.g., diversified portfolio)
                    </p>
                  </div>
                </div>
                <NumericInput
                  label=""
                  value={localPresets.average}
                  onChange={(value) =>
                    setLocalPresets((prev) => ({ ...prev, average: value }))
                  }
                  min={0}
                  max={20}
                  step={0.1}
                  suffix="%"
                  className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Optimistic */}
              <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800">
                      Optimistic
                    </h3>
                    <p className="text-sm text-purple-600">
                      Higher potential returns (e.g., growth stocks, tech)
                    </p>
                  </div>
                </div>
                <NumericInput
                  label=""
                  value={localPresets.optimistic}
                  onChange={(value) =>
                    setLocalPresets((prev) => ({ ...prev, optimistic: value }))
                  }
                  min={0}
                  max={30}
                  step={0.1}
                  suffix="%"
                  className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  hasChanges
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Save className="h-5 w-5 mr-2" />
                {isSaved ? "Saved!" : "Save Changes"}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset to Defaults
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2">How to Use</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • These presets will appear as quick-select options in all
                calculators
              </li>
              <li>
                • Conservative rates are typically for bonds, CDs, and low-risk
                investments
              </li>
              <li>
                • Average rates represent balanced, diversified portfolios
              </li>
              <li>• Optimistic rates are for aggressive growth strategies</li>
              <li>
                • You can always enter custom rates in individual calculators
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
