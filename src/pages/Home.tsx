import { ArrowRight, Shield, BarChart3, FileUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-water.jpg";

const Home = () => {
  const features = [
    {
      icon: FileUp,
      title: "Easy Data Upload",
      description: "Upload CSV or Excel files containing groundwater heavy metal concentration data with geo-coordinates.",
    },
    {
      icon: BarChart3,
      title: "Automatic Computation",
      description: "Calculates Heavy Metal Pollution Indices (HPI, HEI, Cd) using standard scientific formulas.",
    },
    {
      icon: Shield,
      title: "Quality Assessment",
      description: "Categorizes water quality as Safe, Slightly Polluted, or Hazardous based on computed indices.",
    },
    {
      icon: AlertTriangle,
      title: "Visual Analytics",
      description: "Interactive charts and maps to visualize contaminated areas and pollution patterns.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Groundwater monitoring"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Heavy Metal Pollution Index Calculator
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              A comprehensive tool for analyzing groundwater quality and assessing heavy metal contamination risks to public health and the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/upload">
                <Button size="lg" variant="secondary" className="group shadow-glow">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Monitor Heavy Metals?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Heavy metal contamination in groundwater poses serious health risks. Early detection and monitoring are crucial for protecting communities.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
                <CardContent className="p-6">
                  <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Understanding Heavy Metal Pollution</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Heavy metals such as lead, arsenic, cadmium, and mercury can accumulate in groundwater through industrial discharge, agricultural runoff, and natural geological processes.
                </p>
                <p>
                  Prolonged exposure to contaminated water can lead to serious health issues including neurological damage, kidney disease, cancer, and developmental disorders in children.
                </p>
                <p>
                  The Heavy Metal Pollution Index (HMPI) provides a standardized way to assess water quality and identify areas requiring immediate attention.
                </p>
              </div>
            </div>
            <div className="bg-gradient-card rounded-lg p-8 border border-border shadow-elevation">
              <h3 className="text-2xl font-bold mb-4">Key Indices</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-1">HPI - Heavy Metal Pollution Index</h4>
                  <p className="text-sm text-muted-foreground">Assesses overall contamination level</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">HEI - Heavy Metal Evaluation Index</h4>
                  <p className="text-sm text-muted-foreground">Evaluates cumulative toxic effects</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Cd - Contamination Degree</h4>
                  <p className="text-sm text-muted-foreground">Measures pollution intensity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Analyze Your Water Quality?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Upload your groundwater data and get instant pollution index calculations with detailed visualizations.
          </p>
          <Link to="/upload">
            <Button size="lg" variant="secondary" className="shadow-glow">
              Start Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
