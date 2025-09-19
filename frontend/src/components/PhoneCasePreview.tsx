import React from 'react';

interface PhoneCasePreviewProps {
  image: string | null;
  phoneModel?: string;
  className?: string;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  imageRef?: React.RefObject<HTMLImageElement>;
  debugFilters?: boolean; // Add debug prop
}

const PhoneCasePreview: React.FC<PhoneCasePreviewProps> = ({ 
  image, 
  phoneModel = 'default-phone',
  className = '',
  style = {},
  imageStyle = {},
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  imageRef,
  debugFilters = false
}) => {
  
  // Debug logging
  if (debugFilters && imageStyle) {
    console.log('🎨 PhoneCasePreview imageStyle:', imageStyle);
  }
  // Map phone model to SVG template
  const getSvgTemplate = (model: string) => {
    const modelMap: { [key: string]: string } = {
      'iPhone 13': '/phone-templates/iphone-13.svg',
      'iPhone 13 Pro': '/phone-templates/iphone-13-pro.svg',
      'iPhone 13 Pro Max': '/phone-templates/iphone-13-pro-max.svg',
      'iPhone 14': '/phone-templates/iphone-14.svg',
      'iPhone 14 Pro': '/phone-templates/iphone-14-pro.svg',
      'iPhone 14 Pro Max': '/phone-templates/iphone-14-pro-max.svg',
      'iPhone 15': '/phone-templates/iphone-15.svg',
      'iPhone 15 Pro': '/phone-templates/iphone-15-pro.svg',
      'iPhone 15 Pro Max': '/phone-templates/iphone-15-pro-max.svg',
      'Samsung Galaxy S23 Ultra': '/phone-templates/samsung-galaxy-s23-ultra.svg',
      'Samsung Galaxy S24': '/phone-templates/samsung-galaxy-s24.svg',
      'Samsung Galaxy S24 Plus': '/phone-templates/samsung-galaxy-s24-plus.svg',
      'Samsung Galaxy S24 Ultra': '/phone-templates/samsung-galaxy-s24-ultra.svg',
    };
    
    return modelMap[model] || '/phone-templates/default-phone.svg';
  };

  return (
    <div className={`relative inline-block ${className}`} style={style}>
      {/* Background image container with interactive controls */}
      <div 
        className="relative w-48 h-72 rounded-lg overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
        style={{ backgroundColor: '#f0f0f0' }} // Light gray background instead of white
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* User's image as background */}
        {image ? (
          <img 
            ref={imageRef}
            src={image} 
            alt="Phone case design" 
            className="w-full h-full object-contain select-none"
            style={{
              // COMPLETELY BYPASS ALL FILTERS - show raw image
              // filter: 'brightness(100%) contrast(100%) saturate(100%) blur(0px)',
              transform: imageStyle.transform, // Keep the transform for zoom/pan/rotate
              transition: imageStyle.transition, // Keep transitions
            }}
            draggable={false}
            onLoad={() => console.log('✅ Phone case image loaded successfully')}
            onError={(e) => {
              console.log('❌ Phone case image failed to load:', e);
              console.log('Image src was:', image);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No image</p>
          </div>
        )}
        
        {/* Phone case SVG overlay - temporarily disabled for debugging */}
        {false && (
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src={getSvgTemplate(phoneModel)}
              alt="Phone case outline"
              className="w-full h-full object-contain"
              style={{
                mixBlendMode: 'overlay', // Change from 'multiply' to 'overlay' for better visibility
                opacity: 0.3 // Reduce opacity so it doesn't darken the image too much
              }}
              onError={(e) => {
                console.warn('Failed to load phone case template:', getSvgTemplate(phoneModel));
                // Fallback to a simple border
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Simple visible phone case border for now */}
        <div 
          className="absolute inset-3 border-2 border-gray-600 rounded-xl pointer-events-none"
          style={{
            opacity: 0.6,
            display: image ? 'block' : 'none',
            borderRadius: '20px'
          }}
        />

        {/* Corner notches to make it look more like a phone case */}
        <div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full pointer-events-none"
          style={{
            opacity: 0.6,
            display: image ? 'block' : 'none'
          }}
        />
      </div>
    </div>
  );
};

export default PhoneCasePreview;