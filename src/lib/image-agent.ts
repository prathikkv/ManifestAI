// Intelligent Image Discovery & Curation Agent for ManifestAI
// Multi-API integration with AI-powered relevance scoring and enhancement

export interface ImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  highResUrl?: string;
  alt: string;
  source: 'unsplash' | 'pexels' | 'pixabay';
  photographer?: string;
  photographerUrl?: string;
  relevanceScore: number;
  emotionalResonance: number;
  colorPalette: string[];
  composition: 'portrait' | 'landscape' | 'square';
  style: string;
  tags: string[];
  width: number;
  height: number;
}

export interface ImageSearchParams {
  query: string;
  category: string;
  emotionalTone: string;
  colorPreferences?: string[];
  style?: string;
  orientation?: 'portrait' | 'landscape' | 'square' | 'any';
  limit?: number;
  excludeIds?: string[];
}

export interface ImageEnhancement {
  filter?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  blur?: number;
  cropFocus?: 'center' | 'face' | 'entropy';
}

// Color psychology mapping for emotional resonance
const colorPsychology = {
  success: ['#FFD700', '#228B22', '#4169E1'], // Gold, Green, Blue
  love: ['#FF69B4', '#DC143C', '#FFB6C1'], // Pink, Crimson, Light Pink
  peace: ['#87CEEB', '#98FB98', '#F0E68C'], // Sky Blue, Pale Green, Khaki
  energy: ['#FF4500', '#FF6347', '#FFA500'], // Orange Red, Tomato, Orange
  growth: ['#32CD32', '#00FF7F', '#ADFF2F'], // Lime Green, Spring Green, Green Yellow
  luxury: ['#800080', '#B8860B', '#2F4F4F'], // Purple, Dark Goldenrod, Dark Slate Gray
  adventure: ['#FF8C00', '#20B2AA', '#32CD32'], // Dark Orange, Light Sea Green, Lime Green
  wisdom: ['#4B0082', '#191970', '#483D8B'] // Indigo, Midnight Blue, Dark Slate Blue
};

// Image style definitions for different emotional contexts
const imageStyles = {
  dynamic: {
    keywords: ['action', 'movement', 'energy', 'vibrant', 'bold'],
    composition: 'diagonal lines, dynamic angles',
    lighting: 'dramatic, high contrast'
  },
  serene: {
    keywords: ['calm', 'peaceful', 'minimalist', 'soft', 'gentle'],
    composition: 'symmetrical, balanced',
    lighting: 'soft, natural, golden hour'
  },
  luxurious: {
    keywords: ['elegant', 'premium', 'sophisticated', 'rich', 'opulent'],
    composition: 'clean lines, luxury materials',
    lighting: 'professional, polished'
  },
  warm: {
    keywords: ['cozy', 'intimate', 'friendly', 'welcoming', 'comfortable'],
    composition: 'close-up, personal',
    lighting: 'warm tones, soft shadows'
  },
  expansive: {
    keywords: ['vast', 'open', 'freedom', 'limitless', 'horizon'],
    composition: 'wide shots, panoramic',
    lighting: 'natural, outdoor'
  },
  strong: {
    keywords: ['powerful', 'determined', 'focused', 'intense', 'resilient'],
    composition: 'strong focal point, bold contrast',
    lighting: 'dramatic, directional'
  }
};

class ImageDiscoveryAgent {
  private cache: Map<string, ImageResult[]> = new Map();
  private rateLimits: Map<string, number> = new Map();
  private apiKeys = {
    unsplash: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'demo',
    pexels: process.env.NEXT_PUBLIC_PEXELS_API_KEY || 'demo',
    pixabay: process.env.NEXT_PUBLIC_PIXABAY_API_KEY || 'demo'
  };

