import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Code, DollarSign, Percent, Calendar, Copy, Check, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/generatePDF";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(val);

const formatCurrencyDetailed = (val: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

const TERM_OPTIONS = [
  { label: "6 Months", value: "0.5", months: 6 },
  { label: "1 Year", value: "1", months: 12 },
  { label: "2 Years", value: "2", months: 24 },
];

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function calculateAmortization(loanAmount: number, annualRate: number, totalMonths: number): AmortizationRow[] {
  const r = annualRate / 100 / 12;
  if (r === 0 || loanAmount === 0) return [];

  const M = (loanAmount * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
  const rows: AmortizationRow[] = [];
  let balance = loanAmount;

  for (let m = 1; m <= totalMonths; m++) {
    const interestPortion = balance * r;
    const principalPortion = M - interestPortion;
    balance = Math.max(0, balance - principalPortion);
    rows.push({
      month: m,
      payment: M,
      principal: principalPortion,
      interest: interestPortion,
      balance,
    });
  }
  return rows;
}

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [termValue, setTermValue] = useState("1");
  const [shareOpen, setShareOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const { toast } = useToast();

  const termOption = TERM_OPTIONS.find(t => t.value === termValue) || TERM_OPTIONS[1];
  const totalMonths = termOption.months;

  // Monthly compounding: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = loanAmount > 0 && monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;
  const totalPaid = monthlyPayment * totalMonths;
  const totalInterest = totalPaid - loanAmount;

  const amortization = useMemo(
    () => calculateAmortization(loanAmount, interestRate, totalMonths),
    [loanAmount, interestRate, totalMonths]
  );

  const displayedRows = showFullSchedule ? amortization : amortization.slice(0, 6);

  const handleGenerateReport = useCallback(() => {
    generatePDF({ loanAmount, interestRate, termYears: parseFloat(termValue), monthlyPayment, totalInterest });
    toast({ title: "Report Generated", description: "Your PDF report has been downloaded." });
  }, [loanAmount, interestRate, termValue, monthlyPayment, totalInterest, toast]);

  const embedCode = `<iframe src="${window.location.origin}" width="100%" height="800" frameborder="0" style="border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.08);"></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Copied to clipboard." });
  };

  const interestPercent = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;
  const principalPercent = 100 - interestPercent;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="navy-gradient py-5 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-md">
              <DollarSign className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-primary-foreground text-xl font-bold tracking-tight">MortgageCalc</h1>
              <p className="text-primary-foreground/50 text-[11px] font-body">Private Mortgage Calculator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl text-foreground mb-2 font-bold">
            Private Mortgage Calculator
          </h2>
          <p className="text-muted-foreground font-body max-w-md mx-auto text-sm">
            Monthly compounding. Adjust the inputs below to explore your mortgage scenarios.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-5">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-3 glass-card rounded-2xl p-6 md:p-8"
          >
            <h3 className="text-base font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" /> Your Inputs
            </h3>

            {/* Loan Amount */}
            <div className="mb-7">
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-gold" /> Loan Amount
                </label>
                <span className="text-lg font-bold text-foreground font-body tabular-nums">{formatCurrency(loanAmount)}</span>
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={([v]) => setLoanAmount(v)}
                min={10000}
                max={5000000}
                step={10000}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1 font-body">
                <span>$10,000</span>
                <span>$5,000,000</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-7">
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2">
                  <Percent className="w-3.5 h-3.5 text-gold" /> Interest Rate
                </label>
                <span className="text-lg font-bold text-foreground font-body tabular-nums">{interestRate.toFixed(2)}%</span>
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={([v]) => setInterestRate(v)}
                min={1}
                max={25}
                step={0.25}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1 font-body">
                <span>1%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Term */}
            <div>
              <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2 mb-2">
                <Calendar className="w-3.5 h-3.5 text-gold" /> Term
              </label>
              <Select value={termValue} onValueChange={setTermValue}>
                <SelectTrigger className="w-full font-body font-semibold text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TERM_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="font-body">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 flex flex-col gap-4"
          >
            <div className="glass-card rounded-2xl p-6 flex-1">
              <h3 className="text-base font-bold text-foreground mb-5">Your Results</h3>

              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-body mb-1">Monthly Payment</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={monthlyPayment.toFixed(2)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-3xl font-extrabold text-accent font-body tabular-nums"
                  >
                    {formatCurrencyDetailed(monthlyPayment)}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Mini bar chart */}
              <div className="mb-5">
                <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                  <motion.div
                    className="gold-gradient rounded-l-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${principalPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="bg-navy rounded-r-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${interestPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[11px] font-body text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full gold-gradient inline-block" /> Principal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-navy inline-block" /> Interest
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground font-body">Total Interest</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={totalInterest.toFixed(0)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-bold text-foreground font-body tabular-nums"
                    >
                      {formatCurrencyDetailed(totalInterest)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground font-body">Total Cost</span>
                  <span className="text-sm font-bold text-foreground font-body tabular-nums">
                    {formatCurrencyDetailed(totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground font-body">Term</span>
                  <span className="text-sm font-semibold text-foreground font-body">{termOption.label}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="glass-card rounded-2xl p-4 space-y-2.5">
              <Button onClick={handleGenerateReport} className="w-full gold-gradient text-accent-foreground hover:opacity-90 font-body font-bold shadow-md">
                <FileText className="w-4 h-4 mr-2" /> Generate PDF Report
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setShareOpen(true)} className="font-body text-sm">
                  <Mail className="w-4 h-4 mr-1" /> Share
                </Button>
                <Button variant="outline" onClick={() => setEmbedOpen(true)} className="font-body text-sm">
                  <Code className="w-4 h-4 mr-1" /> Embed
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Amortization Schedule */}
        {amortization.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 glass-card rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" /> Amortization Schedule
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="font-body text-xs font-semibold text-muted-foreground">Month</TableHead>
                    <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Payment</TableHead>
                    <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Principal</TableHead>
                    <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Interest</TableHead>
                    <TableHead className="font-body text-xs font-semibold text-muted-foreground text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRows.map((row) => (
                    <TableRow key={row.month} className="border-border/30 hover:bg-muted/30">
                      <TableCell className="font-body text-sm font-medium">{row.month}</TableCell>
                      <TableCell className="font-body text-sm text-right tabular-nums">{formatCurrencyDetailed(row.payment)}</TableCell>
                      <TableCell className="font-body text-sm text-right tabular-nums text-gold-dark">{formatCurrencyDetailed(row.principal)}</TableCell>
                      <TableCell className="font-body text-sm text-right tabular-nums text-navy-light">{formatCurrencyDetailed(row.interest)}</TableCell>
                      <TableCell className="font-body text-sm text-right tabular-nums font-semibold">{formatCurrencyDetailed(row.balance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {amortization.length > 6 && (
              <Button
                variant="ghost"
                className="w-full mt-3 font-body text-sm text-muted-foreground"
                onClick={() => setShowFullSchedule(!showFullSchedule)}
              >
                {showFullSchedule ? (
                  <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
                ) : (
                  <>Show All {amortization.length} Months <ChevronDown className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            )}
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-[11px] text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
            This calculator provides hypothetical estimates for informational purposes only. Interest is compounded monthly. Results are not guaranteed and do not constitute financial advice. Please consult a licensed mortgage broker before making any financial decisions.
          </p>
        </motion.div>
      </main>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Share Calculator</DialogTitle>
            <DialogDescription className="font-body">Share this calculator via email or copy the link.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex gap-2">
              <Input readOnly value={window.location.href} className="font-body text-sm" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(window.location.href)}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              className="w-full gold-gradient text-accent-foreground font-body font-semibold"
              onClick={() => {
                window.open(`mailto:?subject=Private Mortgage Calculator&body=Check out this calculator: ${window.location.href}`, "_blank");
              }}
            >
              <Mail className="w-4 h-4 mr-2" /> Send via Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Embed Dialog */}
      <Dialog open={embedOpen} onOpenChange={setEmbedOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Embed This Calculator</DialogTitle>
            <DialogDescription className="font-body">Copy the code below and paste it into your website.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="bg-muted rounded-lg p-3">
              <code className="text-xs text-foreground break-all font-mono">{embedCode}</code>
            </div>
            <Button variant="outline" className="w-full font-body" onClick={() => copyToClipboard(embedCode)}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Embed Code"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MortgageCalculator;
