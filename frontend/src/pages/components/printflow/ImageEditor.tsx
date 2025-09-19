// src/pages/components/printflow/ImageEditor.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Edit3, RotateCcw, Contrast, Sun, Palette, Zap, Sparkles, Eye, Smartphone, ZoomIn, ZoomOut, Move, RotateCw, Download } from 'lucide-react';
import PhoneCaseOverlaySimple from '@/components/PhoneCaseOverlaySimple';

const filters = [
  { id: 'brightness', name: 'Brightness', icon: Sun, min: -50, max: 50 },
  { id: 'contrast', name: 'Contrast', icon: Contrast, min: -50, max: 50 },
  { id: 'saturation', name: 'Saturation', icon: Palette, min: -50, max: 50 },
  { id: 'blur', name: 'Blur', icon: Zap, min: 0, max: 5 }
];

const presetFilters = [
  { name: 'Natural', brightness: 0, contrast: 0, saturation: 0, blur: 0, description: 'Original appearance' },
  { name: 'Vivid', brightness: 5, contrast: 10, saturation: 15, blur: 0, description: 'Enhanced colors' },
  { name: 'Soft', brightness: -5, contrast: -10, saturation: 5, blur: 0.5, description: 'Gentle and smooth' },
  { name: 'Dramatic', brightness: 0, contrast: 20, saturation: 10, blur: 0, description: 'High contrast' },
  { name: 'Warm', brightness: 5, contrast: 5, saturation: 20, blur: 0, description: 'Warm tones' },
  { name: 'Cool', brightness: -5, contrast: 5, saturation: -10, blur: 0, description: 'Cool tones' }
];

interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

interface ImageTransform {
  scale: number;
  x: number;
  y: number;
  rotation: number;
}

interface Step3ImageEditorProps {
  uploadedImage: string | null;
  filterValues: FilterValues;
  onFilterChange: (filterId: string, value: number) => void;
  onResetFilters: () => void;
  onBack: () => void;
  onNext: (editedImageBlob: Blob, editedImageUrl: string) => void;
  selectedPhone?: string;
  caseType: 'regular' | 'magsafe';
  onCaseTypeChange: (type: 'regular' | 'magsafe') => void;
}

