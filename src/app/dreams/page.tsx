'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Target, 
  Calendar, 
  TrendingUp,
  Heart,
  Briefcase,
  Home,
  GraduationCap,
  DollarSign,
  Users,
  Sparkles,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const categoryIcons = {
  career: Briefcase,
  health: Heart,
  relationships: Users,
  finance: DollarSign,
  education: GraduationCap,
  lifestyle: Home,
  spiritual: Sparkles,
  other: Target
};

const categoryColors = {
  career: 'bg-blue-500',
  health: 'bg-red-500',
  relationships: 'bg-pink-500',
  finance: 'bg-green-500',
  education: 'bg-purple-500',
  lifestyle: 'bg-orange-500',
  spiritual: 'bg-yellow-500',
  other: 'bg-gray-500'
};

const mockDreams = [
  {
    id: '1',
    title: 'Launch My Startup',
    description: 'Build and launch a revolutionary AI-powered app that helps people achieve their goals',
    category: 'career',
    targetDate: '2024-12-31',
    priority: 'high',
    progress: 60,
    status: 'active',
    createdAt: '2024-01-15',
    milestones: ['MVP Development', 'Beta Testing', 'Launch'],
    whyImportant: 'To create something meaningful and achieve financial freedom'
  },
  {
    id: '2',
    title: 'Get Healthy & Fit',
    description: 'Transform my body and mind through consistent exercise and healthy eating habits',
    category: 'health',
    targetDate: '2024-06-30',
    priority: 'high',
    progress: 75,
    status: 'active',
    createdAt: '2024-01-10',
    milestones: ['Join Gym', 'Consistent Workouts', 'Nutrition Plan'],
    whyImportant: 'To have more energy and confidence in my daily life'
  },
  {
    id: '3',
    title: 'Find My Soulmate',
    description: 'Build a meaningful, loving relationship with someone who shares my values',
    category: 'relationships',
    targetDate: '2024-08-31',
    priority: 'medium',
    progress: 30,
    status: 'active',
    createdAt: '2024-02-01',
    milestones: ['Self-improvement', 'Social Activities', 'Dating'],
    whyImportant: 'To share life experiences and grow together with someone special'
  }
];

export default function DreamsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dreams, setDreams] = useState(mockDreams);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Load dreams from localStorage
    const savedDreams = localStorage.getItem('dreams');
    if (savedDreams) {
      const parsedDreams = JSON.parse(savedDreams);
      setDreams([...mockDreams, ...parsedDreams]);
    }
  }, [router]);

  const filteredDreams = dreams.filter(dream => {
    const matchesSearch = dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || dream.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || dream.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const DreamCard = ({ dream }: { dream: any }) => {
    const Icon = categoryIcons[dream.category as keyof typeof categoryIcons];
    const categoryColor = categoryColors[dream.category as keyof typeof categoryColors];

    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/80 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${categoryColor} rounded-lg flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {dream.title}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">{dream.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${getStatusColor(dream.status)}`} />
            <span className="text-xs text-muted-foreground capitalize">{dream.status}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {dream.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formatDate(dream.targetDate)}
            </span>
          </div>
          <span className={`text-sm font-medium ${getPriorityColor(dream.priority)}`}>
            {dream.priority} priority
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-foreground">{dream.progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${dream.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={`/dreams/${dream.id}`}
            className="flex items-center space-x-2 text-primary hover:underline text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Link>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-1 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DreamListItem = ({ dream }: { dream: any }) => {
    const Icon = categoryIcons[dream.category as keyof typeof categoryIcons];
    const categoryColor = categoryColors[dream.category as keyof typeof categoryColors];

    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 hover:bg-card/80 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-8 h-8 ${categoryColor} rounded-lg flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{dream.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{dream.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(dream.status)} mx-auto mb-1`} />
              <span className="text-xs text-muted-foreground capitalize">{dream.status}</span>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">{dream.progress}%</div>
              <div className="w-16 bg-secondary rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full"
                  style={{ width: `${dream.progress}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {formatDate(dream.targetDate)}
              </div>
              <div className={`text-xs ${getPriorityColor(dream.priority)}`}>
                {dream.priority}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                href={`/dreams/${dream.id}`}
                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 manifestation-gradient rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dreams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 manifestation-gradient rounded-full" />
              <span className="text-2xl font-bold text-foreground">ManifestAI</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link href="/dreams" className="text-primary font-semibold">Dreams</Link>
              <Link href="/vision-board" className="text-muted-foreground hover:text-foreground">Vision Board</Link>
              <Link href="/coach" className="text-muted-foreground hover:text-foreground">AI Coach</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Dreams</h1>
            <p className="text-muted-foreground">Track and manifest your goals into reality</p>
          </div>
          <Link
            href="/dreams/new"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Dream</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dreams</p>
                <p className="text-2xl font-bold text-foreground">{dreams.length}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">
                  {dreams.filter(d => d.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(dreams.reduce((acc, d) => acc + d.progress, 0) / dreams.length)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-sm">%</span>
              </div>
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">+2</p>
              </div>
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dreams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="career">Career & Business</option>
                  <option value="health">Health & Fitness</option>
                  <option value="relationships">Love & Relationships</option>
                  <option value="finance">Wealth & Finance</option>
                  <option value="education">Learning & Growth</option>
                  <option value="lifestyle">Lifestyle & Home</option>
                  <option value="spiritual">Spiritual & Personal</option>
                  <option value="other">Other Goals</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Dreams Display */}
        {filteredDreams.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No dreams found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Start your manifestation journey by creating your first dream'
              }
            </p>
            <Link
              href="/dreams/new"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Dream</span>
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }>
            {filteredDreams.map((dream) => (
              viewMode === 'grid' 
                ? <DreamCard key={dream.id} dream={dream} />
                : <DreamListItem key={dream.id} dream={dream} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}