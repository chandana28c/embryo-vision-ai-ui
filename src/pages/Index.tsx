
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { FileInput, BarChart as BarChartIcon, PieChart as PieChartIcon } from "lucide-react";

interface PredictionResult {
  predictedClass: string;
  confidence: number;
  probabilities: { class: string; probability: number }[];
}

interface AnalysisMetrics {
  accuracy: number;
  confusionMatrix: number[][];
  rocData: { fpr: number; tpr: number }[];
  accuracyHistory: { epoch: number; accuracy: number }[];
  lossHistory: { epoch: number; loss: number }[];
}

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [analysisMetrics, setAnalysisMetrics] = useState<AnalysisMetrics | null>(null);
  const [error, setError] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const embryoClasses = ["1-1-2", "2-2-2", "3-2-2", "2-1-3", "arrested", "morula", "early"];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setError("");
        // Simulate AI prediction
        simulatePrediction();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulatePrediction = () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock prediction results
      const randomClass = embryoClasses[Math.floor(Math.random() * embryoClasses.length)];
      const mockProbabilities = embryoClasses.map(cls => ({
        class: cls,
        probability: Math.random() * 100
      })).sort((a, b) => b.probability - a.probability);
      
      // Normalize probabilities to sum to 100
      const total = mockProbabilities.reduce((sum, p) => sum + p.probability, 0);
      const normalizedProbs = mockProbabilities.map(p => ({
        ...p,
        probability: (p.probability / total) * 100
      }));

      setPredictionResult({
        predictedClass: normalizedProbs[0].class,
        confidence: normalizedProbs[0].probability,
        probabilities: normalizedProbs
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleShowAnalysis = () => {
    setShowAnalysis(true);
    
    // Generate mock analysis data
    const mockMetrics: AnalysisMetrics = {
      accuracy: 87.5,
      confusionMatrix: [
        [45, 3, 2, 1, 0, 1, 0],
        [2, 38, 1, 2, 1, 0, 1],
        [1, 2, 42, 3, 1, 0, 1],
        [0, 1, 2, 41, 2, 1, 0],
        [1, 0, 1, 1, 35, 2, 3],
        [0, 1, 0, 0, 1, 39, 2],
        [1, 0, 0, 1, 2, 1, 38]
      ],
      rocData: Array.from({length: 20}, (_, i) => ({
        fpr: i / 19,
        tpr: Math.min(1, (i / 19) + Math.random() * 0.3)
      })),
      accuracyHistory: Array.from({length: 50}, (_, i) => ({
        epoch: i + 1,
        accuracy: Math.min(90, 60 + i * 0.6 + Math.random() * 5)
      })),
      lossHistory: Array.from({length: 50}, (_, i) => ({
        epoch: i + 1,
        loss: Math.max(0.1, 2.5 - i * 0.045 + Math.random() * 0.1)
      }))
    };
    
    setAnalysisMetrics(mockMetrics);
  };

  const validateImage = () => {
    // Simulate invalid image detection
    if (Math.random() < 0.1) { // 10% chance of invalid image
      setError("Invalid input – please upload a valid embryo image.");
      setPredictionResult(null);
      return false;
    }
    return true;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">AI Embryo Analysis System</h1>
          <p className="text-xl text-muted-foreground">Advanced image processing for improved IVF success rates</p>
        </div>

        {/* Upload Section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileInput className="h-5 w-5" />
              Upload Embryo Image
            </CardTitle>
            <CardDescription>
              Upload a high-quality embryo image for AI-powered classification and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="embryo-image">Select Image</Label>
              <Input
                id="embryo-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {uploadedImage && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={uploadedImage}
                    alt="Uploaded embryo"
                    className="max-w-md max-h-64 rounded-lg border shadow-sm"
                  />
                </div>
                
                {isAnalyzing && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Analyzing image...</p>
                    <Progress value={75} className="w-full" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prediction Results */}
        {predictionResult && (
          <Card>
            <CardHeader>
              <CardTitle>Classification Results</CardTitle>
              <CardDescription>AI-powered embryo classification and confidence analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Predicted Class */}
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Predicted Class</p>
                    <Badge variant="default" className="text-2xl px-4 py-2">
                      {predictionResult.predictedClass}
                    </Badge>
                    <p className="text-lg font-semibold">
                      Confidence: {predictionResult.confidence.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Probability Distribution */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChartIcon className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Confidence Distribution</h3>
                  </div>
                  
                  <Tabs defaultValue="bar" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                      <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="bar" className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={predictionResult.probabilities}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="class" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Confidence']} />
                          <Bar dataKey="probability" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    
                    <TabsContent value="pie" className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={predictionResult.probabilities}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({class: cls, probability}) => `${cls}: ${probability.toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="probability"
                          >
                            {predictionResult.probabilities.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Confidence']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button onClick={handleShowAnalysis} size="lg" className="px-8">
                  Show Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {showAnalysis && analysisMetrics && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>Comprehensive system performance metrics and visualizations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preprocessing" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="preprocessing">Preprocessing</TabsTrigger>
                  <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                  <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
                  <TabsTrigger value="roc">ROC Curve</TabsTrigger>
                  <TabsTrigger value="training">Training History</TabsTrigger>
                </TabsList>

                <TabsContent value="preprocessing" className="space-y-4">
                  <h3 className="text-lg font-semibold">Intermediate Preprocessed Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">Grayscale</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Grayscale Conversion</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">Edge Detection</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Edge Detection</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="h-32 bg-gray-400 rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">Thresholding</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Binary Thresholding</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="accuracy" className="space-y-4">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">Overall System Accuracy</h3>
                    <div className="text-6xl font-bold text-primary">{analysisMetrics.accuracy}%</div>
                    <Progress value={analysisMetrics.accuracy} className="w-full max-w-md mx-auto" />
                  </div>
                </TabsContent>

                <TabsContent value="confusion" className="space-y-4">
                  <h3 className="text-lg font-semibold">Confusion Matrix</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr>
                          <th className="border border-border p-2 bg-muted">Actual/Predicted</th>
                          {embryoClasses.map(cls => (
                            <th key={cls} className="border border-border p-2 bg-muted text-xs">{cls}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {analysisMetrics.confusionMatrix.map((row, i) => (
                          <tr key={i}>
                            <td className="border border-border p-2 bg-muted font-medium text-xs">{embryoClasses[i]}</td>
                            {row.map((cell, j) => (
                              <td key={j} className={`border border-border p-2 text-center text-xs ${i === j ? 'bg-primary/10 font-bold' : ''}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="roc" className="space-y-4">
                  <h3 className="text-lg font-semibold">ROC Curve</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analysisMetrics.rocData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fpr" label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -10 }} />
                        <YAxis label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="tpr" stroke="#8884d8" strokeWidth={2} dot={false} />
                        <Line type="monotone" data={[{fpr: 0, tpr: 0}, {fpr: 1, tpr: 1}]} dataKey="tpr" stroke="#ff7300" strokeDasharray="5 5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="training" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Accuracy vs Epoch</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analysisMetrics.accuracyHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epoch" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Loss vs Epoch</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analysisMetrics.lossHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epoch" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="loss" stroke="#ff7300" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
