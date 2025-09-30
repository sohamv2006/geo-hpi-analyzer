import { useState, useCallback } from "react";
import { Upload as UploadIcon, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { processWaterSamples, type WaterSample } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadedFile(file);

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      let data: any[] = [];

      if (fileExtension === "csv") {
        // Parse CSV
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            data = results.data as WaterSample[];
            processData(data);
          },
          error: (error) => {
            throw new Error(`CSV parsing error: ${error.message}`);
          },
        });
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        // Parse Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(firstSheet) as WaterSample[];
        processData(data);
      } else {
        throw new Error("Unsupported file format. Please upload CSV or Excel files.");
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to process file",
        variant: "destructive",
      });
    }
  };

  const processData = (data: WaterSample[]) => {
    if (!data || data.length === 0) {
      toast({
        title: "Empty File",
        description: "The uploaded file contains no data",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Process and calculate indices
    const results = processWaterSamples(data);

    // Store results in sessionStorage
    sessionStorage.setItem("waterAnalysisResults", JSON.stringify(results));

    setIsProcessing(false);
    toast({
      title: "Success",
      description: `Processed ${results.length} samples successfully`,
    });

    // Navigate to results page
    setTimeout(() => {
      navigate("/results");
    }, 500);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Upload Water Quality Data</h1>
          <p className="text-lg text-muted-foreground">
            Upload your CSV or Excel file containing groundwater heavy metal concentration measurements
          </p>
        </div>

        <Card className="mb-8 shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Data Format Requirements
            </CardTitle>
            <CardDescription>
              Your file should include the following columns:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                <span><strong>id</strong> - Unique identifier for each sample</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                <span><strong>latitude, longitude</strong> - Geographic coordinates (optional)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                <span><strong>Metal columns</strong> - Concentration values for metals like As, Cd, Cr, Cu, Fe, Pb, Mn, Ni, Zn, Hg (in mg/L)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-2 border-dashed transition-all ${
            isDragging
              ? "border-primary bg-primary/5 shadow-glow"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <UploadIcon className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              {isProcessing ? "Processing..." : "Drop your file here"}
            </h3>
            <p className="text-muted-foreground mb-6 text-center">
              or click the button below to browse
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              disabled={isProcessing}
            />
            <label htmlFor="file-upload">
              <Button disabled={isProcessing} asChild>
                <span className="cursor-pointer">
                  {isProcessing ? "Processing..." : "Select File"}
                </span>
              </Button>
            </label>
            {uploadedFile && (
              <p className="mt-4 text-sm text-muted-foreground">
                Selected: {uploadedFile.name}
              </p>
            )}
          </CardContent>
        </Card>

        <Alert className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Supported formats are CSV, XLSX, and XLS. Maximum file size is 10MB.
            Ensure your data follows the format requirements above for accurate calculations.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Upload;
