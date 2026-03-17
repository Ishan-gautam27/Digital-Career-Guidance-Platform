import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Search,
  Award,
  IndianRupee,
  Calendar,
  Users,
  BookOpen,
  GraduationCap,
  Heart,
  Building,
  ExternalLink,
  Filter,
  Clock,
  CheckCircle
} from 'lucide-react';

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  type: 'Government' | 'Private' | 'Merit-based' | 'Need-based' | 'Minority' | 'International';
  amount: number | string;
  currency: string;
  eligibility: string[];
  category: 'General' | 'SC' | 'ST' | 'OBC' | 'Minority' | 'Girls' | 'Disabled' | 'International';
  stream: string[];
  deadline: string;
  description: string;
  website?: string;
  documents: string[];
  renewableYears?: number;
  applicationProcess: string;
}

const scholarships: Scholarship[] = [
  {
    id: '1',
    name: 'National Scholarship Portal (NSP)',
    provider: 'Government of India',
    type: 'Government',
    amount: 'Up to ₹75,000',
    currency: 'INR',
    eligibility: ['Family income below ₹8 lakhs', 'Minimum 60% marks', 'Indian citizen'],
    category: 'General',
    stream: ['All Streams'],
    deadline: 'December 31, 2024',
    description: 'Central government scholarship for students pursuing higher education in recognized institutions.',
    website: 'https://scholarships.gov.in',
    documents: ['Aadhaar Card', 'Income Certificate', 'Caste Certificate', 'Mark Sheets'],
    renewableYears: 3,
    applicationProcess: 'Online application through NSP portal'
  },
  {
    id: '2',
    name: 'INSPIRE Scholarship',
    provider: 'Department of Science & Technology',
    type: 'Merit-based',
    amount: 80000,
    currency: 'INR',
    eligibility: ['Top 1% in Class 12 board exams', 'Science stream students', 'Age below 27'],
    category: 'General',
    stream: ['Science'],
    deadline: 'July 31, 2024',
    description: 'Scholarship for pursuing undergraduate courses in Natural and Basic Sciences.',
    documents: ['Class 12 Certificate', 'Aadhaar Card', 'Bank Details', 'Admission Letter'],
    renewableYears: 5,
    applicationProcess: 'Online through INSPIRE portal'
  },
  {
    id: '3',
    name: 'Post Matric Scholarship for SC Students',
    provider: 'Ministry of Social Justice',
    type: 'Government',
    amount: 'Up to ₹2,00,000',
    currency: 'INR',
    eligibility: ['Scheduled Caste certificate', 'Family income below ₹2.5 lakhs', 'Passed Class 10'],
    category: 'SC',
    stream: ['All Streams'],
    deadline: 'November 30, 2024',
    description: 'Financial assistance for SC students pursuing post-matriculation studies.',
    documents: ['SC Certificate', 'Income Certificate', 'Aadhaar Card', 'Bank Passbook'],
    renewableYears: 4,
    applicationProcess: 'State-wise online portals'
  },
  {
    id: '4',
    name: 'Begum Hazrat Mahal National Scholarship',
    provider: 'Maulana Azad Education Foundation',
    type: 'Minority',
    amount: 25000,
    currency: 'INR',
    eligibility: ['Minority community girls', 'Family income below ₹2 lakhs', 'Merit in Class 12'],
    category: 'Minority',
    stream: ['All Streams'],
    deadline: 'October 31, 2024',
    description: 'Scholarship for girl students from minority communities for higher education.',
    documents: ['Minority Certificate', 'Income Certificate', 'Aadhaar Card', 'Class 12 Certificate'],
    renewableYears: 3,
    applicationProcess: 'Online through MAEF portal'
  },
  {
    id: '5',
    name: 'Pragati Scholarship for Girls',
    provider: 'AICTE',
    type: 'Need-based',
    amount: 50000,
    currency: 'INR',
    eligibility: ['Girl students only', 'Technical education courses', 'Family income below ₹8 lakhs'],
    category: 'Girls',
    stream: ['Engineering', 'Technology'],
    deadline: 'January 31, 2025',
    description: 'Promoting technical education among girls through financial assistance.',
    documents: ['Income Certificate', 'Aadhaar Card', 'Admission Letter', 'Bank Details'],
    renewableYears: 4,
    applicationProcess: 'AICTE National Scholarship Portal'
  },
  {
    id: '6',
    name: 'Kishore Vaigyanik Protsahan Yojana (KVPY)',
    provider: 'Indian Institute of Science',
    type: 'Merit-based',
    amount: 'Up to ₹28,000/month',
    currency: 'INR',
    eligibility: ['Class 11, 12 & UG students', 'Science and research aptitude', 'Qualifying exam'],
    category: 'General',
    stream: ['Science', 'Research'],
    deadline: 'August 31, 2024',
    description: 'Fellowship program to encourage students for research career in science.',
    documents: ['Academic Certificates', 'Aadhaar Card', 'KVPY Exam Score', 'Research Proposal'],
    renewableYears: 5,
    applicationProcess: 'KVPY portal with written test and interview'
  },
  {
    id: '7',
    name: 'Fulbright-Nehru Master\'s Fellowships',
    provider: 'Fulbright Commission',
    type: 'International',
    amount: 'Full funding',
    currency: 'USD',
    eligibility: ['Bachelor\'s degree', 'Strong academic record', 'Leadership potential', 'English proficiency'],
    category: 'International',
    stream: ['All Streams'],
    deadline: 'May 15, 2024',
    description: 'Fellowship for Indian students to pursue Master\'s degree in the United States.',
    documents: ['TOEFL/IELTS', 'GRE/GMAT', 'Transcripts', 'Statement of Purpose', 'Letters of Recommendation'],
    renewableYears: 2,
    applicationProcess: 'Online application through Fulbright portal'
  },
  {
    id: '8',
    name: 'Commonwealth Scholarship',
    provider: 'Commonwealth Scholarship Commission',
    type: 'International',
    amount: 'Full tuition + living allowance',
    currency: 'GBP',
    eligibility: ['Indian citizen', 'Strong academic merit', 'Development impact potential', 'English proficiency'],
    category: 'International',
    stream: ['All Streams'],
    deadline: 'December 15, 2024',
    description: 'Scholarships for Indian students to study in UK universities.',
    documents: ['IELTS', 'Academic Transcripts', 'Personal Statement', 'References', 'Development Impact Statement'],
    renewableYears: 3,
    applicationProcess: 'Online through CSC portal'
  }
];

