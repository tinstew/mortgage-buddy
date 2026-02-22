import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCADDetailed } from "@/lib/mortgage-utils";

interface ResultsCardProps {
  title?: string;
  monthlyPayment: number;
  totalInterest: number;
  termMonths: number;
  interestRate: number;
  loanAmount: number;
}

export function ResultsCard({
  title = "Your Results",
  monthlyPayment,
  totalInterest,
  termMonths,
  interestRate,
  loanAmount,
}: ResultsCardProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
            Monthly Payment
          </p>
          <p className="text-3xl font-extrabold text-accent tabular-nums">
            {formatCADDetailed(monthlyPayment)}
          </p>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Interest Rate</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {interestRate.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Term</span>
            <span className="text-sm font-semibold text-foreground">
              {termMonths} months
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Total Interest</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {formatCADDetailed(totalInterest)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">
              Total Cost (Interest Only)
            </span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {formatCADDetailed(totalInterest)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
