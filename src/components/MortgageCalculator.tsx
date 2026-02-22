import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Share2,
  ArrowLeftRight,
  Lightbulb,
} from "lucide-react";
import { CurrencyInput } from "@/components/currency-input";
import { PercentInput } from "@/components/percent-input";
import { ResultsCard } from "@/components/results-card";
import { ShareDialog } from "@/components/share-dialogs";
import {
  formatCAD,
  calculateMonthlyPayment,
  calculateTotalInterest,
} from "@/lib/mortgage-utils";

const MortgageCalculator = () => {
  // Scenario A state
  const [loanAmount, setLoanAmount] = useState(500_000);
  const [interestRateA, setInterestRateA] = useState(8.0);
  const [termMonthsA, setTermMonthsA] = useState(12);

  // Scenario B state
  const [interestRateB, setInterestRateB] = useState(10.0);
  const [termMonthsB, setTermMonthsB] = useState(24);

  // Term options in months
  const termOptions = [6, 12, 18, 24];

  // UI state
  const [compareMode, setCompareMode] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Calculations
  const resultsA = useMemo(() => {
    const monthly = calculateMonthlyPayment(loanAmount, interestRateA);
    const total = calculateTotalInterest(monthly, termMonthsA / 12);
    return { monthly, total };
  }, [loanAmount, interestRateA, termMonthsA]);

  const resultsB = useMemo(() => {
    const monthly = calculateMonthlyPayment(loanAmount, interestRateB);
    const total = calculateTotalInterest(monthly, termMonthsB / 12);
    return { monthly, total };
  }, [loanAmount, interestRateB, termMonthsB]);

  const handleGeneratePDF = async () => {
    const { generatePDF } = await import("@/lib/generate-pdf");
    generatePDF({
      loanAmount,
      scenarioA: {
        interestRate: interestRateA,
        termMonths: termMonthsA,
        monthlyPayment: resultsA.monthly,
        totalInterest: resultsA.total,
      },
      scenarioB: compareMode
        ? {
            interestRate: interestRateB,
            termMonths: termMonthsB,
            monthlyPayment: resultsB.monthly,
            totalInterest: resultsB.total,
          }
        : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="navy-gradient py-5 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-md">
              <ArrowLeftRight className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-primary-foreground text-xl font-bold tracking-tight">
                Interest-Only Mortgage Calculator
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="space-y-6">
          {/* Compare toggle */}
          <Card className="glass-card">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={compareMode}
                    onCheckedChange={setCompareMode}
                  />
                  <div>
                    <Label className="text-sm font-semibold text-foreground">
                      Compare Scenarios
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Evaluate two rate/term combinations side by side
                    </p>
                  </div>
                </div>
                <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Inputs section */}
          <div className={`grid gap-5 ${compareMode ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
            {/* Scenario A inputs */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">
                  {compareMode ? "Scenario A" : "Loan Parameters"}
                </CardTitle>
                <CardDescription>
                  {compareMode
                    ? "Configure your first scenario"
                    : "Adjust your mortgage details below"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CurrencyInput
                  value={loanAmount}
                  onChange={setLoanAmount}
                />
                <Separator />
                <PercentInput
                  value={interestRateA}
                  onChange={setInterestRateA}
                />
                <Separator />
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Term
                  </Label>
                  <div className="flex gap-2">
                    {termOptions.map((months) => (
                      <Button
                        key={months}
                        variant="outline"
                        size="sm"
                        onClick={() => setTermMonthsA(months)}
                        className={
                          termMonthsA === months
                            ? "bg-navy text-primary-foreground hover:bg-navy-light"
                            : "border-input text-foreground hover:bg-secondary"
                        }
                      >
                        {months} mo
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario B inputs */}
            {compareMode && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base">
                    Scenario B
                  </CardTitle>
                  <CardDescription>
                    Configure your second scenario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Loan Amount
                    </Label>
                    <p className="text-lg font-bold text-foreground tabular-nums">
                      {formatCAD(loanAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Shared with Scenario A
                    </p>
                  </div>
                  <Separator />
                  <PercentInput
                    value={interestRateB}
                    onChange={setInterestRateB}
                  />
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Term
                    </Label>
                    <div className="flex gap-2">
                      {termOptions.map((months) => (
                        <Button
                          key={months}
                          variant="outline"
                          size="sm"
                          onClick={() => setTermMonthsB(months)}
                          className={
                            termMonthsB === months
                              ? "bg-navy text-primary-foreground hover:bg-navy-light"
                              : "border-input text-foreground hover:bg-secondary"
                          }
                        >
                          {months} mo
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results section */}
          <div className={`grid gap-5 ${compareMode ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
            <ResultsCard
              title={compareMode ? "Scenario A Results" : "Your Results"}
              monthlyPayment={resultsA.monthly}
              totalInterest={resultsA.total}
              termMonths={termMonthsA}
              interestRate={interestRateA}
              loanAmount={loanAmount}
            />
            {compareMode && (
              <ResultsCard
                title="Scenario B Results"
                monthlyPayment={resultsB.monthly}
                totalInterest={resultsB.total}
                termMonths={termMonthsB}
                interestRate={interestRateB}
                loanAmount={loanAmount}
              />
            )}
          </div>

          {/* Interest-only disclaimer */}
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 border border-border/50 p-4">
            <Lightbulb className="w-5 h-5 text-gold mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Interest-only payments do not reduce your principal. Your loan
              balance remains{" "}
              <span className="font-semibold text-foreground">
                {formatCAD(loanAmount)}
              </span>{" "}
              throughout the term.
            </p>
          </div>

          {/* Action Buttons */}
          <Card className="glass-card">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleGeneratePDF}
                  size="lg"
                  className="gold-gradient text-accent-foreground hover:opacity-90 font-bold shadow-md flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate PDF Report
                </Button>
                <Button
                  onClick={() => setShareOpen(true)}
                  size="lg"
                  variant="outline"
                  className="border-navy/20 text-navy hover:bg-navy hover:text-primary-foreground flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            This calculator is for informational purposes only and does not
            constitute financial advice. For personalized mortgage solutions,
            please consult a licensed mortgage broker at{" "}
            <span className="font-semibold text-foreground">
              The Financing Factory
            </span>
            .
          </p>
        </div>
      </footer>

      {/* Dialogs */}
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
};

export default MortgageCalculator;
