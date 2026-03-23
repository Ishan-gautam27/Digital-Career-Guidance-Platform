import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  GraduationCap, 
  Brain, 
  Building2, 
  TrendingUp, 
  Calendar, 
  User,
  Menu,
  Bot,
  Award,
  Briefcase,
  BookOpen,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

interface HeaderProps {
  currentSection: string;
  onNavigate: (section: any) => void;
  hasProfile: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSignOut: () => void;
}

export function Header({ currentSection, onNavigate, hasProfile, darkMode, onToggleDarkMode, onSignOut }: HeaderProps) {
  const navItems = [
    { id: 'landing', label: 'Home', icon: GraduationCap },
    { id: 'chatbot', label: 'AI Assistant', icon: Bot },
    { id: 'quiz', label: 'Assessment', icon: Brain },
    { id: 'colleges', label: 'Colleges', icon: Building2 },
    { id: 'careers', label: 'Careers', icon: TrendingUp },
    { id: 'scholarships', label: 'Scholarships', icon: Award },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-semibold">Udaan</h1>
            <p className="text-xs text-muted-foreground">Career Guidance Platform</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentSection === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2">
          {hasProfile && (
            <Badge variant="secondary" className="hidden sm:flex">
              Profile Complete
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:bg-accent"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 transition-transform duration-300 rotate-0" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700 transition-transform duration-300 rotate-0" />
            )}
          </Button>
          <Button
            variant={currentSection === 'dashboard' ? "default" : "outline"}
            size="sm"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="flex items-center space-x-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}