export function Scholarships() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [streamFilter, setStreamFilter] = useState('all');
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [activeTab, setActiveTab] = useState('domestic');

  const filteredScholarships = useMemo(() => {
    const isInternational = activeTab === 'international';
    
    return scholarships.filter(scholarship => {
      const matchesTab = isInternational ? scholarship.type === 'International' : scholarship.type !== 'International';
      const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || scholarship.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || scholarship.category === categoryFilter;
      const matchesStream = streamFilter === 'all' || 
        scholarship.stream.some(stream => stream.toLowerCase().includes(streamFilter.toLowerCase()));

      return matchesTab && matchesSearch && matchesType && matchesCategory && matchesStream;
    });
  }, [searchTerm, typeFilter, categoryFilter, streamFilter, activeTab]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Government': return Building;
      case 'Merit-based': return Award;
      case 'Need-based': return Heart;
      case 'Minority': return Users;
      case 'International': return GraduationCap;
      default: return BookOpen;
    }
  };

  const getAmountDisplay = (amount: number | string, currency: string) => {
    if (typeof amount === 'string') return amount;
    
    const symbol = currency === 'INR' ? '₹' : 
                   currency === 'USD' ? '$' : 
                   currency === 'GBP' ? '£' : 
                   currency === 'EUR' ? '€' : '';
    
    return `${symbol}${amount.toLocaleString()}`;
  };

  if (selectedScholarship) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedScholarship(null)}
            className="mb-4"
          >
            ← Back to Scholarships
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedScholarship.name}</CardTitle>
                    <CardDescription className="text-lg">{selectedScholarship.provider}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">{selectedScholarship.type}</Badge>
                    <Badge variant="outline">{selectedScholarship.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{selectedScholarship.description}</p>
                
                <div>
                  <h3 className="mb-3">Eligibility Criteria</h3>
                  <div className="space-y-2">
                    {selectedScholarship.eligibility.map((criteria, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{criteria}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3">Required Documents</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedScholarship.documents.map((document, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{document}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3">Application Process</h3>
                  <p className="text-sm text-muted-foreground">{selectedScholarship.applicationProcess}</p>
                </div>

                <div>
                  <h3 className="mb-3">Applicable Streams</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedScholarship.stream.map((stream, index) => (
                      <Badge key={index} variant="outline">{stream}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Scholarship Amount</p>
                  <p className="text-xl font-medium">
                    {getAmountDisplay(selectedScholarship.amount, selectedScholarship.currency)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Application Deadline</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <p className="text-lg">{selectedScholarship.deadline}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-lg">{selectedScholarship.category}</p>
                </div>

                {selectedScholarship.renewableYears && (
                  <div>
                    <p className="text-sm text-muted-foreground">Renewable For</p>
                    <p className="text-lg">{selectedScholarship.renewableYears} years</p>
                  </div>
                )}

                {selectedScholarship.website && (
                  <Button className="w-full" asChild>
                    <a href={selectedScholarship.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Application Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">📝 Apply Early</p>
                    <p className="text-muted-foreground">Don't wait for the deadline. Submit your application well in advance.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">📋 Complete Documentation</p>
                    <p className="text-muted-foreground">Ensure all required documents are properly attested and submitted.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">✅ Verify Information</p>
                    <p className="text-muted-foreground">Double-check all information before submission to avoid rejection.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Scholarship Directory</h1>
        <p className="text-muted-foreground">
          Discover scholarship opportunities to fund your education and achieve your academic goals.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="domestic">
            <Award className="h-4 w-4 mr-2" />
            Domestic Scholarships
          </TabsTrigger>
          <TabsTrigger value="international">
            <GraduationCap className="h-4 w-4 mr-2" />
            International Scholarships
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domestic" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Search & Filter Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search scholarships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Scholarship Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Merit-based">Merit-based</SelectItem>
                    <SelectItem value="Need-based">Need-based</SelectItem>
                    <SelectItem value="Minority">Minority</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="Minority">Minority</SelectItem>
                    <SelectItem value="Girls">Girls</SelectItem>
                    <SelectItem value="Disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={streamFilter} onValueChange={setStreamFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Streams</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              Found {filteredScholarships.length} scholarships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => {
              const TypeIcon = getTypeIcon(scholarship.type);
              
              return (
                <Card 
                  key={scholarship.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedScholarship(scholarship)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{scholarship.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {scholarship.provider}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{scholarship.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="font-medium">
                          {getAmountDisplay(scholarship.amount, scholarship.currency)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Deadline</span>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-red-500" />
                          <span className="text-sm">{scholarship.deadline}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="outline" className="text-xs">{scholarship.category}</Badge>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Streams:</p>
                        <div className="flex flex-wrap gap-1">
                          {scholarship.stream.slice(0, 2).map((stream, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {stream}
                            </Badge>
                          ))}
                          {scholarship.stream.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{scholarship.stream.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="international" className="space-y-6">
          {/* International Scholarships - Same structure as domestic */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Search & Filter International Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search scholarships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={streamFilter} onValueChange={setStreamFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Streams</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>

                <Select value="all" disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="International Only" />
                  </SelectTrigger>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              Found {filteredScholarships.length} international scholarships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => {
              const TypeIcon = getTypeIcon(scholarship.type);
              
              return (
                <Card 
                  key={scholarship.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedScholarship(scholarship)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{scholarship.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {scholarship.provider}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">International</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Coverage</span>
                        <span className="font-medium text-sm">
                          {getAmountDisplay(scholarship.amount, scholarship.currency)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Deadline</span>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-red-500" />
                          <span className="text-sm">{scholarship.deadline}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Eligibility:</p>
                        <div className="text-xs text-muted-foreground">
                          {scholarship.eligibility.slice(0, 2).join(', ')}
                          {scholarship.eligibility.length > 2 && '...'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="mb-2">No scholarships found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}