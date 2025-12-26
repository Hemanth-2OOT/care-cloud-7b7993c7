import React from "react";
import { Shield, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type SeverityLevel = "low" | "medium" | "high";
export type HarmType = "hate-speech" | "abuse" | "self-harm" | "explicit";

interface SeverityBadgeProps {
  level: SeverityLevel;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ level, className }) => {
  const config = {
    low: {
      label: "Low",
      icon: Info,
      classes: "badge-safe",
    },
    medium: {
      label: "Medium",
      icon: AlertTriangle,
      classes: "badge-moderate",
    },
    high: {
      label: "High",
      icon: AlertTriangle,
      classes: "badge-high",
    },
  };

  const { label, icon: Icon, classes } = config[level];

  return (
    <span className={cn(classes, className)}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

interface HarmTypeBadgeProps {
  type: HarmType;
  className?: string;
}

export const HarmTypeBadge: React.FC<HarmTypeBadgeProps> = ({ type, className }) => {
  const config = {
    "hate-speech": {
      label: "Hate Speech",
      bgClass: "bg-hate-speech-bg",
      textClass: "text-hate-speech",
    },
    abuse: {
      label: "Abuse",
      bgClass: "bg-abuse-bg",
      textClass: "text-abuse",
    },
    "self-harm": {
      label: "Self-Harm",
      bgClass: "bg-self-harm-bg",
      textClass: "text-self-harm",
    },
    explicit: {
      label: "Explicit Content",
      bgClass: "bg-explicit-bg",
      textClass: "text-explicit",
    },
  };

  const { label, bgClass, textClass } = config[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
        bgClass,
        textClass,
        className
      )}
    >
      <Shield className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};
