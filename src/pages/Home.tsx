import { Film, FileText, Settings, BookOpen, PlayCircle, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const navigationCards = [
    {
      title: "Generate New Report",
      description: "Upload film reel data and select analysis operations to create a new digitization report",
      icon: Film,
      path: "/generate",
      gradient: "from-accent to-amber-400",
      badge: "Start Here"
    },
    {
      title: "View Old Reports",
      description: "Browse and access past analysis reports with detailed visualizations and metrics",
      icon: FileText,
      path: "/reports",
      gradient: "from-primary to-slate-700",
      badge: null
    },
    {
      title: "Settings",
      description: "Configure constants and thresholds for analysis operations and customize your workflow",
      icon: Settings,
      path: "/settings",
      gradient: "from-muted-foreground to-slate-500",
      badge: null
    },
    {
      title: "How It's Done",
      description: "Learn about the film digitization process and understand each analysis operation",
      icon: BookOpen,
      path: "/guide",
      gradient: "from-accent/80 to-orange-400",
      badge: null
    }
  ];

  const features = [
    "AI-powered film analysis",
    "Real-time quality metrics",
    "Professional reporting",
    "Archival-grade accuracy"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Logo and Title */}
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
                <div className="relative bg-gradient-to-br from-accent to-amber-400 p-4 rounded-2xl shadow-glow">
                  <Film className="w-16 h-16 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground tracking-tight">
                Filmic Technologies
                <span className="block text-accent mt-2">Inspection Dashboard</span>
              </h1>
            </div>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Professional film reel analysis and digitization reporting for archivists and engineers
            </p>
            
            {/* Features badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {features.map((feature, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="px-4 py-2 text-sm bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20 transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  {feature}
                </Badge>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-6 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/generate">
                <Button 
                  size="lg" 
                  className="bg-gradient-accent hover:opacity-90 text-primary-foreground font-semibold text-lg px-8 py-6 shadow-glow hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Start New Analysis
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="hsl(var(--background))" fillOpacity="0.2"/>
            <path d="M0 40L60 46.7C120 53 240 67 360 70C480 73 600 67 720 63.3C840 60 960 60 1080 63.3C1200 67 1320 73 1380 76.7L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V40Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What would you like to do?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our suite of professional tools designed for film archivists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-fade-in-delayed">
          {navigationCards.map((card, index) => (
            <Link 
              key={card.path} 
              to={card.path} 
              className="group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="relative h-full overflow-hidden transition-all duration-300 hover:shadow-glow hover:-translate-y-2 bg-gradient-card border-border/50 hover:border-accent/50">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge */}
                {card.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-white border-0 shadow-medium">
                      {card.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="relative space-y-4">
                  {/* Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-medium group-hover:shadow-glow group-hover:scale-110 transition-all duration-300`}>
                      <card.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <CardTitle className="text-2xl font-bold text-card-foreground group-hover:text-accent transition-colors duration-300 flex items-center justify-between">
                    <span>{card.title}</span>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                  </CardTitle>
                  
                  {/* Description */}
                  <CardDescription className="text-base text-muted-foreground leading-relaxed min-h-[3rem]">
                    {card.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  <div className="h-1 w-0 bg-gradient-to-r from-accent to-amber-400 group-hover:w-full transition-all duration-500 rounded-full" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card/30 backdrop-blur-sm border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2 animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-accent">99.9%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-accent">6+</div>
              <div className="text-sm text-muted-foreground">AI Models</div>
            </div>
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-accent">24fps</div>
              <div className="text-sm text-muted-foreground">Real-time Analysis</div>
            </div>
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-accent">∞</div>
              <div className="text-sm text-muted-foreground">Film Formats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              <p>Filmic Technologies Inspection Dashboard • Professional archival analysis tools</p>
            </div>
            <p className="text-xs">Built for archivists, by archivists</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
