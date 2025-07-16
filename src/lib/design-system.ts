// Advanced Design System for ManifestAI Vision Boards
// Typography, colors, effects, and visual elements

export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  textShadow?: string;
  gradient?: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
  success: string;
  warning: string;
  error: string;
  gradients: string[];
}

export interface VisualEffect {
  id: string;
  name: string;
  filter: string;
  transform?: string;
  animation?: string;
  backgroundEffect?: string;
}

export interface IconElement {
  id: string;
  name: string;
  category: string;
  svg: string;
  tags: string[];
}

export interface PatternElement {
  id: string;
  name: string;
  type: 'geometric' | 'organic' | 'texture' | 'gradient';
  css: string;
  preview: string;
}

// Typography system with emotional resonance
const typographyStyles = {
  // Luxury & Elegance
  luxury_header: {
    fontFamily: '"Playfair Display", serif',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    gradient: 'linear-gradient(135deg, #D4AF37, #FFD700)'
  },
  
  luxury_subheader: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 1.4,
    letterSpacing: '0.01em',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
  },
  
  // Modern & Clean
  modern_header: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    textTransform: 'uppercase'
  },
  
  modern_body: {
    fontFamily: '"Source Sans Pro", sans-serif',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 1.6,
    letterSpacing: '0.01em'
  },
  
  // Mystical & Cosmic
  cosmic_header: {
    fontFamily: '"Cinzel", serif',
    fontSize: 36,
    fontWeight: '600',
    lineHeight: 1.3,
    letterSpacing: '0.05em',
    textShadow: '0 0 20px rgba(74,144,226,0.6)',
    gradient: 'linear-gradient(45deg, #4A90E2, #9B59B6, #E74C3C)'
  },
  
  cosmic_script: {
    fontFamily: '"Dancing Script", cursive',
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    textShadow: '0 0 10px rgba(155,89,182,0.4)'
  },
  
  // Energetic & Dynamic
  dynamic_header: {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    textTransform: 'uppercase',
    textShadow: '3px 3px 0px rgba(255,107,107,0.3)'
  },
  
  // Peaceful & Zen
  zen_header: {
    fontFamily: '"Lato", sans-serif',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 1.5,
    letterSpacing: '0.03em',
    textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
  },
  
  // Inspirational quotes
  quote_text: {
    fontFamily: '"Lora", serif',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 1.6,
    letterSpacing: '0.01em',
    fontStyle: 'italic'
  },
  
  // Affirmations
  affirmation_text: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    textTransform: 'capitalize'
  }
};

// Emotion-based color palettes
const colorPalettes: ColorPalette[] = [
  {
    id: 'success_energy',
    name: 'Success Energy',
    primary: '#2ECC71',
    secondary: '#27AE60',
    accent: '#F39C12',
    background: '#FFFFFF',
    text: '#2C3E50',
    muted: '#95A5A6',
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    gradients: [
      'linear-gradient(135deg, #2ECC71, #27AE60)',
      'linear-gradient(45deg, #F39C12, #E67E22)',
      'linear-gradient(135deg, #3498DB, #2980B9)'
    ]
  },
  
  {
    id: 'love_passion',
    name: 'Love & Passion',
    primary: '#E91E63',
    secondary: '#AD1457',
    accent: '#FF6B6B',
    background: '#FFF5F5',
    text: '#2C3E50',
    muted: '#BDC3C7',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    gradients: [
      'linear-gradient(135deg, #E91E63, #AD1457)',
      'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
      'linear-gradient(135deg, #FF69B4, #FFB6C1)'
    ]
  },
  
  {
    id: 'luxury_gold',
    name: 'Luxury Gold',
    primary: '#D4AF37',
    secondary: '#B8860B',
    accent: '#FFD700',
    background: '#0F0F0F',
    text: '#FFFFFF',
    muted: '#7F8C8D',
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    gradients: [
      'linear-gradient(135deg, #D4AF37, #FFD700)',
      'linear-gradient(45deg, #B8860B, #DAA520)',
      'linear-gradient(135deg, #2C3E50, #34495E)'
    ]
  },
  
  {
    id: 'cosmic_mystery',
    name: 'Cosmic Mystery',
    primary: '#9B59B6',
    secondary: '#8E44AD',
    accent: '#4A90E2',
    background: '#1A1A2E',
    text: '#FFFFFF',
    muted: '#95A5A6',
    success: '#1ABC9C',
    warning: '#F39C12',
    error: '#E74C3C',
    gradients: [
      'linear-gradient(135deg, #9B59B6, #4A90E2)',
      'linear-gradient(45deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #1A1A2E, #16213E)'
    ]
  },
  
  {
    id: 'nature_zen',
    name: 'Nature Zen',
    primary: '#27AE60',
    secondary: '#2ECC71',
    accent: '#16A085',
    background: '#F8FFF8',
    text: '#2C3E50',
    muted: '#95A5A6',
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',
    gradients: [
      'linear-gradient(135deg, #27AE60, #2ECC71)',
      'linear-gradient(45deg, #16A085, #1ABC9C)',
      'linear-gradient(135deg, #A8E6CF, #DCEDC1)'
    ]
  },
  
  {
    id: 'ocean_dreams',
    name: 'Ocean Dreams',
    primary: '#3498DB',
    secondary: '#2980B9',
    accent: '#1ABC9C',
    background: '#F0F8FF',
    text: '#2C3E50',
    muted: '#95A5A6',
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    gradients: [
      'linear-gradient(135deg, #3498DB, #2980B9)',
      'linear-gradient(45deg, #1ABC9C, #16A085)',
      'linear-gradient(135deg, #87CEEB, #4682B4)'
    ]
  }
];

