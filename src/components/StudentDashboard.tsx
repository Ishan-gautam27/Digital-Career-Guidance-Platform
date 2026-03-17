import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  User,
  BookOpen,
  TrendingUp,
  Calendar,
  Star,
  CheckCircle,
  Clock,
  Target,
  Award,
  MapPin,
  ArrowRight,
  Bell,
  Settings,
  BarChart3
} from 'lucide-react';

interface StudentDashboardProps {
  userProfile: any;
  onNavigate: (section: string) => void;
}

export function StudentDashboard({ userProfile, onNavigate }: StudentDashboardProps) {
  // Mock data for demonstration
  const mockProfile = {
    name: 'Alex Kumar',
    class: '12th Grade',
    recommendedStream: userProfile?.recommendedStream || 'science',
    completedAssessment: !!userProfile,
    location: 'New Delhi',
    interests: ['Mathematics', 'Physics', 'Technology'],
    profileCompleteness: 75
  };

  const recommendations = [
    {
      id: '1',
      type: 'college',
      title: 'Government Science College',
      description: 'Top-rated college matching your interests',
      location: 'Delhi',
      action: () => onNavigate('colleges')
    },
    {
      id: '2',
      type: 'career',
      title: 'Engineering & Technology',
      description: 'Perfect career path based on your assessment',
      match: '95%',
      action: () => onNavigate('careers')
    },
    {
      id: '3',
      type: 'exam',
      title: 'JEE Main 2025',
      description: 'Important exam for your chosen stream',
      deadline: '2025-01-31',
      action: () => onNavigate('timeline')
    }
  ];

  const recentActivity = [
    {
      id: '1',
      action: 'Completed Aptitude Assessment',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '2',
      action: 'Viewed 5 colleges',
      time: '1 day ago',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      id: '3',
      action: 'Added exam reminders',
      time: '2 days ago',
      icon: Bell,
      color: 'text-yellow-600'
    }
  ];

  const upcomingDeadlines = [
    { title: 'JEE Main Application', days: 15, priority: 'high' },
    { title: 'NEET Registration', days: 25, priority: 'high' },
    { title: 'Scholarship Applications', days: 45, priority: 'medium' }
  ];

  const getStreamInfo = (stream: string) => {
    const streamData = {
      science: { 
        title: 'Science Stream', 
        color: 'bg-blue-500',
        description: 'Engineering, Medical, Research'
      },
      commerce: { 
        title: 'Commerce Stream', 
        color: 'bg-green-500',
        description: 'Business, Finance, Management'
      },
      arts: { 
        title: 'Arts Stream', 
        color: 'bg-purple-500',
        description: 'Literature, Social Sciences, Design'
      },
      vocational: { 
        title: 'Vocational Stream', 
        color: 'bg-orange-500',
        description: 'Technical Skills, Practical Training'
      }
    };
    return streamData[stream as keyof typeof streamData] || streamData.science;
  };

  const streamInfo = getStreamInfo(mockProfile.recommendedStream);

  if (!mockProfile.completedAssessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="mb-4">Complete Your Profile</h1>
          <p className="text-muted-foreground mb-8">
            Take our comprehensive aptitude assessment to get personalized 
            recommendations for your educational journey.
          </p>
          <Button size="lg" onClick={() => onNavigate('quiz')}>
            Start Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Welcome back, {mockProfile.name}!</h1>
            <p className="text-muted-foreground">
              Here's your personalized dashboard with recommendations and updates.
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Profile */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{mockProfile.name}</CardTitle>
              <CardDescription>{mockProfile.class}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Profile Completeness</span>
                    <span className="text-sm">{mockProfile.profileCompleteness}%</span>
                  </div>
                  <Progress value={mockProfile.profileCompleteness} className="h-2" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Recommended Stream</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${streamInfo.color}`} />
                    <span className="text-sm">{streamInfo.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {streamInfo.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Location</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{mockProfile.location}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {mockProfile.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assessment</p>
                    <p className="text-lg">Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Colleges Viewed</p>
                    <p className="text-lg">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Careers Explored</p>
                    <p className="text-lg">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Reminders Set</p>
                    <p className="text-lg">5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personalized Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>
                Based on your assessment and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="border-dashed hover:border-solid transition-all cursor-pointer" onClick={rec.action}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {rec.type}
                          </Badge>
                          {rec.match && (
                            <Badge variant="secondary" className="text-xs">
                              {rec.match} match
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm">{rec.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {rec.description}
                          </p>
                        </div>
                        {rec.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{rec.location}</span>
                          </div>
                        )}
                        {rec.deadline && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Due: {rec.deadline}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                Important dates you shouldn't miss
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        deadline.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm">{deadline.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {deadline.days} days left
                      </span>
                      <Button size="sm" variant="outline" onClick={() => onNavigate('timeline')}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => onNavigate('timeline')}>
                  View All Deadlines
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to help you with your educational journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => onNavigate('colleges')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Explore Colleges</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Find government colleges that match your interests
                  </p>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => onNavigate('careers')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Career Pathways</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Explore career options for your chosen stream
                  </p>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => onNavigate('quiz')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5" />
                    <span>Retake Assessment</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Update your preferences and get new recommendations
                  </p>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => onNavigate('timeline')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell className="h-5 w-5" />
                    <span>Set Reminders</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Never miss important deadlines and dates
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}