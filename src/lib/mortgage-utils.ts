export const formatCAD = (val: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(val);

export const formatCADDetailed = (val: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);

/** Interest-only monthly payment = (principal × annualRate%) / 12 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualRate: number
): number {
  if (loanAmount <= 0 || annualRate <= 0) return 0;
  return (loanAmount * (annualRate / 100)) / 12;
}

/** Total interest = monthly payment × term in years × 12 */
export function calculateTotalInterest(
  monthlyPayment: number,
  termYears: number
): number {
  return monthlyPayment * termYears * 12;
}