  // Main search function with multi-API integration
  async searchImages(params: ImageSearchParams): Promise<ImageResult[]> {
    const cacheKey = this.generateCacheKey(params);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Search across multiple APIs in parallel
      const searchPromises = [
        this.searchUnsplash(params),
        this.searchPexels(params),
        this.searchPixabay(params)
      ];

      const results = await Promise.allSettled(searchPromises);
      const allImages: ImageResult[] = [];

      // Combine results from all sources
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          allImages.push(...result.value);
        }
      });

      // Score and rank images
      const rankedImages = await this.scoreAndRankImages(allImages, params);
      
      // Apply intelligent filtering
      const filteredImages = this.intelligentFilter(rankedImages, params);
      
      // Cache results
      this.cache.set(cacheKey, filteredImages);
      
      return filteredImages;
    } catch (error) {
      console.error('Image search error:', error);
      return this.getFallbackImages(params);
    }
  }

  // Enhanced Unsplash search with semantic queries
  private async searchUnsplash(params: ImageSearchParams): Promise<ImageResult[]> {
    if (!this.checkRateLimit('unsplash')) return [];

    try {
      // Build enhanced query
      const enhancedQuery = this.buildEnhancedQuery(params);
      
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(enhancedQuery)}&per_page=${params.limit || 20}&orientation=${params.orientation || 'landscape'}`,
        {
          headers: {
            'Authorization': `Client-ID ${this.apiKeys.unsplash}`
          }
        }
      );

      if (!response.ok) throw new Error('Unsplash API error');

      const data = await response.json();
      return data.results.map((photo: any) => this.transformUnsplashResult(photo, params));
    } catch (error) {
      console.error('Unsplash search error:', error);
      return [];
    }
  }

  // Enhanced Pexels search
  private async searchPexels(params: ImageSearchParams): Promise<ImageResult[]> {
    if (!this.checkRateLimit('pexels')) return [];

    try {
      const enhancedQuery = this.buildEnhancedQuery(params);
      
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(enhancedQuery)}&per_page=${params.limit || 20}&orientation=${params.orientation || 'landscape'}`,
        {
          headers: {
            'Authorization': this.apiKeys.pexels
          }
        }
      );

      if (!response.ok) throw new Error('Pexels API error');

      const data = await response.json();
      return data.photos.map((photo: any) => this.transformPexelsResult(photo, params));
    } catch (error) {
      console.error('Pexels search error:', error);
      return [];
    }
  }

  // Enhanced Pixabay search
  private async searchPixabay(params: ImageSearchParams): Promise<ImageResult[]> {
    if (!this.checkRateLimit('pixabay')) return [];

    try {
      const enhancedQuery = this.buildEnhancedQuery(params);
      
      const response = await fetch(
        `https://pixabay.com/api/?key=${this.apiKeys.pixabay}&q=${encodeURIComponent(enhancedQuery)}&image_type=photo&per_page=${params.limit || 20}&orientation=${params.orientation || 'horizontal'}&category=backgrounds,nature,business,health,people,places`
      );

      if (!response.ok) throw new Error('Pixabay API error');

      const data = await response.json();
      return data.hits.map((photo: any) => this.transformPixabayResult(photo, params));
    } catch (error) {
      console.error('Pixabay search error:', error);
      return [];
    }
  }

  // Build enhanced search queries with semantic understanding
  private buildEnhancedQuery(params: ImageSearchParams): string {
    let query = params.query;
    
    // Add emotional context
    if (params.emotionalTone) {
      const style = imageStyles[params.style as keyof typeof imageStyles];
      if (style) {
        query += ` ${style.keywords.slice(0, 2).join(' ')}`;
      }
    }
    
    // Add style keywords
    if (params.style && imageStyles[params.style as keyof typeof imageStyles]) {
      const styleKeywords = imageStyles[params.style as keyof typeof imageStyles].keywords;
      query += ` ${styleKeywords[0]}`;
    }
    
    // Add composition hints
    if (params.orientation) {
      if (params.orientation === 'portrait') query += ' vertical';
      else if (params.orientation === 'landscape') query += ' horizontal wide';
    }
    
    return query;
  }

  // Transform API results to unified format
  private transformUnsplashResult(photo: any, params: ImageSearchParams): ImageResult {
    return {
      id: `unsplash_${photo.id}`,
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.thumb,
      highResUrl: photo.urls.full,
      alt: photo.alt_description || photo.description || 'Vision board image',
      source: 'unsplash',
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      relevanceScore: 0.8, // Will be calculated later
      emotionalResonance: 0.7,
      colorPalette: photo.color ? [photo.color] : [],
      composition: photo.width > photo.height ? 'landscape' : photo.width < photo.height ? 'portrait' : 'square',
      style: params.style || 'dynamic',
      tags: photo.tags?.map((tag: any) => tag.title) || [],
      width: photo.width,
      height: photo.height
    };
  }

  private transformPexelsResult(photo: any, params: ImageSearchParams): ImageResult {
    return {
      id: `pexels_${photo.id}`,
      url: photo.src.large,
      thumbnailUrl: photo.src.medium,
      highResUrl: photo.src.original,
      alt: photo.alt || 'Vision board image',
      source: 'pexels',
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      relevanceScore: 0.8,
      emotionalResonance: 0.7,
      colorPalette: [photo.avg_color || '#000000'],
      composition: photo.width > photo.height ? 'landscape' : photo.width < photo.height ? 'portrait' : 'square',
      style: params.style || 'dynamic',
      tags: [],
      width: photo.width,
      height: photo.height
    };
  }

  private transformPixabayResult(photo: any, params: ImageSearchParams): ImageResult {
    return {
      id: `pixabay_${photo.id}`,
      url: photo.webformatURL,
      thumbnailUrl: photo.previewURL,
      highResUrl: photo.largeImageURL,
      alt: photo.tags || 'Vision board image',
      source: 'pixabay',
      photographer: photo.user,
      relevanceScore: 0.8,
      emotionalResonance: 0.7,
      colorPalette: [],
      composition: photo.imageWidth > photo.imageHeight ? 'landscape' : photo.imageWidth < photo.imageHeight ? 'portrait' : 'square',
      style: params.style || 'dynamic',
      tags: photo.tags.split(', '),
      width: photo.imageWidth,
      height: photo.imageHeight
    };
  }

  // AI-powered image scoring and ranking
  private async scoreAndRankImages(images: ImageResult[], params: ImageSearchParams): Promise<ImageResult[]> {
    return images.map(image => {
      // Calculate relevance score
      let relevanceScore = 0.5;
      
      // Keyword matching in tags and alt text
      const searchTerms = params.query.toLowerCase().split(' ');
      const imageText = `${image.alt} ${image.tags.join(' ')}`.toLowerCase();
      
      searchTerms.forEach(term => {
        if (imageText.includes(term)) {
          relevanceScore += 0.2;
        }
      });
      
      // Style matching
      if (params.style && image.style === params.style) {
        relevanceScore += 0.2;
      }
      
      // Orientation preference
      if (params.orientation && params.orientation !== 'any') {
        if (image.composition === params.orientation) {
          relevanceScore += 0.1;
        }
      }
      
      // Color preference matching
      if (params.colorPreferences && params.colorPreferences.length > 0) {
        const hasMatchingColor = image.colorPalette.some(color => 
          params.colorPreferences!.some(pref => 
            this.colorDistance(color, pref) < 50
          )
        );
        if (hasMatchingColor) {
          relevanceScore += 0.15;
        }
      }
      
      // Emotional resonance based on category and emotional tone
      let emotionalResonance = 0.6;
      if (params.emotionalTone && colorPsychology[params.emotionalTone as keyof typeof colorPsychology]) {
        const emotionalColors = colorPsychology[params.emotionalTone as keyof typeof colorPsychology];
        const hasEmotionalColor = image.colorPalette.some(color =>
          emotionalColors.some(eColor => this.colorDistance(color, eColor) < 60)
        );
        if (hasEmotionalColor) {
          emotionalResonance += 0.3;
        }
      }
      
      // Update scores
      image.relevanceScore = Math.min(relevanceScore, 1.0);
      image.emotionalResonance = Math.min(emotionalResonance, 1.0);
      
      return image;
    }).sort((a, b) => {
      const scoreA = (a.relevanceScore * 0.6) + (a.emotionalResonance * 0.4);
      const scoreB = (b.relevanceScore * 0.6) + (b.emotionalResonance * 0.4);
      return scoreB - scoreA;
    });
  }

  // Intelligent filtering to remove duplicates and low-quality images
  private intelligentFilter(images: ImageResult[], params: ImageSearchParams): ImageResult[] {
    const filtered: ImageResult[] = [];
    const seenSimilar = new Set<string>();
    
    for (const image of images) {
      // Skip excluded IDs
      if (params.excludeIds?.includes(image.id)) continue;
      
      // Check for similar images (basic deduplication)
      const similarityKey = `${image.width}x${image.height}_${image.photographer || 'unknown'}`;
      if (seenSimilar.has(similarityKey)) continue;
      seenSimilar.add(similarityKey);
      
      // Quality filters
      if (image.width < 400 || image.height < 300) continue; // Minimum resolution
      if (image.relevanceScore < 0.3) continue; // Minimum relevance
      
      filtered.push(image);
      
      // Respect limit
      if (filtered.length >= (params.limit || 20)) break;
    }
    
    return filtered;
  }

  // Enhanced image processing and optimization
  async enhanceImage(imageUrl: string, enhancements: ImageEnhancement): Promise<string> {
    // Build Unsplash image transformation URL
    if (imageUrl.includes('unsplash.com')) {
      const params = new URLSearchParams();
      
      if (enhancements.brightness) params.append('bri', enhancements.brightness.toString());
      if (enhancements.contrast) params.append('con', enhancements.contrast.toString());
      if (enhancements.saturation) params.append('sat', enhancements.saturation.toString());
      if (enhancements.blur) params.append('blur', enhancements.blur.toString());
      if (enhancements.cropFocus) params.append('crop', enhancements.cropFocus);
      
      const transformParams = params.toString();
      return transformParams ? `${imageUrl}&${transformParams}` : imageUrl;
    }
    
    // For other sources, return original URL (could integrate with Cloudinary or similar)
    return imageUrl;
  }

  // Get curated image collections for specific dream categories
  async getCuratedCollection(category: string, limit: number = 10): Promise<ImageResult[]> {
    const collections = {
      health_fitness: [
        'workout gym fitness',
        'healthy food nutrition',
        'running exercise outdoor',
        'yoga meditation wellness'
      ],
      career_business: [
        'office professional business',
        'success achievement trophy',
        'handshake meeting corporate',
        'laptop work productivity'
      ],
      relationships_love: [
        'couple love romantic',
        'wedding marriage celebration',
        'family happiness together',
        'heart symbol love'
      ],
      travel_adventure: [
        'mountain landscape adventure',
        'beach sunset travel',
        'backpack hiking outdoor',
        'airplane passport journey'
      ],
      personal_growth: [
        'meditation peaceful zen',
        'books learning wisdom',
        'nature growth transformation',
        'sunrise new beginning'
      ]
    };

    const queries = collections[category as keyof typeof collections] || collections.personal_growth;
    const allImages: ImageResult[] = [];

    for (const query of queries) {
      const images = await this.searchImages({
        query,
        category,
        emotionalTone: 'positive',
        limit: Math.ceil(limit / queries.length)
      });
      allImages.push(...images);
    }

    return allImages.slice(0, limit);
  }

  // Utility functions
  private generateCacheKey(params: ImageSearchParams): string {
    return `${params.query}_${params.category}_${params.emotionalTone}_${params.orientation}_${params.limit || 20}`;
  }

  private checkRateLimit(api: string): boolean {
    const now = Date.now();
    const lastCall = this.rateLimits.get(api) || 0;
    const minInterval = api === 'unsplash' ? 1000 : 500; // Different limits per API
    
    if (now - lastCall < minInterval) {
      return false;
    }
    
    this.rateLimits.set(api, now);
    return true;
  }

  private colorDistance(color1: string, color2: string): number {
    // Simple color distance calculation (could be enhanced with Delta-E)
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 100;
    
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
  }

  private hexToRgb(hex: string): {r: number, g: number, b: number} | null {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private getFallbackImages(params: ImageSearchParams): ImageResult[] {
    // Return curated fallback images for when APIs fail
    const fallbacks = [
      {
        id: 'fallback_1',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200',
        alt: 'Mountain landscape',
        source: 'unsplash' as const,
        relevanceScore: 0.6,
        emotionalResonance: 0.7,
        colorPalette: ['#4A90E2'],
        composition: 'landscape' as const,
        style: 'expansive',
        tags: ['nature', 'mountain', 'landscape'],
        width: 600,
        height: 400
      }
    ];
    
    return fallbacks.slice(0, params.limit || 10);
  }
}

// Export singleton instance
export const imageAgent = new ImageDiscoveryAgent();

// Export utilities
export { colorPsychology, imageStyles };