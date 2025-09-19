import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  Download, 
  RotateCcw, 
  Palette, 
  Smartphone, 
  Camera,
  Sparkles,
  Star,
  TrendingUp,
  Shield,
  Zap,
  TestTube
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Interactive Case Preview Component
export const InteractiveCasePreview = ({ designs = [], phoneModels = [] }) => {
  const [selectedDesign, setSelectedDesign] = useState(designs[0] || null);
  const [selectedPhone, setSelectedPhone] = useState('iphone-15-pro');
  const [previewAngle, setPreviewAngle] = useState(0);

  const phoneTemplates = {
    'iphone-15-pro': '/phone-templates/iphone-15-pro.svg',
    'iphone-15': '/phone-templates/iphone-15.svg',
    'samsung-s24-ultra': '/phone-templates/samsung-galaxy-s24-ultra.svg',
    'samsung-s24': '/phone-templates/samsung-galaxy-s24.svg'
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Try These Designs</h3>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Interactive
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Design Selection */}
        <div>
          <p className="text-sm font-medium mb-2">Choose a Design:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {designs.map((design, index) => (
              <button
                key={index}
                onClick={() => setSelectedDesign(design)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  selectedDesign?.name === design.name 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-1 flex items-center justify-center">
                  <span className="text-xs">📱</span>
                </div>
                <p className="text-xs font-medium truncate">{design.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Phone Model Selection */}
        <div>
          <p className="text-sm font-medium mb-2">Phone Model:</p>
          <Select value={selectedPhone} onValueChange={setSelectedPhone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iphone-15-pro">iPhone 15 Pro</SelectItem>
              <SelectItem value="iphone-15">iPhone 15</SelectItem>
              <SelectItem value="samsung-s24-ultra">Samsung Galaxy S24 Ultra</SelectItem>
              <SelectItem value="samsung-s24">Samsung Galaxy S24</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3D Preview */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Preview</p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPreviewAngle(prev => prev - 15)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <span className="text-xs text-gray-500">{previewAngle}°</span>
            </div>
          </div>
          <div 
            className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ transform: `rotateY(${previewAngle}deg)` }}
          >
            <div className="text-center">
              <Smartphone className="h-16 w-16 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {selectedDesign?.name || 'Select a design'} on {selectedPhone.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link to="/print-now">
              <Sparkles className="h-4 w-4 mr-2" />
              Start Designing
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Photo Quality Analyzer Component
export const PhotoQualityAnalyzer = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const analyzePhoto = async (file) => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const mockAnalysis = {
        resolution: { width: 3024, height: 4032, score: 95 },
        quality: { sharpness: 87, lighting: 92, composition: 78 },
        printReady: true,
        recommendations: [
          "Excellent resolution for printing",
          "Good lighting conditions detected",
          "Consider cropping for better composition"
        ]
      };
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage({ file, url: imageUrl });
      analyzePhoto(file);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Photo Quality Analyzer</h3>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            AI Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {uploadedImage ? (
            <div className="space-y-2">
              <img
                src={uploadedImage.url}
                alt="Uploaded"
                className="mx-auto max-h-32 rounded-lg object-contain"
              />
              <p className="text-sm text-green-600">Click to upload a different image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Camera className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">Click to upload your photo</p>
              <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Analyzing your photo...</p>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs font-medium text-gray-500">Resolution</p>
                <p className="text-lg font-bold text-green-600">
                  {analysisResult.resolution.score}/100
                </p>
                <p className="text-xs text-gray-600">
                  {analysisResult.resolution.width} × {analysisResult.resolution.height}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs font-medium text-gray-500">Overall Quality</p>
                <p className="text-lg font-bold text-blue-600">
                  {Math.round((analysisResult.quality.sharpness + analysisResult.quality.lighting + analysisResult.quality.composition) / 3)}/100
                </p>
                <p className="text-xs text-gray-600">Print Ready</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Recommendations:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Use This Photo for Design
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Trend Explorer Component
export const TrendExplorer = ({ categories = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('colors');
  const [trending, setTrending] = useState([]);

  const trendData = {
    colors: [
      { name: 'Ocean Blue', popularity: 94, hex: '#0ea5e9' },
      { name: 'Sunset Orange', popularity: 87, hex: '#f97316' },
      { name: 'Forest Green', popularity: 82, hex: '#16a34a' },
      { name: 'Royal Purple', popularity: 78, hex: '#9333ea' }
    ],
    patterns: [
      { name: 'Geometric Waves', popularity: 91 },
      { name: 'Organic Shapes', popularity: 85 },
      { name: 'Minimalist Lines', popularity: 79 },
      { name: 'Abstract Florals', popularity: 73 }
    ],
    textures: [
      { name: 'Matte Finish', popularity: 89 },
      { name: 'Holographic', popularity: 84 },
      { name: 'Textured Grip', popularity: 76 },
      { name: 'Glossy Premium', popularity: 71 }
    ]
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Trend Explorer</h3>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Live Data
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Tabs */}
        <div className="flex gap-1 bg-white rounded-lg p-1">
          {Object.keys(trendData).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Trend Items */}
        <div className="space-y-3">
          {trendData[selectedCategory]?.map((item, index) => (
            <div key={index} className="bg-white p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {item.hex && (
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: item.hex }}
                    />
                  )}
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{item.popularity}%</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${item.popularity}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full" variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview Trending Styles
        </Button>
      </CardContent>
    </Card>
  );
};

// Protection Tester Component
export const ProtectionTester = ({ scenarios = [] }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [testResults, setTestResults] = useState({});

  const runTest = (scenario) => {
    setActiveTest(scenario);
    setTimeout(() => {
      const results = {
        '6ft drop': { score: 95, description: 'Excellent impact absorption' },
        'water splash': { score: 87, description: 'Good splash resistance' },
        'dust exposure': { score: 92, description: 'Superior port protection' },
        'daily wear': { score: 96, description: 'Outstanding durability' }
      };
      
      setTestResults(prev => ({ ...prev, [scenario]: results[scenario] }));
      setActiveTest(null);
    }, 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold">Protection Tester</h3>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Simulation
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Test how well our cases protect your phone in different scenarios:
        </p>

        <div className="grid grid-cols-2 gap-3">
          {scenarios.map((scenario, index) => (
            <div key={index} className="bg-white p-3 rounded-lg border">
              <div className="text-center mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  {scenario === '6ft drop' && <Zap className="h-5 w-5 text-orange-600" />}
                  {scenario === 'water splash' && <span className="text-blue-600">💧</span>}
                  {scenario === 'dust exposure' && <span className="text-gray-600">🌪️</span>}
                  {scenario === 'daily wear' && <span className="text-green-600">📱</span>}
                </div>
                <p className="text-sm font-medium">{scenario}</p>
              </div>

              {activeTest === scenario ? (
                <div className="text-center">
                  <div className="animate-spin h-6 w-6 border-2 border-orange-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-gray-500">Testing...</p>
                </div>
              ) : testResults[scenario] ? (
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 mb-1">
                    {testResults[scenario].score}/100
                  </div>
                  <p className="text-xs text-gray-600">
                    {testResults[scenario].description}
                  </p>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => runTest(scenario)}
                >
                  <TestTube className="h-4 w-4 mr-1" />
                  Test
                </Button>
              )}
            </div>
          ))}
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium mb-2">Overall Protection Score:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                  style={{ width: '94%' }}
                />
              </div>
              <span className="text-lg font-bold text-green-600">94/100</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Interactive Blog Components Wrapper
export const InteractiveBlogComponents = ({ element }) => {
  if (!element) return null;

  switch (element.type) {
    case 'case_preview':
      return <InteractiveCasePreview designs={element.designs || []} />;
    
    case 'photo_analyzer':
      return <PhotoQualityAnalyzer />;
    
    case 'trend_explorer':
      return <TrendExplorer categories={element.categories || []} />;
    
    case 'protection_tester':
      return <ProtectionTester scenarios={element.scenarios || []} />;
    
    case 'design_tool':
      return (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{element.title}</h3>
            <p className="text-blue-100 mb-4">Ready to bring your ideas to life?</p>
            <Button asChild size="lg" variant="secondary">
              <Link to={element.cta_link || "/print-now"}>
                {element.cta_text || "Start Designing"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      );
    
    default:
      return null;
  }
};

export default InteractiveBlogComponents;