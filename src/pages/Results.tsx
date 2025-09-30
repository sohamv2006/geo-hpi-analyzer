import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Download, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";
import type { CalculationResult } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const [results, setResults] = useState<CalculationResult[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedResults = sessionStorage.getItem("waterAnalysisResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      toast({
        title: "No Data Found",
        description: "Please upload a file first",
        variant: "destructive",
      });
      navigate("/upload");
    }
  }, [navigate, toast]);

  const getCategoryBadge = (category: string) => {
    const variants: { [key: string]: { variant: "default" | "destructive" | "secondary"; icon: any } } = {
      Safe: { variant: "default", icon: ShieldCheck },
      "Slightly Polluted": { variant: "secondary", icon: AlertCircle },
      Hazardous: { variant: "destructive", icon: AlertTriangle },
    };

    const config = variants[category] || variants["Safe"];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {category}
      </Badge>
    );
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = ["ID", "Latitude", "Longitude", "HPI", "HEI", "Cd", "Category"];
    const csvContent = [
      headers.join(","),
      ...results.map((r) =>
        [r.id, r.latitude || "", r.longitude || "", r.hpi, r.hei, r.cd, r.category].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `water-analysis-results-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Results have been exported to CSV",
    });
  };

  const stats = {
    total: results.length,
    safe: results.filter((r) => r.category === "Safe").length,
    slightlyPolluted: results.filter((r) => r.category === "Slightly Polluted").length,
    hazardous: results.filter((r) => r.category === "Hazardous").length,
    avgHPI: results.length > 0 ? (results.reduce((sum, r) => sum + r.hpi, 0) / results.length).toFixed(2) : "0",
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analysis Results</h1>
            <p className="text-muted-foreground">
              Heavy Metal Pollution Indices for {results.length} samples
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => navigate("/visualization")}>
              View Charts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-card shadow-elevation">
            <CardHeader className="pb-2">
              <CardDescription>Total Samples</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card shadow-elevation border-success/50">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Safe
              </CardDescription>
              <CardTitle className="text-3xl text-success">{stats.safe}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card shadow-elevation border-warning/50">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Slightly Polluted
              </CardDescription>
              <CardTitle className="text-3xl text-warning">{stats.slightlyPolluted}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card shadow-elevation border-destructive/50">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Hazardous
              </CardDescription>
              <CardTitle className="text-3xl text-destructive">{stats.hazardous}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card shadow-elevation">
            <CardHeader className="pb-2">
              <CardDescription>Avg HPI</CardDescription>
              <CardTitle className="text-3xl">{stats.avgHPI}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Results Table */}
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
            <CardDescription>
              HPI: Heavy Metal Pollution Index | HEI: Heavy Metal Evaluation Index | Cd: Contamination Degree
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead className="text-right">HPI</TableHead>
                    <TableHead className="text-right">HEI</TableHead>
                    <TableHead className="text-right">Cd</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.id}</TableCell>
                      <TableCell>{result.latitude?.toFixed(6) || "N/A"}</TableCell>
                      <TableCell>{result.longitude?.toFixed(6) || "N/A"}</TableCell>
                      <TableCell className="text-right font-mono">{result.hpi}</TableCell>
                      <TableCell className="text-right font-mono">{result.hei}</TableCell>
                      <TableCell className="text-right font-mono">{result.cd}</TableCell>
                      <TableCell>{getCategoryBadge(result.category)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
