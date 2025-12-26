import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, Upload, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { FlaggedContent } from "@/components/dashboard/ReasonModal";
import type { HarmType, SeverityLevel } from "@/components/badges/StatusBadges";

interface ContentAnalyzerProps {
  onAnalysisComplete: (results: FlaggedContent[], toxicityScore: number, message: string) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
}

interface AnalysisIssue {
  harmType: HarmType;
  severity: SeverityLevel;
  content: string;
  reason: string;
  explanation: string;
}

interface AnalysisResult {
  toxicityScore: number;
  issues: AnalysisIssue[];
  overallSafe: boolean;
  friendlyMessage: string;
  error?: string;
}

const ContentAnalyzer: React.FC<ContentAnalyzerProps> = ({
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
}) => {
  const { toast } = useToast();
  const [textContent, setTextContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeText = async () => {
    if (!textContent.trim()) {
      toast({
        title: "Nothing to analyze",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke<AnalysisResult>("analyze-text", {
        body: { text: textContent },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data) {
        const flaggedContent: FlaggedContent[] = data.issues.map((issue, index) => ({
          id: crypto.randomUUID(),
          content: issue.content || textContent.slice(0, 100),
          harmType: issue.harmType,
          severity: issue.severity,
          reason: issue.reason,
          explanation: issue.explanation,
          timestamp: new Date(),
        }));

        onAnalysisComplete(flaggedContent, data.toxicityScore, data.friendlyMessage);

        toast({
          title: data.overallSafe ? "Content is Safe! 🎉" : "Analysis Complete",
          description: data.friendlyMessage,
          variant: data.overallSafe ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview) {
      toast({
        title: "No image selected",
        description: "Please upload an image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke<AnalysisResult>("analyze-image", {
        body: { imageBase64: imagePreview },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data) {
        const flaggedContent: FlaggedContent[] = data.issues.map((issue) => ({
          id: crypto.randomUUID(),
          content: `[Image] ${issue.content}`,
          harmType: issue.harmType,
          severity: issue.severity,
          reason: issue.reason,
          explanation: issue.explanation,
          timestamp: new Date(),
        }));

        onAnalysisComplete(flaggedContent, data.toxicityScore, data.friendlyMessage);

        toast({
          title: data.overallSafe ? "Image is Safe! 🎉" : "Analysis Complete",
          description: data.friendlyMessage,
          variant: data.overallSafe ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card-friendly p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">AI Content Analyzer</h3>
          <p className="text-sm text-muted-foreground">Powered by Gemini AI</p>
        </div>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-12 rounded-xl bg-muted p-1">
          <TabsTrigger 
            value="text" 
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft font-semibold"
          >
            <FileText className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger 
            value="image"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft font-semibold"
          >
            <Image className="w-4 h-4 mr-2" />
            Image
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-semibold">
              Content to Check
            </Label>
            <Textarea
              id="content"
              placeholder="Paste or type the content you want to check..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="min-h-32 resize-none rounded-xl border-2 p-4"
            />
          </div>
          <Button
            onClick={analyzeText}
            variant="friendly"
            size="lg"
            className="w-full"
            disabled={isAnalyzing || !textContent.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Text
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-semibold">
              Upload Image
            </Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer",
                imagePreview 
                  ? "border-primary/40 bg-primary/5" 
                  : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted"
              )}
              onClick={() => document.getElementById("image-input")?.click()}
            >
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click to change image
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </>
              )}
              <Input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          <Button
            onClick={analyzeImage}
            variant="friendly"
            size="lg"
            className="w-full"
            disabled={isAnalyzing || !imageFile}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Image
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentAnalyzer;
