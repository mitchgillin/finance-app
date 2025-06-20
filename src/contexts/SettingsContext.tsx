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

interface SettingsContextType {
  interestRatePresets: InterestRatePresets;
  updateInterestRatePresets: (presets: InterestRatePresets) => void;
  resetToDefaults: () => void;
  riskProfile: RiskProfile | null;
  updateRiskProfile: (profile: RiskProfile) => void;
  clearRiskProfile: () => void;
  getRecommendedRate: () => number;
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
    };
    localStorage.setItem("financeAppSettings", JSON.stringify(settings));
  }, [interestRatePresets, riskProfile]);

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
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
