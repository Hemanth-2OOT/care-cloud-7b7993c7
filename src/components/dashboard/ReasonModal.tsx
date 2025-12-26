import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SeverityBadge, HarmTypeBadge, type SeverityLevel, type HarmType } from "@/components/badges/StatusBadges";
import { Info, Heart, CheckCircle } from "lucide-react";

export interface FlaggedContent {
  id: string;
  content: string;
  harmType: HarmType;
  severity: SeverityLevel;
  reason: string;
  explanation: string;
  timestamp: Date;
}

interface ReasonModalProps {
  content: FlaggedContent | null;
  open: boolean;
  onClose: () => void;
}

const ReasonModal: React.FC<ReasonModalProps> = ({ content, open, onClose }) => {
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-2 rounded-3xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-xl font-bold">
                Why was this flagged?
              </DialogTitle>
            </div>
            <DialogDescription className="text-foreground/70">
              Let's understand together why this content was marked.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <HarmTypeBadge type={content.harmType} />
            <SeverityBadge level={content.severity} />
          </div>

          {/* The flagged content preview */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-1 font-medium">Content:</p>
            <p className="text-foreground/80 text-sm line-clamp-3">{content.content}</p>
          </div>

          {/* Explanation */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              The Reason
            </h4>
            <p className="text-foreground/80 leading-relaxed">
              {content.explanation}
            </p>
          </div>

          {/* Reassurance */}
          <div className="p-4 rounded-xl bg-safe-bg border border-safe/20">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-safe flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-safe-foreground mb-1">Remember</p>
                <p className="text-sm text-safe-foreground/80">
                  Our goal is to help you understand what's safe and keep you protected online. 
                  You're doing great by learning about this!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <Button onClick={onClose} variant="friendly" size="lg" className="w-full">
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReasonModal;
