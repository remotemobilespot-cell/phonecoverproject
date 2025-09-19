import React from 'react';

interface PhoneCaseOverlayProps {
  phoneModel?: string;
  image?: string;
  className?: string;
  children?: React.ReactNode;
}

const PhoneCaseOverlay: React.FC<PhoneCaseOverlayProps> = ({ 
  phoneModel = 'default', 
  image,
  className = '',
  children 
}) => {
  const getPhoneTemplate = (model: string) => {
    const templates: { [key: string]: string } = {
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
    
    return templates[model] || '/phone-templates/default-phone.svg';
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="relative w-48 h-72 bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Background image */}
        {image && (
          <img 
            src={image} 
            alt="Phone case design" 
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        )}
        
        {/* Phone case overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <img 
            src={getPhoneTemplate(phoneModel)}
            alt="Phone case outline"
            className="w-full h-full object-contain"
            style={{ opacity: 0.7 }}
          />
        </div>
        
        {children && (
          <div className="absolute inset-0 z-30">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneCaseOverlay;