#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Phone models with their specifications
const phoneModels = [
  // iPhone Models
  {
    id: 'iphone-11',
    name: 'iPhone 11',
    width: 288,
    height: 560,
    caseInset: 31,
    cameraArea: { x: 45, y: 77, width: 77, height: 85, rx: 21 },
    cameras: [
      { cx: 67, cy: 99, r: 17 },
      { cx: 67, cy: 141, r: 17 },
      { cx: 103, cy: 100, r: 4 }, // Flash
      { cx: 101, cy: 120, r: 8 }  // Microphone
    ]
  },
  {
    id: 'iphone-11-pro',
    name: 'iPhone 11 Pro',
    width: 288,
    height: 560,
    caseInset: 31,
    cameraArea: { x: 45, y: 77, width: 85, height: 85, rx: 21 },
    cameras: [
      { cx: 67, cy: 99, r: 15 },   // Wide
      { cx: 103, cy: 99, r: 15 },  // Ultra Wide
      { cx: 67, cy: 135, r: 15 },  // Telephoto
      { cx: 103, cy: 135, r: 4 },  // Flash
      { cx: 85, cy: 155, r: 6 }    // Microphone
    ]
  },
  {
    id: 'iphone-12',
    name: 'iPhone 12',
    width: 288,
    height: 570,
    caseInset: 31,
    cameraArea: { x: 45, y: 77, width: 77, height: 85, rx: 21 },
    cameras: [
      { cx: 67, cy: 99, r: 17 },
      { cx: 67, cy: 141, r: 17 },
      { cx: 103, cy: 100, r: 4 },
      { cx: 101, cy: 120, r: 8 }
    ]
  },
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    width: 288,
    height: 570,
    caseInset: 31,
    cameraArea: { x: 45, y: 77, width: 77, height: 85, rx: 21 },
    cameras: [
      { cx: 67, cy: 99, r: 18 },   // Larger cameras
      { cx: 67, cy: 141, r: 18 },
      { cx: 103, cy: 100, r: 5 },
      { cx: 101, cy: 120, r: 8 }
    ]
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    width: 288,
    height: 570,
    caseInset: 31,
    cameraArea: { x: 45, y: 77, width: 77, height: 85, rx: 21 },
    cameras: [
      { cx: 67, cy: 99, r: 18 },
      { cx: 67, cy: 141, r: 18 },
      { cx: 103, cy: 100, r: 5 },
      { cx: 101, cy: 120, r: 8 }
    ]
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    width: 288,
    height: 570,
    caseInset: 31,
    cameraArea: { x: 45, y: 77, width: 77, height: 85, rx: 21 },
    cameras: [
      { cx: 67, cy: 99, r: 19 },   // Even larger
      { cx: 67, cy: 141, r: 19 },
      { cx: 103, cy: 100, r: 5 },
      { cx: 101, cy: 120, r: 8 }
    ]
  },
  // Samsung Models
  {
    id: 'galaxy-s24',
    name: 'Galaxy S24',
    width: 288,
    height: 580,
    caseInset: 31,
    cameraArea: { x: 45, y: 77, width: 90, height: 70, rx: 15 },
    cameras: [
      { cx: 70, cy: 95, r: 16 },   // Main
      { cx: 70, cy: 125, r: 12 },  // Ultra wide
      { cx: 105, cy: 95, r: 14 },  // Telephoto
      { cx: 105, cy: 125, r: 4 }   // Flash
    ]
  },
  {
    id: 'galaxy-s24-ultra',
    name: 'Galaxy S24 Ultra',
    width: 288,
    height: 590,
    caseInset: 31,
    cameraArea: { x: 40, y: 75, width: 100, height: 75, rx: 15 },
    cameras: [
      { cx: 65, cy: 95, r: 18 },   // Main
      { cx: 65, cy: 130, r: 14 },  // Ultra wide
      { cx: 105, cy: 95, r: 16 },  // Telephoto 1
      { cx: 105, cy: 130, r: 16 }, // Telephoto 2
      { cx: 85, cy: 150, r: 4 }    // Flash
    ]
  }
];

// Generate SVG content based on template
function generateSVG(phone) {
  const caseWidth = phone.width - (phone.caseInset * 2);
  const caseHeight = phone.height - (phone.caseInset * 2) - 40; // Account for top/bottom
  const caseY = phone.caseInset + 32;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg id="${phone.id}" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${phone.width} ${phone.height}">
  <!-- Phone Case Template for ${phone.name} -->
  
  <!-- Main case outline -->
  <rect x="${phone.caseInset}" y="${caseY}" width="${caseWidth}" height="${caseHeight}" 
        rx="36.75" ry="36.75" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2"/>
  
  <!-- Camera module area -->
  <rect x="${phone.cameraArea.x}" y="${phone.cameraArea.y}" 
        width="${phone.cameraArea.width}" height="${phone.cameraArea.height}" 
        rx="${phone.cameraArea.rx}" ry="${phone.cameraArea.rx}" 
        fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2"/>
  
  <!-- Individual camera lenses and components -->${phone.cameras.map(camera => 
    `\n  <circle cx="${camera.cx}" cy="${camera.cy}" r="${camera.r}" 
            fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2"/>`
  ).join('')}
</svg>`;
}

// Create output directory
const outputDir = path.join(__dirname, '..', 'public', 'images', 'phone-cases');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate SVG files for all phone models
console.log('🎨 Generating phone case SVG templates...');

phoneModels.forEach(phone => {
  const svgContent = generateSVG(phone);
  const filename = `${phone.id}-case.svg`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Generated: ${filename}`);
});

console.log(`\n🎉 Successfully generated ${phoneModels.length} phone case templates!`);
console.log(`📁 Files saved to: ${outputDir}`);

// Also generate a mapping file for easy reference
const mappingContent = `// Auto-generated phone case SVG mapping
export const phoneCaseSVGs = {
${phoneModels.map(phone => 
  `  '${phone.id}': '/images/phone-cases/${phone.id}-case.svg',`
).join('\n')}
};

export const phoneModels = ${JSON.stringify(phoneModels, null, 2)};
`;

fs.writeFileSync(path.join(outputDir, 'phone-mapping.js'), mappingContent);
console.log('📝 Generated mapping file: phone-mapping.js');