import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import {
  Search,
  BookOpen,
  PlayCircle,
  Clock,
  Users,
  Award,
  Star,
  TrendingUp,
  ExternalLink,
  Filter,
  Calendar,
  CheckCircle,
  Globe,
  Download,
  Zap
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  provider: string;
  category: 'Technical' | 'Soft Skills' | 'Government Scheme' | 'Certification' | 'Language' | 'Creative';
  type: 'Free' | 'Paid' | 'Government' | 'Premium';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolledStudents: number;
  price?: number;
  currency?: string;
  description: string;
  skills: string[];
  prerequisites: string[];
  features: string[];
  certification: boolean;
  languages: string[];
  format: 'Online' | 'Offline' | 'Hybrid';
  startDate?: string;
  isPopular: boolean;
  isNew: boolean;
  url: string;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Machine Learning by Stanford University',
    provider: 'Coursera',
    category: 'Technical',
    type: 'Free',
    duration: '11 weeks',
    level: 'Intermediate',
    rating: 4.9,
    enrolledStudents: 5200000,
    description: 'This course provides a broad introduction to machine learning, data mining, and statistical pattern recognition created by Andrew Ng.',
    skills: ['Machine Learning', 'Python', 'Algorithms', 'Deep Learning'],
    prerequisites: ['Basic Math', 'Basic Programming'],
    features: ['Shareable Certificate', 'Self-Paced', 'Video Lectures', 'Quizzes'],
    certification: true,
    languages: ['English', 'Hindi (Subtitles)'],
    format: 'Online',
    startDate: 'Flexible',
    isPopular: true,
    isNew: false,
    url: 'https://www.coursera.org/learn/machine-learning'
  },
  {
    id: '2',
    title: 'The Complete 2024 Web Development Bootcamp',
    provider: 'Udemy',
    category: 'Technical',
    type: 'Paid',
    duration: '65 hours',
    level: 'Beginner',
    rating: 4.7,
    enrolledStudents: 950000,
    price: 3600,
    currency: 'INR',
    description: 'Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps.',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    prerequisites: ['No pre-requisites', 'Mac or PC'],
    features: ['Lifetime Access', '85 Coding Exercises', 'Certificate of Completion'],
    certification: true,
    languages: ['English'],
    format: 'Online',
    isPopular: true,
    isNew: false,
    url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/'
  },
  {
    id: '3',
    title: 'Programming in Java',
    provider: 'NPTEL (IIT Kharagpur)',
    category: 'Government Scheme',
    type: 'Government',
    duration: '12 weeks',
    level: 'Beginner',
    rating: 4.5,
    enrolledStudents: 120000,
    description: 'A comprehensive, rigorous course on Java programming brought to you by the Ministry of Education, India.',
    skills: ['Java', 'Object-Oriented Programming', 'Data Structures'],
    prerequisites: ['Basic C/C++ beneficial'],
    features: ['Free Enrollment', 'Proctored Exam', 'IIT Certification'],
    certification: true,
    languages: ['English'],
    format: 'Online',
    startDate: 'July 2024',
    isPopular: true,
    isNew: false,
    url: 'https://onlinecourses.nptel.ac.in/noc23_cs74/preview'
  },
  {
    id: '4',
    title: 'Google Data Analytics Professional Certificate',
    provider: 'Coursera (Google)',
    category: 'Certification',
    type: 'Paid',
    duration: '6 months',
    level: 'Beginner',
    rating: 4.8,
    enrolledStudents: 2100000,
    price: 1150,
    currency: 'INR',
    description: 'Get ready for a new career in the high-growth field of data analytics, no experience or degree required.',
    skills: ['SQL', 'R Programming', 'Tableau', 'Data Cleaning', 'Spreadsheets'],
    prerequisites: ['None'],
    features: ['Google Career Certificate', 'Applied Capstone Project', 'Resume Support'],
    certification: true,
    languages: ['English'],
    format: 'Online',
    isPopular: true,
    isNew: false,
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics'
  },
  {
    id: '5',
    title: 'Complete A.I. & Machine Learning, Data Science Bootcamp',
    provider: 'Udemy',
    category: 'Technical',
    type: 'Premium',
    duration: '44 hours',
    level: 'Intermediate',
    rating: 4.6,
    enrolledStudents: 250000,
    price: 4500,
    currency: 'INR',
    description: 'Learn Data Science, Data Analysis, Machine Learning (Artificial Intelligence) and Python with Tensorflow, Pandas & more!',
    skills: ['Python', 'TensorFlow', 'Data Science', 'Machine Learning'],
    prerequisites: ['Basic PC Skills'],
    features: ['Downlodable Resources', 'Real world datasets'],
    certification: true,
    languages: ['English'],
    format: 'Online',
    isPopular: false,
    isNew: true,
    url: 'https://www.udemy.com/course/complete-machine-learning-and-data-science-zero-to-mastery/'
  },
  {
    id: '6',
    title: 'Introduction to Internet of Things',
    provider: 'NPTEL (IIT Kharagpur)',
    category: 'Government Scheme',
    type: 'Free',
    duration: '12 weeks',
    level: 'Intermediate',
    rating: 4.4,
    enrolledStudents: 85000,
    description: 'Government backed course that covers basics of IoT, networking protocols, sensor networks, cloud platforms, and security.',
    skills: ['IoT Architecture', 'Sensors', 'Arduino', 'Raspberry Pi'],
    prerequisites: ['Basic Programming', 'Basic Electronics'],
    features: ['Assignments', 'Video Transcripts', 'Swayam Credit Equivalent'],
    certification: true,
    languages: ['English'],
    format: 'Online',
    startDate: 'January 2025',
    isPopular: false,
    isNew: false,
    url: 'https://onlinecourses.nptel.ac.in/noc24_cs14/preview'
  },
  {
    id: '7',
    title: 'The Ultimate Drawing Course - Beginner to Advanced',
    provider: 'Udemy',
    category: 'Creative',
    type: 'Paid',
    duration: '26 hours',
    level: 'Beginner',
    rating: 4.6,
    enrolledStudents: 550000,
    price: 3499,
    currency: 'INR',
    description: 'Learn the #1 most important building block of all art. Draw confidently from your imagination.',
    skills: ['Drawing Techniques', 'Perspective', 'Shading', 'Figure Drawing'],
    prerequisites: ['Pencil and Paper'],
    features: ['51 Articles', 'Step-by-step guides', 'Lifetime Access'],
    certification: true,
    languages: ['English'],
    format: 'Online',
    isPopular: true,
    isNew: false,
    url: 'https://www.udemy.com/course/the-ultimate-drawing-course-beginner-to-advanced/'
  },
  {
    id: '8',
    title: 'Soft Skills and Corporate Communication',
    provider: 'NPTEL (IIT Roorkee)',
    category: 'Soft Skills',
    type: 'Free',
    duration: '8 weeks',
    level: 'Beginner',
    rating: 4.3,
    enrolledStudents: 45000,
    description: 'Learn effective communication, presentation skills, body language, and interviewing techniques to succeed in the corporate world.',
    skills: ['Public Speaking', 'Interview Prep', 'Body Language', 'Business Etiquette'],
    prerequisites: ['None'],
    features: ['Free Video Lectures', 'Self-Assessment', 'IIT Certification Exam'],
    certification: true,
    languages: ['English'],
    format: 'Online',
    isPopular: false,
    isNew: true,
    url: 'https://onlinecourses.nptel.ac.in/noc24_hs12/preview'
  },
  {
    id: '9',
    title: 'Meta Front-End Developer Professional Certificate',
    provider: 'Coursera (Meta)',
    category: 'Certification',
    type: 'Paid',
    duration: '7 months',
    level: 'Beginner',
    rating: 4.7,
    enrolledStudents: 340000,
    price: 1150,
    currency: 'INR',
    description: 'Launch your career as a front-end developer. Build job-ready skills for an in-demand career and earn a credential from Meta.',
    skills: ['React', 'CSS', 'HTML', 'UI/UX Design', 'Version Control'],
    prerequisites: ['None'],
    features: ['Meta Credential', 'Portfolio Building', 'Interview Prep'],
    certification: true,
    languages: ['English'],
    format: 'Online',
    isPopular: true,
    isNew: false,
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer'
  },
  {
    id: '10',
    title: 'English for Career Development',
    provider: 'Coursera (Univ. of Pennsylvania)',
    category: 'Language',
    type: 'Free',
    duration: '40 hours',
    level: 'Intermediate',
    rating: 4.8,
    enrolledStudents: 2100000,
    description: 'This course is designed for non-native English speakers who are interested in advancing their careers in the global marketplace.',
    skills: ['Resume Writing', 'Interview English', 'Networking', 'Professional Email Writing'],
    prerequisites: ['Basic English Understanding'],
    features: ['Funded by US Dept of State', 'Peer Reviews', 'Reading Materials'],
    certification: true,
    languages: ['English', 'Spanish', 'French'],
    format: 'Online',
    isPopular: true,
    isNew: false,
    url: 'https://www.coursera.org/learn/careerdevelopment'
  }
];

