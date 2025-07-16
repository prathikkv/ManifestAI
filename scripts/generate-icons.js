// Temporary icon generator for ManifestAI PWA
// This creates placeholder icons for immediate testing

const fs = require('fs');
const path = require('path');

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create SVG-based icons for each size
const generateIconSVG = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="manifestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6"/>
      <stop offset="50%" style="stop-color:#8B5CF6"/>
      <stop offset="100%" style="stop-color:#EC4899"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#manifestGrad)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.3}" fill="rgba(255,255,255,0.1)"/>
  <g transform="translate(${size/2},${size/2})">
    <path d="M${-size*0.15},${-size*0.1} L${-size*0.15},${size*0.15} L${-size*0.05},${size*0.15} L${-size*0.05},${size*0.05} L${size*0.05},${size*0.15} L${size*0.15},${size*0.05} L${size*0.15},${size*0.15} L${size*0.25},${size*0.15} L${size*0.25},${-size*0.1} L${size*0.15},${-size*0.1} L${size*0.05},${size*0.05} L${-size*0.05},${-size*0.1} Z" fill="white" opacity="0.95"/>
  </g>
</svg>
`.trim();

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate all required icon sizes
iconSizes.forEach(size => {
  const svgContent = generateIconSVG(size);
  const filename = `icon-${size}x${size}.png`;
  
  // For now, we'll save as SVG with PNG extension
  // In production, you'd convert SVG to actual PNG
  const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
  
  // Write a placeholder that can be used for testing
  fs.writeFileSync(
    path.join(iconsDir, filename), 
    svgContent
  );
  
  console.log(`Generated ${filename}`);
});

// Generate additional required files
const additionalIcons = {
  'apple-touch-icon.png': generateIconSVG(180),
  'ms-tile-150x150.png': generateIconSVG(150),
  'ms-tile-310x310.png': generateIconSVG(310)
};

Object.entries(additionalIcons).forEach(([filename, content]) => {
  fs.writeFileSync(
    path.join(iconsDir, filename),
    content
  );
  console.log(`Generated ${filename}`);
});

console.log('✅ All PWA icons generated successfully!');
console.log('Note: These are SVG placeholders. For production, convert to actual PNG files.');