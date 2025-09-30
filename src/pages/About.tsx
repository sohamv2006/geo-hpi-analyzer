import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, HelpCircle, Calculator, Database, Info } from "lucide-react";
import { WHO_STANDARDS } from "@/lib/calculations";

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About HMPI Calculator</h1>
          <p className="text-lg text-muted-foreground">
            Learn how to use this tool and understand heavy metal pollution indices
          </p>
        </div>

        {/* How to Use */}
        <Card className="mb-8 shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              How to Use This Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Prepare Your Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Format your groundwater data in CSV or Excel with columns for sample ID, optional coordinates (latitude/longitude), and metal concentrations in mg/L.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Upload Your File</h3>
                  <p className="text-sm text-muted-foreground">
                    Navigate to the Upload Data page and either drag-and-drop your file or click to browse. The system will automatically process your data.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Review Results</h3>
                  <p className="text-sm text-muted-foreground">
                    View calculated HPI, HEI, and Cd indices for each sample. Results are categorized as Safe, Slightly Polluted, or Hazardous based on standard thresholds.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Visualize & Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore interactive charts and maps showing pollution patterns. Export results to CSV for further analysis or reporting.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Understanding Indices */}
        <Card className="mb-8 shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Understanding Pollution Indices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="hpi">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">Heavy Metal Pollution Index (HPI)</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>
                    HPI is a weighted arithmetic mean method that reflects the composite influence of individual heavy metals on overall water quality.
                  </p>
                  <p className="font-mono text-sm bg-muted p-2 rounded">
                    HPI = Σ(Wi × Qi) / ΣWi
                  </p>
                  <p>
                    Where Wi is the weight of each metal (inversely proportional to its standard limit) and Qi is the sub-index representing the ratio of concentration to standard value.
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">Classification:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>HPI &lt; 100: Safe</li>
                      <li>100 ≤ HPI &lt; 200: Slightly Polluted</li>
                      <li>HPI ≥ 200: Hazardous</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="hei">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">Heavy Metal Evaluation Index (HEI)</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>
                    HEI evaluates the cumulative toxic effects of multiple heavy metals by summing the ratios of each metal concentration to its standard value.
                  </p>
                  <p className="font-mono text-sm bg-muted p-2 rounded">
                    HEI = Σ(Ci / Si)
                  </p>
                  <p>
                    Where Ci is the concentration of metal i and Si is its standard permissible limit.
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">Interpretation:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>HEI &lt; 10: Low pollution</li>
                      <li>10 ≤ HEI &lt; 20: Medium pollution</li>
                      <li>HEI ≥ 20: High pollution</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cd">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">Contamination Degree (Cd)</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>
                    Cd measures the overall contamination level by summing individual contamination factors for each metal.
                  </p>
                  <p className="font-mono text-sm bg-muted p-2 rounded">
                    Cd = Σ(Ci / Si)
                  </p>
                  <p>
                    Similar to HEI, it provides a cumulative measure of pollution intensity across all measured heavy metals.
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">Guidelines:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Cd &lt; 1: Unpolluted</li>
                      <li>1 ≤ Cd &lt; 3: Slightly polluted</li>
                      <li>Cd ≥ 3: Moderately to heavily polluted</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* WHO Standards */}
        <Card className="mb-8 shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              WHO Guideline Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Maximum permissible concentrations (mg/L) used for calculations:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(WHO_STANDARDS).map(([metal, value]) => (
                <div key={metal} className="bg-muted/50 p-3 rounded-lg">
                  <div className="font-semibold text-lg">{metal}</div>
                  <div className="text-sm text-muted-foreground">{value} mg/L</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Impact */}
        <Card className="mb-8 shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Health Impact of Heavy Metals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Heavy metal contamination in groundwater poses significant health risks through drinking water consumption and food chain accumulation. Different metals have varying toxicological effects:
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Arsenic (As)</h4>
                <p className="text-sm">Causes skin lesions, cancer, cardiovascular disease, and developmental issues.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Lead (Pb)</h4>
                <p className="text-sm">Affects brain development in children, causes neurological damage and kidney problems.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Cadmium (Cd)</h4>
                <p className="text-sm">Damages kidneys, bones, and may cause cancer with chronic exposure.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Mercury (Hg)</h4>
                <p className="text-sm">Toxic to nervous, digestive, and immune systems; particularly harmful to developing fetuses.</p>
              </div>
            </div>
            <p className="text-sm pt-2">
              Regular monitoring and assessment using indices like HPI helps identify contaminated areas requiring intervention to protect public health.
            </p>
          </CardContent>
        </Card>

        {/* References */}
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              References & Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• World Health Organization (WHO) - Guidelines for Drinking-water Quality</p>
            <p>• Prasad, B. & Bose, J.M. (2001). Evaluation of heavy metal pollution index for surface and spring water near a limestone mining area</p>
            <p>• Edet, A.E. & Offiong, O.E. (2002). Evaluation of water quality pollution indices for heavy metal contamination monitoring</p>
            <p>• US EPA - National Primary Drinking Water Regulations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
