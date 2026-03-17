import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Search,
  MapPin,
  Building2,
  Globe,
  BookOpen,
  FlaskConical,
  Library,
  Star,
  ExternalLink,
  Filter,
  Award,
  GraduationCap,
  TrendingUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Database,
  X,
  Beaker,
  FileText,
  Briefcase,
  ArrowLeft,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────
interface CollegeData {
  _id: string;
  name: string;
  state: string;
  city: string;
  website: string;
  type: string;
  courses: string[];
  feesRange: { min: number; max: number; currency: string };
  admissionDetails: string;
  placementStats: {
    averagePackage: string;
    highestPackage: string;
    placementRate: string;
    topRecruiters: string[];
  };
  nirfRanking: { rank: number; score: number; year: number; category: string };
  openAlexData: {
    openAlexId: string;
    citedByCount: number;
    worksCount: number;
    hIndex: number;
    topics: string[];
  };
  domains: string[];
  sources: string[];
  lastUpdated: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StatsData {
  totalColleges: number;
  totalRankings: number;
  topStates: { _id: string; count: number }[];
  byType: { _id: string; count: number }[];
  bySources: { _id: string; count: number }[];
}

// ── Helper Functions ────────────────────────────────────────────────────
function typeLabel(type: string): string {
  const map: Record<string, string> = {
    university: 'University',
    college: 'College',
    institute: 'Institute',
    other: 'Institution',
  };
  return map[type] || 'Institution';
}

function typeColor(type: string): string {
  const map: Record<string, string> = {
    university: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    college: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    institute: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };
  return map[type] || map.other;
}

function sourceLabel(src: string): string {
  const map: Record<string, string> = {
    'universities-api': 'Universities API',
    openalex: 'OpenAlex',
    'indian-colleges-api': 'Colleges API',
    nirf: 'NIRF',
  };
  return map[src] || src;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

// ── Main Component ──────────────────────────────────────────────────────
export function CollegeDirectory() {
  // List state
  const [colleges, setColleges] = useState<CollegeData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [states, setStates] = useState<string[]>([]);

  // Stats
  const [stats, setStats] = useState<StatsData | null>(null);

  // Detail view
  const [selectedCollege, setSelectedCollege] = useState<CollegeData | null>(null);

  // ── Debounced search ────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Fetch states for filter dropdown ────────────────────────────────
  useEffect(() => {
    axios
      .get('/api/colleges/filters/states')
      .then((res) => {
        if (res.data?.success) setStates(res.data.data);
      })
      .catch(() => {});
  }, []);

  // ── Fetch stats ─────────────────────────────────────────────────────
  useEffect(() => {
    axios
      .get('/api/colleges/stats')
      .then((res) => {
        if (res.data?.success) setStats(res.data.data);
      })
      .catch(() => {});
  }, []);

  // ── Fetch colleges ──────────────────────────────────────────────────
  const fetchColleges = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError('');
      try {
        const params: Record<string, string> = {
          page: String(page),
          limit: '12',
        };
        if (debouncedSearch) params.q = debouncedSearch;
        if (stateFilter !== 'all') params.state = stateFilter;
        if (typeFilter !== 'all') params.type = typeFilter;
        if (courseFilter !== 'all') params.course = courseFilter;

        const res = await axios.get('/api/colleges/search', { params });
        if (res.data?.success) {
          setColleges(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load colleges. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, stateFilter, typeFilter, courseFilter]
  );

  useEffect(() => {
    fetchColleges(1);
  }, [fetchColleges]);

  // ── Clear all filters ───────────────────────────────────────────────
  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setStateFilter('all');
    setTypeFilter('all');
    setCourseFilter('all');
  };

  const hasFilters = searchTerm || stateFilter !== 'all' || typeFilter !== 'all' || courseFilter !== 'all';

  // ══════════════════════════════════════════════════════════════════════
  // DETAIL VIEW
  // ══════════════════════════════════════════════════════════════════════
  if (selectedCollege) {
    const c = selectedCollege;
    const hasResearchData = c.openAlexData && (c.openAlexData.citedByCount > 0 || c.openAlexData.worksCount > 0);
    const hasPlacement = c.placementStats && (c.placementStats.averagePackage || c.placementStats.topRecruiters?.length > 0);
    const hasNirf = c.nirfRanking && c.nirfRanking.rank > 0;

    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="outline" onClick={() => setSelectedCollege(null)} className="mb-6 group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </Button>

        {/* Hero Header */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="relative z-10">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm`}>
                {typeLabel(c.type)}
              </span>
              {c.sources.map((src) => (
                <span key={src} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 backdrop-blur-sm">
                  <Database className="h-3 w-3 mr-1" />
                  {sourceLabel(src)}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{c.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              {(c.city || c.state) && (
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {[c.city, c.state].filter(Boolean).join(', ')}
                </span>
              )}
              {c.website && (
                <a
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-white transition-colors"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Visit Website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Research Metrics */}
            {hasResearchData && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Beaker className="h-5 w-5 mr-2 text-blue-500" />
                    Research & Academic Profile
                  </CardTitle>
                  <CardDescription>Data sourced from OpenAlex</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                      <p className="text-2xl font-bold text-blue-600">{formatNumber(c.openAlexData.citedByCount)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Citations</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                      <p className="text-2xl font-bold text-emerald-600">{formatNumber(c.openAlexData.worksCount)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Published Works</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30">
                      <p className="text-2xl font-bold text-purple-600">{c.openAlexData.hIndex}</p>
                      <p className="text-xs text-muted-foreground mt-1">h-Index</p>
                    </div>
                  </div>
                  {c.openAlexData.topics?.length > 0 && (
                    <>
                      <p className="text-sm font-medium mb-2">Research Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {c.openAlexData.topics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs py-1 bg-background">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Courses */}
            {c.courses.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BookOpen className="h-5 w-5 mr-2 text-emerald-500" />
                    Courses Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {c.courses.map((course, i) => (
                      <Badge key={i} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 py-1.5 px-3">
                        <GraduationCap className="h-3 w-3 mr-1.5" />
                        {course}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Placement Stats */}
            {hasPlacement && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
                    Placement Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {c.placementStats.averagePackage && (
                      <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30">
                        <p className="text-lg font-bold text-orange-600">{c.placementStats.averagePackage}</p>
                        <p className="text-xs text-muted-foreground">Avg Package</p>
                      </div>
                    )}
                    {c.placementStats.highestPackage && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
                        <p className="text-lg font-bold text-amber-600">{c.placementStats.highestPackage}</p>
                        <p className="text-xs text-muted-foreground">Highest Package</p>
                      </div>
                    )}
                    {c.placementStats.placementRate && (
                      <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
                        <p className="text-lg font-bold text-green-600">{c.placementStats.placementRate}</p>
                        <p className="text-xs text-muted-foreground">Placement Rate</p>
                      </div>
                    )}
                  </div>
                  {c.placementStats.topRecruiters?.length > 0 && (
                    <>
                      <p className="text-sm font-medium mb-2">Top Recruiters</p>
                      <div className="flex flex-wrap gap-2">
                        {c.placementStats.topRecruiters.map((recruiter, i) => (
                          <Badge key={i} variant="outline" className="py-1 bg-background">
                            {recruiter}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Admission Details */}
            {c.admissionDetails && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                    Admission Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.admissionDetails}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasNirf && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/30">
                    <div>
                      <p className="text-sm text-muted-foreground">NIRF Rank</p>
                      <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">#{c.nirfRanking.rank}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{c.nirfRanking.category}</p>
                      <p className="text-sm font-medium">{c.nirfRanking.score.toFixed(1)} pts</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge className={`mt-1 ${typeColor(c.type)}`}>{typeLabel(c.type)}</Badge>
                </div>

                {(c.feesRange.min > 0 || c.feesRange.max > 0) && (
                  <div>
                    <p className="text-sm text-muted-foreground">Fee Range</p>
                    <p className="text-lg font-semibold">
                      ₹{c.feesRange.min.toLocaleString()} – ₹{c.feesRange.max.toLocaleString()}
                    </p>
                  </div>
                )}

                {c.domains.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Domains</p>
                    <div className="flex flex-wrap gap-1">
                      {c.domains.map((d, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(c.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>

                {c.website && (
                  <a href={c.website} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Official Website
                    </Button>
                  </a>
                )}
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
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              College Directory
            </h1>
            <p className="text-muted-foreground">
              Real-time data from Universities API, OpenAlex & more — {stats ? stats.totalColleges.toLocaleString() : '...'} institutions indexed
            </p>
          </div>
          {stats && (
            <div className="flex gap-3">
              {stats.byType.slice(0, 3).map((t) => (
                <div key={t._id} className="text-center px-4 py-2 rounded-xl bg-muted/50">
                  <p className="text-lg font-bold">{t.count}</p>
                  <p className="text-xs text-muted-foreground">{typeLabel(t._id)}s</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search & Filters Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search colleges by name, city, or state..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  id="college-search-input"
                />
              </div>

              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger id="state-filter">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="institute">Institute</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger id="course-filter">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="B.Tech">B.Tech</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="MBBS">MBBS</SelectItem>
                  <SelectItem value="B.Sc">B.Sc</SelectItem>
                  <SelectItem value="M.Tech">M.Tech</SelectItem>
                  <SelectItem value="BCA">BCA</SelectItem>
                  <SelectItem value="MCA">MCA</SelectItem>
                  <SelectItem value="B.Com">B.Com</SelectItem>
                  <SelectItem value="B.A.">B.A.</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="LLB">LLB</SelectItem>
                  <SelectItem value="B.Pharm">B.Pharm</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
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
                {stateFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    State: {stateFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setStateFilter('all')} />
                  </Badge>
                )}
                {typeFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {typeLabel(typeFilter)}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setTypeFilter('all')} />
                  </Badge>
                )}
                {courseFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Course: {courseFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setCourseFilter('all')} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <CardContent className="pt-6 flex items-center justify-between">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchColleges(pagination.page)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </span>
          ) : (
            <>
              Showing {colleges.length} of {pagination.total.toLocaleString()} colleges
              {hasFilters && ' (filtered)'}
            </>
          )}
        </p>
      </div>

      {/* Loading State */}
      {loading && colleges.length === 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse border-0 shadow-md">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-muted rounded-full w-16" />
                    <div className="h-6 bg-muted rounded-full w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* College Grid */}
      {!loading && colleges.length === 0 && !error ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-12 pb-12 text-center">
            <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No colleges found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => {
            const hasResearch = college.openAlexData && (college.openAlexData.citedByCount > 0 || college.openAlexData.hIndex > 0);
            const hasRank = college.nirfRanking && college.nirfRanking.rank > 0;

            return (
              <Card
                key={college._id}
                className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => setSelectedCollege(college)}
                id={`college-card-${college._id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-tight mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {college.name}
                      </CardTitle>
                      {(college.city || college.state) && (
                        <CardDescription className="flex items-center text-xs">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          {[college.city, college.state].filter(Boolean).join(', ')}
                        </CardDescription>
                      )}
                    </div>
                    <Badge className={`flex-shrink-0 text-[10px] ${typeColor(college.type)}`}>
                      {typeLabel(college.type)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Research metrics row */}
                    {hasResearch && (
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-blue-600">
                          <BarChart3 className="h-3 w-3" />
                          <span>{formatNumber(college.openAlexData.citedByCount)} citations</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-600">
                          <TrendingUp className="h-3 w-3" />
                          <span>h-index: {college.openAlexData.hIndex}</span>
                        </div>
                      </div>
                    )}

                    {/* NIRF Rank */}
                    {hasRank && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Award className="h-3 w-3 mr-1" />
                          NIRF Rank
                        </span>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800">
                          #{college.nirfRanking.rank}
                        </Badge>
                      </div>
                    )}

                    {/* Topics */}
                    {college.openAlexData?.topics?.length > 0 && (
                      <div className="pt-1">
                        <div className="flex flex-wrap gap-1">
                          {college.openAlexData.topics.slice(0, 2).map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] py-0.5 bg-background truncate max-w-[140px]">
                              {topic}
                            </Badge>
                          ))}
                          {college.openAlexData.topics.length > 2 && (
                            <Badge variant="outline" className="text-[10px] py-0.5 bg-background">
                              +{college.openAlexData.topics.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Courses */}
                    {college.courses.length > 0 && (
                      <div className="pt-1">
                        <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Courses</p>
                        <div className="flex flex-wrap gap-1">
                          {college.courses.slice(0, 3).map((course, i) => (
                            <Badge key={i} className="text-[10px] py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                              {course}
                            </Badge>
                          ))}
                          {college.courses.length > 3 && (
                            <Badge className="text-[10px] py-0.5 bg-muted text-muted-foreground">
                              +{college.courses.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sources */}
                    <div className="flex items-center gap-1 pt-1 border-t">
                      <Database className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        {college.sources.map(sourceLabel).join(' · ')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchColleges(pagination.page - 1)}
            id="pagination-prev"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  className="w-9 h-9"
                  onClick={() => fetchColleges(pageNum)}
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
            onClick={() => fetchColleges(pagination.page + 1)}
            id="pagination-next"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}