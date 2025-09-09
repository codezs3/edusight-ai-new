'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  CpuChipIcon as BrainIcon,
  BeakerIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XMarkIcon,
  CpuChipIcon,
  ShoppingBagIcon,
  FireIcon,
  GiftIcon,
  TagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon,
  FireIcon as FireSolidIcon
} from '@heroicons/react/24/solid';

interface TestCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  test_count: number;
}

interface Assessment {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  assessment_type: string;
  curriculum: string;
  target_audience: string;
  grade_levels: string[];
  age_range: {
    min: number;
    max: number;
  };
  difficulty: string;
  difficulty_color: string;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  max_score: number;
  price_inr: number;
  price_display: string;
  is_free: boolean;
  is_premium: boolean;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
  ai_insights: any;
  success_rate: number;
  average_score: number;
  completion_rate: number;
  instructions: string;
  prerequisites: string;
  learning_outcomes: string[];
  tags: string[];
  icon_name: string;
  cover_image_url: string;
  total_attempts: number;
  total_completions: number;
  average_rating: number;
  total_ratings: number;
  rating_stars: {
    full: number;
    half: number;
    empty: number;
  };
  created_at: string;
  published_at: string;
}

interface FilterOptions {
  categories: TestCategory[];
  assessment_types: string[];
  difficulties: string[];
  target_audiences: string[];
  curricula: string[];
  price_range: {
    min: number;
    max: number;
    avg: number;
  };
}

interface TestStats {
  total_tests: number;
  total_categories: number;
  tests_by_type: Array<{ assessment_type: string; count: number }>;
  tests_by_category: Array<{ category__name: string; count: number }>;
  price_statistics: {
    min_price: number;
    max_price: number;
    avg_price: number;
    free_tests: number;
    premium_tests: number;
  };
  difficulty_distribution: Array<{ difficulty: string; count: number }>;
  audience_distribution: Array<{ target_audience: string; count: number }>;
}

