// Professional Layout & Design System for ManifestAI Vision Boards
// Magazine-quality layouts with golden ratio positioning and visual hierarchy

export interface LayoutElement {
  id: string;
  type: 'image' | 'text' | 'shape' | 'icon' | 'progress' | 'quote';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  
  // Content-specific properties
  content?: string;
  imageUrl?: string;
  backgroundColor?: string;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  textShadow?: string;
  
  // Advanced styling
  gradient?: string;
  filter?: string;
  transform?: string;
  animation?: string;
  
  // Layout hints
  layoutWeight: number; // Importance for positioning
  visualWeight: number; // Visual impact
  groupId?: string; // For grouping related elements
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundPattern?: string;
  style: 'magazine' | 'pinterest' | 'minimalist' | 'cosmic' | 'luxury' | 'organic';
  layout: 'grid' | 'masonry' | 'flowing' | 'centered' | 'asymmetric' | 'golden-ratio';
  colorScheme: string[];
  typography: {
    primary: string;
    secondary: string;
    accent: string;
  };
  spacing: {
    margin: number;
    padding: number;
    gap: number;
  };
  maxElements: number;
}

export interface LayoutOptions {
  template: LayoutTemplate;
  elements: Partial<LayoutElement>[];
  priorityOrder?: string[]; // Element IDs in priority order
  colorHarmony?: boolean;
  respectGoldenRatio?: boolean;
  allowOverlap?: boolean;
  symmetricBalance?: boolean;
  visualFlow?: 'left-to-right' | 'top-to-bottom' | 'center-out' | 'spiral';
}

// Professional layout templates
const layoutTemplates: LayoutTemplate[] = [
  {
    id: 'magazine_hero',
    name: 'Magazine Hero',
    description: 'Professional magazine-style layout with dominant hero image',
    canvasWidth: 1200,
    canvasHeight: 800,
    backgroundColor: '#FFFFFF',
    style: 'magazine',
    layout: 'asymmetric',
    colorScheme: ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12', '#27AE60'],
    typography: {
      primary: 'Playfair Display',
      secondary: 'Source Sans Pro',
      accent: 'Montserrat'
    },
    spacing: {
      margin: 40,
      padding: 20,
      gap: 15
    },
    maxElements: 8
  },
  
  {
    id: 'pinterest_grid',
    name: 'Pinterest Masonry',
    description: 'Pinterest-style masonry layout with varied image sizes',
    canvasWidth: 1000,
    canvasHeight: 800,
    backgroundColor: '#F8F9FA',
    style: 'pinterest',
    layout: 'masonry',
    colorScheme: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    typography: {
      primary: 'Poppins',
      secondary: 'Open Sans',
      accent: 'Lora'
    },
    spacing: {
      margin: 20,
      padding: 15,
      gap: 12
    },
    maxElements: 12
  },
  
  {
    id: 'minimalist_zen',
    name: 'Minimalist Zen',
    description: 'Clean, minimalist layout with plenty of white space',
    canvasWidth: 1000,
    canvasHeight: 700,
    backgroundColor: '#FEFEFE',
    style: 'minimalist',
    layout: 'centered',
    colorScheme: ['#2C3E50', '#ECF0F1', '#BDC3C7', '#34495E', '#95A5A6'],
    typography: {
      primary: 'Inter',
      secondary: 'Inter',
      accent: 'Space Mono'
    },
    spacing: {
      margin: 60,
      padding: 30,
      gap: 25
    },
    maxElements: 6
  },
  
  {
    id: 'cosmic_energy',
    name: 'Cosmic Energy',
    description: 'Mystical layout with flowing, organic positioning',
    canvasWidth: 1200,
    canvasHeight: 900,
    backgroundColor: '#1A1A2E',
    backgroundPattern: 'radial-gradient(circle, rgba(74,144,226,0.1) 0%, transparent 70%)',
    style: 'cosmic',
    layout: 'flowing',
    colorScheme: ['#4A90E2', '#9B59B6', '#E74C3C', '#F39C12', '#1ABC9C'],
    typography: {
      primary: 'Cinzel',
      secondary: 'Lato',
      accent: 'Dancing Script'
    },
    spacing: {
      margin: 30,
      padding: 20,
      gap: 18
    },
    maxElements: 10
  },
  
  {
    id: 'luxury_elegance',
    name: 'Luxury Elegance',
    description: 'Sophisticated layout with premium aesthetics',
    canvasWidth: 1400,
    canvasHeight: 1000,
    backgroundColor: '#0F0F0F',
    style: 'luxury',
    layout: 'golden-ratio',
    colorScheme: ['#D4AF37', '#C0392B', '#FFFFFF', '#2C3E50', '#7F8C8D'],
    typography: {
      primary: 'Didot',
      secondary: 'Avenir',
      accent: 'Cormorant Garamond'
    },
    spacing: {
      margin: 50,
      padding: 25,
      gap: 20
    },
    maxElements: 7
  }
];

