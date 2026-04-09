import { MONTHLY_RATE } from '../constants'

export function calculateMonthlyInterest(principal) {
  return principal * MONTHLY_RATE
}

export function calculateAnnualInterest(principal) {
  return principal * MONTHLY_RATE * 12
}

export function calculateProjection(principal, months) {
  const monthlyReturn = calculateMonthlyInterest(principal)
  return {
    monthlyReturn,
    annualReturn: calculateAnnualInterest(principal),
    totalReturn: monthlyReturn * months,
    totalValue: principal + monthlyReturn * months,
  }
}
