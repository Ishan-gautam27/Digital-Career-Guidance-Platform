import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  Building,
  TrendingUp,
  ExternalLink,
  Filter,
  Globe,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  X,
  ArrowLeft,
  Zap,
  Tag,
  DollarSign,
  Calendar,
  BarChart3,
  CheckCircle,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────
interface JobData {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  tags: string[];
  description: string;
  applyUrl: string;
  postedDate: string;
  isRemote: boolean;
  source: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StatsData {
  totalJobs: number;
  remoteJobs: number;
  byCategory: { name: string; count: number }[];
  byType: { name: string; count: number }[];
  bySource: { name: string; count: number }[];
  lastUpdated: string | null;
}

// ── Helpers ─────────────────────────────────────────────────────────────
function timeAgo(dateStr: string | undefined | null): string {
  if (!dateStr) return 'Recently';
  const time = new Date(dateStr).getTime();
  if (isNaN(time)) return 'Recently';
  const diff = Date.now() - time;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function sourceColor(source: string): string {
  if (source === 'Remotive') return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300';
  if (source === 'LinkedIn') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
}

function typeColor(type: string): string {
  const map: Record<string, string> = {
    'Full-time': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'Part-time': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    Contract: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Freelance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    Internship: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  };
  return map[type] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
}

// ── Main Component ──────────────────────────────────────────────────────
export function Jobs() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<StatsData | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Categories & types from backend
  const [categories, setCategories] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);

  // Detail view
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Debounce search ─────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Fetch filters & stats on mount ──────────────────────────────────
  useEffect(() => {
    axios.get('/api/jobs/filters/categories').then(r => { if (r.data?.success) setCategories(r.data.data); }).catch(() => {});
    axios.get('/api/jobs/filters/types').then(r => { if (r.data?.success) setJobTypes(r.data.data); }).catch(() => {});
    axios.get('/api/jobs/stats').then(r => { if (r.data?.success) setStats(r.data.data); }).catch(() => {});
  }, []);