// Visual effects for different emotional states
const visualEffects: VisualEffect[] = [
  {
    id: 'glow_success',
    name: 'Success Glow',
    filter: 'drop-shadow(0 0 20px rgba(46, 204, 113, 0.6))',
    animation: 'pulse 2s ease-in-out infinite alternate'
  },
  
  {
    id: 'luxury_shadow',
    name: 'Luxury Shadow',
    filter: 'drop-shadow(0 8px 32px rgba(212, 175, 55, 0.4))',
    transform: 'perspective(1000px) rotateX(5deg)'
  },
  
  {
    id: 'cosmic_aura',
    name: 'Cosmic Aura',
    filter: 'drop-shadow(0 0 30px rgba(155, 89, 182, 0.8))',
    backgroundEffect: 'radial-gradient(circle, rgba(155,89,182,0.1) 0%, transparent 70%)'
  },
  
  {
    id: 'energy_vibration',
    name: 'Energy Vibration',
    filter: 'drop-shadow(0 0 15px rgba(255, 107, 107, 0.5))',
    animation: 'shake 0.5s ease-in-out infinite alternate',
    transform: 'scale(1.02)'
  },
  
  {
    id: 'zen_calm',
    name: 'Zen Calm',
    filter: 'drop-shadow(0 4px 20px rgba(39, 174, 96, 0.2))',
    backgroundEffect: 'linear-gradient(45deg, rgba(168,230,207,0.1), rgba(220,237,193,0.1))'
  },
  
  {
    id: 'love_warmth',
    name: 'Love Warmth',
    filter: 'drop-shadow(0 0 25px rgba(233, 30, 99, 0.4))',
    backgroundEffect: 'radial-gradient(ellipse, rgba(255,107,107,0.1) 0%, transparent 60%)'
  },
  
  {
    id: 'crystal_clear',
    name: 'Crystal Clear',
    filter: 'drop-shadow(0 2px 10px rgba(52, 152, 219, 0.3))',
    backdropFilter: 'blur(5px)',
    backgroundEffect: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
  }
];

