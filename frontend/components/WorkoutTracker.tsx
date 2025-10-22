import { useState, useEffect, useRef } from "react";
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
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Play,
  Pause,
  RotateCcw,
  Target,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle,
  Users,
  Trophy,
  Dumbbell,
  Timer,
  Zap,
  Activity,
  MapPin,
  Plus,
  Edit,
  Star,
  Heart,
  Volume2,
  VolumeX,
  SkipForward,
  ChevronRight,
  Flame,
  Camera,
  Share2,
  Award,
  RefreshCw,
  Sparkles,
  Info,
  Circle,
  X,
  Save,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { db } from "./DatabaseService";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  duration?: string;
  completed: boolean;
  category: string;
  difficulty: string;
  targetMuscles: string[];
  instructions?: string[];
  tips?: string[];
  image?: string;
  videoUrl?: string;
  restTime?: number;
  actualSets?: { reps: number; weight?: number; completed: boolean }[];
  personalBest?: { weight: number; reps: number; date: string };
}

interface Workout {
  id: number;
  name: string;
  duration: string;
  exercises: Exercise[];
  completed: boolean;
  difficulty: string;
  estimatedCalories: number;
  category: string;
  description?: string;
  image?: string;
  tags?: string[];
  createdBy?: string;
  rating?: number;
  completions?: number;
  lastCompleted?: string;
}

interface WorkoutSession {
  startTime?: Date;
  endTime?: Date;
  totalDuration?: number;
  caloriesBurned?: number;
  completedExercises: number;
  totalExercises: number;
  notes?: string;
  mood?: string;
  energyLevel?: number;
}

