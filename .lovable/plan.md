

## Fix Interest-Only Mortgage Calculator

### Problem
The monthly payment formula divides by the term length instead of always dividing by 12. In interest-only mortgages, the monthly payment is always `(Principal x Annual Rate) / 12` -- the term only affects how many months you pay, not the payment amount.

### Changes

**1. Fix monthly payment formula in `MortgageCalculator.tsx`**

Update both the component-level calculation and the `calculateAmortization` function:

```
// WRONG (current):  (loanAmount * rate) / totalMonths
// CORRECT:          (loanAmount * rate) / 12
```

- Monthly payment = `(loanAmount * (interestRate / 100)) / 12`
- Total interest = `monthlyPayment * totalMonths` (this stays the same -- more months = more total interest)

**2. Update `calculateAmortization` function**

Same fix: use `/12` instead of `/totalMonths` for the monthly payment calculation.

**3. Update `generatePDF.ts`**

Ensure the PDF report reflects the corrected formula and shows accurate values.

### Verification

| Loan | Rate | Term | Monthly Payment | Total Interest |
|------|------|------|----------------|----------------|
| $400,000 | 6% | 12 months | $2,000 | $24,000 |
| $400,000 | 6% | 6 months | $2,000 | $12,000 |
| $400,000 | 6% | 24 months | $2,000 | $48,000 |
| $500,000 | 10% | 12 months | $4,166.67 | $50,000 |

