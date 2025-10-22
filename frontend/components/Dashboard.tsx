import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import { useSoundFeedback } from "./SoundFeedback";
import { 
  Activity, Target, TrendingUp, Zap, Sparkles, Brain, Play, Calendar, Clock, Award, 
  Flame, Users, Dumbbell, Trophy, Star, ChevronRight, Droplets, Moon, Apple, 
  Heart, MapPin, Timer, BookOpen, MessageSquare, Settings, CheckCircle2
} from "lucide-react";
import { PlanGenerator } from "./PlanGenerator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { db, UserStats, Achievement, Goal } from "./DatabaseService";

interface RecommendationProps {
  title: string;
  description: string;
  confidence: number;
  type: "workout" | "nutrition" | "recovery";
}

interface DashboardProps {
  userData: { name: string; email: string } | null;
  onTabChange?: (tab: string) => void;
}

// Animated Counter Component (simplified - no jumping)
const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      setCount(value);
      return;
    }
    
    hasAnimated.current = true;
    let startValue = 0;
    const startTime = Date.now();
    const endValue = value;
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * endValue);
      
      if (progress < 1) {
        setCount(currentCount);
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [value, duration]);

  return <span className="tabular-nums">{count.toLocaleString()}</span>;
};

const Recommendation = ({ title, description, confidence, type }: RecommendationProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "workout": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "nutrition": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "recovery": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-gray-800/60 to-gray-900/80 border-purple-500/30 backdrop-blur-sm">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <Badge className={`${getTypeColor(type)} border flex-shrink-0`}>{type}</Badge>
          <span className="text-sm text-gray-400 whitespace-nowrap">{confidence}% confidence</span>
        </div>
        <h4 className="mb-2 text-white break-words leading-tight">{title}</h4>
        <p className="text-sm text-gray-300 mb-3 break-words leading-relaxed">{description}</p>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export function Dashboard({ userData, onTabChange }: DashboardProps) {
  const { playClick, playSuccess } = useSoundFeedback();
  const [currentRecommendation, setCurrentRecommendation] = useState(0);
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  // Reduce loading time for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced user stats with gamification - loaded from database
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load data from database
  useEffect(() => {
    const stats = db.getUserStats();
    setUserStats(stats);
    
    const userAchievements = db.getAchievements();
    setAchievements(userAchievements);
    
    const userGoals = db.getGoals();
    setGoals(userGoals);
  }, []);

  // Today's comprehensive data
  const [todayData] = useState({
    calories: { current: 1420, target: 2200 },
    steps: { current: 8542, target: 10000 },
    water: { current: 6, target: 8 },
    sleep: { current: 7.5, target: 8 },
    workouts: { completed: 1, planned: 1 },
    mood: "Great",
    energy: 85
  });

  // Weekly goals and achievements
  const [weeklyGoals] = useState({
    workouts: { current: 4, target: 5, percentage: 80 },
    activeMinutes: { current: 180, target: 300, percentage: 60 },
    caloriesBurned: { current: 2840, target: 3500, percentage: 81 },
    hydration: { current: 85, target: 100, percentage: 85 }
  });

  // Icon mapping for achievements
  const achievementIcons: Record<string, any> = {
    '🎯': Target,
    '💪': Dumbbell,
    '👑': Trophy,
    '🔥': Flame,
    '⚡': Zap,
    '🥗': Apple,
    '📊': Activity,
    '⭐': Star,
    '💎': Award,
  };

  // Today's workout plan
  const todaysWorkout = {
    name: "Upper Body Strength",
    duration: "45 min",
    exercises: 6,
    completed: false,
    difficulty: "Intermediate",
    calories: 320,
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMGV4ZXJjaXNlfGVufDF8fHx8MTc1ODgyMjAyMHww&ixlib=rb-4.1.0&q=80&w=1080"
  };

  // Today's meal plan
  const [mealPlan] = useState([
    { 
      name: "Greek Yogurt Bowl", 
      type: "Breakfast", 
      calories: 320, 
      protein: 25, 
      time: "8:00 AM",
      image: "https://images.unsplash.com/photo-1670164747721-d3500ef757a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMG51dHJpdGlvbnxlbnwxfHx8fDE3NTg3NzIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "completed"
    },
    { 
      name: "Quinoa Power Salad", 
      type: "Lunch", 
      calories: 450, 
      protein: 18, 
      time: "12:30 PM",
      image: "https://images.unsplash.com/photo-1670164747721-d3500ef757a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMG51dHJpdGlvbnxlbnwxfHx8fDE3NTg3NzIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "pending"
    },
    { 
      name: "Grilled Salmon & Veggies", 
      type: "Dinner", 
      calories: 380, 
      protein: 35, 
      time: "7:00 PM",
      image: "https://images.unsplash.com/photo-1670164747721-d3500ef757a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMG51dHJpdGlvbnxlbnwxfHx8fDE3NTg3NzIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "pending"
    }
  ]);

  // Recent activity feed
  const [recentActivity] = useState([
    { type: "workout", name: "Morning Run", time: "2 hours ago", calories: 280, icon: Activity },
    { type: "meal", name: "Greek Yogurt Bowl", time: "4 hours ago", calories: 320, icon: Apple },
    { type: "achievement", name: "Earned 'Consistency King'", time: "1 day ago", xp: 150, icon: Trophy },
    { type: "social", name: "Sarah liked your workout", time: "3 hours ago", icon: Heart },
    { type: "goal", name: "Weekly goal 80% complete", time: "1 day ago", icon: Target }
  ]);

  // AI recommendations with enhanced data
  const recommendations = [
    {
      title: "Increase Protein Intake",
      description: "Based on your workout intensity, consider adding 25g more protein to optimize muscle recovery and growth.",
      confidence: 92,
      type: "nutrition" as const,
      action: "Add protein shake post-workout"
    },
    {
      title: "Add Cardio Session",
      description: "Your AI algorithm suggests 20 minutes of moderate cardio to improve cardiovascular health and fat burn.",
      confidence: 88,
      type: "workout" as const,
      action: "Schedule HIIT session tomorrow"
    },
    {
      title: "Rest Day Recommended",
      description: "Your training load indicates you need recovery. Take a rest day or try light stretching and mobility work.",
      confidence: 85,
      type: "recovery" as const,
      action: "Book massage or yoga class"
    },
    {
      title: "Optimize Sleep Schedule",
      description: "Your recovery data suggests adjusting bedtime by 30 minutes earlier for better performance and recovery.",
      confidence: 90,
      type: "recovery" as const,
      action: "Set bedtime reminder for 10 PM"
    }
  ];

  const firstName = userData?.name.split(' ')[0] || 'Champion';

  // Auto-scroll recommendations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRecommendation((prev) => (prev + 1) % recommendations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [recommendations.length]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "text-gray-400 border-gray-500";
      case "Rare": return "text-blue-400 border-blue-500";
      case "Epic": return "text-purple-400 border-purple-500";
      case "Legendary": return "text-yellow-400 border-yellow-500";
      default: return "text-gray-400 border-gray-500";
    }
  };

  const handleWorkoutStart = () => {
    toast.success("Workout Started!", {
      description: "Let's crush this Upper Body session! 💪",
      duration: 3000,
    });
    onTabChange?.("workouts");
  };

  const handleMealLog = () => {
    playSuccess(); // 🎵 Play success sound
    toast.success("Meal Logged Successfully!", {
      description: "Great nutrition choice! Keep it up! 🥗",
      duration: 3000,
    });
  };

  const handlePlanGenerate = () => {
    playClick(); // 🎵 Play click sound
    setShowPlanGenerator(true);
    toast.info("Opening AI Plan Generator", {
      description: "Preparing your personalized fitness plan...",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* 👋 Welcome Back Banner */}
      {showWelcomeBanner && (
        <div className="p-4 bg-gradient-brand/30 border-l-4 border-purple-500 rounded-xl animate-slideDown backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👋</span>
            <div>
              <p className="text-white font-medium">
                Welcome back, {userData?.name || 'Champion'}!
              </p>
              <p className="text-sm text-gray-300">
                Ready to crush your fitness goals today? Let's get started!
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWelcomeBanner(false)}
            className="text-white hover:bg-white/10 text-[11px]"
          >
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Welcome Section with XP Progress */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Level 23
            </Badge>
          </div>
          <p className="text-gray-300 text-lg mb-4">Welcome back, Fitness Champion! Ready to crush your goals? 🎯</p>
          
          {/* XP Progress Bar with Animation */}
          {userStats && (
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md bg-[rgba(167,45,204,0)]">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Level {userStats.level}</span>
                  <span className="text-purple-400">
                    <AnimatedCounter value={userStats.xp} />/{userStats.level * 1000} XP
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={(userStats.xp % 1000) / 10} 
                    className="h-3 bg-gray-700"
                  />
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                {(userStats.level * 1000) - userStats.xp} XP to Level {userStats.level + 1}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Simplified Stats Grid - Only Essential Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Workouts */}
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm mb-2">💪 Total Workouts</p>
                <p className="text-4xl font-bold text-white">
                  <AnimatedCounter value={userStats?.totalWorkouts || 147} />
                </p>
                <p className="text-xs text-blue-300 mt-1">Keep pushing!</p>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-2xl">
                <Dumbbell className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day Streak */}
        <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/10 border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm mb-2">🔥 Day Streak</p>
                <p className="text-4xl font-bold text-white">
                  <AnimatedCounter value={userStats?.streak || 28} />
                </p>
                <p className="text-xs text-orange-300 mt-1">days strong!</p>
              </div>
              <div className="p-4 bg-orange-500/20 rounded-2xl">
                <Flame className="w-8 h-8 text-orange-300" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    i < (userStats?.streak || 28) % 7 ? 'bg-orange-500 shadow-lg shadow-orange-500/50' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calories Burned */}
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm mb-2">⚡ Calories Burned</p>
                <p className="text-4xl font-bold text-white">
                  <AnimatedCounter value={Math.round((userStats?.caloriesBurned || 0) / 1000)} />K
                </p>
                <p className="text-xs text-green-300 mt-1">total energy!</p>
              </div>
              <div className="p-4 bg-green-500/20 rounded-2xl">
                <Zap className="w-8 h-8 text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Pattern Recognition - Prominent Display */}
      <Card className="bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-pink-500/10 border-purple-500/40 backdrop-blur-sm shadow-xl hover:shadow-purple-500/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
            AI Pattern Recognition
            <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
              Live Analysis
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-300">Real-time insights from your fitness data</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((rec, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl glass-strong border-l-4 border-purple-500 hover:scale-102 transition-transform duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium flex-1">{rec.title}</h4>
                  <Badge variant="outline" className="text-purple-300 border-purple-500/50 text-xs ml-2">
                    {rec.confidence}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 mb-3 leading-relaxed">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">💡 {rec.action}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 h-8 text-xs"
                    onClick={() => {
                      playClick();
                      toast.success("Action noted!", { description: rec.action });
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons with Enhanced Styling */}
      <div className="flex flex-wrap justify-center gap-4 animate-fadeIn">
        <Button 
          onClick={handlePlanGenerate}
          className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 px-6 py-2.5 button-interactive"
        >
          <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
          Generate New Plan
        </Button>
        <Button 
          onClick={() => onTabChange?.("ai-chat")}
          variant="outline"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-2.5 button-interactive"
        >
          <Zap className="w-4 h-4 mr-2" />
          Get AI Coaching
        </Button>
        <Button 
          onClick={() => onTabChange?.("progress")}
          variant="outline"
          className="border-green-500/30 text-green-300 hover:bg-green-500/20 hover:text-white shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-2.5 button-interactive"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Progress
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-strong">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">Overview</TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">Achievements</TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">Weekly Goals</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">Activity Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Workout Card */}
            <Card className="glass-strong hover:shadow-xl transition-all duration-300 overflow-hidden group card-3d animate-scaleIn stagger-1 opacity-0">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback 
                  src={todaysWorkout.image} 
                  alt="Today's Workout" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 backdrop-blur-sm">Today's Plan</Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">{todaysWorkout.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {todaysWorkout.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {todaysWorkout.exercises} exercises
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {todaysWorkout.calories} cal
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="pt-4">
                <Button 
                  onClick={handleWorkoutStart}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group button-interactive"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Start Workout
                </Button>
              </CardContent>
            </Card>

            {/* Today's Meals */}
            <Card className="glass-strong hover:shadow-xl transition-all duration-300 animate-scaleIn stagger-2 opacity-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Apple className="w-5 h-5 text-green-400" />
                  Today's Meals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mealPlan.map((meal, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <ImageWithFallback 
                        src={meal.image} 
                        alt={meal.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{meal.name}</h4>
                      <p className="text-xs text-gray-400">{meal.type} • {meal.calories} cal • {meal.protein}g protein</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full transition-all ${
                      meal.status === 'completed' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                    }`} />
                  </div>
                ))}
                <Button 
                  onClick={handleMealLog}
                  variant="outline" 
                  className="w-full border-green-500/30 text-green-300 hover:bg-green-500/20 hover:text-white transition-all duration-300 mt-4 button-interactive"
                >
                  <Apple className="w-4 h-4 mr-2" />
                  Log Meal
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats & Insights */}
            <Card className="glass-strong hover:shadow-xl transition-all duration-300 animate-scaleIn stagger-3 opacity-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300">
                    <span className="text-blue-300">Energy Level</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                          style={{width: `${todayData.energy}%`}}
                        />
                      </div>
                      <span className="text-blue-400 font-medium">{todayData.energy}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all duration-300">
                    <span className="text-green-300">Sleep Quality</span>
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">{todayData.sleep.current}h</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all duration-300">
                    <span className="text-yellow-300">Mood</span>
                    <span className="text-yellow-400 font-medium">{todayData.mood}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => onTabChange?.("ai-chat")}
                  variant="outline" 
                  className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all duration-300 button-interactive"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI Coach
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievements Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              🏆 Your Achievement Collection
            </h2>
            <p className="text-gray-400">Earn XP and unlock exclusive badges!</p>
          </div>

          {/* Achievements Grid - Catchy Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {achievements.length > 0 ? achievements.map((achievement, index) => {
              const IconComponent = achievementIcons[achievement.icon] || Trophy;
              return (
                <Card 
                  key={achievement.id}
                  className="glass-strong hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:rotate-1 animate-scaleIn overflow-hidden relative border-yellow-500/50 shadow-yellow-500/30 hover-glow"
                  style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                  onClick={() => {
                    playClick();
                    setSelectedAchievement(achievement);
                    toast.success(achievement.title, {
                      description: achievement.description,
                      duration: 3000,
                    });
                  }}
                >
                  {/* Sparkle Effect for Earned */}
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  </div>
                  
                  <CardContent className="pt-6 relative">
                    <div className="text-center space-y-4">
                      {/* Icon with Glow Effect */}
                      <div className="relative inline-block">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 animate-float shadow-yellow-500/50">
                          <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 animate-pulse blur-xl"></div>
                      </div>
                      
                      {/* Achievement Info */}
                      <div>
                        <h3 className="text-lg font-bold mb-1 text-white">
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                        <Badge 
                          className={`${getRarityColor(achievement.rarity)} text-xs px-2 py-1`}
                          variant="outline"
                        >
                          ✨ {achievement.rarity}
                        </Badge>
                      </div>
                      
                      {/* Achievement Date */}
                      <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                        <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
                        <span className="text-yellow-400 text-sm">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
                <p className="text-gray-400">No achievements yet!</p>
                <p className="text-sm text-gray-500 mt-2">Complete workouts and track meals to earn achievements.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal, index) => (
              <Card key={goal.id} className="glass-strong animate-slideUp hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <span>{goal.icon}</span>
                      {goal.type}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8"
                      onClick={() => {
                        playClick();
                        toast.info("Edit Goal", {
                          description: "Goal editing coming soon!",
                        });
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                  <Badge className={`text-xs ${
                    Math.round((goal.current / goal.target) * 100) >= 80 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  } border`}>
                    {Math.round((goal.current / goal.target) * 100)}% Complete
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-300">
                      <span className="text-sm">Progress</span>
                      <span className="font-medium">
                        <AnimatedCounter value={goal.current} /> / {goal.target}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                      {(goal.current / goal.target) * 100 >= 80 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <Target className="w-3.5 h-3.5" />
                        {goal.target - goal.current} remaining
                      </div>
                      {(goal.current / goal.target) * 100 >= 80 && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Almost there!
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 animate-slideIn"
                    style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                  >
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <activity.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{activity.name}</h4>
                      <p className="text-sm text-gray-400">{activity.time}</p>
                    </div>
                    <div className="text-right">
                      {activity.calories && (
                        <span className="text-orange-400 font-medium">{activity.calories} cal</span>
                      )}
                      {activity.xp && (
                        <span className="text-purple-400 font-medium">+{activity.xp} XP</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Recommendations Carousel */}
      <Card className="glass-strong hover:shadow-xl transition-all duration-300 animate-fadeIn">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
            Personalized Recommendations
          </CardTitle>
          <p className="text-sm text-gray-300">
            AI-powered insights based on your behavior and progress
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden h-40">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 transform ${
                  index === currentRecommendation 
                    ? 'translate-x-0 opacity-100' 
                    : index < currentRecommendation 
                      ? '-translate-x-full opacity-0' 
                      : 'translate-x-full opacity-0'
                }`}
              >
                <Recommendation {...rec} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentRecommendation(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentRecommendation 
                    ? 'bg-purple-500 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`View recommendation ${index + 1}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Generator Dialog */}
      <Dialog open={showPlanGenerator} onOpenChange={setShowPlanGenerator}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-strong animate-scaleIn">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              AI Plan Generator
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Create a personalized fitness and nutrition plan using AI
            </DialogDescription>
          </DialogHeader>
          <PlanGenerator userData={userData} onClose={() => setShowPlanGenerator(false)} />
        </DialogContent>
      </Dialog>

      {/* Achievement Details Dialog */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="glass-strong animate-scaleIn">
          <DialogHeader>
            <DialogTitle className="sr-only">Achievement Details</DialogTitle>
            <DialogDescription className="sr-only">
              View details about your achievement progress and rewards
            </DialogDescription>
          </DialogHeader>
          {selectedAchievement && (
            <div className="text-center space-y-4">
              <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
                selectedAchievement.earned 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 animate-float' 
                  : 'bg-gray-600'
              }`}>
                <selectedAchievement.icon className={`w-12 h-12 ${
                  selectedAchievement.earned ? 'text-white' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedAchievement.name}</h2>
                <p className="text-gray-300 mb-4">{selectedAchievement.description}</p>
                <Badge className={`${getRarityColor(selectedAchievement.rarity)}`} variant="outline">
                  {selectedAchievement.rarity}
                </Badge>
              </div>
              {selectedAchievement.earned ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <Trophy className="w-6 h-6" />
                    <span className="text-lg">+{selectedAchievement.xp} XP Earned</span>
                  </div>
                  <p className="text-sm text-gray-400">Unlocked on {selectedAchievement.date}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-300">Progress: {selectedAchievement.progress}%</p>
                  <Progress value={selectedAchievement.progress} className="h-3" />
                  <p className="text-sm text-gray-400">Keep going! You're {100 - selectedAchievement.progress}% away!</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
