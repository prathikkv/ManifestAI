'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Target, 
  Calendar, 
  Sparkles, 
  Heart, 
  Briefcase, 
  Home, 
  GraduationCap,
  DollarSign,
  Users,
  Zap
} from 'lucide-react';

const categories = [
  { id: 'career', name: 'Career & Business', icon: Briefcase, color: 'bg-blue-500' },
  { id: 'health', name: 'Health & Fitness', icon: Heart, color: 'bg-red-500' },
  { id: 'relationships', name: 'Love & Relationships', icon: Users, color: 'bg-pink-500' },
  { id: 'finance', name: 'Wealth & Finance', icon: DollarSign, color: 'bg-green-500' },
  { id: 'education', name: 'Learning & Growth', icon: GraduationCap, color: 'bg-purple-500' },
  { id: 'lifestyle', name: 'Lifestyle & Home', icon: Home, color: 'bg-orange-500' },
  { id: 'spiritual', name: 'Spiritual & Personal', icon: Sparkles, color: 'bg-yellow-500' },
  { id: 'other', name: 'Other Goals', icon: Target, color: 'bg-gray-500' }
];

export default function NewDreamPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: '',
    priority: 'medium',
    milestones: [''],
    whyImportant: '',
    successMetrics: ''
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMilestoneChange = (index: number, value: string) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = value;
    setFormData(prev => ({
      ...prev,
      milestones: newMilestones
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, '']
    }));
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock save dream
    const dream = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      userId: user.id,
      createdAt: new Date().toISOString(),
      progress: 0,
      status: 'active'
    };
    
    // Save to localStorage (in real app, this would be API call)
    const existingDreams = JSON.parse(localStorage.getItem('dreams') || '[]');
    existingDreams.push(dream);
    localStorage.setItem('dreams', JSON.stringify(existingDreams));
    
    router.push('/dreams');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.category;
      case 2:
        return formData.targetDate && formData.whyImportant;
      case 3:
        return formData.successMetrics;
      default:
        return false;
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 manifestation-gradient rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 manifestation-gradient rounded-full" />
              <span className="text-2xl font-bold text-foreground">ManifestAI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create Your Dream</h1>
            <span className="text-sm text-muted-foreground">Step {currentStep} of 3</span>
          </div>
          
          <div className="flex items-center space-x-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ${
                    step < currentStep ? 'bg-primary' : 'bg-secondary'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">What's Your Dream?</h2>
                  <p className="text-muted-foreground">Let's start by defining what you want to achieve</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dream Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="e.g., Launch my startup, Get healthy, Find love..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Describe your dream in detail. What does success look like?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleInputChange('category', category.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.category === category.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-border/60'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                            <category.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Timeline & Motivation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">When & Why?</h2>
                  <p className="text-muted-foreground">Set your timeline and motivation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Date</label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => handleInputChange('targetDate', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Priority Level</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Why is this important to you?</label>
                  <textarea
                    value={formData.whyImportant}
                    onChange={(e) => handleInputChange('whyImportant', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Your 'why' is your motivation. What drives you to achieve this dream?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Milestones</label>
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={milestone}
                        onChange={(e) => handleMilestoneChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder={`Milestone ${index + 1}`}
                      />
                      {formData.milestones.length > 1 && (
                        <button
                          onClick={() => removeMilestone(index)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addMilestone}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add another milestone
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success Metrics & AI Analysis */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Success & AI Analysis</h2>
                  <p className="text-muted-foreground">Define success and get AI insights</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">How will you measure success?</label>
                  <textarea
                    value={formData.successMetrics}
                    onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Define specific, measurable outcomes. What metrics will indicate you've achieved your dream?"
                  />
                </div>

                {/* AI Analysis Preview */}
                <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI Analysis Preview
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div>
                        <p className="font-medium">Achievability Score: 85%</p>
                        <p className="text-muted-foreground">Based on your timeline and milestones</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div>
                        <p className="font-medium">Recommended Actions</p>
                        <p className="text-muted-foreground">Break down your first milestone into weekly goals</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                      <div>
                        <p className="font-medium">Potential Challenges</p>
                        <p className="text-muted-foreground">Consider time management and resource allocation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                  className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Dream...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Create Dream</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}