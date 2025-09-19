// Simple Phone Case Overlay Component
import React from 'react';

interface PhoneCaseOverlaySimpleProps {
  phoneModel?: string;
  image?: string;
  children?: React.ReactNode;
  imageStyle?: React.CSSProperties;
  imageRef?: React.RefObject<HTMLImageElement>;
}

const PhoneCaseOverlaySimple: React.FC<PhoneCaseOverlaySimpleProps> = ({ 
  phoneModel = 'default',
  image,
  children,
  imageStyle = {},
  imageRef
}) => {
  // Phone layout definitions (image area for each model)
  const phoneLayouts: Record<string, {
    imageArea: { left: number; top: number; width: number; height: number; borderRadius: number },
    svg: JSX.Element
  }> = {
    'iphone-11': {
      imageArea: {
        left: 31.05, top: 63.52, width: 222.39, height: 443.37, borderRadius: 36.75
      },
      svg: (
        <svg viewBox="0 0 288 560" className="w-full h-full" style={{ opacity: 0.4 }}>
          <rect x="31.05" y="63.52" width="222.39" height="443.37" rx="36.75" ry="36.75" fill="none" stroke="#333" strokeMiterlimit="10" strokeWidth="1.5"/>
          <rect x="45" y="77.37" width="77.11" height="85.54" rx="21.08" ry="21.08" fill="rgba(0,0,0,0.1)" stroke="#333" strokeMiterlimit="10" strokeWidth="1"/>
          <circle cx="67.21" cy="141.24" r="17.2" fill="rgba(0,0,0,0.2)" stroke="#333" strokeMiterlimit="10" strokeWidth="1"/>
          <circle cx="102.57" cy="99.65" r="4.3" fill="rgba(0,0,0,0.3)" stroke="#333" strokeMiterlimit="10" strokeWidth="1"/>
          <circle cx="101.2" cy="120.14" r="7.99" fill="rgba(0,0,0,0.2)" stroke="#333" strokeMiterlimit="10" strokeWidth="1"/>
          <circle cx="67.21" cy="99.65" r="17.2" fill="rgba(0,0,0,0.2)" stroke="#333" strokeMiterlimit="10" strokeWidth="1"/>
        </svg>
      )
    },
    // Add more phone models here
    'default': {
      imageArea: {
        left: 31.05, top: 63.52, width: 222.39, height: 443.37, borderRadius: 36.75
      },
      svg: (
        <svg viewBox="0 0 288 560" className="w-full h-full" style={{ opacity: 0.2 }}>
          <rect x="31.05" y="63.52" width="222.39" height="443.37" rx="36.75" ry="36.75" fill="none" stroke="#333" strokeMiterlimit="10" strokeWidth="1.5"/>
        </svg>
      )
    }
  };

  // Normalize phoneModel string for lookup
  const normalizedModel = phoneModel?.toLowerCase().replace(/\s+/g, '-');
  const layout = phoneLayouts[normalizedModel] || phoneLayouts['default'];

  // Calculate image area as percentage for absolute positioning
  const containerWidth = 288;
  const containerHeight = 560;
  const area = layout.imageArea;
  const leftPct = (area.left / containerWidth) * 100;
  const topPct = (area.top / containerHeight) * 100;
  const widthPct = (area.width / containerWidth) * 100;
  const heightPct = (area.height / containerHeight) * 100;

  return (
    <div className="relative inline-block" style={{ width: containerWidth, height: containerHeight }}>
      {/* Phone case frame */}
      <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        {image && (
          <div
            style={{
              position: 'absolute',
              left: `${leftPct}%`,
              top: `${topPct}%`,
              width: `${widthPct}%`,
              height: `${heightPct}%`,
              borderRadius: area.borderRadius,
              overflow: 'hidden',
              zIndex: 2
            }}
          >
            <img
              ref={imageRef}
              src={image}
              alt="Phone case design"
              className="w-full h-full object-cover select-none"
              style={imageStyle}
              draggable={false}
            />
          </div>
        )}
        {/* SVG Phone Case Overlay (dynamic) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {layout.svg}
        </div>
        {children}
      </div>
    </div>
  );
};

export default PhoneCaseOverlaySimple;