// Inspirational icons and symbols
const iconElements: IconElement[] = [
  {
    id: 'heart_love',
    name: 'Heart',
    category: 'love',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    tags: ['love', 'romance', 'passion', 'heart', 'relationship']
  },
  
  {
    id: 'star_success',
    name: 'Star',
    category: 'success',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    tags: ['success', 'achievement', 'excellence', 'star', 'goal']
  },
  
  {
    id: 'infinity_limitless',
    name: 'Infinity',
    category: 'spiritual',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 8.17 8.15c-.97-.97-2.33-1.53-3.77-1.53C1.95 6.62 0 8.57 0 11.04s1.95 4.42 4.4 4.42c1.44 0 2.8-.56 3.77-1.53L12 11.42l3.83 2.51c.97.97 2.33 1.53 3.77 1.53 2.45 0 4.4-1.95 4.4-4.42s-1.95-4.42-4.4-4.42z"/></svg>`,
    tags: ['infinity', 'limitless', 'spiritual', 'eternal', 'endless']
  },
  
  {
    id: 'crown_leadership',
    name: 'Crown',
    category: 'success',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6L9 9l3-8 3 8z M6 9l-2 6 4-7zm12 0l2 6-4-7zm-9 11h6v2H9z"/></svg>`,
    tags: ['leadership', 'royalty', 'success', 'authority', 'power']
  },
  
  {
    id: 'lotus_growth',
    name: 'Lotus',
    category: 'spiritual',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.58 2 4 5.58 4 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`,
    tags: ['lotus', 'growth', 'spiritual', 'enlightenment', 'peace']
  }
];

// Background patterns and textures
const patternElements: PatternElement[] = [
  {
    id: 'geometric_hex',
    name: 'Hexagonal Pattern',
    type: 'geometric',
    css: `background-image: 
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2%, transparent 2%),
      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2%, transparent 2%);
    background-size: 60px 60px;`,
    preview: 'Subtle hexagonal dots'
  },
  
  {
    id: 'organic_flow',
    name: 'Organic Flow',
    type: 'organic',
    css: `background: 
      radial-gradient(ellipse 80% 50% at 20% 40%, rgba(120,119,198,0.1) 0%, transparent 100%),
      radial-gradient(ellipse 60% 80% at 80% 30%, rgba(255,119,198,0.1) 0%, transparent 100%),
      radial-gradient(ellipse 40% 40% at 40% 80%, rgba(120,255,198,0.1) 0%, transparent 100%);`,
    preview: 'Flowing organic shapes'
  },
  
  {
    id: 'luxury_marble',
    name: 'Marble Texture',
    type: 'texture',
    css: `background: 
      linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%);
    background-size: 30px 30px;
    background-position: 0 0, 0 15px, 15px -15px, -15px 0px;`,
    preview: 'Elegant marble texture'
  },
  
  {
    id: 'cosmic_stars',
    name: 'Cosmic Stars',
    type: 'geometric',
    css: `background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
      radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.5), transparent);
    background-repeat: repeat;
    background-size: 200px 100px;`,
    preview: 'Starry cosmic background'
  },
  
  {
    id: 'zen_waves',
    name: 'Zen Waves',
    type: 'organic',
    css: `background: 
      repeating-linear-gradient(
        45deg,
        rgba(39,174,96,0.1) 0px,
        rgba(39,174,96,0.1) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        -45deg,
        rgba(46,204,113,0.1) 0px,
        rgba(46,204,113,0.1) 1px,
        transparent 1px,
        transparent 12px
      );`,
    preview: 'Peaceful wave pattern'
  }
];

class DesignSystem {
  // Typography methods
  getTypographyStyle(styleName: keyof typeof typographyStyles): TypographyStyle {
    return typographyStyles[styleName];
  }

  getTypographyStylesForEmotion(emotion: string): TypographyStyle[] {
    const emotionMap = {
      'luxury': ['luxury_header', 'luxury_subheader'],
      'modern': ['modern_header', 'modern_body'],
      'cosmic': ['cosmic_header', 'cosmic_script'],
      'dynamic': ['dynamic_header'],
      'zen': ['zen_header'],
      'inspirational': ['quote_text', 'affirmation_text']
    };
    
    const styles = emotionMap[emotion as keyof typeof emotionMap] || ['modern_header'];
    return styles.map(style => this.getTypographyStyle(style as keyof typeof typographyStyles));
  }

  // Color palette methods
  getColorPalette(paletteId: string): ColorPalette | undefined {
    return colorPalettes.find(palette => palette.id === paletteId);
  }

  getColorPaletteForEmotion(emotion: string): ColorPalette {
    const emotionMap = {
      'success': 'success_energy',
      'love': 'love_passion',
      'luxury': 'luxury_gold',
      'cosmic': 'cosmic_mystery',
      'zen': 'nature_zen',
      'peace': 'ocean_dreams'
    };
    
    const paletteId = emotionMap[emotion as keyof typeof emotionMap] || 'success_energy';
    return this.getColorPalette(paletteId) || colorPalettes[0];
  }

  getAllColorPalettes(): ColorPalette[] {
    return colorPalettes;
  }

  // Visual effects methods
  getVisualEffect(effectId: string): VisualEffect | undefined {
    return visualEffects.find(effect => effect.id === effectId);
  }

  getEffectsForEmotion(emotion: string): VisualEffect[] {
    const emotionMap = {
      'success': ['glow_success'],
      'luxury': ['luxury_shadow'],
      'cosmic': ['cosmic_aura'],
      'energy': ['energy_vibration'],
      'zen': ['zen_calm'],
      'love': ['love_warmth'],
      'clarity': ['crystal_clear']
    };
    
    const effectIds = emotionMap[emotion as keyof typeof emotionMap] || ['glow_success'];
    return effectIds.map(id => this.getVisualEffect(id)).filter(Boolean) as VisualEffect[];
  }

  // Icon methods
  getIcon(iconId: string): IconElement | undefined {
    return iconElements.find(icon => icon.id === iconId);
  }

  getIconsForCategory(category: string): IconElement[] {
    return iconElements.filter(icon => icon.category === category);
  }

  searchIcons(query: string): IconElement[] {
    const lowercaseQuery = query.toLowerCase();
    return iconElements.filter(icon => 
      icon.name.toLowerCase().includes(lowercaseQuery) ||
      icon.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Pattern methods
  getPattern(patternId: string): PatternElement | undefined {
    return patternElements.find(pattern => pattern.id === patternId);
  }

  getPatternsForType(type: PatternElement['type']): PatternElement[] {
    return patternElements.filter(pattern => pattern.type === type);
  }

  getPatternForEmotion(emotion: string): PatternElement | undefined {
    const emotionMap = {
      'luxury': 'luxury_marble',
      'cosmic': 'cosmic_stars',
      'zen': 'zen_waves',
      'modern': 'geometric_hex',
      'organic': 'organic_flow'
    };
    
    const patternId = emotionMap[emotion as keyof typeof emotionMap];
    return patternId ? this.getPattern(patternId) : undefined;
  }

  // Utility methods
  generateCustomGradient(colors: string[], direction: number = 45): string {
    return `linear-gradient(${direction}deg, ${colors.join(', ')})`;
  }

  generateTextShadow(color: string, intensity: 'subtle' | 'moderate' | 'strong' = 'moderate'): string {
    const intensityMap = {
      subtle: '1px 1px 2px',
      moderate: '2px 2px 4px',
      strong: '3px 3px 6px'
    };
    
    return `${intensityMap[intensity]} ${color}`;
  }

  generateDropShadow(color: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizeMap = {
      small: '0 2px 4px',
      medium: '0 4px 8px',
      large: '0 8px 16px'
    };
    
    return `drop-shadow(${sizeMap[size]} ${color})`;
  }

  // Advanced styling generators
  generateElementStyle(element: any, emotion: string, intensity: number = 0.7): any {
    const palette = this.getColorPaletteForEmotion(emotion);
    const effects = this.getEffectsForEmotion(emotion);
    const typography = this.getTypographyStylesForEmotion(emotion)[0];
    
    let style: any = {
      color: palette.primary,
      backgroundColor: `${palette.background}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`,
    };
    
    if (element.type === 'text') {
      style = {
        ...style,
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize * intensity,
        fontWeight: typography.fontWeight,
        lineHeight: typography.lineHeight,
        letterSpacing: typography.letterSpacing,
        textShadow: typography.textShadow
      };
      
      if (typography.gradient) {
        style.background = typography.gradient;
        style.WebkitBackgroundClip = 'text';
        style.WebkitTextFillColor = 'transparent';
      }
    }
    
    if (effects.length > 0) {
      style.filter = effects[0].filter;
      if (effects[0].transform) {
        style.transform = effects[0].transform;
      }
    }
    
    return style;
  }

  generateResponsiveTypography(baseSize: number, device: 'mobile' | 'tablet' | 'desktop' = 'desktop'): TypographyStyle {
    const sizeMultipliers = {
      mobile: 0.8,
      tablet: 0.9,
      desktop: 1.0
    };
    
    const multiplier = sizeMultipliers[device];
    
    return {
      fontFamily: '"Inter", sans-serif',
      fontSize: baseSize * multiplier,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: '0.01em'
    };
  }
}

// Export singleton instance
export const designSystem = new DesignSystem();

// Export collections
export { 
  typographyStyles, 
  colorPalettes, 
  visualEffects, 
  iconElements, 
  patternElements 
};