  // ── Fetch jobs ──────────────────────────────────────────────────────
  const fetchJobs = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError('');
      try {
        const params: Record<string, string> = {
          page: String(page),
          limit: '15',
        };
        if (debouncedSearch) params.q = debouncedSearch;
        if (categoryFilter !== 'all') params.category = categoryFilter;
        if (typeFilter !== 'all') params.type = typeFilter;
        if (remoteOnly || activeTab === 'remote') params.remote = 'true';

        const res = await axios.get('/api/jobs/search', { params });
        if (res.data?.success) {
          setJobs(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load jobs. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, categoryFilter, typeFilter, remoteOnly, activeTab]
  );

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  // ── Fetch full job detail ───────────────────────────────────────────
  const openJobDetail = async (job: JobData) => {
    setDetailLoading(true);
    setSelectedJob(job);
    try {
      const res = await axios.get(`/api/jobs/${encodeURIComponent(job.id)}`);
      if (res.data?.success) {
        setSelectedJob(res.data.data);
      }
    } catch {
      // Use list data if detail fetch fails
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Clear filters ───────────────────────────────────────────────────
  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setRemoteOnly(false);
    setActiveTab('all');
  };

  const hasFilters = searchTerm || categoryFilter !== 'all' || typeFilter !== 'all' || remoteOnly;

  // ══════════════════════════════════════════════════════════════════════
  // DETAIL VIEW
  // ══════════════════════════════════════════════════════════════════════
  if (selectedJob) {
    const j = selectedJob;
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="outline" onClick={() => setSelectedJob(null)} className="mb-6 group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Jobs
        </Button>

        {/* Hero Interactive */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-border shadow-md hover:shadow-xl transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6 bg-card/80 backdrop-blur-xl text-card-foreground group/hero">
          {/* subtle animated decorative background */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover/hero:scale-110 group-hover/hero:bg-indigo-100 dark:group-hover/hero:bg-indigo-900/20 transition-all duration-700 ease-in-out" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none group-hover/hero:scale-110 transition-all duration-700 ease-in-out delay-150" />

          <div className="relative z-10 flex-1">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                {j.type}
              </Badge>
              <Badge variant="outline" className="px-2.5 py-0.5 font-medium">
                {j.source}
              </Badge>
              {j.isRemote && (
                <Badge className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-100 border-0">
                  <Globe className="h-3 w-3 mr-1" /> Remote
                </Badge>
              )}
            </div>
            
            {/* Title with Gradient on Hover */}
            <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight transition-colors duration-300 group-hover/hero:bg-gradient-to-r group-hover/hero:from-indigo-600 group-hover/hero:to-blue-600 group-hover/hero:bg-clip-text group-hover/hero:text-transparent">
              {j.title}
            </h1>
            
            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-muted-foreground">
              <span className="flex items-center text-foreground font-medium group/item hover:text-indigo-600 transition-colors">
                <Building className="h-4 w-4 mr-1.5 text-indigo-500 group-hover/item:scale-110 transition-transform" />
                {j.company}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-rose-500" />
                {j.location}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-amber-500" />
                Posted {timeAgo(j.postedDate)}
              </span>
            </div>
          </div>

          {/* Actions - Animated Apply Button */}
          <div className="relative z-10 flex flex-col items-stretch sm:items-end gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
            <a href={j.applyUrl} target="_blank" rel="noopener noreferrer" className="block w-full group/apply">
              <Button 
                size="lg" 
                className="w-full shadow-lg font-semibold text-base py-6 transition-all duration-300 transform group-hover/apply:-translate-y-1 group-hover/apply:shadow-blue-500/30 group-hover/apply:shadow-xl cursor-pointer overflow-hidden relative"
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              >
                {/* Shine effect absolute overlay */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/apply:animate-[shimmer_1.5s_infinite]" />
                <ExternalLink className="h-5 w-5 mr-2 group-hover/apply:translate-x-1 group-hover/apply:-translate-y-1 transition-transform" />
                Apply on {j.source}
              </Button>
            </a>
            <p className="text-xs text-muted-foreground text-center sm:text-right max-w-[250px]">
              You will be securely redirected to {j.source}.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/95 backdrop-blur">
              <CardHeader className="border-b border-border/30 pb-4 mb-4">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3 text-indigo-600">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                {detailLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading full description...
                  </div>
                ) : (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: j.description || 'No description available for this role.' }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {(j.tags?.length || 0) > 0 && (
              <Card className="border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/95 backdrop-blur group/tags">
                <CardHeader className="border-b border-border/30 pb-4 mb-4">
                  <CardTitle className="flex items-center text-lg">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3 text-indigo-600 group-hover/tags:scale-110 transition-transform">
                      <Tag className="h-4 w-4" />
                    </div>
                    Skills & Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2.5">
                    {(j.tags || []).map((tag, i) => (
                      <Badge key={i} className="bg-indigo-50/80 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 py-1.5 px-3 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:scale-105 transition-all text-sm font-medium border border-indigo-100 dark:border-indigo-800/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/95 backdrop-blur sticky top-24">
              <CardHeader className="border-b border-border/30 pb-4 mb-4">
                <CardTitle className="text-lg flex items-center">
                   <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600">
                    <Zap className="h-4 w-4" />
                  </div>
                  Quick Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="group/stat flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 w-8 h-8 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0 group-hover/stat:scale-110 transition-transform">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Compensation</p>
                    <p className="text-base font-medium">{j.salary}</p>
                  </div>
                </div>
                
                <div className="group/stat flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 w-8 h-8 rounded-md bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shrink-0 group-hover/stat:scale-110 transition-transform">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Job Type</p>
                    <Badge className={`mt-1 ${typeColor(j.type)} shadow-sm`}>{j.type}</Badge>
                  </div>
                </div>

                <div className="group/stat flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 w-8 h-8 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0 group-hover/stat:scale-110 transition-transform">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Category</p>
                    <p className="text-sm font-medium mt-1">{j.category}</p>
                  </div>
                </div>
                
                <div className="group/stat flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 w-8 h-8 rounded-md bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 shrink-0 group-hover/stat:scale-110 transition-transform">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Posted On</p>
                    <p className="text-sm font-medium mt-1">{new Date(j.postedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/95 backdrop-blur group/tips">
              <CardHeader className="border-b border-border/30 pb-4 mb-4">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 text-orange-600 group-hover/tips:scale-110 transition-transform">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  Application Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">💼 Tailor Your Resume</p>
                    <p className="text-muted-foreground">Customize your resume to match the job requirements.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">📝 Write a Cover Letter</p>
                    <p className="text-muted-foreground">Explain why you're the perfect fit for this role.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">🎯 Research the Company</p>
                    <p className="text-muted-foreground">Learn about the company culture and values.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Job Opportunities
          </h1>
          <p className="text-muted-foreground">
            Real-time listings from Remotive & Arbeitnow — {stats ? `${stats.totalJobs.toLocaleString()} jobs available` : 'loading...'}
          </p>
        </div>
        {stats && (
          <div className="flex gap-3">
            <div className="text-center px-4 py-2 rounded-xl bg-muted/50">
              <p className="text-lg font-bold">{stats.totalJobs}</p>
              <p className="text-xs text-muted-foreground">Total Jobs</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-muted/50">
              <p className="text-lg font-bold">{stats.remoteJobs}</p>
              <p className="text-xs text-muted-foreground">Remote</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-muted/50">
              <p className="text-lg font-bold">{stats.bySource.length}</p>
              <p className="text-xs text-muted-foreground">Sources</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            <Briefcase className="h-4 w-4 mr-2" />
            All Jobs
          </TabsTrigger>
          <TabsTrigger value="remote">
            <Globe className="h-4 w-4 mr-2" />
            Remote Only
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Zap className="h-4 w-4 mr-2" />
            Latest
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search & Filters */}
      <Card className="border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/95 backdrop-blur mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, skills..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
                id="job-search-input"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="job-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger id="job-type-filter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {jobTypes.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchTerm}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {categoryFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter('all')} />
                </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {typeFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setTypeFilter('all')} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">Clear all</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <CardContent className="pt-6 flex items-center justify-between">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchJobs(pagination.page)}>
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Fetching live jobs...</span>
          ) : (
            <>Showing {jobs.length} of {pagination.total.toLocaleString()} jobs{hasFilters && ' (filtered)'}</>
          )}
        </p>
      </div>

      {/* Loading skeletons */}
      {loading && jobs.length === 0 && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse border border-border/50 shadow-sm bg-card/50">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="flex gap-2 mt-3">
                  <div className="h-6 bg-muted rounded-full w-16" />
                  <div className="h-6 bg-muted rounded-full w-20" />
                  <div className="h-6 bg-muted rounded-full w-14" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && jobs.length === 0 && !error && (
        <Card className="border border-border/50 shadow-md bg-card/80 backdrop-blur">
          <CardContent className="pt-12 pb-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            {hasFilters && <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>}
          </CardContent>
        </Card>
      )}

      {/* Job cards */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="group border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm cursor-pointer hover:-translate-y-1 relative overflow-hidden"
            onClick={() => openJobDetail(job)}
            id={`job-card-${job.id}`}
          >
            {/* subtle animated hover background for job card */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100" />
            
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-start gap-4">
                {/* Company logo */}
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl object-contain bg-white border border-indigo-100 dark:border-indigo-800/50 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/20 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50 group-hover:scale-110 transition-transform shadow-sm">
                    <span className="text-xl font-bold bg-gradient-to-br from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      {job.company.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-base text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="flex gap-1 flex-shrink-0">
                      <Badge className={`text-[10px] ${typeColor(job.type)} border-0 shadow-sm`}>{job.type}</Badge>
                      {job.isRemote && (
                        <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 shadow-sm">
                          <Globe className="h-2.5 w-2.5 mr-0.5" /> Remote
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Company & location */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2 group-hover:text-foreground/80 transition-colors">
                    <span className="flex items-center group/item hover:text-indigo-600 transition-colors">
                      <Building className="h-3.5 w-3.5 mr-1 text-indigo-500 group-hover/item:scale-110 transition-transform" /> {job.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-rose-500" /> {(job.location?.length || 0) > 40 ? job.location?.substring(0, 40) + '...' : job.location}
                    </span>
                    {job.salary && job.salary !== 'Not disclosed' && (
                      <span className="flex items-center text-emerald-600 font-medium group-hover:scale-105 transition-transform origin-left">
                        <DollarSign className="h-3 w-3 mr-0.5" /> {(job.salary?.length || 0) > 30 ? job.salary?.substring(0, 30) + '...' : job.salary}
                      </span>
                    )}
                  </div>

                  {/* Description preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {job.description}
                  </p>

                  {/* Tags & metadata */}
                  <div className="flex items-center justify-between group/tags">
                    <div className="flex flex-wrap gap-1">
                      {(job.tags || []).slice(0, 4).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] py-0.5 bg-background border-border/50 group-hover/tags:border-indigo-200 dark:group-hover/tags:border-indigo-800 transition-colors">
                          {tag}
                        </Badge>
                      ))}
                      {(job.tags?.length || 0) > 4 && (
                        <Badge variant="outline" className="text-[10px] py-0.5 bg-background border-border/50 group-hover/tags:border-indigo-200 dark:group-hover/tags:border-indigo-800 transition-colors">+{(job.tags?.length || 0) - 4}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0 group-hover:text-foreground/70 transition-colors">
                      <Badge className={`text-[10px] ${sourceColor(job.source)} border-0 shadow-sm`}>{job.source}</Badge>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-amber-500" /> {timeAgo(job.postedDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchJobs(pagination.page - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) pageNum = i + 1;
              else if (pagination.page <= 3) pageNum = i + 1;
              else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
              else pageNum = pagination.page - 2 + i;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  className="w-9 h-9"
                  onClick={() => fetchJobs(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchJobs(pagination.page + 1)}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}