// Golden ratio and design constants
const GOLDEN_RATIO = 1.618;
const RULE_OF_THIRDS = [1/3, 2/3];
const FOCAL_POINTS = [
  { x: 1/3, y: 1/3 }, { x: 2/3, y: 1/3 },
  { x: 1/3, y: 2/3 }, { x: 2/3, y: 2/3 }
];

class LayoutEngine {
  private layouts: Map<string, LayoutElement[]> = new Map();

  // Main layout generation function
  generateLayout(options: LayoutOptions): LayoutElement[] {
    const { template, elements, priorityOrder } = options;
    
    // Sort elements by priority and visual weight
    const sortedElements = this.sortElementsByPriority(elements, priorityOrder);
    
    // Choose layout algorithm based on template style
    let layoutElements: LayoutElement[];
    
    switch (template.layout) {
      case 'golden-ratio':
        layoutElements = this.generateGoldenRatioLayout(sortedElements, template, options);
        break;
      case 'masonry':
        layoutElements = this.generateMasonryLayout(sortedElements, template, options);
        break;
      case 'grid':
        layoutElements = this.generateGridLayout(sortedElements, template, options);
        break;
      case 'flowing':
        layoutElements = this.generateFlowingLayout(sortedElements, template, options);
        break;
      case 'centered':
        layoutElements = this.generateCenteredLayout(sortedElements, template, options);
        break;
      case 'asymmetric':
        layoutElements = this.generateAsymmetricLayout(sortedElements, template, options);
        break;
      default:
        layoutElements = this.generateAdaptiveLayout(sortedElements, template, options);
    }
    
    // Apply visual enhancements
    layoutElements = this.applyVisualEnhancements(layoutElements, template);
    
    // Final optimization
    layoutElements = this.optimizeLayout(layoutElements, template, options);
    
    return layoutElements;
  }

  // Golden ratio-based layout (most prestigious)
  private generateGoldenRatioLayout(elements: Partial<LayoutElement>[], template: LayoutTemplate, options: LayoutOptions): LayoutElement[] {
    const layoutElements: LayoutElement[] = [];
    const { canvasWidth, canvasHeight, spacing } = template;
    
    // Define golden ratio divisions
    const primaryWidth = canvasWidth / GOLDEN_RATIO;
    const secondaryWidth = canvasWidth - primaryWidth;
    const primaryHeight = canvasHeight / GOLDEN_RATIO;
    const secondaryHeight = canvasHeight - primaryHeight;
    
    elements.forEach((element, index) => {
      const layoutElement = this.createLayoutElement(element, index);
      
      if (index === 0) {
        // Hero element in primary golden rectangle
        layoutElement.x = spacing.margin;
        layoutElement.y = spacing.margin;
        layoutElement.width = primaryWidth - spacing.margin * 2;
        layoutElement.height = primaryHeight - spacing.margin * 2;
        layoutElement.layoutWeight = 1.0;
        layoutElement.visualWeight = 1.0;
      } else if (index === 1) {
        // Secondary element in secondary rectangle
        layoutElement.x = primaryWidth + spacing.gap;
        layoutElement.y = spacing.margin;
        layoutElement.width = secondaryWidth - spacing.gap - spacing.margin;
        layoutElement.height = secondaryHeight - spacing.margin;
        layoutElement.layoutWeight = 0.618; // 1/golden ratio
        layoutElement.visualWeight = 0.8;
      } else {
        // Remaining elements in smaller golden divisions
        const remainingHeight = canvasHeight - primaryHeight - spacing.gap;
        const elementHeight = (remainingHeight - spacing.gap * (elements.length - 2)) / (elements.length - 2);
        
        layoutElement.x = spacing.margin;
        layoutElement.y = primaryHeight + spacing.gap + (index - 2) * (elementHeight + spacing.gap);
        layoutElement.width = primaryWidth / GOLDEN_RATIO;
        layoutElement.height = elementHeight;
        layoutElement.layoutWeight = 0.4 - (index - 2) * 0.1;
        layoutElement.visualWeight = 0.6 - (index - 2) * 0.1;
      }
      
      layoutElements.push(layoutElement);
    });
    
    return layoutElements;
  }