export function WorkoutTracker() {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession>({
    completedExercises: 0,
    totalExercises: 0
  });
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);
  const [showCustomWorkout, setShowCustomWorkout] = useState(false);
  const [showExerciseDetail, setShowExerciseDetail] = useState<Exercise | null>(null);
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [sessionMood, setSessionMood] = useState("");
  const [sessionEnergy, setSessionEnergy] = useState(5);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const restTimerRef = useRef<NodeJS.Timeout>();

  // Enhanced workout data
  const sampleWorkouts: Workout[] = [
    {
      id: 1,
      name: "Upper Body Strength",
      duration: "45 min",
      difficulty: "Intermediate",
      estimatedCalories: 320,
      category: "Strength",
      completed: false,
      description: "Build upper body muscle and strength with compound movements targeting chest, back, and shoulders.",
      image: "https://images.unsplash.com/photo-1584827387179-355517d8a5fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwZXF1aXBtZW50fGVufDF8fHx8MTc1ODg1NzQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Strength", "Upper Body", "Muscle Building", "Compound"],
      rating: 4.8,
      completions: 1247,
      createdBy: "AI Coach",
      lastCompleted: "2025-09-25",
      exercises: [
        {
          id: 1,
          name: "Push-ups",
          sets: 3,
          reps: "12-15",
          completed: false,
          category: "Bodyweight",
          difficulty: "Beginner",
          targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
          instructions: [
            "Start in a plank position with hands slightly wider than shoulders",
            "Lower your body until chest nearly touches the floor",
            "Push back up to starting position maintaining straight body line",
            "Keep core engaged throughout the entire movement"
          ],
          tips: [
            "Keep your body in a straight line from head to heels",
            "Don't let hips sag or pike up during the movement",
            "Focus on controlled movement, not speed",
            "Breathe in on the way down, exhale on the way up"
          ],
          image: "https://images.unsplash.com/photo-1566581184707-0ff96ae2f0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBmb3JtfGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 60,
          actualSets: [
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false }
          ],
          personalBest: { weight: 0, reps: 18, date: "2025-09-20" }
        },
        {
          id: 2,
          name: "Dumbbell Rows",
          sets: 3,
          reps: "10-12",
          weight: "15-20 lbs",
          completed: false,
          category: "Weights",
          difficulty: "Intermediate",
          targetMuscles: ["Back", "Biceps", "Core"],
          instructions: [
            "Hold dumbbells with palms facing your torso",
            "Bend at hips and knees, keeping back straight",
            "Pull dumbbells to your sides, squeezing shoulder blades together",
            "Lower with control, feeling the stretch in your lats"
          ],
          tips: [
            "Keep core engaged and back neutral throughout",
            "Don't use momentum - control the weight",
            "Focus on squeezing back muscles at the top",
            "Lead with your elbows, not your hands"
          ],
          image: "https://images.unsplash.com/photo-1566581184707-0ff96ae2f0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBmb3JtfGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 90,
          actualSets: [
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false }
          ],
          personalBest: { weight: 22.5, reps: 12, date: "2025-09-22" }
        },
        {
          id: 3,
          name: "Shoulder Press",
          sets: 3,
          reps: "8-10",
          weight: "10-15 lbs",
          completed: false,
          category: "Weights",
          difficulty: "Intermediate",
          targetMuscles: ["Shoulders", "Triceps", "Core"],
          instructions: [
            "Hold dumbbells at shoulder height with palms facing forward",
            "Press weights overhead until arms are fully extended",
            "Lower with control back to starting position",
            "Keep core tight and avoid arching your back"
          ],
          tips: [
            "Don't press weight behind your head",
            "Control the descent - don't drop the weights",
            "Keep elbows slightly forward of your shoulders",
            "Engage core to prevent back arch"
          ],
          image: "https://images.unsplash.com/photo-1566581184707-0ff96ae2f0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBmb3JtfGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 90,
          actualSets: [
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false }
          ],
          personalBest: { weight: 17.5, reps: 10, date: "2025-09-20" }
        },
        {
          id: 4,
          name: "Plank",
          sets: 3,
          reps: "30-60 sec",
          duration: "45 sec",
          completed: false,
          category: "Core",
          difficulty: "Beginner",
          targetMuscles: ["Core", "Shoulders", "Glutes"],
          instructions: [
            "Start in push-up position, then lower to forearms",
            "Keep body in straight line from head to heels",
            "Engage core muscles and squeeze glutes",
            "Hold position for specified time while breathing normally"
          ],
          tips: [
            "Don't let hips sag or pike up",
            "Breathe normally - don't hold your breath",
            "Keep neck in neutral position",
            "Focus on quality over duration"
          ],
          image: "https://images.unsplash.com/photo-1566581184707-0ff96ae2f0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBmb3JxfGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 60,
          actualSets: [
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false }
          ],
          personalBest: { weight: 0, reps: 75, date: "2025-09-18" }
        }
      ]
    },
    {
      id: 2,
      name: "HIIT Cardio Blast",
      duration: "30 min",
      difficulty: "Advanced",
      estimatedCalories: 450,
      category: "Cardio",
      completed: false,
      description: "High-intensity interval training for maximum calorie burn and cardiovascular improvement.",
      image: "https://images.unsplash.com/photo-1566581184707-0ff96ae2f0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBmb3JtfGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["HIIT", "Cardio", "Fat Burn", "No Equipment", "Full Body"],
      rating: 4.9,
      completions: 892,
      createdBy: "AI Coach",
      lastCompleted: "2025-09-24",
      exercises: [
        {
          id: 5,
          name: "Burpees",
          sets: 4,
          reps: "45 sec work, 15 sec rest",
          completed: false,
          category: "HIIT",
          difficulty: "Advanced",
          targetMuscles: ["Full Body", "Cardio"],
          instructions: [
            "Start standing, then squat down and place hands on floor",
            "Jump feet back into plank position",
            "Perform a push-up (optional for beginners)",
            "Jump feet back to squat, then jump up with arms overhead"
          ],
          tips: [
            "Land softly on the balls of your feet",
            "Modify by stepping back instead of jumping",
            "Keep core engaged throughout entire movement",
            "Focus on smooth transitions between positions"
          ],
          image: "https://images.unsplash.com/photo-1566581184707-0ff96ae2f0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBmb3JtfGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 15,
          actualSets: [
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false }
          ],
          personalBest: { weight: 0, reps: 12, date: "2025-09-22" }
        },
        {
          id: 6,
          name: "Mountain Climbers",
          sets: 4,
          reps: "45 sec work, 15 sec rest",
          completed: false,
          category: "HIIT",
          difficulty: "Intermediate",
          targetMuscles: ["Core", "Cardio", "Shoulders"],
          instructions: [
            "Start in plank position with hands under shoulders",
            "Bring right knee toward chest, then quickly switch",
            "Keep alternating legs as fast as possible",
            "Maintain plank position and straight back throughout"
          ],
          tips: [
            "Keep hips level - don't let them bounce up and down",
            "Land on balls of feet, not heels",
            "Maintain steady rhythm rather than all-out speed",
            "Keep shoulders over wrists throughout movement"
          ],
          image: "https://images.unsplash.com/photo-1566581184707-0ff96ae2f0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBmb3JtfGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 15,
          actualSets: [
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false }
          ],
          personalBest: { weight: 0, reps: 25, date: "2025-09-21" }
        },
        {
          id: 7,
          name: "Jump Squats",
          sets: 4,
          reps: "45 sec work, 15 sec rest",
          completed: false,
          category: "HIIT",
          difficulty: "Intermediate",
          targetMuscles: ["Legs", "Glutes", "Cardio"],
          instructions: [
            "Stand with feet shoulder-width apart",
            "Lower into squat position with thighs parallel to floor",
            "Explode up jumping as high as possible",
            "Land softly and immediately go into next squat"
          ],
          tips: [
            "Land with bent knees to absorb impact",
            "Keep chest up and back straight",
            "Use arms for momentum and balance",
            "Focus on soft landings to protect joints"
          ],
          image: "https://images.unsplash.com/photo-1566581184707-0ff96ae2f0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBmb3JtfGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 15,
          actualSets: [
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false }
          ],
          personalBest: { weight: 0, reps: 20, date: "2025-09-23" }
        }
      ]
    },
    {
      id: 3,
      name: "Lower Body Power",
      duration: "50 min",
      difficulty: "Advanced",
      estimatedCalories: 380,
      category: "Strength",
      completed: false,
      description: "Build explosive lower body power and strength with compound movements.",
      image: "https://images.unsplash.com/photo-1584827387179-355517d8a5fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwZXF1aXBtZW50fGVufDF8fHx8MTc1ODg1NzQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Strength", "Lower Body", "Power", "Compound"],
      rating: 4.7,
      completions: 634,
      createdBy: "AI Coach",
      lastCompleted: "2025-09-23",
      exercises: [
        {
          id: 8,
          name: "Goblet Squats",
          sets: 4,
          reps: "12-15",
          weight: "20-25 lbs",
          completed: false,
          category: "Weights",
          difficulty: "Intermediate",
          targetMuscles: ["Quadriceps", "Glutes", "Core"],
          instructions: [
            "Hold dumbbell at chest level with both hands",
            "Stand with feet shoulder-width apart",
            "Lower into squat until thighs parallel to floor",
            "Drive through heels to return to starting position"
          ],
          tips: [
            "Keep chest up and core engaged",
            "Don't let knees cave inward",
            "Control the descent, explode up",
            "Keep weight on heels, not toes"
          ],
          image: "https://images.unsplash.com/photo-1566581184707-0ff96ae2f0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBmb3JtfGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 120,
          actualSets: [
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false }
          ],
          personalBest: { weight: 30, reps: 15, date: "2025-09-19" }
        }
      ]
    },
    {
      id: 4,
      name: "Core & Abs Blast",
      duration: "25 min",
      difficulty: "Intermediate",
      estimatedCalories: 200,
      category: "Core",
      completed: false,
      description: "Target your core with a focused ab routine that builds strength and definition.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY29yZXxlbnwxfHx8fDE3NTg4NTc0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Core", "Abs", "Bodyweight", "Quick"],
      rating: 4.6,
      completions: 523,
      createdBy: "AI Coach",
      exercises: [
        {
          id: 9,
          name: "Bicycle Crunches",
          sets: 3,
          reps: "20-30",
          completed: false,
          category: "Core",
          difficulty: "Intermediate",
          targetMuscles: ["Abs", "Obliques"],
          instructions: [
            "Lie on your back with hands behind head",
            "Bring opposite elbow to opposite knee in a cycling motion",
            "Keep core engaged throughout",
            "Alternate sides in a controlled manner"
          ],
          tips: [
            "Focus on rotation, not just bringing limbs together",
            "Don't pull on your neck",
            "Breathe naturally throughout",
            "Quality over speed"
          ],
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY29yZXxlbnwxfHx8fDE3NTg4NTc0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 45,
          actualSets: [
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false }
          ],
          personalBest: { weight: 0, reps: 35, date: "2025-09-15" }
        }
      ]
    },
    {
      id: 5,
      name: "Full Body Circuit",
      duration: "40 min",
      difficulty: "Intermediate",
      estimatedCalories: 400,
      category: "Circuit",
      completed: false,
      description: "A dynamic full-body workout combining strength and cardio in one efficient session.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2lyY3VpdHxlbnwxfHx8fDE3NTg4NTc0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Full Body", "Circuit", "Conditioning", "Strength"],
      rating: 4.7,
      completions: 712,
      createdBy: "AI Coach",
      exercises: [
        {
          id: 10,
          name: "Kettlebell Swings",
          sets: 3,
          reps: "15-20",
          weight: "15-25 lbs",
          completed: false,
          category: "Weights",
          difficulty: "Intermediate",
          targetMuscles: ["Glutes", "Hamstrings", "Core", "Back"],
          instructions: [
            "Start with feet shoulder-width apart, kettlebell between legs",
            "Hinge at hips and swing kettlebell back",
            "Drive hips forward explosively to swing kettlebell to chest height",
            "Let momentum carry kettlebell, don't lift with arms"
          ],
          tips: [
            "Power comes from hip thrust, not arms",
            "Keep back flat throughout movement",
            "Squeeze glutes at top of swing",
            "Maintain tight core"
          ],
          image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2lyY3VpdHxlbnwxfHx8fDE3NTg4NTc0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 60,
          actualSets: [
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false }
          ],
          personalBest: { weight: 25, reps: 20, date: "2025-09-17" }
        }
      ]
    },
    {
      id: 6,
      name: "Yoga Flow & Flexibility",
      duration: "35 min",
      difficulty: "Beginner",
      estimatedCalories: 120,
      category: "Flexibility",
      completed: false,
      description: "Gentle yoga flow to improve flexibility, balance, and mindfulness.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwZml0bmVzc3xlbnwxfHx8fDE3NTg4NTc0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Yoga", "Flexibility", "Recovery", "Mindfulness"],
      rating: 4.8,
      completions: 945,
      createdBy: "AI Coach",
      exercises: [
        {
          id: 11,
          name: "Sun Salutation",
          sets: 3,
          reps: "5 rounds",
          duration: "10 min",
          completed: false,
          category: "Yoga",
          difficulty: "Beginner",
          targetMuscles: ["Full Body", "Flexibility"],
          instructions: [
            "Start in mountain pose",
            "Flow through upward salute, forward fold, plank",
            "Move through chaturanga, upward dog, downward dog",
            "Return to standing through forward fold"
          ],
          tips: [
            "Breathe deeply and consistently",
            "Move slowly and mindfully",
            "Modify as needed for your body",
            "Focus on the journey, not perfection"
          ],
          image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwZml0bmVzc3xlbnwxfHx8fDE3NTg4NTc0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 30,
          actualSets: [
            { reps: 0, completed: false },
            { reps: 0, completed: false },
            { reps: 0, completed: false }
          ],
          personalBest: { weight: 0, reps: 8, date: "2025-09-10" }
        }
      ]
    },
    {
      id: 7,
      name: "Arms & Shoulders",
      duration: "35 min",
      difficulty: "Intermediate",
      estimatedCalories: 280,
      category: "Strength",
      completed: false,
      description: "Sculpt and strengthen your arms and shoulders with targeted exercises.",
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcm0lMjB3b3Jrb3V0fGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Arms", "Shoulders", "Strength", "Isolation"],
      rating: 4.5,
      completions: 487,
      createdBy: "AI Coach",
      exercises: [
        {
          id: 12,
          name: "Bicep Curls",
          sets: 3,
          reps: "12-15",
          weight: "10-15 lbs",
          completed: false,
          category: "Weights",
          difficulty: "Beginner",
          targetMuscles: ["Biceps"],
          instructions: [
            "Stand with dumbbells at sides, palms forward",
            "Keep elbows close to body",
            "Curl weights up to shoulders",
            "Lower with control"
          ],
          tips: [
            "Don't swing the weights",
            "Keep elbows stationary",
            "Full range of motion",
            "Squeeze at the top"
          ],
          image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcm0lMjB3b3Jrb3V0fGVufDF8fHx8MTc1ODg1NzQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          restTime: 60,
          actualSets: [
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false },
            { reps: 0, weight: 0, completed: false }
          ],
          personalBest: { weight: 17.5, reps: 15, date: "2025-09-12" }
        }
      ]
    }
  ];

  // Timer effects
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            if (soundEnabled) {
              // Play notification sound (would implement with Web Audio API)
              console.log("Rest complete!");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }

    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isResting, restTimer, soundEnabled]);

  const startWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setCurrentExercise(0);
    setCurrentSet(0);
    setIsTimerRunning(true);
    setTimerSeconds(0);
    setWorkoutSession({
      startTime: new Date(),
      completedExercises: 0,
      totalExercises: workout.exercises.length
    });
    toast.success("Workout Started!", {
      description: `Let's crush this ${workout.name} session! 💪`,
      duration: 3000,
    });
  };

  const completeSet = () => {
    if (!activeWorkout) return;

    const exercise = activeWorkout.exercises[currentExercise];
    const actualSet = exercise.actualSets?.[currentSet];
    
    if (actualSet) {
      actualSet.completed = true;
      actualSet.reps = parseInt(currentReps) || 0;
      if (currentWeight) actualSet.weight = parseFloat(currentWeight);
    }

    setCurrentReps("");
    setCurrentWeight("");

    if (currentSet < exercise.sets - 1) {
      setCurrentSet(currentSet + 1);
      if (exercise.restTime) {
        setRestTimer(exercise.restTime);
        setIsResting(true);
        toast.info("Rest Time", {
          description: `Take ${exercise.restTime} seconds to recover`,
          duration: 3000,
        });
      }
    } else {
      // Exercise completed
      exercise.completed = true;
      setWorkoutSession(prev => ({
        ...prev,
        completedExercises: prev.completedExercises + 1
      }));

      toast.success("Exercise Complete! 💪", {
        description: `Great work on ${exercise.name}!`,
        duration: 3000,
      });

      if (currentExercise < activeWorkout.exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setCurrentSet(0);
      } else {
        finishWorkout();
      }
    }
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - (workoutSession.startTime?.getTime() || 0)) / 1000 / 60);
    const caloriesBurned = Math.round(duration * (activeWorkout.estimatedCalories / parseInt(activeWorkout.duration)));
    
    setWorkoutSession(prev => ({
      ...prev,
      endTime,
      totalDuration: duration,
      caloriesBurned
    }));

    // Save workout to database
    db.addWorkout({
      date: new Date().toISOString(),
      type: activeWorkout.difficulty,
      duration: duration,
      caloriesBurned: caloriesBurned,
      exercises: activeWorkout.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: parseInt(ex.reps) || 0,
        weight: ex.weight ? parseFloat(ex.weight) : undefined,
        duration: ex.duration ? parseInt(ex.duration) : undefined,
      })),
      notes: `Completed ${activeWorkout.name}`,
    });

    setIsTimerRunning(false);
    
    toast.success("🎉 Workout Complete!", {
      description: `Duration: ${duration} min | Calories: ~${caloriesBurned} | Great job!`,
      duration: 5000,
    });
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Advanced": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Strength": return Dumbbell;
      case "Cardio": return Heart;
      case "HIIT": return Zap;
      default: return Activity;
    }
  };

  // Active workout view
  if (activeWorkout) {
    const currentExerciseData = activeWorkout.exercises[currentExercise];

    return (
      <div className="space-y-6">
        {/* Workout Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
              {activeWorkout.name}
            </h1>
            <p className="text-gray-300 text-lg">
              Exercise {currentExercise + 1} of {activeWorkout.exercises.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveWorkout(null)}
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              End Workout
            </Button>
          </div>
        </div>

        {/* Workout Progress */}
        <Card className="bg-gradient-to-br from-blue-500/20 to-green-500/20 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {formatTime(timerSeconds)}
                </div>
                <p className="text-gray-300">Duration</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {workoutSession.completedExercises}
                </div>
                <p className="text-gray-300">Exercises Done</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {Math.round(timerSeconds / 60 * (activeWorkout.estimatedCalories / parseInt(activeWorkout.duration)))}
                </div>
                <p className="text-gray-300">Calories Burned</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Overall Progress</span>
                <span className="text-blue-400">
                  {Math.round(((currentExercise + (currentSet + 1) / currentExerciseData.sets) / activeWorkout.exercises.length) * 100)}%
                </span>
              </div>
              <Progress 
                value={((currentExercise + (currentSet + 1) / currentExerciseData.sets) / activeWorkout.exercises.length) * 100} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rest Timer */}
        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="pt-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-40 h-40 mx-auto rounded-full border-4 border-purple-500/30 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <div className="text-center">
                        <Timer className="w-12 h-12 mx-auto mb-3 text-purple-400 animate-pulse" />
                        <p className="text-5xl text-white font-mono font-bold">
                          {Math.floor(restTimer / 60)}:{String(restTimer % 60).padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-white text-2xl mb-2">Rest Time</h2>
                  <p className="text-gray-300 mb-6">Recover before your next set</p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={skipRest}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip Rest
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setRestTimer(Math.max(0, restTimer - 15))}
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    >
                      -15s
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setRestTimer(restTimer + 15)}
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    >
                      +15s
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Exercise */}
        {!isResting && (
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-blue-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/30 rounded-lg">
                    <Dumbbell className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">
                      {currentExerciseData.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getDifficultyColor(currentExerciseData.difficulty)}>
                        {currentExerciseData.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-500/30 text-blue-200 border-blue-500/50">
                        {currentExerciseData.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowExerciseDetail(currentExerciseData)}
                  className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exercise Image */}
              {currentExerciseData.image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={currentExerciseData.image}
                    alt={currentExerciseData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-2">{currentExerciseData.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentExerciseData.targetMuscles.map((muscle, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Set Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg border border-green-500/30">
                  <p className="text-sm text-green-300 mb-1">Current Set</p>
                  <p className="text-3xl text-white font-bold">
                    {currentSet + 1}
                    <span className="text-lg text-gray-400">/{currentExerciseData.sets}</span>
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-blue-300 mb-1">Target Reps</p>
                  <p className="text-3xl text-white font-bold">{currentExerciseData.reps}</p>
                </div>
                {currentExerciseData.weight && (
                  <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg border border-purple-500/30">
                    <p className="text-sm text-purple-300 mb-1">Suggested Weight</p>
                    <p className="text-xl text-white font-bold">{currentExerciseData.weight}</p>
                  </div>
                )}
              </div>

              {/* Personal Best */}
              {currentExerciseData.personalBest && (
                <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 font-medium">Personal Best</span>
                  </div>
                  <p className="text-white">
                    {currentExerciseData.personalBest.reps} reps
                    {currentExerciseData.personalBest.weight > 0 && ` @ ${currentExerciseData.personalBest.weight} lbs`}
                    <span className="text-gray-400 ml-2">({currentExerciseData.personalBest.date})</span>
                  </p>
                </div>
              )}

              {/* Input Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Weight Used (lbs)</Label>
                  <Input
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    placeholder="Enter weight"
                    className="bg-gray-800/50 border-blue-500/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Reps Completed</Label>
                  <Input
                    value={currentReps}
                    onChange={(e) => setCurrentReps(e.target.value)}
                    placeholder="Enter reps"
                    className="bg-gray-800/50 border-blue-500/30 text-white"
                  />
                </div>
              </div>

              {/* Complete Set Button */}
              <Button
                onClick={completeSet}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-green-500/30 transition-all duration-300"
                size="lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Set {currentSet + 1}/{currentExerciseData.sets}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Exercise List Progress */}
        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Exercise Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeWorkout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    index === currentExercise
                      ? 'bg-blue-500/20 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : exercise.completed
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-gray-700/30 border border-gray-600/30'
                  }`}
                >
                  {exercise.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : index === currentExercise ? (
                    <div className="w-5 h-5 border-2 border-blue-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${exercise.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                      {exercise.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      {exercise.sets} sets × {exercise.reps}
                      {exercise.weight && ` @ ${exercise.weight}`}
                    </p>
                  </div>
                  {index === currentExercise && (
                    <Badge className="bg-blue-500/30 text-blue-200 border-blue-500/50">
                      Set {currentSet + 1}/{exercise.sets}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main workout selection view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
            Workout Tracker
          </h1>
          <p className="text-gray-300 text-lg">
            AI-generated workouts tailored to your goals
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCustomWorkout(true)}
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Custom
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate New Plan
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-xs text-blue-400">Workouts</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Total Time</p>
                <p className="text-2xl font-bold text-white">162</p>
                <p className="text-xs text-green-400">Minutes</p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm">Calories</p>
                <p className="text-2xl font-bold text-white">1,115</p>
                <p className="text-xs text-orange-400">Burned</p>
              </div>
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Streak</p>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-xs text-purple-400">Days</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="workouts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 backdrop-blur-sm">
          <TabsTrigger value="workouts">Available Workouts</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sampleWorkouts.map((workout) => {
              const IconComponent = getCategoryIcon(workout.category);
              
              return (
                <Card
                  key={workout.id}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                  onClick={() => {
                    setSelectedWorkout(workout);
                    setShowWorkoutDetail(true);
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={workout.image || ""}
                      alt={workout.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <Badge className={getDifficultyColor(workout.difficulty)}>
                        {workout.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-white text-xs">{workout.rating}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{workout.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {workout.estimatedCalories} cal
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {workout.completions}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <p className="text-gray-300 text-sm">{workout.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {workout.tags?.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            startWorkout(workout);
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWorkout(workout);
                            setShowWorkoutDetail(true);
                          }}
                          className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
                      <p className="text-3xl font-bold text-white">4</p>
                      <p className="text-sm text-green-400">Workouts</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">162</p>
                      <p className="text-sm text-blue-400">Minutes</p>
                    </div>
                  </div>
                  <Progress value={80} className="h-3" />
                  <p className="text-center text-gray-300">80% of weekly goal achieved</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Personal Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <span className="text-white">Push-ups</span>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">18 reps</p>
                      <p className="text-xs text-gray-400">Sep 20</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <span className="text-white">Dumbbell Rows</span>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">22.5 lbs × 12</p>
                      <p className="text-xs text-gray-400">Sep 22</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <span className="text-white">Plank Hold</span>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">75 seconds</p>
                      <p className="text-xs text-gray-400">Sep 18</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "First Workout", description: "Complete your first workout", icon: Trophy, earned: true, date: "Sep 15" },
              { name: "Consistency Champion", description: "7-day workout streak", icon: Flame, earned: true, date: "Sep 22" },
              { name: "Strength Builder", description: "Complete 10 strength workouts", icon: Dumbbell, earned: false, progress: 60 },
              { name: "Cardio King", description: "Burn 1000 calories in cardio", icon: Heart, earned: false, progress: 85 },
              { name: "Early Bird", description: "Complete 5 morning workouts", icon: Clock, earned: true, date: "Sep 20" },
              { name: "Dedication Master", description: "30-day workout streak", icon: Award, earned: false, progress: 40 }
            ].map((achievement, index) => (
              <Card
                key={index}
                className={`bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm transition-all duration-300 ${
                  achievement.earned 
                    ? 'border-yellow-500/40 shadow-yellow-500/20' 
                    : 'border-gray-500/30'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                      achievement.earned 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                        : 'bg-gray-600'
                    }`}>
                      <achievement.icon className={`w-8 h-8 ${
                        achievement.earned ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                    </div>
                    {achievement.earned ? (
                      <Badge className="bg-yellow-500 text-black">
                        Earned {achievement.date}
                      </Badge>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">
                          Progress: {achievement.progress}%
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Workout Detail Dialog */}
      <Dialog open={showWorkoutDetail} onOpenChange={setShowWorkoutDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-purple-500/30 backdrop-blur-xl">
          {selectedWorkout && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  {selectedWorkout.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Detailed information about this workout including exercises, difficulty, and ratings
                </DialogDescription>
                <div className="flex items-start gap-4 mt-4">
                  {selectedWorkout.image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={selectedWorkout.image}
                        alt={selectedWorkout.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-gray-300 mt-2">{selectedWorkout.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge className={getDifficultyColor(selectedWorkout.difficulty)}>
                        {selectedWorkout.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400">{selectedWorkout.rating}</span>
                      </div>
                      <span className="text-gray-400">{selectedWorkout.completions} completions</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <Clock className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-white font-medium">{selectedWorkout.duration}</p>
                  <p className="text-sm text-blue-300">Duration</p>
                </div>
                <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
                  <Flame className="w-6 h-6 text-orange-400 mb-2" />
                  <p className="text-white font-medium">{selectedWorkout.estimatedCalories}</p>
                  <p className="text-sm text-orange-300">Calories</p>
                </div>
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <Target className="w-6 h-6 text-green-400 mb-2" />
                  <p className="text-white font-medium">{selectedWorkout.exercises.length}</p>
                  <p className="text-sm text-green-300">Exercises</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl text-white mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Exercise List
                </h3>
                <div className="space-y-3">
                  {selectedWorkout.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => setShowExerciseDetail(exercise)}
                    >
                      {exercise.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={exercise.image}
                            alt={exercise.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{exercise.name}</h4>
                        <p className="text-sm text-gray-300">
                          {exercise.sets} sets × {exercise.reps}
                          {exercise.weight && ` @ ${exercise.weight}`}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {exercise.targetMuscles.slice(0, 3).map((muscle, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {muscle}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowWorkoutDetail(false);
                    startWorkout(selectedWorkout);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Workout
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorite
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom Workout Dialog */}
      <Dialog open={showCustomWorkout} onOpenChange={setShowCustomWorkout}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-purple-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Create Custom Workout
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Build your own personalized workout routine
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div>
              <Label className="text-gray-200 mb-2 block">Workout Name</Label>
              <Input
                placeholder="e.g., Morning Strength Session"
                className="bg-gray-800/50 border-purple-500/30 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-200 mb-2 block">Duration (minutes)</Label>
                <Input
                  type="number"
                  placeholder="45"
                  className="bg-gray-800/50 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-200 mb-2 block">Difficulty</Label>
                <Select>
                  <SelectTrigger className="bg-gray-800/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-200 mb-2 block">Category</Label>
              <Select>
                <SelectTrigger className="bg-gray-800/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="Flexibility">Flexibility</SelectItem>
                  <SelectItem value="Circuit">Circuit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-200 mb-2 block">Description</Label>
              <Textarea
                placeholder="Describe your workout goals and focus areas..."
                className="bg-gray-800/50 border-purple-500/30 text-white min-h-[80px]"
              />
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-blue-400" />
                  Exercises
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Exercise
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Start by adding exercises to your custom workout
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCustomWorkout(false)}
                className="flex-1 border-gray-500/50 text-gray-300 hover:bg-gray-500/20"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Custom Workout Created! 💪", {
                    description: "Your personalized workout is ready to start",
                    duration: 3000,
                  });
                  setShowCustomWorkout(false);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Workout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exercise Detail Dialog */}
      <Dialog open={!!showExerciseDetail} onOpenChange={() => setShowExerciseDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-purple-500/30 backdrop-blur-xl">
          {showExerciseDetail && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
                  {showExerciseDetail.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Exercise instructions, form tips, and personal records
                </DialogDescription>
              </DialogHeader>

              {showExerciseDetail.image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={showExerciseDetail.image}
                    alt={showExerciseDetail.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      {showExerciseDetail.targetMuscles.map((muscle, index) => (
                        <Badge key={index} variant="secondary">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <p className="text-green-300 text-sm mb-1">Sets</p>
                  <p className="text-2xl font-bold text-white">{showExerciseDetail.sets}</p>
                </div>
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <p className="text-blue-300 text-sm mb-1">Reps</p>
                  <p className="text-2xl font-bold text-white">{showExerciseDetail.reps}</p>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <p className="text-purple-300 text-sm mb-1">Rest</p>
                  <p className="text-2xl font-bold text-white">{showExerciseDetail.restTime}s</p>
                </div>
              </div>

              {showExerciseDetail.instructions && (
                <div>
                  <h3 className="text-lg text-white mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Instructions
                  </h3>
                  <ol className="space-y-2">
                    {showExerciseDetail.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3 text-gray-300">
                        <span className="bg-blue-500/20 text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {showExerciseDetail.tips && (
                <div>
                  <h3 className="text-lg text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-2">
                    {showExerciseDetail.tips.map((tip, index) => (
                      <li key={index} className="flex gap-3 text-gray-300">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showExerciseDetail.personalBest && (
                <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/10 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-300 font-medium">Personal Best</span>
                  </div>
                  <p className="text-white">
                    {showExerciseDetail.personalBest.reps} reps
                    {showExerciseDetail.personalBest.weight > 0 && ` @ ${showExerciseDetail.personalBest.weight} lbs`}
                    <span className="text-gray-400 ml-2">({showExerciseDetail.personalBest.date})</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}