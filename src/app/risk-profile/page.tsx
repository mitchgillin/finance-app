"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

interface Question {
  id: number;
  question: string;
  options: { text: string; score: number }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is your primary investment goal?",
    options: [
      { text: "Preserve my capital with minimal risk", score: 1 },
      { text: "Generate steady income with some growth", score: 2 },
      { text: "Balance growth and income", score: 3 },
      { text: "Maximize long-term growth", score: 4 },
      { text: "Aggressive growth, I can handle volatility", score: 5 },
    ],
  },
  {
    id: 2,
    question: "How would you react if your investment lost 20% in a month?",
    options: [
      { text: "Sell everything immediately", score: 1 },
      { text: "Sell some to reduce risk", score: 2 },
      { text: "Hold and wait for recovery", score: 3 },
      { text: "Hold and maybe buy a little more", score: 4 },
      { text: "Buy more - it's a great opportunity!", score: 5 },
    ],
  },
  {
    id: 3,
    question: "What is your investment timeline?",
    options: [
      { text: "Less than 2 years", score: 1 },
      { text: "2-5 years", score: 2 },
      { text: "5-10 years", score: 3 },
      { text: "10-20 years", score: 4 },
      { text: "More than 20 years", score: 5 },
    ],
  },
  {
    id: 4,
    question: "How much investment experience do you have?",
    options: [
      { text: "No experience - I'm just starting", score: 1 },
      { text: "Limited experience with basic investments", score: 2 },
      { text: "Moderate experience with various investments", score: 3 },
      { text: "Significant experience with complex investments", score: 4 },
      { text: "Very experienced with all types of investments", score: 5 },
    ],
  },
  {
    id: 5,
    question: "What percentage of your income can you afford to invest?",
    options: [
      { text: "Less than 5%", score: 1 },
      { text: "5-10%", score: 2 },
      { text: "10-20%", score: 3 },
      { text: "20-30%", score: 4 },
      { text: "More than 30%", score: 5 },
    ],
  },
];