  // Pinterest-style masonry layout
  private generateMasonryLayout(elements: Partial<LayoutElement>[], template: LayoutTemplate, options: LayoutOptions): LayoutElement[] {
    const layoutElements: LayoutElement[] = [];
    const { canvasWidth, canvasHeight, spacing } = template;
    
    // Calculate column configuration
    const columns = Math.floor(canvasWidth / 250); // Minimum column width
    const columnWidth = (canvasWidth - spacing.margin * 2 - spacing.gap * (columns - 1)) / columns;
    const columnHeights = new Array(columns).fill(spacing.margin);
    
    elements.forEach((element, index) => {
      const layoutElement = this.createLayoutElement(element, index);
      
      // Find shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Calculate dimensions with aspect ratio variety
      layoutElement.width = columnWidth;
      layoutElement.height = this.calculateMasonryHeight(element, columnWidth, index);
      
      // Position in shortest column
      layoutElement.x = spacing.margin + shortestColumnIndex * (columnWidth + spacing.gap);
      layoutElement.y = columnHeights[shortestColumnIndex];
      
      // Update column height
      columnHeights[shortestColumnIndex] += layoutElement.height + spacing.gap;
      
      // Set weights based on position and size
      layoutElement.layoutWeight = 1.0 - (index * 0.1);
      layoutElement.visualWeight = layoutElement.height / columnWidth; // Taller = more visual weight
      
      layoutElements.push(layoutElement);
    });
    
    return layoutElements;
  }

  // Magazine-style asymmetric layout
  private generateAsymmetricLayout(elements: Partial<LayoutElement>[], template: LayoutTemplate, options: LayoutOptions): LayoutElement[] {
    const layoutElements: LayoutElement[] = [];
    const { canvasWidth, canvasHeight, spacing } = template;
    
    elements.forEach((element, index) => {
      const layoutElement = this.createLayoutElement(element, index);
      
      if (index === 0) {
        // Hero element - large and prominent
        layoutElement.x = spacing.margin;
        layoutElement.y = spacing.margin;
        layoutElement.width = canvasWidth * 0.6;
        layoutElement.height = canvasHeight * 0.5;
        layoutElement.layoutWeight = 1.0;
        layoutElement.visualWeight = 1.0;
      } else if (index === 1) {
        // Secondary element - complementary
        layoutElement.x = canvasWidth * 0.6 + spacing.gap;
        layoutElement.y = spacing.margin;
        layoutElement.width = canvasWidth * 0.35 - spacing.margin;
        layoutElement.height = canvasHeight * 0.3;
        layoutElement.layoutWeight = 0.8;
        layoutElement.visualWeight = 0.7;
      } else {
        // Supporting elements in dynamic grid
        const remainingElements = elements.length - 2;
        const gridCols = Math.ceil(Math.sqrt(remainingElements));
        const gridRows = Math.ceil(remainingElements / gridCols);
        
        const col = (index - 2) % gridCols;
        const row = Math.floor((index - 2) / gridCols);
        
        const availableWidth = canvasWidth - spacing.margin * 2;
        const availableHeight = canvasHeight * 0.4;
        
        layoutElement.width = (availableWidth - spacing.gap * (gridCols - 1)) / gridCols;
        layoutElement.height = (availableHeight - spacing.gap * (gridRows - 1)) / gridRows;
        layoutElement.x = spacing.margin + col * (layoutElement.width + spacing.gap);
        layoutElement.y = canvasHeight * 0.55 + row * (layoutElement.height + spacing.gap);
        layoutElement.layoutWeight = 0.6 - (index - 2) * 0.1;
        layoutElement.visualWeight = 0.5 - (index - 2) * 0.05;
      }
      
      layoutElements.push(layoutElement);
    });
    
    return layoutElements;
  }

