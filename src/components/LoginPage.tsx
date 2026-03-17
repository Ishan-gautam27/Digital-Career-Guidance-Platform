import React, { useState } from 'react';
import { Spline3D } from './Spline3D';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import authService from '../services/authService';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login({ email, password });
      } else {
        await authService.register({ name, email, password });
      }
      onLogin(); // Success! Transition up
    } catch (err) {
      setError(authService.handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col lg:flex-row">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-[400px] xl:w-[480px] flex items-center justify-center p-6 lg:p-8 bg-black relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Branding */}
          <div className="space-y-2">
            <h1 className="text-white text-4xl tracking-tight">Udaan</h1>
            <p className="text-gray-400">Your career guidance companion</p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-zinc-700 focus:ring-zinc-700"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-zinc-700 focus:ring-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-zinc-700 focus:ring-zinc-700"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="space-y-4 text-center">
            {isLogin && (
              <button 
                type="button"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            )}
            <div className="text-sm text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                className="text-white hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - 3D Animation */}
      <div className="flex-1 relative bg-black">
        <div className="absolute inset-0">
          <Spline3D 
            url="https://prod.spline.design/J8K6klq4HnqJMVcz/scene.splinecode"
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        
        {/* Liquid Glass Welcome Box */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl"></div>
            
            {/* Glass box */}
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
              <div className="space-y-4 text-center">
                <h2 className="text-white text-5xl xl:text-6xl tracking-tight">
                  Welcome to
                </h2>
                <h1 className="text-white text-7xl xl:text-8xl tracking-tight">
                  Udaan
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
                <p className="text-gray-300 text-lg mt-6">
                  Soar towards your dreams
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}