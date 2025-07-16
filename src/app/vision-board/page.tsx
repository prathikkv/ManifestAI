'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Sparkles, 
  Image, 
  Type, 
  Layout, 
  Palette, 
  Zap,
  Heart,
  Star,
  Camera,
  Plus,
  Move,
  Trash2,
  RotateCw,
  Copy,
  Settings,
  User,
  Undo,
  Redo,
  Grid,
  MousePointer,
  Edit3,
  Wand2,
  Layers,
  PaintBucket,
  Quote,
  Target,
  Crown,
  Infinity,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Import our advanced AI systems
import { nlpEngine, type DreamAnalysis, type Dream } from '@/lib/nlp-engine';
import { imageAgent, type ImageResult, type ImageSearchParams } from '@/lib/image-agent';
import { layoutEngine, type LayoutElement, type LayoutTemplate, layoutTemplates } from '@/lib/layout-engine';
import { designSystem, type ColorPalette, type TypographyStyle } from '@/lib/design-system';
import { contentGenerator, type GeneratedContent, type ContentRequest } from '@/lib/content-generator';

interface VisionBoardElement extends LayoutElement {
  // Extended properties for enhanced functionality
  isSelected?: boolean;
  isLocked?: boolean;
  isVisible?: boolean;
  metadata?: {
    source?: string;
    emotion?: string;
    category?: string;
    relevanceScore?: number;
    aiGenerated?: boolean;
  };
}

interface AIGenerationState {
  isGenerating: boolean;
  currentStep: string;
  progress: number;
  analysis?: DreamAnalysis;
  generatedContent?: GeneratedContent;
  selectedImages?: ImageResult[];
}

