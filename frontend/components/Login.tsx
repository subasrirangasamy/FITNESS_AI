import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Bot, Eye, EyeOff, Mail, Lock, User, Sparkles, Zap, TrendingUp, Target, Star, Shield, Award } from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  onLogin: (userData: { name: string; email: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Welcome to Fitness AI!", {
      description: `Let's start your transformation journey, ${name || email.split('@')[0]}!`,
      duration: 3000,
    });
    setTimeout(() => {
      onLogin({ 
        name: name || email.split('@')[0], 
        email 
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Multiple Floating Orbs with different gradients */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-70" style={{animation: 'float 6s ease-in-out infinite'}}></div>
        <div className="absolute top-40 right-32 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl opacity-60" style={{animation: 'float 8s ease-in-out infinite reverse'}}></div>
        <div className="absolute bottom-32 left-32 w-48 h-48 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl opacity-70" style={{animation: 'float 7s ease-in-out infinite'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2" style={{animation: 'pulse 4s ease-in-out infinite'}}></div>
        
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-indigo-500/3 to-transparent"></div>
        
        {/* Animated Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 197, 253, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 197, 253, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gridMove 20s linear infinite'
          }}
        ></div>
      </div>

      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1693214674477-1159bddf1598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwd29ya291dCUyMGRhcmt8ZW58MXx8fHwxNzU4NDMzODIyfDA&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header - Simplified without robot icon */}
        <div className="text-center mb-8 opacity-0" style={{animation: 'fadeIn 0.8s ease-out forwards'}}>
          <h1 className="text-6xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
            Fitness AI
          </h1>
          <p className="text-xl bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
            Your Personal AI Fitness Coach
          </p>
        </div>

        {/* Enhanced Login Card */}
        <Card className="glass-strong border border-purple-500/30 shadow-2xl ring-1 ring-purple-500/20 overflow-hidden opacity-0 hover-glow card-3d" style={{animation: 'slideUp 0.8s ease-out 0.2s forwards'}}>
          {/* Enhanced Card Header Gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 gradient-animate"></div>
          
          <CardHeader className="text-center pb-4 pt-6">
            <CardTitle className="text-3xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
              {isSignUp ? "Join Fitness AI" : "Welcome Back"}
            </CardTitle>
            <p className="text-gray-300 text-lg">
              {isSignUp 
                ? "Start your AI-powered transformation" 
                : "Continue your fitness journey"
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.4s forwards'}}>
                <Label htmlFor="name" className="text-gray-200 flex items-center gap-2 text-base">
                  <User className="w-5 h-5 text-purple-400" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800/60 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 h-12 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 flex items-center gap-2 text-base">
                  <Mail className="w-5 h-5 text-blue-400" />
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800/60 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 pl-12 transition-all duration-300 h-12 text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200 flex items-center gap-2 text-base">
                  <Lock className="w-5 h-5 text-green-400" />
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800/60 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-500/30 pl-12 pr-12 transition-all duration-300 h-12 text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-gray-600 bg-gray-800/50 text-purple-600 focus:ring-purple-500/30 focus:ring-2"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-300">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto">
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] h-12 text-base button-interactive gradient-animate"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="bg-gradient-to-r from-gray-600/50 via-purple-500/50 to-gray-600/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-4 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-800/40 border-purple-500/30 text-gray-200 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 h-12 button-interactive hover:scale-105"
                  onClick={() => {
                    toast.success("Google Sign-In Initiated", {
                      description: "Redirecting to Google authentication...",
                      duration: 2000,
                    });
                    // In production, this would redirect to Google OAuth
                    setTimeout(() => {
                      onLogin({ 
                        name: "Demo User", 
                        email: "demo@gmail.com" 
                      });
                    }, 1500);
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-300">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-400 hover:text-purple-300 ml-1 p-0 h-auto"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>



        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 opacity-0" style={{animation: 'fadeInUp 0.8s ease-out 0.8s forwards'}}>
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-2">© 2024 Fitness AI. Advanced Machine Learning Technology.</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
    </div>
  );
}