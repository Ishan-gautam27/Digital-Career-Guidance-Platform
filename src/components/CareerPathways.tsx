import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  BookOpen,
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  Award,
  ArrowRight,
  Building,
  Stethoscope,
  Calculator,
  Palette,
  Code,
  Users,
  Globe,
  Wrench
} from 'lucide-react';

interface CareerPath {
  id: string;
  title: string;
  stream: 'science' | 'commerce' | 'arts' | 'vocational';
  degree: string;
  description: string;
  icon: any;
  salaryRange: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  jobs: string[];
  skills: string[];
  exams: string[];
  higherStudies: string[];
  sectors: string[];
}

const careerPaths: CareerPath[] = [
  {
    id: '1',
    title: 'Engineering & Technology',
    stream: 'science',
    degree: 'B.Tech/B.E.',
    description: 'Design, develop, and innovate technological solutions for real-world problems',
    icon: Code,
    salaryRange: '₹3-15 LPA',
    duration: '4 years',
    difficulty: 'Hard',
    jobs: ['Software Engineer', 'Mechanical Engineer', 'Civil Engineer', 'Electronics Engineer'],
    skills: ['Problem Solving', 'Mathematics', 'Programming', 'Design Thinking'],
    exams: ['JEE Main', 'JEE Advanced', 'State CET', 'BITSAT'],
    higherStudies: ['M.Tech', 'MBA', 'MS abroad', 'PhD'],
    sectors: ['IT', 'Manufacturing', 'Construction', 'Automotive', 'Aerospace']
  },
  {
    id: '2',
    title: 'Medical & Healthcare',
    stream: 'science',
    degree: 'MBBS/BDS/BAMS',
    description: 'Provide healthcare services and medical treatment to improve lives',
    icon: Stethoscope,
    salaryRange: '₹4-20 LPA',
    duration: '4-5.5 years',
    difficulty: 'Hard',
    jobs: ['Doctor', 'Surgeon', 'Dentist', 'Physiotherapist', 'Pharmacist'],
    skills: ['Biology', 'Chemistry', 'Empathy', 'Critical Thinking'],
    exams: ['NEET UG', 'AIIMS', 'JIPMER', 'State NEET'],
    higherStudies: ['MD/MS', 'MDS', 'PhD', 'Fellowship'],
    sectors: ['Hospitals', 'Clinics', 'Pharmaceuticals', 'Research', 'Public Health']
  },
  {
    id: '3',
    title: 'Business & Management',
    stream: 'commerce',
    degree: 'B.Com/BBA/BBM',
    description: 'Lead organizations, manage resources, and drive business growth',
    icon: Briefcase,
    salaryRange: '₹2.5-12 LPA',
    duration: '3 years',
    difficulty: 'Medium',
    jobs: ['Business Analyst', 'Marketing Manager', 'HR Manager', 'Operations Manager'],
    skills: ['Leadership', 'Communication', 'Analysis', 'Strategy'],
    exams: ['CUET', 'DU JAT', 'IPU CET', 'State Entrance'],
    higherStudies: ['MBA', 'M.Com', 'CA', 'CMA'],
    sectors: ['Banking', 'Consulting', 'FMCG', 'Retail', 'Startups']
  },
  {
    id: '4',
    title: 'Finance & Accounting',
    stream: 'commerce',
    degree: 'B.Com/BBA Finance',
    description: 'Manage financial resources and provide accounting services',
    icon: Calculator,
    salaryRange: '₹2-10 LPA',
    duration: '3 years',
    difficulty: 'Medium',
    jobs: ['Chartered Accountant', 'Financial Analyst', 'Investment Banker', 'Tax Consultant'],
    skills: ['Mathematics', 'Analysis', 'Attention to Detail', 'Ethics'],
    exams: ['CA Foundation', 'CS Executive', 'CMA Foundation'],
    higherStudies: ['CA', 'CS', 'CMA', 'MBA Finance'],
    sectors: ['Banking', 'Insurance', 'Investment', 'Corporate', 'Government']
  },
  {
    id: '5',
    title: 'Arts & Literature',
    stream: 'arts',
    degree: 'B.A. English/Literature',
    description: 'Explore language, literature, and creative expression',
    icon: BookOpen,
    salaryRange: '₹2-8 LPA',
    duration: '3 years',
    difficulty: 'Easy',
    jobs: ['Writer', 'Editor', 'Journalist', 'Content Creator', 'Teacher'],
    skills: ['Writing', 'Critical Thinking', 'Research', 'Communication'],
    exams: ['CUET', 'DU Entrance', 'JMI Entrance', 'BHU UET'],
    higherStudies: ['M.A.', 'M.Phil', 'PhD', 'Journalism Courses'],
    sectors: ['Media', 'Publishing', 'Education', 'Digital Marketing', 'Government']
  },
  {
    id: '6',
    title: 'Design & Creative Arts',
    stream: 'arts',
    degree: 'B.Des/BFA',
    description: 'Create visual solutions and artistic expressions',
    icon: Palette,
    salaryRange: '₹2.5-12 LPA',
    duration: '3-4 years',
    difficulty: 'Medium',
    jobs: ['Graphic Designer', 'UI/UX Designer', 'Fashion Designer', 'Animator'],
    skills: ['Creativity', 'Visual Design', 'Software Skills', 'Innovation'],
    exams: ['NIFT', 'NID', 'CEED', 'UCEED'],
    higherStudies: ['M.Des', 'MFA', 'Specialized Diplomas'],
    sectors: ['Advertising', 'Fashion', 'Gaming', 'Film', 'Digital Media']
  },
  {
    id: '7',
    title: 'Social Sciences',
    stream: 'arts',
    degree: 'B.A. Psychology/Sociology',
    description: 'Study human behavior and social structures',
    icon: Users,
    salaryRange: '₹2-10 LPA',
    duration: '3 years',
    difficulty: 'Medium',
    jobs: ['Psychologist', 'Social Worker', 'HR Specialist', 'Counselor'],
    skills: ['Empathy', 'Research', 'Communication', 'Analysis'],
    exams: ['CUET', 'JMI Entrance', 'Psychology Aptitude'],
    higherStudies: ['M.A.', 'MSW', 'M.Phil', 'PhD'],
    sectors: ['Healthcare', 'NGOs', 'Corporate HR', 'Government', 'Education']
  },
  {
    id: '8',
    title: 'Technical & Vocational',
    stream: 'vocational',
    degree: 'Diploma/Certificate',
    description: 'Develop practical skills for immediate employment',
    icon: Wrench,
    salaryRange: '₹1.5-6 LPA',
    duration: '1-3 years',
    difficulty: 'Easy',
    jobs: ['Technician', 'Mechanic', 'Electrician', 'Computer Operator'],
    skills: ['Practical Skills', 'Problem Solving', 'Technical Knowledge'],
    exams: ['Polytechnic Entrance', 'ITI Admission', 'Skill Tests'],
    higherStudies: ['Advanced Diplomas', 'B.Tech Lateral Entry'],
    sectors: ['Manufacturing', 'Automotive', 'Construction', 'IT Support']
  }
];

