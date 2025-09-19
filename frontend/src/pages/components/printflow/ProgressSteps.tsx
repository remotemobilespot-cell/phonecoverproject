// src/components/printflow/ProgressSteps.tsx

import { Check } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  return (
    <div className="flex justify-center mb-12 overflow-x-auto">
      <div className="flex items-center space-x-2 md:space-x-4 min-w-max">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          return (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                currentStep >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div className={`w-8 md:w-16 h-1 ${currentStep > stepNumber ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}