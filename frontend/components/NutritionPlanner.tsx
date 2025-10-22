import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Apple,
  Plus,
  Search,
  Camera,
  Utensils,
  TrendingUp,
  Target,
  Clock,
  Flame,
  Droplets,
  Calculator,
  Sparkles,
  Star,
  Heart,
  Share2,
  BookOpen,
  ChefHat,
  ShoppingCart,
  Zap,
  Award,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { db } from "./DatabaseService";

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
  servingUnit: string;
  image?: string;
  barcode?: string;
  category: string;
  isVerified?: boolean;
}

interface MealEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  timestamp: Date;
  notes?: string;
}

interface MealPlan {
  id: string;
  name: string;
  description: string;
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: number;
  image?: string;
  rating?: number;
  servings: number;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  image?: string;
  rating?: number;
  reviews?: number;
}

export function NutritionPlanner() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [showRecipe, setShowRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [mealNotes, setMealNotes] = useState("");

  // User nutrition goals
  const [nutritionGoals] = useState<NutritionGoals>({
    calories: 2200,
    protein: 150,
    carbs: 250,
    fat: 75,
    fiber: 30,
    water: 8
  });

  // Today's intake
  const [todayIntake, setTodayIntake] = useState({
    calories: 1650,
    protein: 110,
    carbs: 180,
    fat: 55,
    fiber: 22,
    water: 6
  });

  // Sample meal entries for today
  const [mealEntries] = useState<MealEntry[]>([
    {
      id: "1",
      foodItem: {
        id: "1",
        name: "Greek Yogurt",
        brand: "Chobani",
        calories: 150,
        protein: 20,
        carbs: 9,
        fat: 4,
        fiber: 0,
        servingSize: "1",
        servingUnit: "container",
        category: "Dairy",
        image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
        isVerified: true
      },
      quantity: 1,
      meal: "breakfast",
      timestamp: new Date(),
      notes: "With blueberries"
    },
    {
      id: "2",
      foodItem: {
        id: "2",
        name: "Grilled Chicken Breast",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
        servingSize: "100",
        servingUnit: "g",
        category: "Protein",
        image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
        isVerified: true
      },
      quantity: 150,
      meal: "lunch",
      timestamp: new Date(),
      notes: "Seasoned with herbs"
    }
  ]);

  // Sample food database
  const [foodDatabase] = useState<FoodItem[]>([
    {
      id: "1",
      name: "Greek Yogurt",
      brand: "Chobani",
      calories: 150,
      protein: 20,
      carbs: 9,
      fat: 4,
      fiber: 0,
      servingSize: "1",
      servingUnit: "container",
      category: "Dairy",
      image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: true
    },
    {
      id: "2",
      name: "Grilled Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      servingSize: "100",
      servingUnit: "g",
      category: "Protein",
      image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: true
    },
    {
      id: "3",
      name: "Brown Rice",
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      fiber: 3.5,
      servingSize: "1",
      servingUnit: "cup cooked",
      category: "Grains",
      image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: true
    },
    {
      id: "4",
      name: "Avocado",
      calories: 234,
      protein: 3,
      carbs: 12,
      fat: 21,
      fiber: 10,
      servingSize: "1",
      servingUnit: "medium",
      category: "Fruits",
      image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: true
    },
    {
      id: "5",
      name: "Salmon Fillet",
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      servingSize: "100",
      servingUnit: "g",
      category: "Protein",
      image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: true
    }
  ]);

  // Sample meal plans
  const [mealPlans] = useState<MealPlan[]>([
    {
      id: "1",
      name: "High Protein Muscle Building",
      description: "Perfect for building lean muscle with optimal protein distribution",
      meals: {
        breakfast: [foodDatabase[0], foodDatabase[3]], // Greek yogurt + avocado
        lunch: [foodDatabase[1], foodDatabase[2]], // Chicken + brown rice
        dinner: [foodDatabase[4], foodDatabase[2]], // Salmon + brown rice
        snacks: [foodDatabase[0]] // Greek yogurt
      },
      totalCalories: 2150,
      totalProtein: 165,
      totalCarbs: 140,
      totalFat: 85,
      tags: ["High Protein", "Muscle Building", "Clean Eating"],
      difficulty: "Easy",
      prepTime: 45,
      servings: 1,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "2",
      name: "Weight Loss Balanced",
      description: "Balanced nutrition for sustainable weight loss",
      meals: {
        breakfast: [foodDatabase[0]], // Greek yogurt
        lunch: [foodDatabase[1]], // Chicken
        dinner: [foodDatabase[4]], // Salmon
        snacks: [foodDatabase[3]] // Avocado
      },
      totalCalories: 1800,
      totalProtein: 135,
      totalCarbs: 95,
      totalFat: 68,
      tags: ["Weight Loss", "Balanced", "Low Carb"],
      difficulty: "Medium",
      prepTime: 35,
      servings: 1,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ]);

  // Sample recipes
  const [recipes] = useState<Recipe[]>([
    {
      id: "1",
      name: "Protein Power Bowl",
      description: "A nutrient-dense bowl packed with lean protein and healthy fats",
      ingredients: [
        { item: "Grilled chicken breast", amount: "150g" },
        { item: "Quinoa", amount: "1/2 cup cooked" },
        { item: "Avocado", amount: "1/2 medium" },
        { item: "Mixed greens", amount: "2 cups" },
        { item: "Cherry tomatoes", amount: "1/2 cup" },
        { item: "Olive oil", amount: "1 tbsp" }
      ],
      instructions: [
        "Cook quinoa according to package instructions",
        "Grill chicken breast until fully cooked",
        "Slice avocado and tomatoes",
        "Combine all ingredients in a bowl",
        "Drizzle with olive oil and season with salt and pepper"
      ],
      prepTime: 15,
      cookTime: 20,
      servings: 1,
      calories: 485,
      protein: 38,
      carbs: 22,
      fat: 26,
      difficulty: "Easy",
      tags: ["High Protein", "Gluten Free", "Quick"],
      rating: 4.9,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "2",
      name: "Mediterranean Salmon",
      description: "Heart-healthy salmon with Mediterranean flavors",
      ingredients: [
        { item: "Salmon fillet", amount: "200g" },
        { item: "Olive oil", amount: "2 tbsp" },
        { item: "Lemon", amount: "1 whole" },
        { item: "Garlic", amount: "3 cloves" },
        { item: "Cherry tomatoes", amount: "1 cup" },
        { item: "Kalamata olives", amount: "1/4 cup" },
        { item: "Fresh herbs", amount: "2 tbsp" }
      ],
      instructions: [
        "Preheat oven to 400°F (200°C)",
        "Season salmon with salt, pepper, and herbs",
        "Heat olive oil in oven-safe pan",
        "Sear salmon skin-side up for 3-4 minutes",
        "Flip and add tomatoes, olives, and garlic",
        "Transfer to oven for 8-10 minutes",
        "Finish with lemon juice and fresh herbs"
      ],
      prepTime: 10,
      cookTime: 15,
      servings: 1,
      calories: 420,
      protein: 35,
      carbs: 8,
      fat: 28,
      difficulty: "Medium",
      tags: ["Mediterranean", "Heart Healthy", "Omega-3"],
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1715733502435-d1fca0ab4273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBmb29kfGVufDF8fHx8MTc1ODg1Nzc0OXww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ]);

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (food.brand && food.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMacroPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getMacroColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-yellow-400";
    return "text-blue-400";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Hard": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case "breakfast": return "🍳";
      case "lunch": return "🥙";
      case "dinner": return "🍽️";
      case "snack": return "🍎";
      default: return "🍴";
    }
  };

  const addFoodToMeal = () => {
    if (!selectedFood) return;

    const newEntry: MealEntry = {
      id: Date.now().toString(),
      foodItem: selectedFood,
      quantity: parseFloat(quantity),
      meal: selectedMeal,
      timestamp: new Date(),
      notes: mealNotes
    };

    // Update today's intake (simplified calculation)
    const multiplier = parseFloat(quantity);
    const addedCalories = Math.round(selectedFood.calories * multiplier);
    const addedProtein = Math.round(selectedFood.protein * multiplier);
    const addedCarbs = Math.round(selectedFood.carbs * multiplier);
    const addedFat = Math.round(selectedFood.fat * multiplier);
    
    // Save meal to database
    db.addMeal({
      date: new Date().toISOString(),
      type: selectedMeal as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      items: [{
        name: selectedFood.name,
        calories: addedCalories,
        protein: addedProtein,
        carbs: addedCarbs,
        fats: addedFat,
        servings: multiplier,
      }],
      totalMacros: {
        calories: addedCalories,
        protein: addedProtein,
        carbs: addedCarbs,
        fats: addedFat,
      },
    });
    
    setTodayIntake(prev => ({
      calories: prev.calories + addedCalories,
      protein: prev.protein + addedProtein,
      carbs: prev.carbs + (selectedFood.carbs * multiplier),
      fat: prev.fat + (selectedFood.fat * multiplier),
      fiber: prev.fiber + (selectedFood.fiber || 0) * multiplier,
      water: prev.water
    }));

    toast.success("Food Logged! 🥗", {
      description: `Added ${selectedFood.name} (${addedCalories} cal, ${addedProtein}g protein)`,
      duration: 3000,
    });

    // Reset form
    setSelectedFood(null);
    setQuantity("1");
    setMealNotes("");
    setShowFoodSearch(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent">
            Nutrition Planner
          </h1>
          <p className="text-gray-300 text-lg">
            Track your nutrition and achieve your health goals
          </p>
        </div>
        <Button
          onClick={() => setShowFoodSearch(true)}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-green-500/30 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Food
        </Button>
      </div>

      {/* Daily Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border-orange-500/30 card-3d hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 animate-slideUp stagger-1 opacity-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-orange-300 text-sm">Calories</p>
                <p className="text-3xl font-bold text-white">
                  {todayIntake.calories}
                </p>
                <p className="text-xs text-orange-400">of {nutritionGoals.calories}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <Progress 
              value={getMacroPercentage(todayIntake.calories, nutritionGoals.calories)} 
              className="h-2"
            />
            <p className="text-xs text-gray-400 mt-2">
              {nutritionGoals.calories - todayIntake.calories} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-300 text-sm">Protein</p>
                <p className="text-3xl font-bold text-white">
                  {todayIntake.protein}g
                </p>
                <p className="text-xs text-blue-400">of {nutritionGoals.protein}g</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <Progress 
              value={getMacroPercentage(todayIntake.protein, nutritionGoals.protein)} 
              className="h-2"
            />
            <p className="text-xs text-gray-400 mt-2">
              {nutritionGoals.protein - todayIntake.protein}g remaining
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-green-300 text-sm">Carbs</p>
                <p className="text-3xl font-bold text-white">
                  {todayIntake.carbs}g
                </p>
                <p className="text-xs text-green-400">of {nutritionGoals.carbs}g</p>
              </div>
              <Apple className="w-8 h-8 text-green-400" />
            </div>
            <Progress 
              value={getMacroPercentage(todayIntake.carbs, nutritionGoals.carbs)} 
              className="h-2"
            />
            <p className="text-xs text-gray-400 mt-2">
              {nutritionGoals.carbs - todayIntake.carbs}g remaining
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-cyan-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-cyan-300 text-sm">Water</p>
                <p className="text-3xl font-bold text-white">
                  {todayIntake.water}
                </p>
                <p className="text-xs text-cyan-400">of {nutritionGoals.water} glasses</p>
              </div>
              <Droplets className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="flex gap-1 mb-2">
              {[...Array(nutritionGoals.water)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-2 rounded-full ${
                    i < todayIntake.water ? 'bg-cyan-500' : 'bg-gray-600'
                  }`} 
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">
              {nutritionGoals.water - todayIntake.water} glasses remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 backdrop-blur-sm">
          <TabsTrigger value="dashboard">Today</TabsTrigger>
          <TabsTrigger value="plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Macro Breakdown */}
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-400" />
                Macro Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-300">Protein</span>
                    <span className="text-white font-medium">{todayIntake.protein}g</span>
                  </div>
                  <Progress 
                    value={getMacroPercentage(todayIntake.protein, nutritionGoals.protein)} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{Math.round((todayIntake.protein * 4 / todayIntake.calories) * 100)}% of calories</span>
                    <span className={getMacroColor(getMacroPercentage(todayIntake.protein, nutritionGoals.protein))}>
                      {Math.round(getMacroPercentage(todayIntake.protein, nutritionGoals.protein))}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">Carbs</span>
                    <span className="text-white font-medium">{todayIntake.carbs}g</span>
                  </div>
                  <Progress 
                    value={getMacroPercentage(todayIntake.carbs, nutritionGoals.carbs)} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{Math.round((todayIntake.carbs * 4 / todayIntake.calories) * 100)}% of calories</span>
                    <span className={getMacroColor(getMacroPercentage(todayIntake.carbs, nutritionGoals.carbs))}>
                      {Math.round(getMacroPercentage(todayIntake.carbs, nutritionGoals.carbs))}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-300">Fat</span>
                    <span className="text-white font-medium">{todayIntake.fat}g</span>
                  </div>
                  <Progress 
                    value={getMacroPercentage(todayIntake.fat, nutritionGoals.fat)} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{Math.round((todayIntake.fat * 9 / todayIntake.calories) * 100)}% of calories</span>
                    <span className={getMacroColor(getMacroPercentage(todayIntake.fat, nutritionGoals.fat))}>
                      {Math.round(getMacroPercentage(todayIntake.fat, nutritionGoals.fat))}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Meals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(["breakfast", "lunch", "dinner", "snack"] as const).map((mealType) => {
              const mealEntriesForType = mealEntries.filter(entry => entry.meal === mealType);
              const totalCalories = mealEntriesForType.reduce((sum, entry) => sum + (entry.foodItem.calories * entry.quantity), 0);

              return (
                <Card key={mealType} className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2 capitalize">
                      <span className="text-xl">{getMealIcon(mealType)}</span>
                      {mealType}
                    </CardTitle>
                    <p className="text-sm text-gray-400">{totalCalories} calories</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mealEntriesForType.length > 0 ? (
                      <>
                        {mealEntriesForType.map(entry => (
                          <div key={entry.id} className="flex items-center gap-3 p-2 bg-gray-700/30 rounded-lg">
                            {entry.foodItem.image && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden">
                                <ImageWithFallback
                                  src={entry.foodItem.image}
                                  alt={entry.foodItem.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {entry.foodItem.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {entry.quantity} {entry.foodItem.servingUnit} • {Math.round(entry.foodItem.calories * entry.quantity)} cal
                              </p>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMeal(mealType);
                            setShowFoodSearch(true);
                          }}
                          className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Food
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Utensils className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm mb-3">No items logged</p>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMeal(mealType);
                            setShowFoodSearch(true);
                          }}
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Food
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Camera className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Scan Barcode</h3>
                <p className="text-sm text-gray-400">Quickly log packaged foods</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-blue-500/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Calculator className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Recipe Calculator</h3>
                <p className="text-sm text-gray-400">Calculate nutrition for homemade meals</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-500/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">AI Suggestions</h3>
                <p className="text-sm text-gray-400">Get personalized meal recommendations</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mealPlans.map(plan => (
              <Card 
                key={plan.id} 
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setShowMealPlan(true)}
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={plan.image || ""}
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <Badge className={getDifficultyColor(plan.difficulty)}>
                      {plan.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-white text-xs">{plan.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span>{plan.totalCalories} cal</span>
                      <span>{plan.totalProtein}g protein</span>
                      <span>{plan.prepTime} min prep</span>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {plan.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Use Plan
                    </Button>
                    <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recipes.map(recipe => (
              <Card 
                key={recipe.id} 
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setShowRecipe(recipe)}
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={recipe.image || ""}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-white text-xs">{recipe.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{recipe.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.prepTime + recipe.cookTime}m
                      </span>
                      <span>{recipe.calories} cal</span>
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <p className="text-gray-300 text-sm mb-4">{recipe.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
                    <div>
                      <p className="text-blue-400 font-medium">{recipe.protein}g</p>
                      <p className="text-gray-400">Protein</p>
                    </div>
                    <div>
                      <p className="text-green-400 font-medium">{recipe.carbs}g</p>
                      <p className="text-gray-400">Carbs</p>
                    </div>
                    <div>
                      <p className="text-yellow-400 font-medium">{recipe.fat}g</p>
                      <p className="text-gray-400">Fat</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      <ChefHat className="w-4 h-4 mr-2" />
                      Cook Recipe
                    </Button>
                    <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-white">85%</p>
                      <p className="text-sm text-green-400">Goal Achievement</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">6.2</p>
                      <p className="text-sm text-blue-400">Avg Daily Score</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 h-20">
                    {[85, 92, 78, 88, 95, 82, 90].map((score, index) => (
                      <div key={index} className="flex flex-col justify-end">
                        <div 
                          className="bg-gradient-to-t from-green-500 to-blue-500 rounded-sm"
                          style={{ height: `${score}%` }}
                        />
                        <p className="text-xs text-gray-400 text-center mt-1">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Nutrition Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Protein Goal</p>
                        <p className="text-sm text-gray-400">Hit target 5 days in a row</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">5 days</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Hydration</p>
                        <p className="text-sm text-gray-400">8+ glasses daily</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500 text-white">3 days</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Meal Logging</p>
                        <p className="text-sm text-gray-400">Tracked all meals</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-500 text-white">12 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-green-300 font-medium mb-1">Protein Optimization</h4>
                      <p className="text-sm text-gray-300">Consider adding a protein shake post-workout to hit your daily target more consistently.</p>
                      <Badge className="mt-2 bg-green-500/20 text-green-300">High Priority</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Droplets className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-yellow-300 font-medium mb-1">Hydration Reminder</h4>
                      <p className="text-sm text-gray-300">You're consistently 1-2 glasses short of your water goal. Set hourly reminders.</p>
                      <Badge className="mt-2 bg-yellow-500/20 text-yellow-300">Medium Priority</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Apple className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-blue-300 font-medium mb-1">Fiber Boost</h4>
                      <p className="text-sm text-gray-300">Add more vegetables and whole grains to increase fiber intake for better digestion.</p>
                      <Badge className="mt-2 bg-blue-500/20 text-blue-300">Low Priority</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Nutrition Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-700/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Best Performance Days</h4>
                  <p className="text-sm text-gray-300 mb-3">You tend to hit your goals better on weekdays when you meal prep.</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Monday</Badge>
                    <Badge variant="secondary">Tuesday</Badge>
                    <Badge variant="secondary">Wednesday</Badge>
                  </div>
                </div>

                <div className="p-4 bg-gray-700/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Meal Timing</h4>
                  <p className="text-sm text-gray-300 mb-3">Your protein intake is highest at dinner. Consider redistributing throughout the day.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Breakfast</span>
                      <span className="text-blue-400">20g protein</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Lunch</span>
                      <span className="text-green-400">35g protein</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Dinner</span>
                      <span className="text-yellow-400">55g protein</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-700/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Weekly Trends</h4>
                  <p className="text-sm text-gray-300">Your calorie intake is 15% higher on weekends. Consider planning weekend meals in advance.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Food Search Dialog */}
      <Dialog open={showFoodSearch} onOpenChange={setShowFoodSearch}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-purple-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent">
              Add Food to {selectedMeal}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Search and select foods to add to your meal plan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search foods..."
                  className="pl-10 bg-gray-800/50 border-purple-500/30 text-white"
                />
              </div>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Camera className="w-4 h-4 mr-2" />
                Scan
              </Button>
            </div>

            {/* Food Results */}
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFoods.map(food => (
                  <Card 
                    key={food.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedFood?.id === food.id 
                        ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                        : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedFood(food)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        {food.image && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={food.image}
                              alt={food.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-medium truncate">{food.name}</h4>
                            {food.isVerified && (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            )}
                          </div>
                          {food.brand && (
                            <p className="text-sm text-gray-400 truncate">{food.brand}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span>{food.calories} cal</span>
                            <span>{food.protein}g protein</span>
                            <span>per {food.servingSize} {food.servingUnit}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {/* Selected Food Details */}
            {selectedFood && (
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    {selectedFood.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <p className="text-orange-400 font-bold text-lg">{selectedFood.calories}</p>
                      <p className="text-xs text-gray-400">Calories</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <p className="text-blue-400 font-bold text-lg">{selectedFood.protein}g</p>
                      <p className="text-xs text-gray-400">Protein</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <p className="text-green-400 font-bold text-lg">{selectedFood.carbs}g</p>
                      <p className="text-xs text-gray-400">Carbs</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <p className="text-yellow-400 font-bold text-lg">{selectedFood.fat}g</p>
                      <p className="text-xs text-gray-400">Fat</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Quantity</Label>
                      <Input
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        className="bg-gray-800/50 border-blue-500/30 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Per {selectedFood.servingSize} {selectedFood.servingUnit}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Meal</Label>
                      <Select value={selectedMeal} onValueChange={(value: any) => setSelectedMeal(value)}>
                        <SelectTrigger className="bg-gray-800/50 border-blue-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Notes (Optional)</Label>
                    <Textarea
                      value={mealNotes}
                      onChange={(e) => setMealNotes(e.target.value)}
                      placeholder="Add notes about preparation, modifications, etc."
                      className="bg-gray-800/50 border-blue-500/30 text-white"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={addFoodToMeal}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to {selectedMeal}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowFoodSearch(false)}
                      className="border-gray-500/50 text-gray-300 hover:bg-gray-500/20"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Recipe Detail Dialog */}
      <Dialog open={!!showRecipe} onOpenChange={() => setShowRecipe(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-purple-500/30 backdrop-blur-xl">
          {showRecipe && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-start gap-4">
                  {showRecipe.image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={showRecipe.image}
                        alt={showRecipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <DialogTitle className="text-2xl bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent">
                      {showRecipe.name}
                    </DialogTitle>
                    <p className="text-gray-300 mt-2">{showRecipe.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge className={getDifficultyColor(showRecipe.difficulty)}>
                        {showRecipe.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400">{showRecipe.rating}</span>
                        <span className="text-gray-400">({showRecipe.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <Clock className="w-6 h-6 text-green-400 mb-2" />
                  <p className="text-white font-medium">{showRecipe.prepTime}m</p>
                  <p className="text-sm text-green-300">Prep Time</p>
                </div>
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <Timer className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-white font-medium">{showRecipe.cookTime}m</p>
                  <p className="text-sm text-blue-300">Cook Time</p>
                </div>
                <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
                  <Flame className="w-6 h-6 text-orange-400 mb-2" />
                  <p className="text-white font-medium">{showRecipe.calories}</p>
                  <p className="text-sm text-orange-300">Calories</p>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <Users className="w-6 h-6 text-purple-400 mb-2" />
                  <p className="text-white font-medium">{showRecipe.servings}</p>
                  <p className="text-sm text-purple-300">Servings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-green-400" />
                    Ingredients
                  </h3>
                  <div className="space-y-2">
                    {showRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-green-400 text-xs font-medium">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-white">{ingredient.amount}</span>
                          <span className="text-gray-300 ml-2">{ingredient.item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-blue-400" />
                    Instructions
                  </h3>
                  <div className="space-y-3">
                    {showRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-400 text-sm font-medium">{index + 1}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{showRecipe.protein}g</p>
                  <p className="text-sm text-gray-400">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{showRecipe.carbs}g</p>
                  <p className="text-sm text-gray-400">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{showRecipe.fat}g</p>
                  <p className="text-sm text-gray-400">Fat</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <ChefHat className="w-4 h-4 mr-2" />
                  Start Cooking
                </Button>
                <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}