import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ToxicityMeter from "@/components/dashboard/ToxicityMeter";
import SupportPanel from "@/components/dashboard/SupportPanel";
import ContentList from "@/components/dashboard/ContentList";
import ContentAnalyzer from "@/components/dashboard/ContentAnalyzer";
import ReasonModal, { type FlaggedContent } from "@/components/dashboard/ReasonModal";
import { Shield, LogOut, Menu, X } from "lucide-react";
import shieldIllustration from "@/assets/shield-illustration.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toxicityScore, setToxicityScore] = useState(0);
  const [flaggedItems, setFlaggedItems] = useState<FlaggedContent[]>([]);
  const [lastMessage, setLastMessage] = useState<string>("No content analyzed yet. Try analyzing some text or an image!");

  const handleViewReason = (item: FlaggedContent) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  const handleAnalysisComplete = (results: FlaggedContent[], score: number, message: string) => {
    if (results.length > 0) {
      setFlaggedItems((prev) => [...results, ...prev]);
    }
    setToxicityScore(score);
    setLastMessage(message);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <img
                  src={shieldIllustration}
                  alt="SafeGuard"
                  className="w-7 h-7"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-foreground">SafeGuard</h1>
                <p className="text-xs text-muted-foreground">Your Safety Dashboard</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-slide-up">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Hello, Welcome Back! 👋
          </h2>
          <p className="text-muted-foreground">
            Let's check in on your online safety together.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toxicity Meter */}
            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <ToxicityMeter value={toxicityScore} message={lastMessage} />
            </div>

            {/* Content Analyzer */}
            <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <ContentAnalyzer
                onAnalysisComplete={handleAnalysisComplete}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
            </div>

            {/* Detected Content */}
            <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-moderate/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-moderate" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Detected Content</h3>
                  <p className="text-sm text-muted-foreground">
                    {flaggedItems.length === 0 
                      ? "No issues found yet" 
                      : `${flaggedItems.length} item(s) need your attention`}
                  </p>
                </div>
              </div>
              <ContentList items={flaggedItems} onViewReason={handleViewReason} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Panel */}
            <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
              <SupportPanel />
            </div>
          </div>
        </div>
      </main>

      {/* Reason Modal */}
      <ReasonModal
        content={selectedContent}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
