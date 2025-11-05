import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Film, Volume2, Gauge, Palette, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Guide = () => {
  const navigate = useNavigate();

  const operations = [
    {
      icon: Volume2,
      title: "Audio Analysis",
      items: [
        {
          name: "Language Detection",
          description: "Analyzes the audio track to identify the spoken language(s) present in the film. Uses acoustic modeling and linguistic patterns to determine language with high accuracy.",
        },
        {
          name: "Noise Profile",
          description: "Characterizes the background noise in the audio track, measuring frequency distribution and amplitude. Essential for restoration and cleaning processes.",
        },
        {
          name: "AV Offset",
          description: "Measures synchronization between audio and video tracks by detecting lip sync and visual cues. Reports drift in milliseconds across the film's duration.",
        },
        {
          name: "Soundtrack Detection",
          description: "Identifies the presence and type of soundtrack (optical, magnetic, or both). Analyzes track position and quality for proper digitization.",
        },
      ],
    },
    {
      icon: Film,
      title: "Physical Condition",
      items: [
        {
          name: "Dirt & Debris",
          description: "Scans each frame for foreign particles, scratches, and contamination. Provides particle count and size distribution for cleaning assessment.",
        },
        {
          name: "Perforations",
          description: "Examines sprocket holes for damage, wear, or deformation. Critical for ensuring proper film transport during digitization.",
        },
        {
          name: "Edge Damage",
          description: "Detects tears, curling, and brittleness along film edges. Essential for determining handling procedures and restoration needs.",
        },
        {
          name: "Leader/Tail Condition",
          description: "Assesses the state of leader and tail sections, checking for splices, damage, and proper labeling.",
        },
      ],
    },
    {
      icon: Gauge,
      title: "Technical Specifications",
      items: [
        {
          name: "Film Gauge",
          description: "Determines the physical width of the film stock (8mm, Super 8, 16mm, 35mm, 70mm). Automatically configures digitization parameters.",
        },
        {
          name: "Edge Codes",
          description: "Reads manufacturer edge codes and key numbers printed on the film. Provides dating, stock type, and manufacturing information.",
        },
        {
          name: "Aspect Ratio",
          description: "Calculates the frame dimensions ratio (e.g., 1.33:1, 1.85:1, 2.39:1) to ensure proper reproduction during digitization.",
        },
        {
          name: "Process",
          description: "Identifies the film processing method used (e.g., Eastmancolor, Technicolor, black & white). Informs color correction strategies.",
        },
      ],
    },
    {
      icon: Palette,
      title: "Color & Image Quality",
      items: [
        {
          name: "Dye Stability",
          description: "Measures color fading and dye layer degradation over the film's length. Tracks color shift trends and estimates preservation urgency.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-5xl mx-auto px-6 py-8">
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
            <BookOpen className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">How It's Done</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Understanding film digitization analysis operations
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 animate-fade-in bg-gradient-card shadow-medium border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  About Film Digitization Analysis
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Film digitization analysis is a comprehensive process that examines every aspect of analog film 
                  to ensure optimal digital preservation. Our system performs automated detection and measurement 
                  of physical condition, technical specifications, and quality metrics to guide restoration and 
                  digitization workflows.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operations by Category */}
        <div className="space-y-6 animate-fade-in-delayed">
          {operations.map((category) => (
            <Card key={category.title} className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <category.icon className="w-6 h-6 text-accent" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent">
                        {item.name}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <Card className="mt-8 animate-fade-in-delayed bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Film className="w-6 h-6 text-accent" />
              Analysis Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </span>
                <div>
                  <p className="font-semibold text-foreground">Upload Film Data</p>
                  <p>Load your film reel data file containing scanned frames and metadata</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </span>
                <div>
                  <p className="font-semibold text-foreground">Select Operations</p>
                  <p>Choose which analysis operations to perform based on your needs</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </span>
                <div>
                  <p className="font-semibold text-foreground">Automated Analysis</p>
                  <p>The system processes your film data using computer vision and signal processing</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-primary-foreground flex items-center justify-center font-semibold">
                  4
                </span>
                <div>
                  <p className="font-semibold text-foreground">Review Results</p>
                  <p>Examine detailed charts and metrics to guide your digitization and restoration process</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Guide;
