/**
 * 🗄️ DATABASE SERVICE
 * 
 * Comprehensive data persistence layer using localStorage
 * Mimics MongoDB operations for easy migration to real backend
 * 
 * MongoDB Schema Structure (for future backend implementation):
 * 
 * Users Collection:
 * {
 *   _id: ObjectId,
 *   name: String,
 *   email: String,
 *   createdAt: Date,
 *   stats: { totalWorkouts, streak, xp, level },
 *   goals: [{ type, target, current, deadline }],
 *   achievements: [{ id, unlockedAt }]
 * }
 * 
 * Workouts Collection:
 * {
 *   _id: ObjectId,
 *   userId: ObjectId,
 *   date: Date,
 *   type: String,
 *   duration: Number,
 *   caloriesBurned: Number,
 *   exercises: [{ name, sets, reps, weight, duration }],
 *   notes: String
 * }
 * 
 * Meals Collection:
 * {
 *   _id: ObjectId,
 *   userId: ObjectId,
 *   date: Date,
 *   type: String (breakfast/lunch/dinner/snack),
 *   items: [{ name, calories, protein, carbs, fats, servings }],
 *   totalMacros: { calories, protein, carbs, fats }
 * }
 * 
 * MealPlans Collection:
 * {
 *   _id: ObjectId,
 *   userId: ObjectId,
 *   name: String,
 *   description: String,
 *   meals: [{ type, items, macros }],
 *   createdAt: Date
 * }
 */

export interface UserStats {
  totalWorkouts: number;
  streak: number;
  xp: number;
  level: number;
  caloriesBurned: number;
  lastWorkoutDate: string | null;
}

export interface Goal {
  id: string;
  type: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // in minutes
}

export interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  exercises: Exercise[];
  notes?: string;
  xpGained: number;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servings: number;
}

export interface Meal {
  id: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: FoodItem[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
  };
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  createdAt: string;
}

// Leaderboard feature removed - can be added with real backend

class DatabaseService {
  private readonly STORAGE_KEYS = {
    USER_STATS: 'fitness-ai-user-stats',
    GOALS: 'fitness-ai-goals',
    ACHIEVEMENTS: 'fitness-ai-achievements',
    WORKOUTS: 'fitness-ai-workouts',
    MEALS: 'fitness-ai-meals',
    MEAL_PLANS: 'fitness-ai-meal-plans',
  };

  // ============ USER STATS ============
  getUserStats(): UserStats {
    const data = localStorage.getItem(this.STORAGE_KEYS.USER_STATS);
    if (data) {
      return JSON.parse(data);
    }
    
    const defaultStats: UserStats = {
      totalWorkouts: 0,
      streak: 0,
      xp: 0,
      level: 1,
      caloriesBurned: 0,
      lastWorkoutDate: null,
    };
    
    this.saveUserStats(defaultStats);
    return defaultStats;
  }