export default function Step3ImageEditor({ 
  uploadedImage, 
  filterValues, 
  onFilterChange, 
  onResetFilters, 
  onBack, 
  onNext,
  selectedPhone = '',
  caseType,
  onCaseTypeChange
}: Step3ImageEditorProps) {
  const [activeSection, setActiveSection] = useState<'manual' | 'presets' | 'ai'>('manual');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load and draw image on canvas
  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        if (imageRef.current) {
          imageRef.current.src = uploadedImage;
        }
      };
      img.src = uploadedImage;
    }
  }, [uploadedImage]);

  const applyFiltersToCanvas = useCallback(async (): Promise<{ blob: Blob; url: string } | null> => {
    if (!canvasRef.current || !uploadedImage) return null;
    
    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Create a new image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve) => {
        img.onload = () => {
          // Set canvas size to match image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Save context state
          ctx.save();
          
          // Apply transformations
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((imageTransform.rotation * Math.PI) / 180);
          ctx.scale(imageTransform.scale, imageTransform.scale);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
          ctx.translate(imageTransform.x, imageTransform.y);
          
          // Apply CSS filters to canvas context
          const filterString = `brightness(${100 + filterValues.brightness}%) contrast(${100 + filterValues.contrast}%) saturate(${100 + filterValues.saturation}%) blur(${filterValues.blur}px)`;
          ctx.filter = filterString;
          
          // Draw the image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Restore context
          ctx.restore();
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({ blob, url });
            } else {
              resolve(null);
            }
          }, 'image/jpeg', 0.9);
        };
        
        img.src = uploadedImage;
      });
    } catch (error) {
      console.error('Error applying filters:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedImage, filterValues, imageTransform]);

  const getImageStyle = () => {
    // Clamp filter values to ensure true neutrality
    const brightness = Math.max(0, 100 + (filterValues.brightness || 0));
    const contrast = Math.max(0, 100 + (filterValues.contrast || 0));
    const saturation = Math.max(0, 100 + (filterValues.saturation || 0));
    const blur = Math.max(0, filterValues.blur || 0);

    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
      transform: `scale(${imageTransform.scale}) translate(${imageTransform.x}px, ${imageTransform.y}px) rotate(${imageTransform.rotation}deg)`,
      transition: isDragging ? 'none' : 'transform 0.2s ease',
      cursor: isDragging ? 'grabbing' : 'grab'
    };
  };

  const applyPreset = (preset: any) => {
    onFilterChange('brightness', preset.brightness);
    onFilterChange('contrast', preset.contrast);
    onFilterChange('saturation', preset.saturation);
    onFilterChange('blur', preset.blur);
    setSelectedPreset(preset.name);
  };

  const apply3DEffect = () => {
    onFilterChange('contrast', 35);
    onFilterChange('brightness', 10);
    onFilterChange('saturation', 20);
    onFilterChange('blur', 0.5);
  };

  const zoomIn = () => {
    setImageTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.2, 3)
    }));
  };

  const zoomOut = () => {
    setImageTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.2, 0.5)
    }));
  };

  const resetTransform = () => {
    setImageTransform({
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0
    });
  };

  const rotateImage = () => {
    setImageTransform(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageTransform.scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imageTransform.x,
        y: e.clientY - imageTransform.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageTransform.scale > 1) {
      setImageTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (imageTransform.scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - imageTransform.x,
        y: touch.clientY - imageTransform.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && imageTransform.scale > 1 && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setImageTransform(prev => ({
        ...prev,
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleContinue = async () => {
    const result = await applyFiltersToCanvas();
    if (result) {
      onNext(result.blob, result.url);
    } else {
      // Fallback: continue with original image
      if (uploadedImage) {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        onNext(blob, uploadedImage);
      }
    }
  };

  const downloadPreview = async () => {
    const result = await applyFiltersToCanvas();
    if (result) {
      const link = document.createElement('a');
      link.download = 'edited-phone-case-design.jpg';
      link.href = result.url;
      link.click();
      URL.revokeObjectURL(result.url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Edit3 className="h-5 w-5 mr-2" />
          Step 3: Edit Your Design
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Case Type Selector */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Choose Case Type</h4>
            <div className="flex gap-4">
              <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded border ${caseType === 'regular' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onClick={() => onCaseTypeChange('regular')}>
                <input type="radio" name="caseType" value="regular" checked={caseType === 'regular'} readOnly />
                <span className="font-medium">Regular ($20 + tax)</span>
              </label>
              <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded border ${caseType === 'magsafe' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onClick={() => onCaseTypeChange('magsafe')}>
                <input type="radio" name="caseType" value="magsafe" checked={caseType === 'magsafe'} readOnly />
                <span className="font-medium">MagSafe ($30 + tax)</span>
              </label>
            </div>
          </div>
          {/* Enhanced Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Live Preview</h4>
              <div className="flex gap-2">
                {selectedPhone && (
                  <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    <Smartphone className="h-3 w-3 mr-1" />
                    {selectedPhone.split(' ').slice(-2).join(' ')}
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={downloadPreview} disabled={isProcessing}>
                  <Download className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={apply3DEffect}>
                  <Eye className="h-4 w-4 mr-1" />
                  3D Effect
                </Button>
              </div>
            </div>

            {/* Transform Controls */}
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={zoomOut} disabled={imageTransform.scale <= 0.5}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 px-2 min-w-[60px] text-center">
                  {Math.round(imageTransform.scale * 100)}%
                </span>
                <Button variant="outline" size="sm" onClick={zoomIn} disabled={imageTransform.scale >= 3}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={rotateImage}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={resetTransform}>
                  Reset
                </Button>
              </div>
            </div>

            {imageTransform.scale > 1 && (
              <div className="text-center text-sm text-blue-600 bg-blue-50 p-2 rounded">
                <Move className="h-4 w-4 inline mr-1" />
                Drag to reposition your image
              </div>
            )}
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-center">
                <div
                  ref={previewRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <PhoneCaseOverlaySimple
                    image={uploadedImage}
                    phoneModel={selectedPhone}
                    imageStyle={getImageStyle()}
                    imageRef={imageRef}
                  />
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Phone Case Preview - Zoom: {Math.round(imageTransform.scale * 100)}%
              </p>
            </div>

            {/* Hidden canvas for processing */}
            <canvas 
              ref={canvasRef} 
              className="hidden" 
              width={800} 
              height={600}
            />
            <canvas 
              ref={hiddenCanvasRef} 
              className="hidden" 
              width={800} 
              height={600}
            />
          </div>

          {/* Editor Controls */}
          <div className="space-y-6">
            {/* Section Tabs */}
            <div className="flex border-b">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === 'manual' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveSection('manual')}
              >
                Manual
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === 'presets' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveSection('presets')}
              >
                Presets
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === 'ai' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveSection('ai')}
              >
                <Sparkles className="h-4 w-4 inline mr-1" />
                AI Designs
              </button>
            </div>

            {/* Manual Controls */}
            {activeSection === 'manual' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Manual Adjustments</h4>
                  <Button variant="outline" size="sm" onClick={onResetFilters}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
                
                {filters.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <div key={filter.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <Label>{filter.name}</Label>
                        <span className="text-sm text-gray-500 ml-auto">
                          {filterValues[filter.id as keyof FilterValues]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={filter.min}
                        max={filter.max}
                        step={1}
                        value={filterValues[filter.id as keyof FilterValues]}
                        onChange={(e) => onFilterChange(filter.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  );
                })}

                {/* Transform Controls */}
                <div className="border-t pt-4 mt-4">
                  <h5 className="font-medium mb-3">Image Position & Scale</h5>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ZoomIn className="h-4 w-4" />
                        <Label>Zoom</Label>
                        <span className="text-sm text-gray-500 ml-auto">
                          {Math.round(imageTransform.scale * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={3}
                        step={0.1}
                        value={imageTransform.scale}
                        onChange={(e) => setImageTransform(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <RotateCw className="h-4 w-4" />
                        <Label>Rotation</Label>
                        <span className="text-sm text-gray-500 ml-auto">
                          {imageTransform.rotation}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        step={15}
                        value={imageTransform.rotation}
                        onChange={(e) => setImageTransform(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preset Controls */}
            {activeSection === 'presets' && (
              <div className="space-y-4">
                <h4 className="font-semibold">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-3">
                  {presetFilters.map((preset) => (
                    <div
                      key={preset.name}
                      className={`border rounded-lg p-3 cursor-pointer transition-all text-center ${
                        selectedPreset === preset.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => applyPreset(preset)}
                    >
                      <h5 className="font-medium text-sm mb-1">{preset.name}</h5>
                      <p className="text-xs text-gray-600">{preset.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {activeSection === 'ai' && (
              <div className="space-y-4">
                <h4 className="font-semibold">AI Design Templates</h4>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <Sparkles className="h-4 w-4 inline mr-1" />
                    AI enhancement coming soon! For now, use manual controls and presets.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleContinue}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Continue to Fulfillment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}