  // Flowing organic layout for cosmic theme
  private generateFlowingLayout(elements: Partial<LayoutElement>[], template: LayoutTemplate, options: LayoutOptions): LayoutElement[] {
    const layoutElements: LayoutElement[] = [];
    const { canvasWidth, canvasHeight, spacing } = template;
    
    // Create spiral or flowing pattern
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const maxRadius = Math.min(canvasWidth, canvasHeight) / 2 - spacing.margin;
    
    elements.forEach((element, index) => {
      const layoutElement = this.createLayoutElement(element, index);
      
      if (index === 0) {
        // Center element
        layoutElement.width = 200;
        layoutElement.height = 200;
        layoutElement.x = centerX - layoutElement.width / 2;
        layoutElement.y = centerY - layoutElement.height / 2;
        layoutElement.layoutWeight = 1.0;
        layoutElement.visualWeight = 1.0;
      } else {
        // Spiral arrangement
        const angle = (index - 1) * (Math.PI * 2 / 3); // 120 degrees apart
        const radius = (maxRadius / elements.length) * (index + 1);
        
        const baseSize = 120 - index * 10;
        layoutElement.width = baseSize + Math.random() * 40;
        layoutElement.height = baseSize + Math.random() * 40;
        
        layoutElement.x = centerX + Math.cos(angle) * radius - layoutElement.width / 2;
        layoutElement.y = centerY + Math.sin(angle) * radius - layoutElement.height / 2;
        
        // Add subtle rotation for organic feel
        layoutElement.rotation = (Math.random() - 0.5) * 15;
        
        layoutElement.layoutWeight = 1.0 - index * 0.15;
        layoutElement.visualWeight = 0.8 - index * 0.1;
      }
      
      layoutElements.push(layoutElement);
    });
    
    return layoutElements;
  }

  // Minimalist centered layout
  private generateCenteredLayout(elements: Partial<LayoutElement>[], template: LayoutTemplate, options: LayoutOptions): LayoutElement[] {
    const layoutElements: LayoutElement[] = [];
    const { canvasWidth, canvasHeight, spacing } = template;
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    elements.forEach((element, index) => {
      const layoutElement = this.createLayoutElement(element, index);
      
      if (index === 0) {
        // Hero element in center
        layoutElement.width = Math.min(400, canvasWidth * 0.6);
        layoutElement.height = Math.min(300, canvasHeight * 0.4);
        layoutElement.x = centerX - layoutElement.width / 2;
        layoutElement.y = centerY - layoutElement.height / 2 - 50;
        layoutElement.layoutWeight = 1.0;
        layoutElement.visualWeight = 1.0;
      } else {
        // Supporting elements arranged symmetrically
        const angle = (index - 1) * (Math.PI * 2 / (elements.length - 1));
        const radius = Math.min(canvasWidth, canvasHeight) * 0.25;
        
        layoutElement.width = 150;
        layoutElement.height = 120;
        layoutElement.x = centerX + Math.cos(angle) * radius - layoutElement.width / 2;
        layoutElement.y = centerY + Math.sin(angle) * radius - layoutElement.height / 2;
        layoutElement.layoutWeight = 0.6;
        layoutElement.visualWeight = 0.6;
      }
      
      layoutElements.push(layoutElement);
    });
    
    return layoutElements;
  }

