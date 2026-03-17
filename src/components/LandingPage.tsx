import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Spline3D } from './Spline3D';
import {
  Brain,
  Building2,
  TrendingUp,
  Calendar,
  Target,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Bot,
  MessageCircle
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (section: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: "Aptitude Assessment",
      description: "Discover your strengths and interests through comprehensive quizzes",
      action: () => onNavigate('quiz')
    },
    {
      icon: Building2,
      title: "College Directory",
      description: "Find nearby government colleges with detailed information and facilities",
      action: () => onNavigate('colleges')
    },
    {
      icon: TrendingUp,
      title: "Career Pathways",
      description: "Explore career opportunities and required qualifications for each field",
      action: () => onNavigate('careers')
    },
    {
      icon: Calendar,
      title: "Timeline Tracker",
      description: "Never miss important admission dates and scholarship deadlines",
      action: () => onNavigate('timeline')
    }
  ];

  const benefits = [
    "Make informed academic decisions",
    "Reduce confusion after Class 10/12",
    "Access reliable career guidance",
    "Discover government college opportunities",
    "Understand long-term career outcomes",
    "Get personalized recommendations"
  ];

  const stats = [
    { number: "1000+", label: "Government Colleges" },
    { number: "50+", label: "Career Paths" },
    { number: "95%", label: "Student Satisfaction" },
    { number: "24/7", label: "Platform Access" }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-4">
                Udaan - Career Guidance Platform
              </Badge>
              <h1 className="mb-6 text-4xl md:text-6xl">
                Your Personalized Career and Education Advisor
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Navigate your educational journey with confidence. Get personalized recommendations 
                for courses, colleges, and career paths based on your interests and aptitude.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
                <Button 
                  size="lg" 
                  onClick={() => onNavigate('chatbot')}
                  className="flex items-center space-x-2"
                >
                  <Bot className="h-5 w-5" />
                  <span>Chat with AI Assistant</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => onNavigate('quiz')}
                >
                  Take Assessment
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50">
                <Spline3D 
                  className="rounded-xl"
                  style={{ height: '450px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="mb-4">Addressing Critical Educational Gaps</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Many students face confusion after Class 10/12 about career choices, 
              leading to poor decisions and reduced enrollment in quality government institutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1565688420536-11a4ddfa246f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGVkdWNhdGlvbiUyMGd1aWRhbmNlJTIwY291bnNlbGluZ3xlbnwxfHx8fDE3NTY5OTk4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Students in educational guidance session"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Comprehensive Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make informed educational and career decisions in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center mb-4">
                      {feature.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={feature.action}
                    >
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Platform Impact</h2>
            <p className="text-muted-foreground">
              Empowering students across the nation with data-driven career guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl md:text-4xl text-primary">
                  {stat.number}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Showcase */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Meet Your AI Career Guidance Assistant</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get instant, personalized advice about careers, colleges, and educational planning from our intelligent chatbot.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Spline3D 
                        className="w-full"
                        style={{ height: '400px' }}
                      />
                      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
                        <Badge variant="secondary" className="text-xs flex items-center space-x-1">
                          <Bot className="h-3 w-3" />
                          <span>AI Powered</span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="mb-2">24/7 Instant Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Get immediate answers to your career and education questions anytime, anywhere.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Target className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="mb-2">Personalized Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive tailored advice based on your interests, strengths, and career goals.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Brain className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="mb-2">Smart Guidance</h3>
                      <p className="text-sm text-muted-foreground">
                        Navigate complex educational decisions with AI-powered insights and analysis.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  onClick={() => onNavigate('chatbot')}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Bot className="h-5 w-5" />
                  <span>Start Chatting Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Bot className="h-12 w-12 text-primary-foreground" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-primary"></div>
            </div>
          </div>
          <h2 className="mb-4 text-white">Ready to Shape Your Future?</h2>
          <p className="mb-8 text-primary-foreground/90">
            Start your personalized career guidance journey today. Chat with our AI assistant 
            for instant advice, take assessments, explore colleges, and plan your educational path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => onNavigate('chatbot')}
              className="flex items-center space-x-2"
            >
              <Bot className="h-5 w-5" />
              <span>Chat with AI Assistant</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('quiz')}
              className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Target className="h-5 w-5 mr-2" />
              <span>Take Assessment</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}