export default function TestVaultPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [stats, setStats] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Assessment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch assessments when filters change
  useEffect(() => {
    fetchAssessments();
  }, [currentPage, searchTerm, selectedCategory, selectedType, selectedDifficulty, selectedAudience, priceRange, showFreeOnly, showFeaturedOnly, showPopularOnly, sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, statsRes] = await Promise.all([
        fetch('/api/testvault/categories'),
        fetch('/api/testvault/stats')
      ]);

      if (!categoriesRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch initial data');
      }

      const categoriesData = await categoriesRes.json();
      const statsData = await statsRes.json();

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }

      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedType && { type: selectedType }),
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
        ...(selectedAudience && { audience: selectedAudience }),
        ...(priceRange[0] > 0 && { price_min: priceRange[0].toString() }),
        ...(priceRange[1] < 1000 && { price_max: priceRange[1].toString() }),
        ...(showFreeOnly && { is_free: 'true' }),
        ...(showFeaturedOnly && { is_featured: 'true' }),
        ...(showPopularOnly && { is_popular: 'true' }),
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      const response = await fetch(`/api/testvault/catalog?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const data = await response.json();
      
      if (data.success) {
        setAssessments(data.data.tests);
        setTotalPages(data.data.pagination.total_pages);
        setTotalItems(data.data.pagination.total_items);
      } else {
        throw new Error(data.error || 'Failed to load assessments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessments');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedDifficulty('');
    setSelectedAudience('');
    setPriceRange([0, 1000]);
    setShowFreeOnly(false);
    setShowFeaturedOnly(false);
    setShowPopularOnly(false);
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800 border-green-200',
      'intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'advanced': 'bg-red-100 text-red-800 border-red-200',
      'expert': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'calculator': AcademicCapIcon,
      'beaker': BeakerIcon,
      'book-open': AcademicCapIcon,
      'globe-alt': ChartBarIcon,
      'computer-desktop': CpuChipIcon,
      'paint-brush': SparklesIcon,
      'user-circle': UserGroupIcon,
      'brain': BrainIcon,
      'heart': HeartIcon,
      'academic-cap': AcademicCapIcon,
      'eye': ChartBarIcon,
      'cpu-chip': CpuChipIcon,
      'hand-raised': UserGroupIcon,
      'trophy': StarIcon,
      'shield-check': CheckCircleIcon,
      'briefcase': AcademicCapIcon,
      'wrench-screwdriver': CpuChipIcon,
      'users': UserGroupIcon,
      'chat-bubble-left-right': UserGroupIcon,
      'finger-print': HeartIcon,
      'light-bulb': SparklesIcon,
      'sparkles': SparklesIcon,
      'puzzle-piece': CpuChipIcon,
    };
    return icons[iconName] || AcademicCapIcon;
  };

  const handleStartAssessment = (test: Assessment) => {
    // Check if user is logged in
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/testvault?start=${test.id}`));
      return;
    }

    // Route to individual test page
    router.push(`/test/${test.id}`);
  };

  const handleGuestAssessment = (test: Assessment) => {
    // Route to guest assessment page
    router.push('/guest-assessment?testId=' + test.id + '&type=' + test.assessment_type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading TestVault</h3>
          <p className="text-gray-600">Discovering amazing assessments for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading TestVault</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ShoppingBagIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TestVault
                  </h1>
                  <p className="text-sm text-gray-500">Premium Assessment Marketplace</p>
                </div>
              </div>
              <p className="text-gray-600">
                Discover {stats?.total_tests || 1000}+ comprehensive assessments across {stats?.total_categories || 24} categories
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2">
                  {totalItems} tests available
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Filter Menu */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/30 sticky top-[80px] z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Quick Filter Pills */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setShowFreeOnly(!showFreeOnly);
                  setCurrentPage(1);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                  showFreeOnly 
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white border-2 border-green-300 shadow-lg' 
                    : 'bg-white/90 text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-200 shadow-sm hover:shadow-md'
                }`}
              >
                <GiftIcon className="h-4 w-4" />
                <span>Free Tests</span>
                {showFreeOnly && <span className="ml-1 text-xs">✓</span>}
              </button>
              
              <button
                onClick={() => {
                  setShowFeaturedOnly(!showFeaturedOnly);
                  setCurrentPage(1);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                  showFeaturedOnly 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-2 border-yellow-300 shadow-lg' 
                    : 'bg-white/90 text-gray-700 border border-gray-200 hover:bg-yellow-50 hover:border-yellow-200 shadow-sm hover:shadow-md'
                }`}
              >
                <StarIcon className="h-4 w-4" />
                <span>Featured</span>
                {showFeaturedOnly && <span className="ml-1 text-xs">✓</span>}
              </button>
              
              <button
                onClick={() => {
                  setShowPopularOnly(!showPopularOnly);
                  setCurrentPage(1);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                  showPopularOnly 
                    ? 'bg-gradient-to-r from-red-400 to-red-500 text-white border-2 border-red-300 shadow-lg' 
                    : 'bg-white/90 text-gray-700 border border-gray-200 hover:bg-red-50 hover:border-red-200 shadow-sm hover:shadow-md'
                }`}
              >
                <FireSolidIcon className="h-4 w-4" />
                <span>Popular</span>
                {showPopularOnly && <span className="ml-1 text-xs">✓</span>}
              </button>

              {/* Category Quick Filters */}
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === category.name ? '' : category.name);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                    selectedCategory === category.name 
                      ? 'text-white border-2 border-transparent shadow-lg' 
                      : 'bg-white/90 text-gray-700 border border-gray-200 hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.name ? category.color : undefined,
                    backgroundImage: selectedCategory === category.name ? `linear-gradient(135deg, ${category.color}, ${category.color}dd)` : undefined
                  }}
                >
                  <span>{category.name}</span>
                  <span className="text-xs opacity-75">({category.test_count})</span>
                  {selectedCategory === category.name && <span className="ml-1 text-xs">✓</span>}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Tests
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name} ({category.test_count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assessment Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                >
                  <option value="">All Types</option>
                  <option value="academic">Academic</option>
                  <option value="psychological">Psychological</option>
                  <option value="physical">Physical</option>
                  <option value="career">Career</option>
                  <option value="dmit">DMIT</option>
                  <option value="aptitude">Aptitude</option>
                  <option value="personality">Personality</option>
                  <option value="cognitive">Cognitive</option>
                  <option value="behavioral">Behavioral</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                >
                  <option value="created_at">Newest First</option>
                  <option value="-created_at">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="-title">Title Z-A</option>
                  <option value="price_inr">Price Low to High</option>
                  <option value="-price_inr">Price High to Low</option>
                  <option value="average_rating">Rating Low to High</option>
                  <option value="-average_rating">Rating High to Low</option>
                </select>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {totalItems} Tests Found
                </h2>
                <p className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            </div>

            {/* Tests Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {assessments.map((test, index) => {
                const CategoryIcon = getCategoryIcon(test.category.icon);
                
                return (
                  <div
                    key={test.id}
                    className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                      viewMode === 'list' ? 'p-6' : 'p-6'
                    }`}
                    onClick={() => setSelectedTest(test)}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View
                      <>
                        {/* Test Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="p-3 rounded-xl shadow-sm"
                              style={{ backgroundColor: `${test.category.color}20` }}
                            >
                              <CategoryIcon 
                                className="h-6 w-6"
                                style={{ color: test.category.color }}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {test.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {test.category.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            {test.is_featured && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-200">
                                Featured
                              </span>
                            )}
                            {test.is_popular && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200">
                                Popular
                              </span>
                            )}
                            {test.is_new && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200">
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {test.short_description}
                        </p>

                        {/* Test Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Duration:</span>
                            <span className="text-gray-900">{test.duration_minutes} min</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Questions:</span>
                            <span className="text-gray-900">{test.total_questions}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Difficulty:</span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(test.difficulty)}`}>
                              {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Success Rate:</span>
                            <span className="text-gray-900">{test.success_rate}%</span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <StarSolidIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < test.rating_stars.full
                                    ? 'text-yellow-400'
                                    : i < test.rating_stars.full + test.rating_stars.half
                                    ? 'text-yellow-200'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              ({test.total_ratings})
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {test.total_attempts} attempts
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-gray-900">
                            {test.price_display}
                          </div>
                          <button 
                            onClick={() => handleStartAssessment(test)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
                          >
                            Take Test
                          </button>
                        </div>
                      </>
                    ) : (
                      // List View
                      <div className="flex items-center space-x-6">
                        <div 
                          className="p-4 rounded-xl shadow-sm flex-shrink-0"
                          style={{ backgroundColor: `${test.category.color}20` }}
                        >
                          <CategoryIcon 
                            className="h-8 w-8"
                            style={{ color: test.category.color }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {test.title}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">
                                {test.category.name} • {test.duration_minutes} min • {test.total_questions} questions
                              </p>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {test.short_description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="text-2xl font-bold text-gray-900">
                                {test.price_display}
                              </div>
                              <button 
                                onClick={() => handleStartAssessment(test)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                              >
                                Take Test
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Test Detail Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div 
                    className="p-4 rounded-xl shadow-sm"
                    style={{ backgroundColor: `${selectedTest.category.color}20` }}
                  >
                    {(() => {
                      const CategoryIcon = getCategoryIcon(selectedTest.category.icon);
                      return <CategoryIcon className="h-8 w-8" style={{ color: selectedTest.category.color }} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedTest.title}
                    </h2>
                    <p className="text-gray-600">{selectedTest.category.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedTest.description}</p>
                  </div>

                  {/* Learning Outcomes */}
                  {selectedTest.learning_outcomes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Learning Outcomes</h3>
                      <ul className="space-y-2">
                        {selectedTest.learning_outcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {selectedTest.prerequisites && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Prerequisites</h3>
                      <p className="text-gray-600">{selectedTest.prerequisites}</p>
                    </div>
                  )}

                  {/* AI Insights */}
                  {selectedTest.ai_insights && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">AI Insights</h3>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                        <p className="text-blue-800">
                          {selectedTest.ai_insights.recommended_for || 'Comprehensive assessment with personalized insights'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Test Info Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Test Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{selectedTest.duration_minutes} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Questions:</span>
                        <span className="font-medium">{selectedTest.total_questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(selectedTest.difficulty)}`}>
                          {selectedTest.difficulty.charAt(0).toUpperCase() + selectedTest.difficulty.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Success Rate:</span>
                        <span className="font-medium">{selectedTest.success_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Target Audience:</span>
                        <span className="font-medium capitalize">{selectedTest.target_audience.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Rating & Reviews</h3>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon
                            key={i}
                            className={`h-6 w-6 ${
                              i < selectedTest.rating_stars.full
                                ? 'text-yellow-400'
                                : i < selectedTest.rating_stars.full + selectedTest.rating_stars.half
                                ? 'text-yellow-200'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedTest.average_rating}</p>
                      <p className="text-sm text-gray-500">({selectedTest.total_ratings} reviews)</p>
                    </div>
                  </div>

                  {/* Purchase Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {selectedTest.price_display}
                      </div>
                      <p className="text-sm text-gray-600 mb-6">One-time payment</p>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={() => handleStartAssessment(test)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          Start Test
                        </button>
                        <button className="w-full bg-white/80 text-gray-700 py-3 rounded-xl font-medium hover:bg-white transition-colors border border-gray-200">
                          Add to Favorites
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-4">
                        Instant access • Detailed report • 30-day guarantee
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}