  // Smart grid layout with varied sizes
  private generateGridLayout(elements: Partial<LayoutElement>[], template: LayoutTemplate, options: LayoutOptions): LayoutElement[] {
    const layoutElements: LayoutElement[] = [];
    const { canvasWidth, canvasHeight, spacing } = template;
    
    // Dynamic grid based on element count
    const cols = Math.ceil(Math.sqrt(elements.length));
    const rows = Math.ceil(elements.length / cols);
    
    const cellWidth = (canvasWidth - spacing.margin * 2 - spacing.gap * (cols - 1)) / cols;
    const cellHeight = (canvasHeight - spacing.margin * 2 - spacing.gap * (rows - 1)) / rows;
    
    elements.forEach((element, index) => {
      const layoutElement = this.createLayoutElement(element, index);
      
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      // Add size variation for visual interest
      const sizeVariation = index === 0 ? 1.3 : (0.8 + Math.random() * 0.4);
      
      layoutElement.width = cellWidth * sizeVariation;
      layoutElement.height = cellHeight * sizeVariation;
      layoutElement.x = spacing.margin + col * (cellWidth + spacing.gap);
      layoutElement.y = spacing.margin + row * (cellHeight + spacing.gap);
      
      layoutElement.layoutWeight = 1.0 - index * 0.1;
      layoutElement.visualWeight = sizeVariation;
      
      layoutElements.push(layoutElement);
    });
    
    return layoutElements;
  }

  // Adaptive layout that chooses best approach
  private generateAdaptiveLayout(elements: Partial<LayoutElement>[], template: LayoutTemplate, options: LayoutOptions): LayoutElement[] {
    // Choose layout based on element count and template style
    if (elements.length <= 3) {
      return this.generateCenteredLayout(elements, template, options);
    } else if (elements.length <= 6 && template.style === 'luxury') {
      return this.generateGoldenRatioLayout(elements, template, options);
    } else if (template.style === 'pinterest') {
      return this.generateMasonryLayout(elements, template, options);
    } else {
      return this.generateAsymmetricLayout(elements, template, options);
    }
  }