export default function EnhancedVisionBoardPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // User and authentication state
  const [user, setUser] = useState<any>(null);
  const [userGender, setUserGender] = useState<string>('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  
  // Vision board state
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(layoutTemplates[0]);
  const [boardElements, setBoardElements] = useState<VisionBoardElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<VisionBoardElement | null>(null);
  const [boardTitle, setBoardTitle] = useState('My Vision Board');
  
  // UI state
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  // Dreams and AI state
  const [userDreams, setUserDreams] = useState<Dream[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showDreamSelector, setShowDreamSelector] = useState(false);
  const [aiState, setAiState] = useState<AIGenerationState>({
    isGenerating: false,
    currentStep: '',
    progress: 0
  });
  
  // Advanced editing state
  const [editHistory, setEditHistory] = useState<VisionBoardElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState('');
  
  // Design customization state
  const [currentColorPalette, setCurrentColorPalette] = useState<ColorPalette | null>(null);
  const [customBackground, setCustomBackground] = useState<string>('');
  const [globalOpacity, setGlobalOpacity] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  // Grid system constants
  const gridSize = 20;
  const canvasWidth = selectedTemplate.canvasWidth;
  const canvasHeight = selectedTemplate.canvasHeight;

  useEffect(() => {
    // Initialize user and load data
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load user dreams
    const savedDreams = localStorage.getItem('dreams');
    if (savedDreams) {
      setUserDreams(JSON.parse(savedDreams));
    }
    
    // Load user preferences
    const savedGender = localStorage.getItem('userGender');
    if (savedGender) {
      setUserGender(savedGender);
    } else {
      setShowGenderModal(true);
    }
    
    // Initialize color palette
    setCurrentColorPalette(designSystem.getColorPaletteForEmotion('success'));
  }, [router]);

  // Advanced AI Vision Board Generation
  const generateAIVisionBoard = async (dream: Dream) => {
    setAiState({ 
      isGenerating: true, 
      currentStep: 'Initializing AI analysis...', 
      progress: 0 
    });
    
    saveState();
    
    try {
      // Step 1: Advanced NLP Analysis
      setAiState(prev => ({ 
        ...prev, 
        currentStep: '🧠 Analyzing dream with advanced NLP...', 
        progress: 15 
      }));
      
      await delay(1000);
      const analysis = nlpEngine.analyzeDream(dream, user.id);
      
      setAiState(prev => ({ 
        ...prev, 
        analysis,
        currentStep: `🎯 Detected: ${analysis.primaryCategories.join(', ')} (${analysis.emotionalTone.sentiment})`,
        progress: 25
      }));
      
      await delay(800);
      
      // Step 2: Generate Personalized Content
      setAiState(prev => ({ 
        ...prev, 
        currentStep: '✨ Generating personalized content...', 
        progress: 40 
      }));
      
      const contentRequest: ContentRequest = {
        dreamTitle: dream.title,
        dreamDescription: dream.description,
        category: analysis.primaryCategories[0] || 'personal_growth',
        emotionalTone: analysis.emotionalTone.emotions[0] || 'success',
        timeframe: dream.deadline ? 'medium_term' : 'long_term',
        userGender: userGender || undefined,
        personalValues: analysis.entities.values,
        previousSuccesses: []
      };
      
      const generatedContent = contentGenerator.generateContent(contentRequest);
      
      setAiState(prev => ({ 
        ...prev, 
        generatedContent,
        currentStep: '🖼️ Discovering perfect images...', 
        progress: 55 
      }));
      
      await delay(1200);
      
      // Step 3: Intelligent Image Discovery
      const imagePromises = analysis.suggestions.imageQueries.slice(0, 3).map(async (query) => {
        const searchParams: ImageSearchParams = {
          query,
          category: analysis.primaryCategories[0],
          emotionalTone: analysis.emotionalTone.emotions[0],
          style: analysis.emotionalTone.emotions[0] === 'excitement' ? 'dynamic' : 'serene',
          orientation: 'landscape',
          limit: 4
        };
        
        return await imageAgent.searchImages(searchParams);
      });
      
      const imageResults = await Promise.all(imagePromises);
      const selectedImages = imageResults.flat().slice(0, 8);
      
      setAiState(prev => ({ 
        ...prev, 
        selectedImages,
        currentStep: '🎨 Creating professional layout...', 
        progress: 75 
      }));
      
      await delay(1000);
      
      // Step 4: Professional Layout Generation
      const emotion = analysis.emotionalTone.emotions[0];
      const appropriateTemplate = selectOptimalTemplate(analysis);
      setSelectedTemplate(appropriateTemplate);
      
      // Update color palette based on emotion
      const emotionalPalette = designSystem.getColorPaletteForEmotion(emotion);
      setCurrentColorPalette(emotionalPalette);
      
      // Create layout elements
      const elementsToLayout: Partial<LayoutElement>[] = [];
      
      // Add hero image
      if (selectedImages.length > 0) {
        elementsToLayout.push({
          id: 'hero_image',
          type: 'image',
          imageUrl: selectedImages[0].url,
          layoutWeight: 1.0,
          visualWeight: 1.0,
          metadata: {
            source: selectedImages[0].source,
            emotion: emotion,
            category: analysis.primaryCategories[0],
            relevanceScore: selectedImages[0].relevanceScore,
            aiGenerated: true
          }
        });
      }
      
      // Add main title
      elementsToLayout.push({
        id: 'main_title',
        type: 'text',
        content: dream.title.toUpperCase(),
        layoutWeight: 0.9,
        visualWeight: 0.9,
        fontSize: 42,
        fontWeight: 'bold',
        metadata: {
          emotion: emotion,
          category: 'title',
          aiGenerated: true
        }
      });
      
      // Add supporting images
      selectedImages.slice(1, 5).forEach((image, index) => {
        elementsToLayout.push({
          id: `support_image_${index}`,
          type: 'image',
          imageUrl: image.url,
          layoutWeight: 0.7 - index * 0.1,
          visualWeight: 0.6 - index * 0.05,
          metadata: {
            source: image.source,
            emotion: emotion,
            category: analysis.primaryCategories[0],
            relevanceScore: image.relevanceScore,
            aiGenerated: true
          }
        });
      });
      
      // Add affirmations
      generatedContent.affirmations.slice(0, 3).forEach((affirmation, index) => {
        elementsToLayout.push({
          id: `affirmation_${index}`,
          type: 'text',
          content: affirmation,
          layoutWeight: 0.5 - index * 0.1,
          visualWeight: 0.4,
          fontSize: 18,
          fontWeight: '500',
          metadata: {
            emotion: emotion,
            category: 'affirmation',
            aiGenerated: true
          }
        });
      });
      
      // Add power words
      const powerWords = contentGenerator.generatePowerWords(analysis.primaryCategories[0]);
      powerWords.slice(0, 2).forEach((word, index) => {
        elementsToLayout.push({
          id: `power_word_${index}`,
          type: 'text',
          content: word,
          layoutWeight: 0.4,
          visualWeight: 0.5,
          fontSize: 28,
          fontWeight: 'bold',
          metadata: {
            emotion: emotion,
            category: 'power_word',
            aiGenerated: true
          }
        });
      });
      
      // Generate professional layout
      const layoutElements = layoutEngine.generateLayout({
        template: appropriateTemplate,
        elements: elementsToLayout,
        priorityOrder: elementsToLayout.map(e => e.id!),
        colorHarmony: true,
        respectGoldenRatio: true,
        allowOverlap: false,
        symmetricBalance: false,
        visualFlow: 'center-out'
      });
      
      setAiState(prev => ({ 
        ...prev, 
        currentStep: '✨ Applying professional styling...', 
        progress: 90 
      }));
      
      await delay(800);
      
      // Step 5: Apply Advanced Styling
      const styledElements: VisionBoardElement[] = layoutElements.map((element, index) => {
        const style = designSystem.generateElementStyle(
          element, 
          emotion, 
          0.8 + Math.random() * 0.2
        );
        
        return {
          ...element,
          ...style,
          isSelected: false,
          isLocked: false,
          isVisible: true,
          metadata: element.metadata || {
            emotion: emotion,
            category: analysis.primaryCategories[0],
            aiGenerated: true
          }
        };
      });
      
      setBoardElements(styledElements);
      setBoardTitle(`${dream.title} - AI Vision Board`);
      setSelectedDream(dream);
      
      setAiState(prev => ({ 
        ...prev, 
        currentStep: '🎉 Vision board created successfully!', 
        progress: 100 
      }));
      
      await delay(1500);
      
      setAiState({
        isGenerating: false,
        currentStep: '',
        progress: 0,
        analysis,
        generatedContent,
        selectedImages
      });
      
    } catch (error) {
      console.error('AI Vision Board generation error:', error);
      setAiState({
        isGenerating: false,
        currentStep: 'Error occurred during generation',
        progress: 0
      });
    }
  };

  // Select optimal template based on dream analysis
  const selectOptimalTemplate = (analysis: DreamAnalysis): LayoutTemplate => {
    const category = analysis.primaryCategories[0];
    const emotion = analysis.emotionalTone.emotions[0];
    const sentiment = analysis.emotionalTone.sentiment;
    
    // Template selection logic
    if (emotion === 'luxury' || emotion === 'ambition') {
      return layoutTemplates.find(t => t.id === 'luxury_elegance') || layoutTemplates[0];
    } else if (emotion === 'cosmic' || category === 'spiritual_growth') {
      return layoutTemplates.find(t => t.id === 'cosmic_energy') || layoutTemplates[0];
    } else if (emotion === 'peace' || emotion === 'zen') {
      return layoutTemplates.find(t => t.id === 'minimalist_zen') || layoutTemplates[0];
    } else if (category === 'health_fitness' || emotion === 'dynamic') {
      return layoutTemplates.find(t => t.id === 'pinterest_grid') || layoutTemplates[0];
    } else {
      return layoutTemplates.find(t => t.id === 'magazine_hero') || layoutTemplates[0];
    }
  };

  // Enhanced drag and drop with snap-to-grid
  const snapToGridValue = (value: number) => {
    return snapToGrid ? Math.round(value / gridSize) * gridSize : value;
  };

  const handleMouseDown = (e: React.MouseEvent, element: VisionBoardElement) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedElement(element);
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - element.x,
        y: e.clientY - rect.top - element.y
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if ((isDragging || isResizing) && selectedElement && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      
      if (isDragging) {
        let newX = e.clientX - rect.left - dragOffset.x;
        let newY = e.clientY - rect.top - dragOffset.y;
        
        newX = snapToGridValue(newX);
        newY = snapToGridValue(newY);
        
        const constrainedX = Math.max(0, Math.min(newX, canvasWidth - (selectedElement.width || 100)));
        const constrainedY = Math.max(0, Math.min(newY, canvasHeight - (selectedElement.height || 100)));
        
        setBoardElements(elements => 
          elements.map(el => 
            el.id === selectedElement.id 
              ? { ...el, x: constrainedX, y: constrainedY }
              : el
          )
        );
      }
    }
  }, [isDragging, isResizing, selectedElement, dragOffset, canvasWidth, canvasHeight, snapToGrid]);

  const handleMouseUp = useCallback(() => {
    if (isDragging || isResizing) {
      saveState();
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle('');
    }
  }, [isDragging, isResizing]);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // State management
  const saveState = useCallback(() => {
    const newHistory = editHistory.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(boardElements)));
    setEditHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [boardElements, editHistory, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBoardElements(editHistory[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < editHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBoardElements(editHistory[historyIndex + 1]);
    }
  };

  // Element manipulation
  const deleteElement = (elementId: string) => {
    saveState();
    setBoardElements(elements => elements.filter(el => el.id !== elementId));
    setSelectedElement(null);
  };

  const duplicateElement = (element: VisionBoardElement) => {
    saveState();
    const newElement = {
      ...element,
      id: `${element.id}_copy_${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
      isSelected: false
    };
    setBoardElements(elements => [...elements, newElement]);
  };

  const toggleElementVisibility = (elementId: string) => {
    setBoardElements(elements =>
      elements.map(el =>
        el.id === elementId
          ? { ...el, isVisible: !el.isVisible }
          : el
      )
    );
  };

  const lockElement = (elementId: string) => {
    setBoardElements(elements =>
      elements.map(el =>
        el.id === elementId
          ? { ...el, isLocked: !el.isLocked }
          : el
      )
    );
  };

  // Utility functions
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 manifestation-gradient rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your vision board studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Enhanced Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <input
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                className="bg-transparent text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
                placeholder="Vision Board Title"
              />
              {selectedDream && (
                <span className="text-sm text-muted-foreground px-2 py-1 bg-primary/10 rounded-full">
                  {selectedDream.title}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Undo/Redo */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= editHistory.length - 1}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
              
              {/* View Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 transition-colors ${
                    showGrid ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Toggle Grid"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={`p-2 transition-colors ${
                    snapToGrid ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Snap to Grid"
                >
                  <MousePointer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`p-2 transition-colors ${
                    showPreview ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Preview Mode"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="h-6 w-px bg-border" />
              
              {/* Export & Save */}
              <button className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Enhanced Sidebar */}
        <div className="w-80 bg-card/50 backdrop-blur-sm border-r border-border overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* AI Generation Section */}
            <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Wand2 className="w-4 h-4 mr-2 text-primary" />
                AI Vision Board
              </h3>
              
              {aiState.isGenerating ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm font-medium text-primary">Generating...</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aiState.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{aiState.currentStep}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowDreamSelector(true)}
                    disabled={userDreams.length === 0}
                    className="w-full bg-gradient-to-r from-primary to-purple-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate AI Vision Board</span>
                  </button>
                  
                  {userDreams.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Create a dream first to generate AI vision boards
                    </p>
                  )}
                  
                  {aiState.analysis && (
                    <div className="bg-secondary/20 rounded-lg p-3 text-xs">
                      <h4 className="font-semibold text-foreground mb-1">Last Analysis</h4>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Categories: {aiState.analysis.primaryCategories.join(', ')}</div>
                        <div>Emotion: {aiState.analysis.emotionalTone.emotions.join(', ')}</div>
                        <div>Confidence: {aiState.analysis.emotionalTone.intensity.toFixed(1)}/1.0</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Template Gallery */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Layout className="w-4 h-4 mr-2" />
                Templates
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {layoutTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-border/60'
                    }`}
                  >
                    <div 
                      className={`w-full h-12 rounded mb-2`}
                      style={{ background: template.backgroundColor }}
                    />
                    <p className="text-xs font-medium text-foreground">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.style}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Element Properties */}
            {selectedElement && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <h3 className="font-semibold text-primary mb-2 flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Element Properties
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground capitalize">{selectedElement.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position:</span>
                    <span className="text-foreground">{Math.round(selectedElement.x)}, {Math.round(selectedElement.y)}</span>
                  </div>
                  {selectedElement.width && selectedElement.height && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="text-foreground">{Math.round(selectedElement.width)} × {Math.round(selectedElement.height)}</span>
                    </div>
                  )}
                  {selectedElement.metadata?.relevanceScore && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Score:</span>
                      <span className="text-foreground">{(selectedElement.metadata.relevanceScore * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  
                  {/* Element Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-primary/20">
                    <button
                      onClick={() => toggleElementVisibility(selectedElement.id)}
                      className={`p-1 rounded transition-colors ${
                        selectedElement.isVisible !== false ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      title={selectedElement.isVisible !== false ? 'Hide' : 'Show'}
                    >
                      {selectedElement.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => lockElement(selectedElement.id)}
                      className={`p-1 rounded transition-colors ${
                        selectedElement.isLocked ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      title={selectedElement.isLocked ? 'Unlock' : 'Lock'}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => duplicateElement(selectedElement)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => deleteElement(selectedElement.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Add Tools */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Elements
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowImageLibrary(true)}
                  className="flex items-center justify-center space-x-2 bg-secondary/50 hover:bg-secondary/80 p-3 rounded-lg transition-colors"
                >
                  <Image className="w-4 h-4" />
                  <span className="text-sm">Image</span>
                </button>
                
                <button
                  onClick={() => setShowTextEditor(true)}
                  className="flex items-center justify-center space-x-2 bg-secondary/50 hover:bg-secondary/80 p-3 rounded-lg transition-colors"
                >
                  <Type className="w-4 h-4" />
                  <span className="text-sm">Text</span>
                </button>
                
                <button
                  onClick={() => setShowDesignPanel(true)}
                  className="flex items-center justify-center space-x-2 bg-secondary/50 hover:bg-secondary/80 p-3 rounded-lg transition-colors"
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-sm">Colors</span>
                </button>
                
                <button
                  className="flex items-center justify-center space-x-2 bg-secondary/50 hover:bg-secondary/80 p-3 rounded-lg transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Icons</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            ref={canvasRef}
            className={`w-full h-full relative transition-all duration-300 ${
              showPreview ? 'cursor-default' : 'cursor-crosshair'
            }`}
            style={{ 
              minHeight: '100vh',
              background: selectedTemplate.backgroundColor,
              backgroundImage: selectedTemplate.backgroundPattern || customBackground
            }}
            onClick={() => !showPreview && setSelectedElement(null)}
          >
            {/* Grid Overlay */}
            {showGrid && !showPreview && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${gridSize}px ${gridSize}px`
                }}
              />
            )}

            {/* Vision Board Elements */}
            {boardElements.map((element) => (
              <div
                key={element.id}
                className={`absolute transition-all duration-200 ${
                  !showPreview && !element.isLocked ? 'cursor-move' : 'cursor-default'
                } ${
                  element.isVisible !== false ? 'opacity-100' : 'opacity-30'
                } ${
                  selectedElement?.id === element.id && !showPreview 
                    ? 'ring-2 ring-primary shadow-lg z-50' 
                    : ''
                } ${
                  isDragging && selectedElement?.id === element.id 
                    ? 'scale-105 rotate-1 shadow-2xl' 
                    : 'hover:shadow-lg'
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  zIndex: element.zIndex,
                  opacity: (element.opacity || 1) * globalOpacity,
                  filter: element.filter,
                  borderRadius: element.borderRadius
                }}
                onMouseDown={(e) => !showPreview && !element.isLocked && handleMouseDown(e, element)}
                onClick={(e) => {
                  if (!showPreview) {
                    e.stopPropagation();
                    setSelectedElement(element);
                  }
                }}
              >
                {element.type === 'image' ? (
                  <img
                    src={element.imageUrl}
                    alt={element.content || 'Vision board element'}
                    className="w-full h-full object-cover rounded-lg pointer-events-none"
                    style={{
                      filter: element.filter,
                      transform: element.transform
                    }}
                    draggable={false}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-center p-2 rounded-lg pointer-events-none"
                    style={{
                      fontSize: element.fontSize,
                      fontFamily: element.fontFamily,
                      fontWeight: element.fontWeight,
                      color: element.color,
                      textShadow: element.textShadow,
                      background: element.gradient || element.backgroundColor,
                      WebkitBackgroundClip: element.gradient ? 'text' : 'border-box',
                      WebkitTextFillColor: element.gradient ? 'transparent' : element.color,
                      textAlign: element.textAlign as any
                    }}
                  >
                    {element.content}
                  </div>
                )}
                
                {/* Enhanced Element Controls */}
                {selectedElement?.id === element.id && !showPreview && (
                  <div className="absolute -top-12 left-0 flex items-center space-x-1 bg-black/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-xl">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateElement(element);
                      }}
                      className="text-white hover:text-blue-400 transition-colors p-1 rounded"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoardElements(elements => 
                          elements.map(el => 
                            el.id === element.id 
                              ? { ...el, rotation: (el.rotation || 0) + 15 }
                              : el
                          )
                        );
                        saveState();
                      }}
                      className="text-white hover:text-green-400 transition-colors p-1 rounded"
                      title="Rotate"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleElementVisibility(element.id);
                      }}
                      className="text-white hover:text-yellow-400 transition-colors p-1 rounded"
                      title="Toggle Visibility"
                    >
                      {element.isVisible !== false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(element.id);
                      }}
                      className="text-white hover:text-red-400 transition-colors p-1 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Empty State */}
            {boardElements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-md p-8">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wand2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Create Your Vision</h3>
                  <p className="text-white/80 mb-8 text-lg leading-relaxed">
                    Let our advanced AI create a personalized vision board from your dreams with professional layouts and perfect imagery.
                  </p>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => setShowDreamSelector(true)}
                      disabled={userDreams.length === 0}
                      className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      <Sparkles className="w-6 h-6" />
                      <span className="text-lg font-semibold">Generate AI Vision Board</span>
                    </button>
                    
                    {userDreams.length === 0 && (
                      <Link
                        href="/dreams/new"
                        className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Target className="w-5 h-5" />
                        <span>Create Your First Dream</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dream Selector Modal */}
      {showDreamSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Select Dream for AI Vision Board
            </h3>
            
            <div className="space-y-3">
              {userDreams.map((dream) => (
                <button
                  key={dream.id}
                  onClick={() => {
                    generateAIVisionBoard(dream);
                    setShowDreamSelector(false);
                  }}
                  className="w-full text-left p-4 border border-border rounded-lg hover:border-primary/30 transition-colors"
                >
                  <h4 className="font-semibold text-foreground mb-1">{dream.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{dream.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">{dream.category}</span>
                    {dream.deadline && (
                      <span>Due: {new Date(dream.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDreamSelector(false)}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}