export function CareerPathways() {
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);

  const streams = [
    { id: 'all', label: 'All Streams', icon: Globe },
    { id: 'science', label: 'Science', icon: BookOpen },
    { id: 'commerce', label: 'Commerce', icon: TrendingUp },
    { id: 'arts', label: 'Arts', icon: Palette },
    { id: 'vocational', label: 'Vocational', icon: Wrench }
  ];

  const filteredCareers = selectedStream === 'all' 
    ? careerPaths 
    : careerPaths.filter(career => career.stream === selectedStream);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (selectedCareer) {
    const Icon = selectedCareer.icon;
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedCareer(null)}
            className="mb-4"
          >
            ← Back to Career Paths
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedCareer.title}</CardTitle>
                    <CardDescription className="text-lg mt-1">
                      {selectedCareer.degree}
                    </CardDescription>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {selectedCareer.description}
                </p>
              </CardHeader>
              <CardContent>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1640077596538-be70c80c183a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBwbGFubmluZyUyMGZ1dHVyZSUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzU2OTk5ODc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt={selectedCareer.title}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="jobs">Job Roles</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="sectors">Sectors</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="mb-3">Required Skills</h3>
                        <div className="space-y-2">
                          {selectedCareer.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-3">Key Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{selectedCareer.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Difficulty:</span>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${getDifficultyColor(selectedCareer.difficulty)}`} />
                              <span>{selectedCareer.difficulty}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Salary Range:</span>
                            <span>{selectedCareer.salaryRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="jobs" className="space-y-4">
                    <h3>Popular Job Roles</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedCareer.jobs.map((job, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <Briefcase className="h-5 w-5 text-primary" />
                              <span>{job}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="education" className="space-y-6">
                    <div>
                      <h3 className="mb-3">Entrance Exams</h3>
                      <div className="space-y-2">
                        {selectedCareer.exams.map((exam, index) => (
                          <Badge key={index} variant="secondary">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-3">Higher Studies Options</h3>
                      <div className="space-y-2">
                        {selectedCareer.higherStudies.map((study, index) => (
                          <Badge key={index} variant="outline">
                            {study}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sectors" className="space-y-4">
                    <h3>Industry Sectors</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedCareer.sectors.map((sector, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <Building className="h-5 w-5 text-primary" />
                              <span>{sector}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Salary Range</p>
                    <p>{selectedCareer.salaryRange}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p>{selectedCareer.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getDifficultyColor(selectedCareer.difficulty)}`} />
                      <span>{selectedCareer.difficulty}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6">
                  Find Related Colleges
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
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
        <h1 className="mb-2">Career Pathways Explorer</h1>
        <p className="text-muted-foreground">
          Discover career opportunities and understand the path to achieve your goals.
        </p>
      </div>

      {/* Stream Filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter by Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {streams.map((stream) => {
              const Icon = stream.icon;
              return (
                <Button
                  key={stream.id}
                  variant={selectedStream === stream.id ? "default" : "outline"}
                  onClick={() => setSelectedStream(stream.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{stream.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Career Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((career) => {
          const Icon = career.icon;
          return (
            <Card 
              key={career.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCareer(career)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{career.title}</CardTitle>
                    <CardDescription>{career.degree}</CardDescription>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="w-fit capitalize"
                >
                  {career.stream}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {career.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salary:</span>
                    <span>{career.salaryRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{career.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getDifficultyColor(career.difficulty)}`} />
                      <span>{career.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Top Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {career.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}