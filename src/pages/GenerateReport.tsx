import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Film, ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const GenerateReport = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const [operations, setOperations] = useState({
    languageDetection: true,
    noiseProfile: true,
    avOffset: true,
    dirtDebris: true,
    perforations: false,
    edgeCodes: false,
    soundtrackDetection: true,
    filmGauge: false,
    process: false,
    aspectRatio: true,
    leaderTail: false,
    edgeDamage: true,
    dyeStability: false,
  });

  const operationsList = [
    { key: "languageDetection", label: "Language Detection", description: "Detect spoken language in soundtrack" },
    { key: "noiseProfile", label: "Noise Profile", description: "Analyze audio noise characteristics" },
    { key: "avOffset", label: "AV Offset", description: "Measure audio/video synchronization" },
    { key: "dirtDebris", label: "Dirt & Debris", description: "Detect particles and contamination" },
    { key: "perforations", label: "Perforations", description: "Analyze sprocket hole condition" },
    { key: "edgeCodes", label: "Edge Codes", description: "Read manufacturer edge codes" },
    { key: "soundtrackDetection", label: "Soundtrack Detection", description: "Identify audio track presence" },
    { key: "filmGauge", label: "Film Gauge", description: "Determine film width (8mm, 16mm, 35mm)" },
    { key: "process", label: "Process", description: "Identify film processing method" },
    { key: "aspectRatio", label: "Aspect Ratio", description: "Calculate frame dimensions ratio" },
    { key: "leaderTail", label: "Leader/Tail Condition", description: "Assess start/end reel condition" },
    { key: "edgeDamage", label: "Edge Damage", description: "Detect edge wear and tears" },
    { key: "dyeStability", label: "Dye Stability", description: "Measure color degradation" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} ready for processing`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleGenerateReport = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a film reel data file first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            toast({
              title: "Report generated successfully",
              description: "Your film analysis report is ready",
            });
            navigate("/reports/1");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-accent/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Generate New Report</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Upload your film reel data and select analysis operations
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Upload Section (very compact) */}
          <div className="lg:col-span-1 animate-fade-in">
            <Card className="bg-gradient-card shadow-medium">
              <CardHeader className="pb-2">
                <CardTitle>Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-border rounded-xl p-5 text-center hover:border-accent hover:bg-accent/5 transition-all cursor-pointer group"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
                  {selectedFile ? (
                    <div>
                      <p className="font-semibold text-foreground text-sm truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Click or drop file
                    </p>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".film,.dat,.raw"
                  />
                </div>

                {isGenerating && (
                  <div className="mt-4 animate-scale-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground">Processing</span>
                      <span className="text-xs text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Operations Section (4 columns, wide) */}
          <div className="lg:col-span-6 animate-fade-in-delayed">
            <Card className="bg-gradient-card shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle>Analysis Operations</CardTitle>
                <CardDescription>
                  Select the analyses you want to include in your report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                  {operationsList.map((op) => (
                    <div
                      key={op.key}
                      className="flex items-start space-x-2 p-2.5 rounded-lg hover:bg-secondary/40 transition-colors"
                    >
                      <Checkbox
                        id={op.key}
                        checked={operations[op.key as keyof typeof operations]}
                        onCheckedChange={(checked) =>
                          setOperations((prev) => ({
                            ...prev,
                            [op.key]:
                              typeof checked === "boolean" ? checked : !!checked,
                          }))
                        }
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={op.key}
                          className="text-sm font-medium leading-none cursor-pointer text-foreground"
                        >
                          {op.label}
                        </label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {op.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerateReport}
                    disabled={!selectedFile || isGenerating}
                    className="flex-1 bg-gradient-accent hover:opacity-90 text-primary-foreground font-semibold h-11"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Report"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
