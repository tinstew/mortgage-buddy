import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Percent } from "lucide-react";

interface PercentInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function PercentInput({
  label = "Interest Rate",
  value,
  onChange,
  min = 1,
  max = 25,
  step = 0.25,
}: PercentInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Percent className="w-3.5 h-3.5 text-gold" />
          {label}
        </Label>
        <span className="text-lg font-bold text-foreground tabular-nums">
          {value.toFixed(2)}%
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
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
}
