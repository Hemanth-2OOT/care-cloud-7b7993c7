import React from "react";
import { Button } from "@/components/ui/button";
import { SeverityBadge, HarmTypeBadge } from "@/components/badges/StatusBadges";
import type { FlaggedContent } from "@/components/dashboard/ReasonModal";
import { HelpCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContentListProps {
  items: FlaggedContent[];
  onViewReason: (item: FlaggedContent) => void;
}

const ContentList: React.FC<ContentListProps> = ({ items, onViewReason }) => {
  if (items.length === 0) {
    return (
      <div className="card-friendly p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-safe/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h3 className="font-bold text-lg text-foreground mb-2">All Clear!</h3>
        <p className="text-muted-foreground">
          No concerning content has been detected. Keep up the great work staying safe online!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="card-friendly p-4 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Content Preview */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <HarmTypeBadge type={item.harmType} />
                <SeverityBadge level={item.severity} />
              </div>
              
              <p className="text-foreground/80 text-sm line-clamp-2 mb-2">
                {item.content}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
              </div>
            </div>

            {/* Action */}
            <Button
              variant="soft"
              size="sm"
              onClick={() => onViewReason(item)}
              className="flex-shrink-0"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" />
              Why?
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentList;
