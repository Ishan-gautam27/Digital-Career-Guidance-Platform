import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { AptitudeQuiz } from './components/AptitudeQuiz';
import { CollegeDirectory } from './components/CollegeDirectory';
import { CareerPathways } from './components/CareerPathways';
import { TimelineTracker } from './components/TimelineTracker';
import { StudentDashboard } from './components/StudentDashboard';
import { ChatBot } from './components/ChatBot';
import { FloatingChatButton } from './components/FloatingChatButton';
import { Scholarships } from './components/Scholarships';
import { Jobs } from './components/Jobs';
import { SkillDevelopment } from './components/SkillDevelopment';

type AppSection = 'landing' | 'quiz' | 'colleges' | 'careers' | 'timeline' | 'dashboard' | 'chatbot' | 'scholarships' | 'jobs' | 'skills';

const VALID_SECTIONS: AppSection[] = ['landing', 'quiz', 'colleges', 'careers', 'timeline', 'dashboard', 'chatbot', 'scholarships', 'jobs', 'skills'];

function getInitialAuth(): boolean {
  try {
    const user = localStorage.getItem('user');
    return !!user;
  } catch {
    return false;
  }
}

function getInitialSection(): AppSection {
  try {
    const saved = localStorage.getItem('currentSection') as AppSection;
    if (saved && VALID_SECTIONS.includes(saved)) return saved;
  } catch {}
  return 'landing';
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuth);
  const [currentSection, setCurrentSection] = useState<AppSection>(getInitialSection);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Persist section to localStorage whenever it changes
  const handleNavigate = useCallback((section: AppSection) => {
    setCurrentSection(section);
    try { localStorage.setItem('currentSection', section); } catch {}
  }, []);

  // Also sync on initial mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      try { localStorage.setItem('currentSection', currentSection); } catch {}
    }
  }, []);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleQuizComplete = (results: any) => {
    setUserProfile(results);
    handleNavigate('dashboard');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'quiz':
        return <AptitudeQuiz onComplete={handleQuizComplete} />;
      case 'colleges':
        return <CollegeDirectory />;
      case 'careers':
        return <CareerPathways />;
      case 'timeline':
        return <TimelineTracker />;
      case 'dashboard':
        return <StudentDashboard userProfile={userProfile} onNavigate={handleNavigate} />;
      case 'chatbot':
        return <ChatBot onNavigate={handleNavigate} userProfile={userProfile} />;
      case 'scholarships':
        return <Scholarships />;
      case 'jobs':
        return <Jobs />;
      case 'skills':
        return <SkillDevelopment />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentSection={currentSection} 
        onNavigate={handleNavigate}
        hasProfile={!!userProfile}
        onSignOut={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('currentSection');
          setIsAuthenticated(false);
          setCurrentSection('landing');
        }}
      />
      <main className="pt-16">
        {renderSection()}
      </main>
      <FloatingChatButton 
        onNavigate={handleNavigate}
        currentSection={currentSection}
      />
    </div>
  );
}