import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DollarSign } from "lucide-react";
import { formatCAD } from "@/lib/mortgage-utils";

interface CurrencyInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function CurrencyInput({
  label = "Loan Amount",
  value,
  onChange,
  min = 10_000,
  max = 5_000_000,
  step = 10_000,
}: CurrencyInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-gold" />
          {label}
        </Label>
        <span className="text-lg font-bold text-foreground tabular-nums">
          {formatCAD(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{formatCAD(min)}</span>
        <span>{formatCAD(max)}</span>
      </div>
    </div>
  );
}
