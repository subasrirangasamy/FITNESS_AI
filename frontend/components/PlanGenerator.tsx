import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { 
  Target, 
  Zap, 
  Clock, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  RefreshCw,
  Sparkles,
  Dumbbell,
  Apple,
  Activity
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PlanGeneratorProps {
  userData: { name: string; email: string } | null;
  onClose: () => void;
}

export function PlanGenerator({ userData, onClose }: PlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [generationStep, setGenerationStep] = useState(0);

  const generationSteps = [
    "Analyzing your fitness profile...",
    "Processing your workout history...", 
    "Applying Reinforcement Learning algorithm...",
    "Running Genetic Algorithm optimization...",
    "Personalizing nutrition recommendations...",
    "Finalizing your custom plan..."
  ];

  const generateNewPlan = async () => {
    setIsGenerating(true);
    setGenerationStep(0);
    
    // Simulate AI plan generation with step-by-step progress
    for (let i = 0; i < generationSteps.length; i++) {
      setGenerationStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Generate mock personalized plan
    const newPlan = {
      workoutPlan: {
        name: "Power Build Pro",
        duration: "6 weeks",
        sessionsPerWeek: 4,
        avgSessionTime: "55 min",
        focusAreas: ["Strength", "Muscle Building", "Endurance"],
        confidence: 94,
        exercises: [
          { name: "Compound Deadlifts", sets: "4x6", focus: "Strength" },
          { name: "Bench Press", sets: "4x8", focus: "Chest/Strength" },
          { name: "Squats", sets: "4x10", focus: "Legs/Power" },
          { name: "Pull-ups", sets: "3x12", focus: "Back/Endurance" },
          { name: "Shoulder Press", sets: "3x10", focus: "Shoulders" }
        ]
      },
      nutritionPlan: {
        dailyCalories: 2400,
        protein: 180,
        carbs: 220,
        fat: 85,
        meals: 5,
        hydration: "3.5L",
        confidence: 91,
        recommendations: [
          "Pre-workout: Banana + Coffee",
          "Post-workout: Protein shake + Greek yogurt", 
          "Focus on lean proteins and complex carbs",
          "Include omega-3 rich foods"
        ]
      },
      adaptations: {
        basedOn: [
          "Your 12-day streak performance", 
          "Intermediate fitness level",
          "Morning workout preference",
          "Previous strength gains"
        ],
        aiInsights: [
          "Your consistency shows readiness for progressive overload",
          "Morning sessions show 15% better completion rates",
          "Strength-focused goals align with your progress patterns"
        ]
      }
    };
    
    setGeneratedPlan(newPlan);
    setIsGenerating(false);
    toast.success("New personalized plan generated!");
  };

  const acceptPlan = () => {
    toast.success("New plan activated! Check your Workouts and Nutrition tabs.");
    onClose();
  };

  if (!generatedPlan && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
              Generate New AI Plan
            </h2>
            <p className="text-gray-300">
              Our hybrid RL + GA algorithm will create a personalized workout and nutrition plan based on your progress, preferences, and goals.
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              What Makes Your Plan Unique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Reinforcement Learning</span>
                </div>
                <p className="text-xs text-gray-400">
                  Learns from your workout completion patterns and adapts difficulty
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Genetic Algorithm</span>
                </div>
                <p className="text-xs text-gray-400">
                  Evolves optimal exercise combinations for maximum results
                </p>
              </div>
            </div>
            <Separator className="bg-gray-700/50" />
            <div className="space-y-2">
              <h4 className="text-white text-sm">Your Current Data Points:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">12-day streak</Badge>
                <Badge variant="outline" className="text-xs">4/5 weekly workouts</Badge>
                <Badge variant="outline" className="text-xs">38min avg duration</Badge>
                <Badge variant="outline" className="text-xs">Morning preference</Badge>
                <Badge variant="outline" className="text-xs">Intermediate level</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800/50"
          >
            Cancel
          </Button>
          <Button 
            onClick={generateNewPlan}
            className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate My Plan
          </Button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
              Generating Your Plan
            </h2>
            <p className="text-gray-300">
              {generationSteps[generationStep]}
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Progress value={(generationStep + 1) / generationSteps.length * 100} className="h-2" />
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  {Math.round((generationStep + 1) / generationSteps.length * 100)}% Complete
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
            Your Personalized Plan is Ready!
          </h2>
          <p className="text-gray-300">
            AI confidence: {generatedPlan.workoutPlan.confidence}% (Workout) | {generatedPlan.nutritionPlan.confidence}% (Nutrition)
          </p>
        </div>
      </div>

      {/* Workout Plan */}
      <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-blue-400" />
            {generatedPlan.workoutPlan.name}
          </CardTitle>
          <div className="flex gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {generatedPlan.workoutPlan.duration}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {generatedPlan.workoutPlan.avgSessionTime}
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {generatedPlan.workoutPlan.sessionsPerWeek}x/week
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-white text-sm mb-2">Focus Areas:</h4>
            <div className="flex flex-wrap gap-2">
              {generatedPlan.workoutPlan.focusAreas.map((area: string, index: number) => (
                <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-500/30">{area}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm mb-2">Key Exercises:</h4>
            <div className="space-y-2">
              {generatedPlan.workoutPlan.exercises.slice(0, 3).map((exercise: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{exercise.name}</span>
                  <span className="text-blue-400">{exercise.sets}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Plan */}
      <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Apple className="w-5 h-5 text-green-400" />
            Nutrition Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl text-white">{generatedPlan.nutritionPlan.dailyCalories}</p>
              <p className="text-xs text-gray-400">Calories</p>
            </div>
            <div>
              <p className="text-2xl text-white">{generatedPlan.nutritionPlan.protein}g</p>
              <p className="text-xs text-gray-400">Protein</p>
            </div>
            <div>
              <p className="text-2xl text-white">{generatedPlan.nutritionPlan.carbs}g</p>
              <p className="text-xs text-gray-400">Carbs</p>
            </div>
            <div>
              <p className="text-2xl text-white">{generatedPlan.nutritionPlan.fat}g</p>
              <p className="text-xs text-gray-400">Fat</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Insights & Adaptations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-white text-sm mb-2">Based on:</h4>
            <div className="space-y-1">
              {generatedPlan.adaptations.basedOn.map((item: string, index: number) => (
                <p key={index} className="text-xs text-gray-300 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm mb-2">Key Insights:</h4>
            <div className="space-y-1">
              {generatedPlan.adaptations.aiInsights.map((insight: string, index: number) => (
                <p key={index} className="text-xs text-gray-300 flex items-start gap-2">
                  <Zap className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                  {insight}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          onClick={generateNewPlan}
          variant="outline" 
          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800/50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Another
        </Button>
        <Button 
          onClick={acceptPlan}
          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Activate This Plan
        </Button>
      </div>
    </div>
  );
}