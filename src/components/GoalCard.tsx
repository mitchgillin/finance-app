import React, { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { Goal, GoalContribution } from "../contexts/SettingsContext";

interface GoalCardProps {
  goal: Goal;
  onAddMoney: (goalId: string, amount: number) => void;
}

export default function GoalCard({ goal, onAddMoney }: GoalCardProps) {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");

  const progressPercentage = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100
  );
  const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);

  const Icon = goal.category.icon;

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(contributionAmount);
    if (amount > 0) {
      onAddMoney(goal.id, amount);
      setContributionAmount("");
      setShowAddMoney(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div
              className={`bg-${goal.category.color}-100 rounded-full p-2 mr-3`}
            >
              <Icon className={`h-5 w-5 text-${goal.category.color}-600`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{goal.name}</h3>
              <p className="text-sm text-gray-500">{goal.category.name}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Current</p>
            <p className="font-semibold text-lg text-gray-900">
              {formatCurrency(goal.currentAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Target</p>
            <p className="font-semibold text-lg text-gray-900">
              {formatCurrency(goal.targetAmount)}
            </p>
          </div>
        </div>

        {/* Target Date */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Target: {formatDate(goal.targetDate)}</span>
        </div>

        {/* Remaining Amount */}
        {remainingAmount > 0 && (
          <div className="text-center mb-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-orange-600">
                {formatCurrency(remainingAmount)}
              </span>{" "}
              left to reach your goal
            </p>
          </div>
        )}

        {/* Add Money Button */}
        {remainingAmount > 0 ? (
          <button
            onClick={() => setShowAddMoney(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Money
          </button>
        ) : (
          <div className="w-full bg-green-100 text-green-800 py-3 px-4 rounded-lg font-medium text-center">
            🎉 Goal Completed!
          </div>
        )}
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Money</h3>
              <button
                onClick={() => setShowAddMoney(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Add money to &quot;{goal.name}&quot;
            </p>

            <form onSubmit={handleAddMoney}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="100"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                    min="0.01"
                    step="0.01"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddMoney(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
