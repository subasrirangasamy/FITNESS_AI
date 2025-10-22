/**
 * Sample Data Generator
 * 
 * This component provides quick buttons to populate the database with sample data
 * for testing and demonstration purposes.
 */

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Database, Trash2, Download, Upload } from 'lucide-react';
import { db } from './DatabaseService';
import { toast } from 'sonner@2.0.3';

export function SampleDataGenerator() {
  const generateSampleWorkouts = () => {
    const workoutTypes = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Sports'];
    const exercises = [
      { name: 'Bench Press', sets: 4, reps: 10, weight: 185 },
      { name: 'Squats', sets: 4, reps: 8, weight: 225 },
      { name: 'Deadlifts', sets: 3, reps: 5, weight: 315 },
      { name: 'Pull-ups', sets: 3, reps: 12 },
      { name: 'Running', duration: 30 },
    ];

    // Generate 10 sample workouts over the past 2 weeks
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 1.5)); // Every 1.5 days

      const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      const duration = 30 + Math.floor(Math.random() * 30); // 30-60 min
      const caloriesBurned = 200 + Math.floor(Math.random() * 300); // 200-500 cal

      const selectedExercises = exercises
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 + Math.floor(Math.random() * 3)); // 3-5 exercises

      db.addWorkout({
        date: date.toISOString(),
        type: type,
        duration: duration,
        caloriesBurned: caloriesBurned,
        exercises: selectedExercises,
        notes: `Sample ${type} workout`,
      });
    }

    toast.success('Sample Workouts Added!', {
      description: 'Generated 10 workouts over the past 2 weeks',
    });
  };

  const generateSampleMeals = () => {
    const breakfasts = [
      { name: 'Greek Yogurt Bowl', calories: 320, protein: 25, carbs: 35, fats: 8 },
      { name: 'Oatmeal with Berries', calories: 280, protein: 12, carbs: 48, fats: 6 },
      { name: 'Scrambled Eggs & Toast', calories: 350, protein: 22, carbs: 28, fats: 16 },
    ];

    const lunches = [
      { name: 'Chicken Salad', calories: 420, protein: 35, carbs: 25, fats: 18 },
      { name: 'Quinoa Bowl', calories: 450, protein: 18, carbs: 58, fats: 14 },
      { name: 'Turkey Sandwich', calories: 380, protein: 28, carbs: 42, fats: 12 },
    ];

    const dinners = [
      { name: 'Grilled Salmon', calories: 480, protein: 38, carbs: 22, fats: 26 },
      { name: 'Chicken Stir-Fry', calories: 520, protein: 42, carbs: 48, fats: 18 },
      { name: 'Pasta with Veggies', calories: 450, protein: 18, carbs: 68, fats: 12 },
    ];

    // Generate meals for the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Breakfast
      const breakfast = breakfasts[Math.floor(Math.random() * breakfasts.length)];
      db.addMeal({
        date: new Date(date.setHours(8, 0, 0, 0)).toISOString(),
        type: 'breakfast',
        items: [{ ...breakfast, servings: 1 }],
        totalMacros: {
          calories: breakfast.calories,
          protein: breakfast.protein,
          carbs: breakfast.carbs,
          fats: breakfast.fats,
        },
      });

      // Lunch
      const lunch = lunches[Math.floor(Math.random() * lunches.length)];
      db.addMeal({
        date: new Date(date.setHours(12, 30, 0, 0)).toISOString(),
        type: 'lunch',
        items: [{ ...lunch, servings: 1 }],
        totalMacros: {
          calories: lunch.calories,
          protein: lunch.protein,
          carbs: lunch.carbs,
          fats: lunch.fats,
        },
      });

      // Dinner
      const dinner = dinners[Math.floor(Math.random() * dinners.length)];
      db.addMeal({
        date: new Date(date.setHours(19, 0, 0, 0)).toISOString(),
        type: 'dinner',
        items: [{ ...dinner, servings: 1 }],
        totalMacros: {
          calories: dinner.calories,
          protein: dinner.protein,
          carbs: dinner.carbs,
          fats: dinner.fats,
        },
      });
    }

    toast.success('Sample Meals Added!', {
      description: 'Generated 3 meals per day for the past week',
    });
  };

  const unlockAllAchievements = () => {
    const definitions = db.getAchievementDefinitions();
    let unlocked = 0;

    definitions.forEach(achievement => {
      const result = db.unlockAchievement(achievement.id);
      if (result) unlocked++;
    });

    toast.success('Achievements Unlocked!', {
      description: `Unlocked ${unlocked} achievements`,
    });
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
      db.clearAllData();
      toast.success('Data Cleared', {
        description: 'All data has been deleted. Refresh to start fresh.',
      });
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const exportData = () => {
    const data = db.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success('Data Exported!', {
      description: 'Your data has been downloaded as JSON',
    });
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const success = db.importData(event.target.result);
          if (success) {
            toast.success('Data Imported!', {
              description: 'Your data has been restored. Refreshing...',
            });
            setTimeout(() => window.location.reload(), 2000);
          } else {
            toast.error('Import Failed', {
              description: 'Invalid data format',
            });
          }
        } catch (error) {
          toast.error('Import Error', {
            description: 'Failed to parse JSON file',
          });
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Tools
        </CardTitle>
        <CardDescription>
          Generate sample data for testing or manage your database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={generateSampleWorkouts}
            variant="outline"
            className="w-full"
          >
            Generate Workouts
          </Button>
          
          <Button
            onClick={generateSampleMeals}
            variant="outline"
            className="w-full"
          >
            Generate Meals
          </Button>
          
          <Button
            onClick={unlockAllAchievements}
            variant="outline"
            className="w-full"
          >
            Unlock Achievements
          </Button>
          
          <Button
            onClick={exportData}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          
          <Button
            onClick={importData}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          
          <Button
            onClick={clearAllData}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Generate sample workouts to test history and stats</p>
          <p>• Generate sample meals to test nutrition tracking</p>
          <p>• Export your data as backup before clearing</p>
          <p>• Import previously exported data to restore</p>
        </div>
      </CardContent>
    </Card>
  );
}
