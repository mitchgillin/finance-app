"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface InterestRatePresets {
  conservative: number;
  average: number;
  optimistic: number;
}

export interface RiskProfile {
  profile:
    | "Conservative"
    | "Moderately Conservative"
    | "Moderate"
    | "Moderately Aggressive"
    | "Aggressive";
  score: number;
  answers: { [key: number]: number };
  completedAt: Date;
  expectedReturn: string;
  allocation: { stocks: number; bonds: number; cash: number };
  risk: string;
}

export interface GoalCategory {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  description: string;
}

export interface GoalContribution {
  id: string;
  amount: number;
  date: Date;
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: GoalCategory;
  createdDate: Date;
  contributions: GoalContribution[];
  milestones?: {
    "25": boolean;
    "50": boolean;
    "75": boolean;
    "100": boolean;
  };
}

interface SettingsContextType {
  interestRatePresets: InterestRatePresets;
  updateInterestRatePresets: (presets: InterestRatePresets) => void;
  resetToDefaults: () => void;
  riskProfile: RiskProfile | null;
  updateRiskProfile: (profile: RiskProfile) => void;
  clearRiskProfile: () => void;
  getRecommendedRate: () => number;
  goals: Goal[];
  addGoal: (
    goal: Omit<Goal, "id" | "createdDate" | "contributions" | "currentAmount">
  ) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addContribution: (
    goalId: string,
    contribution: Omit<GoalContribution, "id">
  ) => void;
}

const defaultPresets: InterestRatePresets = {
  conservative: 4.0,
  average: 7.0,
  optimistic: 10.0,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [interestRatePresets, setInterestRatePresets] =
    useState<InterestRatePresets>(defaultPresets);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("financeAppSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.interestRatePresets) {
          setInterestRatePresets(parsed.interestRatePresets);
        }
        if (parsed.riskProfile) {
          // Convert completedAt back to Date object
          const profile = {
            ...parsed.riskProfile,
            completedAt: new Date(parsed.riskProfile.completedAt),
          };
          setRiskProfile(profile);
        }
        if (parsed.goals) {
          // Convert date strings back to Date objects
          const goalsWithDates = parsed.goals.map((goal: Goal) => ({
            ...goal,
            createdDate: new Date(goal.createdDate),
            contributions: goal.contributions.map(
              (contrib: GoalContribution) => ({
                ...contrib,
                date: new Date(contrib.date),
              })
            ),
          }));
          setGoals(goalsWithDates);
        }
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      interestRatePresets,
      riskProfile,
      goals,
    };
    localStorage.setItem("financeAppSettings", JSON.stringify(settings));
  }, [interestRatePresets, riskProfile, goals]);

  const updateInterestRatePresets = (presets: InterestRatePresets) => {
    setInterestRatePresets(presets);
  };

  const resetToDefaults = () => {
    setInterestRatePresets(defaultPresets);
  };

  const updateRiskProfile = (profile: RiskProfile) => {
    setRiskProfile(profile);
  };

  const clearRiskProfile = () => {
    setRiskProfile(null);
  };

  // Goal management functions
  const addGoal = (
    goalData: Omit<
      Goal,
      "id" | "createdDate" | "contributions" | "currentAmount"
    >
  ) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdDate: new Date(),
      currentAmount: 0,
      contributions: [],
      milestones: {
        "25": false,
        "50": false,
        "75": false,
        "100": false,
      },
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const addContribution = (
    goalId: string,
    contributionData: Omit<GoalContribution, "id">
  ) => {
    const contribution: GoalContribution = {
      ...contributionData,
      id: Date.now().toString(),
    };

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const newContributions = [...goal.contributions, contribution];
          const newCurrentAmount = newContributions.reduce(
            (sum, contrib) => sum + contrib.amount,
            0
          );
          const progressPercentage =
            (newCurrentAmount / goal.targetAmount) * 100;

          // Update milestones
          const updatedMilestones = { ...goal.milestones };
          if (progressPercentage >= 25 && !updatedMilestones?.["25"]) {
            updatedMilestones["25"] = true;
          }
          if (progressPercentage >= 50 && !updatedMilestones?.["50"]) {
            updatedMilestones["50"] = true;
          }
          if (progressPercentage >= 75 && !updatedMilestones?.["75"]) {
            updatedMilestones["75"] = true;
          }
          if (progressPercentage >= 100 && !updatedMilestones?.["100"]) {
            updatedMilestones["100"] = true;
          }

          return {
            ...goal,
            contributions: newContributions,
            currentAmount: newCurrentAmount,
            milestones: updatedMilestones,
          };
        }
        return goal;
      })
    );
  };

  // Get recommended interest rate based on risk profile
  const getRecommendedRate = (): number => {
    if (!riskProfile) {
      return interestRatePresets.average; // Default to average if no profile
    }

    switch (riskProfile.profile) {
      case "Conservative":
        return interestRatePresets.conservative;
      case "Moderately Conservative":
        return (
          (interestRatePresets.conservative + interestRatePresets.average) / 2
        );
      case "Moderate":
        return interestRatePresets.average;
      case "Moderately Aggressive":
        return (
          (interestRatePresets.average + interestRatePresets.optimistic) / 2
        );
      case "Aggressive":
        return interestRatePresets.optimistic;
      default:
        return interestRatePresets.average;
    }
  };

  const value = {
    interestRatePresets,
    updateInterestRatePresets,
    resetToDefaults,
    riskProfile,
    updateRiskProfile,
    clearRiskProfile,
    getRecommendedRate,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
