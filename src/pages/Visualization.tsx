import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Upload, Map as MapIcon, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import type { CalculationResult } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";
import "leaflet/dist/leaflet.css";

const Visualization = () => {
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
    }
  }, [toast]);

  if (results.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-elevation">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Upload className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
              <p className="text-muted-foreground mb-6 text-center">
                Upload your water quality data to see visualizations
              </p>
              <Button onClick={() => navigate("/upload")}>
                Upload Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const categoryData = [
    { name: "Safe", value: results.filter((r) => r.category === "Safe").length, color: "hsl(var(--success))" },
    { name: "Slightly Polluted", value: results.filter((r) => r.category === "Slightly Polluted").length, color: "hsl(var(--warning))" },
    { name: "Hazardous", value: results.filter((r) => r.category === "Hazardous").length, color: "hsl(var(--destructive))" },
  ].filter(d => d.value > 0);

  const indicesData = results.map((r) => ({
    name: r.id,
    HPI: r.hpi,
    HEI: r.hei,
    Cd: r.cd,
  }));

  const samplesWithCoordinates = results.filter((r) => r.latitude && r.longitude);
  const hasMapData = samplesWithCoordinates.length > 0;

  const getMarkerColor = (category: string) => {
    switch (category) {
      case "Safe": return "#10b981";
      case "Slightly Polluted": return "#f59e0b";
      case "Hazardous": return "#ef4444";
      default: return "#3b82f6";
    }
  };

  const defaultCenter: [number, number] = hasMapData 
    ? [Number(samplesWithCoordinates[0].latitude), Number(samplesWithCoordinates[0].longitude)]
    : [0, 0];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Data Visualization</h1>
          <p className="text-muted-foreground">
            Interactive charts and maps for {results.length} water quality samples
          </p>
        </div>

        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2" disabled={!hasMapData}>
              <MapIcon className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            {/* Category Distribution */}
            <Card className="shadow-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Water Quality Distribution
                </CardTitle>
                <CardDescription>
                  Distribution of samples by pollution category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name}: ${(Number(percent) * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* HPI Bar Chart */}
            <Card className="shadow-elevation">
              <CardHeader>
                <CardTitle>Heavy Metal Pollution Index (HPI)</CardTitle>
                <CardDescription>
                  Comparison of HPI values across samples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={indicesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="HPI" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Indices Line Chart */}
            <Card className="shadow-elevation">
              <CardHeader>
                <CardTitle>All Pollution Indices</CardTitle>
                <CardDescription>
                  Trends across HPI, HEI, and Cd values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={indicesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="HPI" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="HEI" stroke="hsl(var(--secondary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="Cd" stroke="hsl(var(--accent))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            {hasMapData ? (
              <Card className="shadow-elevation">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>
                    Location of water samples colored by pollution category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] rounded-lg overflow-hidden border border-border">
                    <MapContainer
                      center={defaultCenter}
                      zoom={6}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {samplesWithCoordinates.map((sample, index) => (
                        <CircleMarker
                          key={index}
                          center={[sample.latitude!, sample.longitude!]}
                          radius={8}
                          fillColor={getMarkerColor(sample.category)}
                          color="#fff"
                          weight={2}
                          opacity={1}
                          fillOpacity={0.7}
                        >
                          <Popup>
                            <div className="text-sm">
                              <p className="font-semibold">{sample.id}</p>
                              <p className="text-xs">Category: {sample.category}</p>
                              <p className="text-xs">HPI: {sample.hpi}</p>
                              <p className="text-xs">HEI: {sample.hei}</p>
                              <p className="text-xs">Cd: {sample.cd}</p>
                            </div>
                          </Popup>
                        </CircleMarker>
                      ))}
                    </MapContainer>
                  </div>
                  <div className="mt-4 flex gap-4 justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#10b981" }} />
                      <span>Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
                      <span>Slightly Polluted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#ef4444" }} />
                      <span>Hazardous</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-elevation">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <MapIcon className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No Geographic Data</h2>
                  <p className="text-muted-foreground text-center">
                    Your data doesn't include latitude and longitude coordinates
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Visualization;
