import React from "react";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, Sparkles } from "lucide-react";

interface ToxicityMeterProps {
  value: number; // 0-100
  className?: string;
}

const ToxicityMeter: React.FC<ToxicityMeterProps> = ({ value, className }) => {
  const getStatus = () => {
    if (value <= 33) return { label: "Safe", color: "bg-safe", icon: Sparkles };
    if (value <= 66) return { label: "Moderate", color: "bg-moderate", icon: AlertTriangle };
    return { label: "High", color: "bg-high", icon: AlertTriangle };
  };

  const { label, color, icon: Icon } = getStatus();

  return (
    <div className={cn("card-friendly p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Safety Level</h3>
            <p className="text-sm text-muted-foreground">Current content status</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Icon className={cn(
            "w-5 h-5",
            value <= 33 ? "text-safe" : value <= 66 ? "text-moderate" : "text-high"
          )} />
          <span className={cn(
            "font-bold text-lg",
            value <= 33 ? "text-safe" : value <= 66 ? "text-moderate" : "text-high"
          )}>
            {label}
          </span>
        </div>
      </div>

      {/* Meter Track */}
      <div className="relative h-4 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out",
            color
          )}
          style={{ width: `${value}%` }}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-safe" />
          Safe
        </span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-moderate" />
          Moderate
        </span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-high" />
          High
        </span>
      </div>

      {/* Friendly Message */}
      <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-sm text-foreground/80">
          {value <= 33 
            ? "Everything looks good! The content appears safe and friendly."
            : value <= 66
            ? "Some content may need attention. Take a moment to review flagged items."
            : "Some concerning content was found. Please review with a trusted adult."}
        </p>
      </div>
    </div>
  );
};

export default ToxicityMeter;
