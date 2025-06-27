// Types and Interfaces
interface Period {
  interestRate: number;
  contribution: number;
  withdrawal: number;
}

interface CalculationResult {
  balance: number;
  interest: number;
  contribution: number;
  withdrawal: number;
  netChange: number;
}

interface CompoundingHistory {
  periods: CalculationResult[];
  summary: {
    totalInterest: number;
    totalContributions: number;
    totalWithdrawals: number;
    finalBalance: number;
  };
}

// Main Calculator Class
class CompoundInterestCalculator {
  private readonly initialPrincipal: number;
  private readonly periods: Period[];

  constructor(initialPrincipal: number, periods: Period[]) {
    this.initialPrincipal = initialPrincipal;
    this.periods = periods;
  }

  calculate(): CompoundingHistory {
    let currentBalance = this.initialPrincipal;
    let totalInterest = 0;
    let totalContributions = 0;
    let totalWithdrawals = 0;

    const periods: CalculationResult[] = this.periods.map((period) => {
      // Calculate interest
      const interest = currentBalance * period.interestRate;

      // Apply changes
      const newBalance =
        currentBalance + interest + period.contribution - period.withdrawal;

      // Update running totals
      totalInterest += interest;
      totalContributions += period.contribution;
      totalWithdrawals += period.withdrawal;

      // Create period result
      const result: CalculationResult = {
        balance: newBalance,
        interest: interest,
        contribution: period.contribution,
        withdrawal: period.withdrawal,
        netChange: newBalance - currentBalance,
      };

      // Update current balance for next iteration
      currentBalance = newBalance;

      return result;
    });

    return {
      periods,
      summary: {
        totalInterest,
        totalContributions,
        totalWithdrawals,
        finalBalance: currentBalance,
      },
    };
  }

  // Utility method to create periods with fixed values
  static createFixedPeriods(
    numPeriods: number,
    annualInterestRate: number,
    monthlyContribution: number = 0,
    monthlyWithdrawal: number = 0
  ): Period[] {
    const monthlyRate = annualInterestRate / 12;
    return Array(numPeriods).fill({
      interestRate: monthlyRate,
      contribution: monthlyContribution,
      withdrawal: monthlyWithdrawal,
    });
  }

  // Utility method to create periods with varying contributions
  static createVaryingPeriods(
    numPeriods: number,
    annualInterestRate: number,
    contributions: number[],
    withdrawals: number[]
  ): Period[] {
    const monthlyRate = annualInterestRate / 12;
    return Array(numPeriods)
      .fill(null)
      .map((_, index) => ({
        interestRate: monthlyRate,
        contribution: contributions[index] || 0,
        withdrawal: withdrawals[index] || 0,
      }));
  }
}

// Example usage:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const example = () => {
  // Example 1: Fixed monthly contributions
  const fixedPeriods = CompoundInterestCalculator.createFixedPeriods(
    12, // 12 months
    0.05, // 5% annual interest
    500, // $500 monthly contribution
    0 // No withdrawals
  );

  const calculator1 = new CompoundInterestCalculator(10000, fixedPeriods);
  const result1 = calculator1.calculate();

  // Example 2: Varying contributions and withdrawals
  const varyingPeriods = CompoundInterestCalculator.createVaryingPeriods(
    12, // 12 months
    0.05, // 5% annual interest
    [500, 600, 700, 800], // Varying contributions
    [0, 0, 1000, 0] // One withdrawal in period 3
  );

  const calculator2 = new CompoundInterestCalculator(10000, varyingPeriods);
  const result2 = calculator2.calculate();

  return { result1, result2 };
};

export default CompoundInterestCalculator;

// Usage with specific scenario
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const runScenario = () => {
  const initialInvestment = 10000;
  const monthlyContribution = 500;
  const annualInterestRate = 0.05; // 5%
  const numYears = 1;
  const numPeriods = numYears * 12;

  const periods = CompoundInterestCalculator.createFixedPeriods(
    numPeriods,
    annualInterestRate,
    monthlyContribution
  );

  const calculator = new CompoundInterestCalculator(initialInvestment, periods);
  const results = calculator.calculate();

  console.log("Investment Summary:");
  console.log(`Initial Investment: $${initialInvestment.toFixed(2)}`);
  console.log(
    `Total Interest Earned: $${results.summary.totalInterest.toFixed(2)}`
  );
  console.log(
    `Total Contributions: $${results.summary.totalContributions.toFixed(2)}`
  );
  console.log(`Final Balance: $${results.summary.finalBalance.toFixed(2)}`);
};
