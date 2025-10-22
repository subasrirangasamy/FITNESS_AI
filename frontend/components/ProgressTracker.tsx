import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Target, Calendar, Award, Zap, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ProgressTracker() {
  const [showTimeline, setShowTimeline] = useState(false);
  const weightData = [
    { date: "Jan 1", weight: 180, bodyFat: 18 },
    { date: "Jan 15", weight: 178, bodyFat: 17.5 },
    { date: "Feb 1", weight: 176, bodyFat: 17 },
    { date: "Feb 15", weight: 175, bodyFat: 16.8 },
    { date: "Mar 1", weight: 174, bodyFat: 16.5 },
    { date: "Mar 15", weight: 173, bodyFat: 16.2 },
    { date: "Apr 1", weight: 172, bodyFat: 16 },
  ];

  const strengthData = [
    { exercise: "Bench Press", week1: 135, week2: 140, week3: 145, week4: 150 },
    { exercise: "Squat", week1: 185, week2: 195, week3: 205, week4: 215 },
    { exercise: "Deadlift", week1: 225, week2: 235, week3: 245, week4: 255 },
    { exercise: "Overhead Press", week1: 95, week2: 100, week3: 105, week4: 110 },
  ];

  const workoutConsistency = [
    { week: "Week 1", planned: 5, completed: 4 },
    { week: "Week 2", planned: 5, completed: 5 },
    { week: "Week 3", planned: 5, completed: 3 },
    { week: "Week 4", planned: 5, completed: 5 },
    { week: "Week 5", planned: 5, completed: 4 },
    { week: "Week 6", planned: 5, completed: 5 },
  ];

  const achievements = [
    {
      id: "1",
      title: "Consistency King",
      description: "Completed 20 workouts in a row",
      icon: "🏆",
      date: "March 15",
      type: "gold"
    },
    {
      id: "2",
      title: "Strength Milestone",
      description: "Deadlifted 2x body weight",
      icon: "💪",
      date: "March 10",
      type: "silver"
    },
    {
      id: "3",
      title: "Nutrition Master",
      description: "Hit protein goals for 7 days straight",
      icon: "🥗",
      date: "March 5",
      type: "bronze"
    },
    {
      id: "4",
      title: "Early Bird",
      description: "10 morning workouts completed",
      icon: "🌅",
      date: "February 28",
      type: "bronze"
    }
  ];

  const currentStats = {
    totalWorkouts: 89,
    totalMinutes: 3420,
    currentStreak: 12,
    personalRecords: 8,
    averageSession: 38,
    caloriesBurned: 18500
  };

  const goals = [
    {
      title: "Lose 10 lbs",
      current: 8,
      target: 10,
      unit: "lbs",
      deadline: "May 1",
      category: "weight"
    },
    {
      title: "Bench Press 160 lbs",
      current: 150,
      target: 160,
      unit: "lbs",
      deadline: "April 15",
      category: "strength"
    },
    {
      title: "5K in under 25 min",
      current: 26.5,
      target: 25,
      unit: "min",
      deadline: "June 1",
      category: "cardio"
    },
    {
      title: "30 Days Consistency",
      current: 12,
      target: 30,
      unit: "days",
      deadline: "April 30",
      category: "habit"
    }
  ];

  const aiInsights = [
    {
      type: "strength",
      title: "Strength Progression Accelerating",
      description: "Your RL algorithm detected a 15% increase in strength gains over the past month. The GA optimization suggests this is due to improved rest periods and progressive overload timing.",
      confidence: 94,
      trend: "up"
    },
    {
      type: "nutrition",
      title: "Protein Timing Optimization",
      description: "Data shows 23% better recovery when protein is consumed within 2 hours post-workout. Your current timing aligns with this optimal window 78% of the time.",
      confidence: 87,
      trend: "up"
    },
    {
      type: "consistency",
      title: "Workout Timing Pattern",
      description: "Your best performance occurs during 7-9 AM sessions. Morning workouts show 18% higher intensity and completion rates compared to evening sessions.",
      confidence: 91,
      trend: "neutral"
    }
  ];

  const getAchievementColor = (type: string) => {
    switch (type) {
      case "gold": return "bg-yellow-100 border-yellow-300";
      case "silver": return "bg-gray-100 border-gray-300";
      case "bronze": return "bg-orange-100 border-orange-300";
      default: return "bg-blue-100 border-blue-300";
    }
  };

  // Timeline data
  const timelineEvents = [
    { date: "March 15", event: "Reached 20-workout streak", type: "achievement", icon: "🏆" },
    { date: "March 10", event: "Personal record: Deadlift 255 lbs", type: "pr", icon: "💪" },
    { date: "March 5", event: "7-day nutrition streak", type: "nutrition", icon: "🥗" },
    { date: "February 28", event: "Completed 10 morning workouts", type: "consistency", icon: "🌅" },
    { date: "February 20", event: "Lost 5 lbs since start", type: "milestone", icon: "⚖️" },
    { date: "February 15", event: "Personal record: Bench Press 150 lbs", type: "pr", icon: "💪" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Progress Tracker</h1>
        <Button onClick={() => setShowTimeline(true)}>
          <Calendar className="w-4 h-4 mr-2" />
          View Timeline
        </Button>
      </div>

      {/* Timeline Modal */}
      <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-purple-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Your Fitness Timeline
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Track your journey and celebrate every milestone
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <div className="space-y-4">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index}
                  className="flex gap-4 p-4 rounded-xl glass-strong hover:bg-gray-700/30 transition-all duration-300 animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl shadow-lg">
                      {event.icon}
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-500 to-transparent mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">{event.date}</span>
                      <Badge variant="outline" className={`text-xs ${
                        event.type === 'achievement' ? 'border-yellow-500/50 text-yellow-300' :
                        event.type === 'pr' ? 'border-red-500/50 text-red-300' :
                        event.type === 'nutrition' ? 'border-green-500/50 text-green-300' :
                        'border-blue-500/50 text-blue-300'
                      }`}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-white font-medium">{event.event}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Key Stats - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-blue-500/30 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">{currentStats.totalWorkouts}</p>
              <p className="text-sm text-blue-300">Total Workouts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border-orange-500/30 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">{currentStats.currentStreak}</p>
              <p className="text-sm text-orange-300">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">{Math.round(currentStats.caloriesBurned / 1000)}K</p>
              <p className="text-sm text-green-300">Calories Burned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="body">Body Metrics</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Workout Consistency - Visual Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Workout Consistency</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your weekly workout completion pattern
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workoutConsistency.map((week, index) => {
                  const completionRate = (week.completed / week.planned) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{week.week}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {week.completed}/{week.planned} completed
                          </span>
                          <Badge variant={completionRate === 100 ? "default" : completionRate >= 80 ? "secondary" : "outline"}>
                            {Math.round(completionRate)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: week.planned }, (_, i) => (
                          <div
                            key={i}
                            className={`h-8 flex-1 rounded ${
                              i < week.completed 
                                ? "bg-gradient-to-r from-green-500 to-green-600 shadow-md" 
                                : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
                    <span>Completed Workout</span>
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
                    <span>Missed Workout</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 ${getAchievementColor(achievement.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4>{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {achievement.date}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strength" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strength Progression (Monthly)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your one-rep max estimates based on workout data
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={strengthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exercise" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="week1" fill="#fbbf24" name="Week 1" />
                  <Bar dataKey="week2" fill="#f59e0b" name="Week 2" />
                  <Bar dataKey="week3" fill="#d97706" name="Week 3" />
                  <Bar dataKey="week4" fill="#b45309" name="Week 4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {strengthData.map((exercise) => {
              const improvement = exercise.week4 - exercise.week1;
              const improvementPercent = ((improvement / exercise.week1) * 100).toFixed(1);
              
              return (
                <Card key={exercise.exercise}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <h4>{exercise.exercise}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{exercise.week4} lbs</span>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">+{improvementPercent}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        +{improvement} lbs this month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="body" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Weight (lbs)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Body Fat Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="bodyFat" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Body Fat %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl text-green-600">-8 lbs</p>
                <p className="text-sm text-muted-foreground">Weight Lost</p>
                <p className="text-xs text-muted-foreground mt-1">Since January</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl text-blue-600">16.0%</p>
                <p className="text-sm text-muted-foreground">Current Body Fat</p>
                <p className="text-xs text-muted-foreground mt-1">-2% since start</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl text-purple-600">+2.3%</p>
                <p className="text-sm text-muted-foreground">Muscle Mass</p>
                <p className="text-xs text-muted-foreground mt-1">Estimated gain</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal, index) => {
              const progress = (goal.current / goal.target) * 100;
              const isReversed = goal.category === "cardio"; // For goals where lower is better
              const displayProgress = isReversed ? Math.max(0, 100 - progress + 100) : progress;
              
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Badge variant="outline">{goal.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">
                          {goal.current} {goal.unit}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Target: {goal.target} {goal.unit}
                        </span>
                      </div>
                      
                      <Progress value={Math.min(100, displayProgress)} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Deadline: {goal.deadline}
                        </span>
                        <span className={`flex items-center gap-1 ${
                          progress >= 80 ? 'text-green-600' : 
                          progress >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {progress >= 80 ? <TrendingUp className="w-4 h-4" /> : 
                           progress >= 50 ? <Target className="w-4 h-4" /> : 
                           <TrendingDown className="w-4 h-4" />}
                          {Math.round(displayProgress)}%
                        </span>
                      </div>
                      
                      {goal.category === "weight" && (
                        <p className="text-xs text-muted-foreground">
                          {goal.target - goal.current} {goal.unit} to go
                        </p>
                      )}
                      {goal.category === "strength" && (
                        <p className="text-xs text-muted-foreground">
                          {goal.target - goal.current} {goal.unit} to go
                        </p>
                      )}
                      {goal.category === "cardio" && (
                        <p className="text-xs text-muted-foreground">
                          Need to improve by {(goal.current - goal.target).toFixed(1)} {goal.unit}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI-Powered Progress Insights
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Generated by our hybrid RL + GA algorithm analyzing your data patterns
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="flex items-center gap-2">
                        {insight.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {insight.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                        {insight.trend === "neutral" && <Target className="w-4 h-4 text-blue-500" />}
                        {insight.title}
                      </h4>
                      <Badge variant="secondary">{insight.confidence}% confidence</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Reinforcement Learning</span>
                    <span>87% optimized</span>
                  </div>
                  <Progress value={87} />
                  
                  <div className="flex justify-between">
                    <span>Genetic Algorithm</span>
                    <span>94% converged</span>
                  </div>
                  <Progress value={94} />
                  
                  <div className="flex justify-between">
                    <span>Recommendation Accuracy</span>
                    <span>91% success rate</span>
                  </div>
                  <Progress value={91} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pattern Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm">✅ Best workout times identified: 7-9 AM</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm">📊 Optimal rest periods calculated for each exercise</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm">🎯 Progressive overload timing optimized</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm">🍽️ Nutrition timing correlated with performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}