  // Apply visual enhancements based on template style
  private applyVisualEnhancements(elements: LayoutElement[], template: LayoutTemplate): LayoutElement[] {
    return elements.map((element, index) => {
      // Apply template-specific styling
      switch (template.style) {
        case 'luxury':
          element.borderRadius = 8;
          element.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
          if (element.type === 'text') {
            element.fontFamily = template.typography.primary;
            element.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
          }
          break;
          
        case 'minimalist':
          element.borderRadius = 4;
          element.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
          if (element.type === 'text') {
            element.fontFamily = template.typography.primary;
            element.color = template.colorScheme[0];
          }
          break;
          
        case 'cosmic':
          element.borderRadius = 12;
          element.filter = 'drop-shadow(0 0 10px rgba(74,144,226,0.4))';
          element.transform = `rotate(${element.rotation}deg)`;
          if (element.type === 'text') {
            element.fontFamily = template.typography.accent;
            element.gradient = 'linear-gradient(45deg, #4A90E2, #9B59B6)';
          }
          break;
          
        case 'pinterest':
          element.borderRadius = 16;
          element.filter = 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))';
          if (element.type === 'image') {
            element.transform = `scale(${1 + Math.random() * 0.1})`;
          }
          break;
          
        case 'magazine':
          element.borderRadius = 6;
          element.filter = 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))';
          if (element.type === 'text' && index === 0) {
            element.fontSize = 36;
            element.fontWeight = 'bold';
            element.fontFamily = template.typography.primary;
          }
          break;
      }
      
      // Apply z-index based on visual weight
      element.zIndex = Math.floor(element.visualWeight * 100);
      
      return element;
    });
  }

  // Optimize layout for better visual balance
  private optimizeLayout(elements: LayoutElement[], template: LayoutTemplate, options: LayoutOptions): LayoutElement[] {
    if (!options.allowOverlap) {
      elements = this.resolveOverlaps(elements, template);
    }
    
    if (options.colorHarmony) {
      elements = this.applyColorHarmony(elements, template);
    }
    
    if (options.symmetricBalance) {
      elements = this.improveBalance(elements, template);
    }
    
    return elements;
  }

  // Helper functions
  private sortElementsByPriority(elements: Partial<LayoutElement>[], priorityOrder?: string[]): Partial<LayoutElement>[] {
    if (!priorityOrder) {
      return elements.sort((a, b) => (b.layoutWeight || 0.5) - (a.layoutWeight || 0.5));
    }
    
    return elements.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.id || '');
      const bIndex = priorityOrder.indexOf(b.id || '');
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }

  private createLayoutElement(element: Partial<LayoutElement>, index: number): LayoutElement {
    return {
      id: element.id || `element_${index}`,
      type: element.type || 'image',
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      rotation: element.rotation || 0,
      zIndex: index,
      opacity: element.opacity || 1,
      layoutWeight: element.layoutWeight || (1.0 - index * 0.1),
      visualWeight: element.visualWeight || 0.8,
      content: element.content,
      imageUrl: element.imageUrl,
      backgroundColor: element.backgroundColor,
      fontSize: element.fontSize || 16,
      fontWeight: element.fontWeight || 'normal',
      fontFamily: element.fontFamily || 'Inter',
      textAlign: element.textAlign || 'center',
      color: element.color || '#000000',
      borderRadius: element.borderRadius || 8,
      ...element
    };
  }

  private calculateMasonryHeight(element: Partial<LayoutElement>, width: number, index: number): number {
    // Vary heights for visual interest
    const baseHeight = 150;
    const variations = [1.0, 1.3, 0.8, 1.1, 0.9, 1.2];
    const multiplier = variations[index % variations.length];
    
    if (element.type === 'text') {
      return Math.max(80, baseHeight * 0.6 * multiplier);
    }
    
    return baseHeight * multiplier;
  }

  private resolveOverlaps(elements: LayoutElement[], template: LayoutTemplate): LayoutElement[] {
    // Simple overlap resolution by shifting elements
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        if (this.elementsOverlap(elements[i], elements[j])) {
          // Move element j to avoid overlap
          elements[j].y += elements[i].height + template.spacing.gap;
        }
      }
    }
    return elements;
  }

  private elementsOverlap(a: LayoutElement, b: LayoutElement): boolean {
    return !(a.x + a.width < b.x || 
             b.x + b.width < a.x || 
             a.y + a.height < b.y || 
             b.y + b.height < a.y);
  }

  private applyColorHarmony(elements: LayoutElement[], template: LayoutTemplate): LayoutElement[] {
    const colors = template.colorScheme;
    return elements.map((element, index) => {
      if (element.type === 'text' && !element.color) {
        element.color = colors[index % colors.length];
      }
      return element;
    });
  }

  private improveBalance(elements: LayoutElement[], template: LayoutTemplate): LayoutElement[] {
    // Advanced balance algorithm would go here
    // For now, return elements as-is
    return elements;
  }

  // Public API methods
  getLayoutTemplates(): LayoutTemplate[] {
    return layoutTemplates;
  }

  getTemplateById(id: string): LayoutTemplate | undefined {
    return layoutTemplates.find(template => template.id === id);
  }

  validateLayout(elements: LayoutElement[], template: LayoutTemplate): boolean {
    // Check if all elements fit within canvas bounds
    return elements.every(element => 
      element.x >= 0 && 
      element.y >= 0 && 
      element.x + element.width <= template.canvasWidth && 
      element.y + element.height <= template.canvasHeight
    );
  }
}

// Export singleton instance
export const layoutEngine = new LayoutEngine();

// Export templates and types
export { layoutTemplates, GOLDEN_RATIO, RULE_OF_THIRDS, FOCAL_POINTS };