export function SkillDevelopment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      const matchesType = typeFilter === 'all' || course.type === typeFilter;
      const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
      const matchesFormat = formatFilter === 'all' || course.format === formatFilter;
      
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'free' && (course.type === 'Free' || course.type === 'Government')) ||
        (activeTab === 'popular' && course.isPopular) ||
        (activeTab === 'new' && course.isNew) ||
        (activeTab === 'government' && course.type === 'Government');

      return matchesSearch && matchesCategory && matchesType && matchesLevel && matchesFormat && matchesTab;
    });
  }, [searchTerm, categoryFilter, typeFilter, levelFilter, formatFilter, activeTab]);

  const getPriceDisplay = (course: Course) => {
    if (course.type === 'Free' || course.type === 'Government') return 'Free';
    if (!course.price) return 'Contact for pricing';
    const symbol = course.currency === 'INR' ? '₹' : '$';
    return `${symbol}${course.price.toLocaleString()}`;
  };

  if (selectedCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedCourse(null)}
            className="mb-4"
          >
            ← Back to Courses
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedCourse.title}</CardTitle>
                    <CardDescription className="text-lg mb-2">{selectedCourse.provider}</CardDescription>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{selectedCourse.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{selectedCourse.enrolledStudents.toLocaleString()} students</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{selectedCourse.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge variant="secondary">{selectedCourse.category}</Badge>
                    <Badge variant="outline">{selectedCourse.level}</Badge>
                    {selectedCourse.isPopular && (
                      <Badge variant="default">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {selectedCourse.isNew && (
                      <Badge variant="destructive">
                        <Zap className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-3">Course Description</h3>
                  <p className="text-muted-foreground">{selectedCourse.description}</p>
                </div>

                <div>
                  <h3 className="mb-3">What You'll Learn</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedCourse.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3">Prerequisites</h3>
                  <div className="space-y-2">
                    {selectedCourse.prerequisites.map((prerequisite, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{prerequisite}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3">Course Features</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedCourse.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3">Available Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.languages.map((language, index) => (
                      <Badge key={index} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold text-primary">
                    {getPriceDisplay(selectedCourse)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg">{selectedCourse.duration}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-lg">{selectedCourse.level}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Format</p>
                  <div className="flex items-center space-x-2">
                    {selectedCourse.format === 'Online' && <Globe className="h-4 w-4" />}
                    {selectedCourse.format === 'Offline' && <BookOpen className="h-4 w-4" />}
                    {selectedCourse.format === 'Hybrid' && <PlayCircle className="h-4 w-4" />}
                    <span>{selectedCourse.format}</span>
                  </div>
                </div>

                {selectedCourse.startDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <p className="text-lg">{selectedCourse.startDate}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Certification</p>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-green-500" />
                    <span>{selectedCourse.certification ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <a href={selectedCourse.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Enroll Now / View Details
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Course Progress</span>
                    <span className="text-sm text-muted-foreground">0%</span>
                  </div>
                  <Progress value={0} className="w-full" />
                  
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium mb-1">📚 Study Regularly</p>
                      <p className="text-muted-foreground">Dedicate consistent time for learning to maximize retention.</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium mb-1">🛠️ Practice Projects</p>
                      <p className="text-muted-foreground">Apply your knowledge through hands-on projects and exercises.</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium mb-1">👥 Join Community</p>
                      <p className="text-muted-foreground">Connect with other learners for support and networking.</p>
                    </div>
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
        <h1 className="mb-2">Skill Development Center</h1>
        <p className="text-muted-foreground">
          Enhance your skills with curated courses, government programs, and professional certifications.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            <BookOpen className="h-4 w-4 mr-2" />
            All Courses
          </TabsTrigger>
          <TabsTrigger value="free">
            <Award className="h-4 w-4 mr-2" />
            Free
          </TabsTrigger>
          <TabsTrigger value="government">
            <Users className="h-4 w-4 mr-2" />
            Government
          </TabsTrigger>
          <TabsTrigger value="popular">
            <TrendingUp className="h-4 w-4 mr-2" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="new">
            <Zap className="h-4 w-4 mr-2" />
            New
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Search & Filter Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, skills, providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Government Scheme">Government</SelectItem>
                    <SelectItem value="Certification">Certification</SelectItem>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={formatFilter} onValueChange={setFormatFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              Found {filteredCourses.length} courses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCourse(course)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        {course.isPopular && (
                          <Badge variant="default" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {course.isNew && (
                          <Badge variant="destructive" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center space-x-4">
                        <span>{course.provider}</span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{course.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Price</span>
                        <p className="font-medium text-primary">{getPriceDisplay(course)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration</span>
                        <p className="font-medium">{course.duration}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Level</span>
                        <p className="font-medium">{course.level}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Format</span>
                        <div className="flex items-center space-x-1">
                          {course.format === 'Online' && <Globe className="h-3 w-3" />}
                          {course.format === 'Offline' && <BookOpen className="h-3 w-3" />}
                          {course.format === 'Hybrid' && <PlayCircle className="h-3 w-3" />}
                          <span className="text-sm">{course.format}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Key Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {course.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {course.enrolledStudents.toLocaleString()} enrolled
                      </span>
                      {course.certification && (
                        <span className="flex items-center text-green-600">
                          <Award className="h-3 w-3 mr-1" />
                          Certificate
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters to find more learning opportunities.
          </p>
        </div>
      )}
    </div>
  );
}