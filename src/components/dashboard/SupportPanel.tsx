import React from "react";
import { Heart, MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportPanelProps {
  className?: string;
}

const SupportPanel: React.FC<SupportPanelProps> = ({ className }) => {
  return (
    <div className={cn("support-panel", className)}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground mb-2">
            You're Not in Trouble
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Sometimes online content can be confusing or upsetting. If something makes you uncomfortable, 
            it's okay to stop and talk to a trusted adult. We're here to help you stay safe.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <div className="w-8 h-8 rounded-lg bg-safe/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-safe" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Talk to Someone</p>
                <p className="text-xs text-muted-foreground">Share how you feel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Find a Trusted Adult</p>
                <p className="text-xs text-muted-foreground">Parent, teacher, or counselor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-card border border-border">
        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <span className="text-lg">💡</span>
          What Can You Do?
        </h4>
        <ul className="space-y-2 text-sm text-foreground/80">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">1.</span>
            <span>Take a deep breath. It's okay to feel confused or worried.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">2.</span>
            <span>Don't respond to anything that makes you uncomfortable.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">3.</span>
            <span>Talk to a trusted adult about what you've seen.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">4.</span>
            <span>Remember: You can always step away from the screen.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SupportPanel;