  saveUserStats(stats: UserStats): void {
    localStorage.setItem(this.STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  }

  updateUserStats(updates: Partial<UserStats>): UserStats {
    const currentStats = this.getUserStats();
    const newStats = { ...currentStats, ...updates };
    this.saveUserStats(newStats);
    return newStats;
  }

  // Calculate streak based on workout history
  calculateStreak(): number {
    const workouts = this.getWorkouts();
    if (workouts.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedWorkouts = workouts
      .map(w => new Date(w.date))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let currentDate = new Date(today);

    for (const workoutDate of sortedWorkouts) {
      const workoutDay = new Date(workoutDate);
      workoutDay.setHours(0, 0, 0, 0);

      if (workoutDay.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (workoutDay.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  }

  // ============ GOALS ============
  getGoals(): Goal[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.GOALS);
    if (data) {
      return JSON.parse(data);
    }
    
    const defaultGoals: Goal[] = [
      {
        id: '1',
        type: 'Weekly Workouts',
        target: 5,
        current: 0,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        icon: '🏋️',
      },
      {
        id: '2',
        type: 'Calories Burned',
        target: 3000,
        current: 0,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        icon: '🔥',
      },
    ];
    
    this.saveGoals(defaultGoals);
    return defaultGoals;
  }

  saveGoals(goals: Goal[]): void {
    localStorage.setItem(this.STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  updateGoal(goalId: string, updates: Partial<Goal>): Goal[] {
    const goals = this.getGoals();
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    this.saveGoals(updatedGoals);
    return updatedGoals;
  }

  addGoal(goal: Omit<Goal, 'id'>): Goal[] {
    const goals = this.getGoals();
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    const updatedGoals = [...goals, newGoal];
    this.saveGoals(updatedGoals);
    return updatedGoals;
  }

  deleteGoal(goalId: string): Goal[] {
    const goals = this.getGoals();
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    this.saveGoals(updatedGoals);
    return updatedGoals;
  }

  // ============ ACHIEVEMENTS ============
  getAchievements(): Achievement[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
  }

  saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(this.STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  unlockAchievement(achievementId: string): Achievement | null {
    const achievements = this.getAchievements();
    
    // Check if already unlocked
    if (achievements.some(a => a.id === achievementId)) {
      return null;
    }

    const achievementDefinitions = this.getAchievementDefinitions();
    const definition = achievementDefinitions.find(a => a.id === achievementId);
    
    if (!definition) return null;

    const newAchievement: Achievement = {
      ...definition,
      unlockedAt: new Date().toISOString(),
    };

    const updatedAchievements = [...achievements, newAchievement];
    this.saveAchievements(updatedAchievements);
    
    return newAchievement;
  }

  checkAndUnlockAchievements(): Achievement[] {
    const stats = this.getUserStats();
    const workouts = this.getWorkouts();
    const meals = this.getMeals();
    const newlyUnlocked: Achievement[] = [];

    // Define achievement unlock conditions
    const checks = [
      { id: 'first-workout', condition: workouts.length >= 1 },
      { id: 'workout-warrior', condition: workouts.length >= 10 },
      { id: 'fitness-master', condition: workouts.length >= 50 },
      { id: 'streak-starter', condition: stats.streak >= 3 },
      { id: 'streak-legend', condition: stats.streak >= 7 },
      { id: 'calorie-crusher', condition: stats.caloriesBurned >= 5000 },
      { id: 'nutrition-novice', condition: meals.length >= 1 },
      { id: 'meal-planner', condition: meals.length >= 20 },
      { id: 'level-up', condition: stats.level >= 5 },
      { id: 'xp-master', condition: stats.xp >= 10000 },
    ];

    checks.forEach(({ id, condition }) => {
      if (condition) {
        const achievement = this.unlockAchievement(id);
        if (achievement) {
          newlyUnlocked.push(achievement);
        }
      }
    });

    return newlyUnlocked;
  }

  getAchievementDefinitions(): Omit<Achievement, 'unlockedAt'>[] {
    return [
      { id: 'first-workout', title: 'First Steps', description: 'Complete your first workout', icon: '🎯', rarity: 'common' },
      { id: 'workout-warrior', title: 'Workout Warrior', description: 'Complete 10 workouts', icon: '💪', rarity: 'rare' },
      { id: 'fitness-master', title: 'Fitness Master', description: 'Complete 50 workouts', icon: '👑', rarity: 'epic' },
      { id: 'streak-starter', title: 'Streak Starter', description: 'Maintain a 3-day streak', icon: '🔥', rarity: 'common' },
      { id: 'streak-legend', title: 'Streak Legend', description: 'Maintain a 7-day streak', icon: '⚡', rarity: 'legendary' },
      { id: 'calorie-crusher', title: 'Calorie Crusher', description: 'Burn 5000 total calories', icon: '🔥', rarity: 'rare' },
      { id: 'nutrition-novice', title: 'Nutrition Novice', description: 'Log your first meal', icon: '🥗', rarity: 'common' },
      { id: 'meal-planner', title: 'Meal Planner', description: 'Log 20 meals', icon: '📊', rarity: 'epic' },
      { id: 'level-up', title: 'Level 5!', description: 'Reach level 5', icon: '⭐', rarity: 'rare' },
      { id: 'xp-master', title: 'XP Master', description: 'Earn 10,000 XP', icon: '💎', rarity: 'legendary' },
    ];
  }

  // ============ WORKOUTS ============
  getWorkouts(): Workout[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  }

  saveWorkouts(workouts: Workout[]): void {
    localStorage.setItem(this.STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  }

  addWorkout(workout: Omit<Workout, 'id' | 'xpGained'>): Workout {
    const workouts = this.getWorkouts();
    
    // Calculate XP based on duration and calories
    const xpGained = Math.round(workout.duration * 10 + workout.caloriesBurned / 2);
    
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      xpGained,
    };

    const updatedWorkouts = [...workouts, newWorkout];
    this.saveWorkouts(updatedWorkouts);

    // Update user stats
    const stats = this.getUserStats();
    const newStreak = this.calculateStreak();
    
    this.updateUserStats({
      totalWorkouts: stats.totalWorkouts + 1,
      caloriesBurned: stats.caloriesBurned + workout.caloriesBurned,
      xp: stats.xp + xpGained,
      level: Math.floor(1 + Math.sqrt((stats.xp + xpGained) / 100)),
      streak: newStreak,
      lastWorkoutDate: workout.date,
    });

    // Check for new achievements
    this.checkAndUnlockAchievements();

    return newWorkout;
  }

  getWorkoutsByDateRange(startDate: string, endDate: string): Workout[] {
    const workouts = this.getWorkouts();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date).getTime();
      return workoutDate >= start && workoutDate <= end;
    });
  }

  getWorkoutStats(days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const workouts = this.getWorkoutsByDateRange(
      startDate.toISOString(),
      endDate.toISOString()
    );

    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const avgCaloriesPerWorkout = workouts.length > 0 
      ? Math.round(totalCalories / workouts.length)
      : 0;

    return {
      totalWorkouts: workouts.length,
      totalDuration,
      totalCalories,
      avgCaloriesPerWorkout,
    };
  }

  // ============ MEALS ============
  getMeals(): Meal[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  }

  saveMeals(meals: Meal[]): void {
    localStorage.setItem(this.STORAGE_KEYS.MEALS, JSON.stringify(meals));
  }

  addMeal(meal: Omit<Meal, 'id'>): Meal {
    const meals = this.getMeals();
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
    };

    const updatedMeals = [...meals, newMeal];
    this.saveMeals(updatedMeals);

    // Check for nutrition achievements
    this.checkAndUnlockAchievements();

    return newMeal;
  }

  getMealsByDate(date: string): Meal[] {
    const meals = this.getMeals();
    const targetDate = new Date(date).toDateString();
    
    return meals.filter(meal => 
      new Date(meal.date).toDateString() === targetDate
    );
  }

  getDailyMacros(date: string) {
    const meals = this.getMealsByDate(date);
    
    return meals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.totalMacros.calories,
        protein: totals.protein + meal.totalMacros.protein,
        carbs: totals.carbs + meal.totalMacros.carbs,
        fats: totals.fats + meal.totalMacros.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }

  // ============ MEAL PLANS ============
  getMealPlans(): MealPlan[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.MEAL_PLANS);
    return data ? JSON.parse(data) : [];
  }

  saveMealPlans(plans: MealPlan[]): void {
    localStorage.setItem(this.STORAGE_KEYS.MEAL_PLANS, JSON.stringify(plans));
  }

  addMealPlan(plan: Omit<MealPlan, 'id' | 'createdAt'>): MealPlan {
    const plans = this.getMealPlans();
    const newPlan: MealPlan = {
      ...plan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedPlans = [...plans, newPlan];
    this.saveMealPlans(updatedPlans);

    return newPlan;
  }

  deleteMealPlan(planId: string): MealPlan[] {
    const plans = this.getMealPlans();
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    this.saveMealPlans(updatedPlans);
    return updatedPlans;
  }

  // Leaderboard removed - will be implemented with real backend and API

  // ============ UTILITIES ============
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  exportData(): string {
    const data = {
      stats: this.getUserStats(),
      goals: this.getGoals(),
      achievements: this.getAchievements(),
      workouts: this.getWorkouts(),
      meals: this.getMeals(),
      mealPlans: this.getMealPlans(),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.stats) this.saveUserStats(data.stats);
      if (data.goals) this.saveGoals(data.goals);
      if (data.achievements) this.saveAchievements(data.achievements);
      if (data.workouts) this.saveWorkouts(data.workouts);
      if (data.meals) this.saveMeals(data.meals);
      if (data.mealPlans) this.saveMealPlans(data.mealPlans);

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const db = new DatabaseService();
