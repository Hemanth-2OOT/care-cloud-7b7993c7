import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, Upload, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ContentAnalyzerProps {
  onAnalysisComplete: (results: any) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
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

    // Simulate AI analysis - in production this would call the AI API
    setTimeout(() => {
      // Mock results for demonstration
      const mockResults = generateMockResults(textContent);
      onAnalysisComplete(mockResults);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: `Found ${mockResults.length} item(s) to review.`,
      });
    }, 2000);
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      toast({
        title: "No image selected",
        description: "Please upload an image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = generateMockImageResults();
      onAnalysisComplete(mockResults);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Image has been analyzed for safety.",
      });
    }, 2500);
  };

  return (
    <div className="card-friendly p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">AI Content Analyzer</h3>
          <p className="text-sm text-muted-foreground">Check if content is safe</p>
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
                Analyzing...
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
                Analyzing...
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

// Mock data generators for demonstration
function generateMockResults(text: string) {
  const results = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("hate") || lowerText.includes("stupid")) {
    results.push({
      id: crypto.randomUUID(),
      content: text.slice(0, 100),
      harmType: "hate-speech" as const,
      severity: "medium" as const,
      reason: "Contains potentially harmful language",
      explanation: "This content was flagged because it uses words that can hurt or upset people. Using kind words helps everyone feel welcome and respected online.",
      timestamp: new Date(),
    });
  }
  
  if (lowerText.includes("hurt") || lowerText.includes("harm")) {
    results.push({
      id: crypto.randomUUID(),
      content: text.slice(0, 100),
      harmType: "self-harm" as const,
      severity: "high" as const,
      reason: "Contains concerning themes",
      explanation: "This content mentions topics that could be concerning. If you or someone you know is struggling, please talk to a trusted adult or reach out for help.",
      timestamp: new Date(),
    });
  }

  if (results.length === 0 && text.length > 10) {
    // Safe content
    return [];
  }

  return results;
}

function generateMockImageResults() {
  return [];
}

export default ContentAnalyzer;
