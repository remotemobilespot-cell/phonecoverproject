// src/components/printflow/Step2ImageUpload.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface Step2ImageUploadProps {
  uploadedImage: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2ImageUpload({ 
  uploadedImage, 
  onImageUpload, 
  onBack, 
  onNext 
}: Step2ImageUploadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Step 2: Upload Your Design
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="image-upload">Upload your photo or design</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {uploadedImage ? (
                  <div>
                    <img src={uploadedImage} alt="Preview" className="max-w-full max-h-64 mx-auto rounded-lg" />
                    <p className="mt-2 text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Click to upload image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              className="flex-1" 
              disabled={!uploadedImage}
              onClick={onNext}
            >
              Continue to Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}