export default function RiskProfileQuiz() {
  const { riskProfile, updateRiskProfile } = useSettings();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showQuiz, setShowQuiz] = useState(!riskProfile);

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: score };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
      // Save the results to context when quiz is completed
      const profile = getRiskProfileFromAnswers(newAnswers);
      const riskProfileData = {
        profile: profile.profile as
          | "Conservative"
          | "Moderately Conservative"
          | "Moderate"
          | "Moderately Aggressive"
          | "Aggressive",
        score: Object.values(newAnswers).reduce((sum, score) => sum + score, 0),
        answers: newAnswers,
        completedAt: new Date(),
        expectedReturn: profile.expectedReturn,
        allocation: profile.allocation,
        risk: profile.risk,
      };
      updateRiskProfile(riskProfileData);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setShowQuiz(true);
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
  };

  const getRiskProfileFromAnswers = (answersToUse: {
    [key: number]: number;
  }) => {
    const totalScore = Object.values(answersToUse).reduce(
      (sum, score) => sum + score,
      0
    );
    const avgScore = totalScore / questions.length;

    if (avgScore <= 1.5) {
      return {
        profile: "Conservative",
        color: "blue",
        icon: <Shield className="h-8 w-8" />,
        description:
          "You prefer stability and capital preservation over growth",
        allocation: { stocks: 20, bonds: 70, cash: 10 },
        expectedReturn: "3-5%",
        risk: "Low",
      };
    } else if (avgScore <= 2.5) {
      return {
        profile: "Moderately Conservative",
        color: "green",
        icon: <Shield className="h-8 w-8" />,
        description: "You want some growth but with limited risk",
        allocation: { stocks: 40, bonds: 50, cash: 10 },
        expectedReturn: "4-6%",
        risk: "Low to Moderate",
      };
    } else if (avgScore <= 3.5) {
      return {
        profile: "Moderate",
        color: "yellow",
        icon: <TrendingUp className="h-8 w-8" />,
        description: "You seek balanced growth with moderate risk",
        allocation: { stocks: 60, bonds: 35, cash: 5 },
        expectedReturn: "6-8%",
        risk: "Moderate",
      };
    } else if (avgScore <= 4.5) {
      return {
        profile: "Moderately Aggressive",
        color: "orange",
        icon: <TrendingUp className="h-8 w-8" />,
        description: "You prioritize growth and can tolerate higher volatility",
        allocation: { stocks: 80, bonds: 15, cash: 5 },
        expectedReturn: "7-10%",
        risk: "Moderate to High",
      };
    } else {
      return {
        profile: "Aggressive",
        color: "red",
        icon: <Zap className="h-8 w-8" />,
        description: "You seek maximum growth and can handle high volatility",
        allocation: { stocks: 90, bonds: 5, cash: 5 },
        expectedReturn: "8-12%",
        risk: "High",
      };
    }
  };

  const getRiskProfile = () => {
    return getRiskProfileFromAnswers(answers);
  };

  const profile = isComplete ? getRiskProfile() : null;
  
  // Helper function to get profile data for display
  const getProfileDataForDisplay = (profileData: any) => {
    return getRiskProfileFromAnswers(profileData?.answers || {});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Risk Profile Quiz
            </h1>
          </div>
          <p className="text-gray-600">
            Discover your investment risk tolerance and get personalized
            portfolio recommendations.
          </p>
        </div>

        {/* Show existing results if user has completed quiz before */}
        {riskProfile && !showQuiz && !isComplete ? (
          <div className="max-w-4xl mx-auto">
            {/* Existing Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${getProfileDataForDisplay(riskProfile)?.color}-100 text-${getProfileDataForDisplay(riskProfile)?.color}-600 mb-4`}
                >
                  {getProfileDataForDisplay(riskProfile)?.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Risk Profile: {riskProfile.profile}
                </h2>
                <p className="text-gray-600 text-lg">{getProfileDataForDisplay(riskProfile)?.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Completed on {new Date(riskProfile.completedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {riskProfile.expectedReturn}
                  </div>
                  <div className="text-sm text-gray-600">
                    Expected Annual Return
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {riskProfile.risk}
                  </div>
                  <div className="text-sm text-gray-600">Risk Level</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {riskProfile.score}
                  </div>
                  <div className="text-sm text-gray-600">Risk Score</div>
                </div>
              </div>
            </div>

            {/* Recommended Allocation */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Recommended Portfolio Allocation
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full border-8 border-blue-500 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {riskProfile.allocation.stocks}%
                        </div>
                        <div className="text-sm text-gray-600">Stocks</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Growth-oriented investments including domestic and
                    international equities
                  </p>
                </div>

                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full border-8 border-green-500 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {riskProfile.allocation.bonds}%
                        </div>
                        <div className="text-sm text-gray-600">Bonds</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Fixed-income securities for stability and regular income
                  </p>
                </div>

                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-500 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {riskProfile.allocation.cash}%
                        </div>
                        <div className="text-sm text-gray-600">Cash</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Liquid investments for emergencies and opportunities
                  </p>
                </div>
              </div>
            </div>

            {/* Investment Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Investment Recommendations
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Suitable Investment Types
                  </h4>
                  <ul className="space-y-2">
                    {riskProfile.profile === "Conservative" && (
                      <>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          High-grade corporate bonds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Government securities
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Money market funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Conservative balanced funds
                        </li>
                      </>
                    )}
                    {(riskProfile.profile === "Moderately Conservative" ||
                      riskProfile.profile === "Moderate") && (
                      <>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Balanced mutual funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Blue-chip dividend stocks
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Bond index funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Target-date funds
                        </li>
                      </>
                    )}
                    {(riskProfile.profile === "Moderately Aggressive" ||
                      riskProfile.profile === "Aggressive") && (
                      <>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Growth stock funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          International equity funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Small-cap funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Technology sector ETFs
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Considerations
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Diversify across different asset classes and sectors
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Review and rebalance your portfolio annually
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Consider tax-advantaged accounts (401k, IRA, Roth IRA)
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Maintain an emergency fund before investing
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Don&apos;t try to time the market - invest consistently
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <button
                onClick={startQuiz}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors mr-4"
              >
                Retake Quiz
              </button>
              <Link
                href="/compound-interest"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-block"
              >
                Calculate Growth Potential
              </Link>
            </div>
          </div>
        ) : showQuiz && !isComplete ? (
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                {questions[currentQuestion].question}
              </h2>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.score)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-4 flex-shrink-0" />
                      <span className="text-gray-900">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Results */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${profile?.color}-100 text-${profile?.color}-600 mb-4`}
                >
                  {profile?.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Risk Profile: {profile?.profile}
                </h2>
                <p className="text-gray-600 text-lg">{profile?.description}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {profile?.expectedReturn}
                  </div>
                  <div className="text-sm text-gray-600">
                    Expected Annual Return
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {profile?.risk}
                  </div>
                  <div className="text-sm text-gray-600">Risk Level</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {Object.values(answers).reduce(
                      (sum, score) => sum + score,
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Risk Score</div>
                </div>
              </div>
            </div>

            {/* Recommended Allocation */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Recommended Portfolio Allocation
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full border-8 border-blue-500 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {profile?.allocation.stocks}%
                        </div>
                        <div className="text-sm text-gray-600">Stocks</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Growth-oriented investments including domestic and
                    international equities
                  </p>
                </div>

                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full border-8 border-green-500 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {profile?.allocation.bonds}%
                        </div>
                        <div className="text-sm text-gray-600">Bonds</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Fixed-income securities for stability and regular income
                  </p>
                </div>

                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-500 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {profile?.allocation.cash}%
                        </div>
                        <div className="text-sm text-gray-600">Cash</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Liquid investments for emergencies and opportunities
                  </p>
                </div>
              </div>
            </div>

            {/* Investment Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Investment Recommendations
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Suitable Investment Types
                  </h4>
                  <ul className="space-y-2">
                    {profile?.profile === "Conservative" && (
                      <>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          High-grade corporate bonds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Government securities
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Money market funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Conservative balanced funds
                        </li>
                      </>
                    )}
                    {(profile?.profile === "Moderately Conservative" ||
                      profile?.profile === "Moderate") && (
                      <>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Balanced mutual funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Blue-chip dividend stocks
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Bond index funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Target-date funds
                        </li>
                      </>
                    )}
                    {(profile?.profile === "Moderately Aggressive" ||
                      profile?.profile === "Aggressive") && (
                      <>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Growth stock funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          International equity funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Small-cap funds
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Technology sector ETFs
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Considerations
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Diversify across different asset classes and sectors
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Review and rebalance your portfolio annually
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Consider tax-advantaged accounts (401k, IRA, Roth IRA)
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Maintain an emergency fund before investing
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Don&apos;t try to time the market - invest consistently
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <button
                onClick={() => setShowQuiz(false)}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors mr-4"
              >
                View My Results
              </button>
              <button
                onClick={resetQuiz}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors mr-4"
              >
                Retake Quiz
              </button>
              <Link
                href="/compound-interest"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-block"
              >
                Calculate Growth Potential
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
