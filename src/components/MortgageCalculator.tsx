import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Code, DollarSign, Percent, Calendar, Copy, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/generatePDF";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(val);

const formatCurrencyDetailed = (val: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(5);
  const [termYears, setTermYears] = useState(25);
  const [shareOpen, setShareOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const monthlyPayment = (loanAmount * (interestRate / 100)) / 12;
  const totalInterest = monthlyPayment * termYears * 12;

  const handleGenerateReport = useCallback(() => {
    generatePDF({ loanAmount, interestRate, termYears, monthlyPayment, totalInterest });
    toast({ title: "Report Generated", description: "Your PDF report has been downloaded." });
  }, [loanAmount, interestRate, termYears, monthlyPayment, totalInterest, toast]);

  const embedCode = `<iframe src="${window.location.origin}" width="100%" height="700" frameborder="0" style="border-radius:12px;"></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="navy-gradient py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-primary-foreground text-xl tracking-tight">MortgageCalc</h1>
              <p className="text-primary-foreground/60 text-xs font-body">Interest-Only Calculator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl text-foreground mb-3">
            Interest-Only Mortgage Calculator
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Instantly calculate your monthly interest payments and total cost over any term. Adjust the sliders below to explore scenarios.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Sliders Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 glass-card rounded-xl p-6 md:p-8"
          >
            <h3 className="text-lg text-foreground mb-6 font-display">Your Inputs</h3>

            {/* Loan Amount */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gold" /> Loan Amount
                </label>
                <span className="text-xl font-semibold text-foreground font-body">{formatCurrency(loanAmount)}</span>
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={([v]) => setLoanAmount(v)}
                min={0}
                max={5000000}
                step={10000}
                className="mortgage-slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1 font-body">
                <span>$0</span>
                <span>$5,000,000</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2">
                  <Percent className="w-4 h-4 text-gold" /> Annual Interest Rate
                </label>
                <span className="text-xl font-semibold text-foreground font-body">{interestRate.toFixed(2)}%</span>
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={([v]) => setInterestRate(v)}
                min={1}
                max={15}
                step={0.05}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1 font-body">
                <span>1%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Term */}
            <div className="mb-2">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold" /> Term (Years)
                </label>
                <span className="text-xl font-semibold text-foreground font-body">{termYears} years</span>
              </div>
              <Slider
                value={[termYears]}
                onValueChange={([v]) => setTermYears(v)}
                min={1}
                max={40}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1 font-body">
                <span>1 yr</span>
                <span>40 yrs</span>
              </div>
            </div>
          </motion.div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 flex flex-col gap-4"
          >
            <div className="glass-card rounded-xl p-6 flex-1">
              <h3 className="text-lg text-foreground mb-5 font-display">Your Results</h3>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-body mb-1">Monthly Payment</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={monthlyPayment.toFixed(2)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-3xl font-bold text-accent font-body"
                  >
                    {formatCurrencyDetailed(monthlyPayment)}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-muted-foreground font-body mt-1">Interest only, per month</p>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-body mb-1">Total Interest Over Term</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={totalInterest.toFixed(0)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-2xl font-bold text-foreground font-body"
                  >
                    {formatCurrencyDetailed(totalInterest)}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-muted-foreground font-body mt-1">Over {termYears} year{termYears !== 1 ? "s" : ""}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  💡 Interest-only payments do not reduce your principal. Your loan balance remains {formatCurrency(loanAmount)} throughout the term.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <Button onClick={handleGenerateReport} className="w-full gold-gradient text-accent-foreground hover:opacity-90 font-body font-semibold">
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

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-xs text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
            This calculator provides hypothetical estimates for informational purposes only. Results are not guaranteed and do not constitute financial advice. Please consult a licensed mortgage broker before making any financial decisions.
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
                window.open(`mailto:?subject=Interest-Only Mortgage Calculator&body=Check out this calculator: ${window.location.href}`, "_blank");
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
