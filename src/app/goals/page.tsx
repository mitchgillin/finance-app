"use client";

import { useState } from "react";
import { Target, Plus, Home, Car, Plane, Shield, PiggyBank, DollarSign } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import GoalCard from "../../components/GoalCard";

export default function GoalsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { goals, addGoal, addContribution } = useSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            My Financial Goals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your progress and achieve your financial dreams
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {goals.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="flex justify-center mb-8">
                <div className="bg-orange-100 rounded-full p-8">
                  <Target className="h-16 w-16 text-orange-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to achieve your financial dreams?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Set your first goal and start tracking your progress. Whether it&apos;s building an emergency fund, 
                saving for a home, or planning a vacation, we&apos;ll help you get there.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Goal
              </button>
              
              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Stay Focused</h3>
                  <p className="text-gray-600">Clear targets keep you motivated and on track</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
                  <p className="text-gray-600">Visual progress bars show how close you are</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Build Security</h3>
                  <p className="text-gray-600">Achieve financial milestones with confidence</p>
                </div>
              </div>
            </div>
          ) : (
            /* Goals Grid */
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Your Goals ({goals.length})</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Goal
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal}
                    onAddMoney={(goalId, amount) => {
                      addContribution(goalId, {
                        amount,
                        date: new Date(),
                        note: `Added via goal card`
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Goal Creation Modal */}
        {showCreateForm && (
          <GoalCreationModal 
            onClose={() => setShowCreateForm(false)}
            onSave={(goal) => {
              addGoal(goal);
              setShowCreateForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

interface GoalCreationModalProps {
  onClose: () => void;
  onSave: (goal: {
    name: string;
    targetAmount: number;
    targetDate: string;
    category: {
      id: string;
      name: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      color: string;
      description: string;
    };
  }) => void;
}

function GoalCreationModal({ onClose, onSave }: GoalCreationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    category: "custom"
  });

  const goalCategories = [
    { id: "emergency", name: "Emergency Fund", icon: Shield, color: "red", description: "3-6 months of expenses" },
    { id: "home", name: "Home Down Payment", icon: Home, color: "blue", description: "Save for your first home" },
    { id: "car", name: "Car Purchase", icon: Car, color: "green", description: "Buy your dream car" },
    { id: "vacation", name: "Vacation Fund", icon: Plane, color: "purple", description: "Plan your perfect getaway" },
    { id: "investment", name: "Investment Milestone", icon: PiggyBank, color: "orange", description: "$10k, $100k portfolio" },
    { id: "custom", name: "Custom Goal", icon: Target, color: "gray", description: "Create your own goal" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount || !formData.targetDate) return;
    
    const selectedCategory = goalCategories.find(cat => cat.id === formData.category);
    onSave({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      targetDate: formData.targetDate,
      category: selectedCategory!,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Goal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Goal Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Goal Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {goalCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = formData.category === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.id })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Icon className={`h-5 w-5 mr-2 text-${category.color}-600`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goal Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Emergency Fund, Down Payment, Vacation to Japan"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* Target Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="10000"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
                min="1"
                step="0.01"
              />
            </div>
          </div>

          {/* Target Date */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Date
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}