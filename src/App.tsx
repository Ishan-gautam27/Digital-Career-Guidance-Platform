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
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch { return false; }
  });

  // Apply dark class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try { localStorage.setItem('darkMode', String(darkMode)); } catch {}
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev: boolean) => !prev);
  }, []);

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
    <div className="min-h-screen relative bg-[#f4f7fe] dark:bg-slate-950" style={{ overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{__html: `
        /* ─── Global Animated Background ─── */
        @keyframes float-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(40px, 10px) scale(1.03); }
        }
        @keyframes float-drift-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-40px, 30px) scale(1.08); }
          50% { transform: translate(30px, -30px) scale(0.92); }
          75% { transform: translate(-20px, -40px) scale(1.05); }
        }
        .global-bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          will-change: transform;
        }
        .global-bg-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.08) 60%, transparent 80%);
          top: -100px; left: -120px;
          animation: float-drift 14s ease-in-out infinite;
        }
        .global-bg-orb-2 {
          width: 450px; height: 450px;
          background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(96,165,250,0.06) 60%, transparent 80%);
          top: 25%; right: -100px;
          animation: float-drift-reverse 17s ease-in-out infinite;
        }
        .global-bg-orb-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(192,132,252,0.05) 60%, transparent 80%);
          bottom: 5%; left: 15%;
          animation: float-drift 20s ease-in-out infinite;
          animation-delay: -4s;
        }
        .global-bg-orb-4 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(103,232,249,0.04) 60%, transparent 80%);
          top: 55%; left: -80px;
          animation: float-drift-reverse 16s ease-in-out infinite;
          animation-delay: -7s;
        }
        .global-bg-orb-5 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(244,114,182,0.1) 0%, rgba(251,146,194,0.03) 60%, transparent 80%);
          top: 10%; right: 10%;
          animation: float-drift 18s ease-in-out infinite;
          animation-delay: -2s;
        }
        .global-bg-orb-6 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.03) 60%, transparent 80%);
          bottom: 20%; right: 5%;
          animation: float-drift-reverse 19s ease-in-out infinite;
          animation-delay: -5s;
        }
        .global-bg-mesh {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 50% at 20% 0%, rgba(99,102,241,0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(168,85,247,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 50% 50%, rgba(59,130,246,0.03) 0%, transparent 60%);
        }
        .global-bg-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.025;
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(99,102,241,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,0.5) 1px, transparent 1px);
        }
        /* Dark mode overrides */
        .dark .global-bg-orb-1 { background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%); }
        .dark .global-bg-orb-2 { background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%); }
        .dark .global-bg-orb-3 { background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%); }
        .dark .global-bg-orb-4 { background: radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%); }
        .dark .global-bg-orb-5 { background: radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%); }
        .dark .global-bg-orb-6 { background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%); }
        .dark .global-bg-mesh {
          background:
            radial-gradient(ellipse 80% 50% at 20% 0%, rgba(99,102,241,0.04) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(168,85,247,0.03) 0%, transparent 50%);
        }
        .dark .global-bg-grid { opacity: 0.015; }
      `}} />

      {/* Global Animated Background Elements */}
      <div className="global-bg-mesh" />
      <div className="global-bg-grid" />
      <div className="global-bg-orb global-bg-orb-1" />
      <div className="global-bg-orb global-bg-orb-2" />
      <div className="global-bg-orb global-bg-orb-3" />
      <div className="global-bg-orb global-bg-orb-4" />
      <div className="global-bg-orb global-bg-orb-5" />
      <div className="global-bg-orb global-bg-orb-6" />

      <Header 
        currentSection={currentSection} 
        onNavigate={handleNavigate}
        hasProfile={!!userProfile}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onSignOut={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('currentSection');
          setIsAuthenticated(false);
          setCurrentSection('landing');
        }}
      />
      <main className="pt-16" style={{ position: 'relative', zIndex: 1 }}>
        {renderSection()}
      </main>
      <FloatingChatButton 
        onNavigate={handleNavigate}
        currentSection={currentSection}
      />
    </div>
  );
}