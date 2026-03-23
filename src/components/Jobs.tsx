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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <style dangerouslySetInnerHTML={{__html: `
          /* ─── Liquid Glass Buttons ─── */
          .liquid-glass-tab {
            background-color: rgba(219, 234, 254, 0.4) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(191, 219, 254, 0.8) !important;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1) !important;
            color: #1d4ed8 !important;
            border-radius: 0.75rem !important;
            padding-top: 0.75rem !important;
            padding-bottom: 0.75rem !important;
            transition: all 0.3s ease-out !important;
            cursor: pointer !important;
          }
          .liquid-glass-tab:hover {
            background-color: rgba(191, 219, 254, 0.6) !important;
            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2) !important;
            transform: translateY(-4px) !important;
          }
          .liquid-glass-tab[data-state="active"] {
            background-color: rgba(147, 197, 253, 0.5) !important;
            border-color: rgba(96, 165, 250, 0.8) !important;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.8), 0 10px 15px -3px rgba(59,130,246,0.3) !important;
          }
          .liquid-glass-btn {
            background-color: rgba(219, 234, 254, 0.35) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(191, 219, 254, 0.7) !important;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.08) !important;
            color: #1d4ed8 !important;
            border-radius: 0.75rem !important;
            transition: all 0.3s ease-out !important;
            cursor: pointer !important;
          }
          .liquid-glass-btn:hover {
            background-color: rgba(191, 219, 254, 0.55) !important;
            box-shadow: 0 12px 20px -4px rgba(59, 130, 246, 0.22) !important;
            transform: translateY(-4px) !important;
          }
          .liquid-glass-btn:disabled {
            opacity: 0.5 !important;
            transform: none !important;
            cursor: not-allowed !important;
          }
          .liquid-glass-btn-primary {
            background: linear-gradient(180deg, rgba(238,242,255,1) 0%, rgba(224,231,255,1) 100%) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(199, 210, 254, 0.8) !important;
            box-shadow: 0 4px 14px 0 rgba(79,70,229,0.15) !important;
            color: #4f46e5 !important;
            border-radius: 1rem !important;
            transition: all 0.3s ease-out !important;
            cursor: pointer !important;
          }
          .liquid-glass-btn-primary:hover {
            box-shadow: 0 20px 40px -10px rgba(79,70,229,0.4) !important;
            transform: translateY(-4px) scale(1.02) !important;
          }
          .liquid-glass-btn-active {
            background-color: rgba(99, 102, 241, 0.15) !important;
            border-color: rgba(99, 102, 241, 0.5) !important;
            color: #4338ca !important;
            font-weight: 700 !important;
          }
          .dark .liquid-glass-tab {
            background-color: rgba(30, 58, 138, 0.4) !important;
            border-color: rgba(29, 78, 216, 0.5) !important;
            color: #93c5fd !important;
          }
          .dark .liquid-glass-tab[data-state="active"] {
            background-color: rgba(30, 58, 138, 0.8) !important;
          }
          .dark .liquid-glass-btn {
            background-color: rgba(30, 58, 138, 0.3) !important;
            border-color: rgba(29, 78, 216, 0.4) !important;
            color: #93c5fd !important;
          }
          .dark .liquid-glass-btn:hover {
            background-color: rgba(30, 58, 138, 0.5) !important;
          }
          .dark .liquid-glass-btn-primary {
            background: linear-gradient(180deg, rgba(30,58,138,0.6) 0%, rgba(30,64,175,0.5) 100%) !important;
            border-color: rgba(59, 130, 246, 0.4) !important;
            color: #93c5fd !important;
          }
          .dark .liquid-glass-btn-active {
            background-color: rgba(99, 102, 241, 0.3) !important;
            color: #a5b4fc !important;
          }
        `}} />

        <Button variant="ghost" onClick={() => setSelectedJob(null)} className="liquid-glass-btn mb-6 font-semibold">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT COLUMN: Hero + Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* HERO CARD */}
            <div className="bg-card rounded-[28px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 flex flex-col relative overflow-hidden">
              
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Big Square Icon Box */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/50">
                   <Building className="w-8 h-8" style={{ color: '#4f46e5' }} />
                </div>

                {/* Badges & Title */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-3 py-1 font-semibold rounded-full text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {j.type}
                    </div>
                    <div className="px-3 py-1 font-semibold rounded-full text-xs flex items-center gap-1.5 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                       <ExternalLink className="w-3 h-3" /> {j.source}
                    </div>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {j.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1.5 shrink-0" />
                      {j.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5 shrink-0" />
                      {j.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 shrink-0" />
                      Posted {timeAgo(j.postedDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-8">
                  <a href={j.applyUrl} target="_blank" rel="noopener noreferrer" className="block w-full group/apply">
                    <button 
                      className="liquid-glass-btn-primary w-full h-14 font-bold text-base flex items-center justify-center"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Apply on {j.source}
                    </button>
                 </a>
                 <div className="mt-4 flex justify-center">
                   <p className="text-center text-xs font-medium text-slate-500">
                      You will be securely redirected to {j.source}.
                   </p>
                 </div>
              </div>
            </div>

            {/* TABBED DETAILS CARD */}
            <div className="bg-card rounded-[28px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800">
              <Tabs defaultValue="description" className="w-full">

                <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0 gap-4 mb-6">
                  <TabsTrigger 
                    value="description" 
                    className="liquid-glass-tab font-semibold cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 mr-2" /> Job Description
                  </TabsTrigger>
                  <TabsTrigger 
                    value="overview" 
                    className="liquid-glass-tab font-semibold cursor-pointer lg:hidden"
                  >
                    <Zap className="w-4 h-4 mr-2" /> Quick Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skills" 
                    className="hidden lg:flex liquid-glass-tab font-semibold cursor-pointer"
                  >
                    <Tag className="w-4 h-4 mr-2" /> Skills
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-0 focus-visible:outline-none">
                  {detailLoading ? (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading full description...
                    </div>
                  ) : (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-li:text-slate-600 dark:prose-li:text-slate-300 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2 [&_p]:mb-4 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:font-bold"
                      dangerouslySetInnerHTML={{ __html: j.description || 'No description available for this role.' }}
                    />
                  )}
                </TabsContent>

                <TabsContent value="overview" className="mt-0 focus-visible:outline-none lg:hidden">
                   {/* Mobile overview content goes here (matches sidebar) */}
                   <p className="text-slate-500 text-sm">Please see the Quick Overview section below.</p>
                </TabsContent>

                <TabsContent value="skills" className="mt-0 focus-visible:outline-none hidden lg:block">
                  <div className="flex flex-wrap gap-2.5">
                    {(j.tags && j.tags.length > 0) ? (
                      j.tags.map((tag, i) => (
                        <Badge key={i} className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 py-1.5 px-4 hover:bg-slate-200 transition-colors text-sm font-semibold border-0 rounded-lg shadow-sm">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">No specific skills listed for this role.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-[28px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 sticky top-24 flex flex-col pt-8">
              
              <h2 className="flex items-center text-slate-800 dark:text-slate-100 font-bold text-lg mb-8">
                <Zap className="w-5 h-5 text-indigo-500 mr-2 shrink-0" /> 
                Quick Overview
              </h2>

              <div className="space-y-6 flex-1">
                {/* Compensation */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-500 mb-0.5">Compensation</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{j.salary || 'Not disclosed'}</p>
                  </div>
                </div>
                
                {/* Job Type */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-500 mb-0.5">Job Type</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{j.type}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-500 mb-0.5">Category</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{(j.category?.length || 0) > 25 ? j.category?.substring(0, 25) + '...' : j.category}</p>
                  </div>
                </div>
                
                {/* Posted On */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-500 mb-0.5">Posted On</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      {new Date(j.postedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Job Button */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                 <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-card text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] cursor-pointer">
                    Save Job
                 </Button>
              </div>
              
            </div>
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
      <style dangerouslySetInnerHTML={{__html: `
        .liquid-glass-tab {
          background-color: rgba(219, 234, 254, 0.4) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(191, 219, 254, 0.8) !important;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1) !important;
          color: #1d4ed8 !important;
          border-radius: 0.75rem !important;
          padding-top: 0.75rem !important;
          padding-bottom: 0.75rem !important;
          transition: all 0.3s ease-out !important;
          cursor: pointer !important;
        }
        .liquid-glass-tab:hover {
          background-color: rgba(191, 219, 254, 0.6) !important;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2) !important;
          transform: translateY(-4px) !important;
        }
        .liquid-glass-tab[data-state="active"] {
          background-color: rgba(147, 197, 253, 0.5) !important;
          border-color: rgba(96, 165, 250, 0.8) !important;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.8), 0 10px 15px -3px rgba(59,130,246,0.3) !important;
        }
        .liquid-glass-btn {
          background-color: rgba(219, 234, 254, 0.35) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(191, 219, 254, 0.7) !important;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.08) !important;
          color: #1d4ed8 !important;
          border-radius: 0.75rem !important;
          transition: all 0.3s ease-out !important;
          cursor: pointer !important;
        }
        .liquid-glass-btn:hover {
          background-color: rgba(191, 219, 254, 0.55) !important;
          box-shadow: 0 12px 20px -4px rgba(59, 130, 246, 0.22) !important;
          transform: translateY(-4px) !important;
        }
        .liquid-glass-btn:disabled {
          opacity: 0.5 !important;
          transform: none !important;
          cursor: not-allowed !important;
        }
        .liquid-glass-btn-active {
          background-color: rgba(99, 102, 241, 0.15) !important;
          border-color: rgba(99, 102, 241, 0.5) !important;
          color: #4338ca !important;
          font-weight: 700 !important;
        }
        .dark .liquid-glass-tab {
          background-color: rgba(30, 58, 138, 0.4) !important;
          border-color: rgba(29, 78, 216, 0.5) !important;
          color: #93c5fd !important;
        }
        .dark .liquid-glass-tab[data-state="active"] {
          background-color: rgba(30, 58, 138, 0.8) !important;
        }
        .dark .liquid-glass-btn {
          background-color: rgba(30, 58, 138, 0.3) !important;
          border-color: rgba(29, 78, 216, 0.4) !important;
          color: #93c5fd !important;
        }
        .dark .liquid-glass-btn:hover {
          background-color: rgba(30, 58, 138, 0.5) !important;
        }
        .dark .liquid-glass-btn-active {
          background-color: rgba(99, 102, 241, 0.3) !important;
          color: #a5b4fc !important;
        }
      `}} />

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
          <TabsTrigger value="all" className="liquid-glass-tab font-semibold">
            <Briefcase className="h-4 w-4 mr-2" />
            All Jobs
          </TabsTrigger>
          <TabsTrigger value="remote" className="liquid-glass-tab font-semibold">
            <Globe className="h-4 w-4 mr-2" />
            Remote Only
          </TabsTrigger>
          <TabsTrigger value="recent" className="liquid-glass-tab font-semibold">
            <Zap className="h-4 w-4 mr-2" />
            Latest
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search & Filters */}
      <Card className="bg-card rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] mb-6 overflow-visible">
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
              <Button variant="ghost" size="sm" onClick={clearFilters} className="liquid-glass-btn text-xs h-7">Clear all</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <CardContent className="pt-6 flex items-center justify-between">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchJobs(pagination.page)} className="liquid-glass-btn">
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
        <Card className="bg-card rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <CardContent className="pt-12 pb-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            {hasFilters && <Button variant="outline" onClick={clearFilters} className="liquid-glass-btn font-semibold">Clear all filters</Button>}
          </CardContent>
        </Card>
      )}

      {/* Job cards */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="group bg-card rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out relative overflow-hidden"
            onClick={() => openJobDetail(job)}
            id={`job-card-${job.id}`}
          >
            {/* subtle animated hover background for job card */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:scale-150 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100" />
            
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-start gap-4">
                {/* Company logo */}
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl object-contain bg-card border border-indigo-100 dark:border-indigo-800/50 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm"
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
                        <Badge key={i} variant="outline" className="text-[10px] py-0.5 bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 group-hover/tags:border-indigo-200 dark:group-hover/tags:border-indigo-800 transition-colors text-slate-600 dark:text-slate-300 font-medium">
                          {tag}
                        </Badge>
                      ))}
                      {(job.tags?.length || 0) > 4 && (
                        <Badge variant="outline" className="text-[10px] py-0.5 bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 group-hover/tags:border-indigo-200 dark:group-hover/tags:border-indigo-800 transition-colors text-slate-600 dark:text-slate-300 font-medium">+{(job.tags?.length || 0) - 4}</Badge>
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
            className="liquid-glass-btn font-semibold"
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
                  className={`w-9 h-9 ${pageNum === pagination.page ? 'liquid-glass-btn-active liquid-glass-btn' : 'liquid-glass-btn'}`}
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
            className="liquid-glass-btn font-semibold"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}