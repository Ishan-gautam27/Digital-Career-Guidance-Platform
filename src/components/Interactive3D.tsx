import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Spline3D } from './Spline3D';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  Info,
  Play,
  Pause
} from 'lucide-react';

interface Interactive3DProps {
  onNavigate?: (section: string) => void;
}

export function Interactive3D({ onNavigate }: Interactive3DProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const features = [
    {
      title: "Immersive Experience",
      description: "Explore educational pathways in an interactive 3D environment",
      icon: "🎯"
    },
    {
      title: "Visual Learning",
      description: "Complex career paths visualized through engaging 3D models",
      icon: "🧠"
    },
    {
      title: "Interactive Elements",
      description: "Click and explore different aspects of your educational journey",
      icon: "🚀"
    },
    {
      title: "Real-time Feedback",
      description: "Get instant visual feedback on your choices and preferences",
      icon: "⚡"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Interactive 3D Experience</h1>
        <p className="text-muted-foreground">
          Explore your educational journey through our immersive 3D visualization platform.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main 3D Viewer */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>3D Career Exploration</span>
                    <Badge variant="secondary">Interactive</Badge>
                  </CardTitle>
                  <CardDescription>
                    Navigate through different career paths and educational opportunities
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
                <Spline3D 
                  className="rounded-b-lg"
                  style={{ 
                    height: isFullscreen ? '100vh' : '600px',
                    borderRadius: isFullscreen ? '0' : undefined
                  }}
                />
                {isFullscreen && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() => setIsFullscreen(false)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Interactive Mode Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                How to Interact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium mb-1">🖱️ Mouse Controls</p>
                <p className="text-muted-foreground">Click and drag to rotate the view</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium mb-1">🔍 Zoom</p>
                <p className="text-muted-foreground">Scroll to zoom in and out</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium mb-1">👆 Touch</p>
                <p className="text-muted-foreground">Tap and explore different elements</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{feature.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => onNavigate?.('quiz')}
              >
                Take Assessment
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => onNavigate?.('colleges')}
              >
                Find Colleges
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => onNavigate?.('careers')}
              >
                Explore Careers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>About This Experience</CardTitle>
            <CardDescription>
              Our 3D visualization represents the interconnected nature of educational choices and career paths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="mb-3">Educational Journey Mapping</h3>
                <p className="text-sm text-muted-foreground">
                  The 3D environment visualizes how different subjects, streams, and career choices 
                  are interconnected, helping you understand the pathways between your current 
                  education and future career goals.
                </p>
              </div>
              <div>
                <h3 className="mb-3">Interactive Exploration</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate through the 3D space to discover new connections between fields of study, 
                  government colleges, and career opportunities that you might not have considered before.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}