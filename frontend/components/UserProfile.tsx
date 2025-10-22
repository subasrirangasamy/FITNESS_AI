import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { User, Settings, Target, Bell, Shield, HelpCircle, LogOut } from "lucide-react";

interface UserProfileProps {
  userData: { name: string; email: string } | null;
}

export function UserProfile({ userData }: UserProfileProps) {
  const [userInfo, setUserInfo] = useState({
    name: userData?.name || "User",
    email: userData?.email || "user@email.com",
    age: 28,
    height: "5'10\"",
    weight: 172,
    fitnessLevel: "Intermediate",
    goals: ["Muscle Building", "Strength", "Weight Loss"],
    workoutDays: 5,
    preferredTime: "Morning",
    experience: "2 years",
    gender: "Male",
    occupation: "Software Engineer",
    location: "New York, NY",
    emergencyContact: "",
    medicalConditions: "",
    allergies: "",
    targetWeight: 165,
    bodyFatPercentage: 16,
    motivationalQuote: "Stronger every day!"
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    aiCoaching: true,
    dataCollection: true,
    publicProfile: false
  });

  const [aiSettings, setAiSettings] = useState({
    aggressiveness: "Moderate",
    adaptationSpeed: "Fast",
    recommendationTypes: ["Workouts", "Nutrition", "Recovery"],
    learningFromFeedback: true
  });

  const achievementBadges = [
    { name: "Early Bird", icon: "🌅", description: "Completed 10 morning workouts" },
    { name: "Consistency King", icon: "👑", description: "20 workouts in a row" },
    { name: "Strength Beast", icon: "💪", description: "Lifted 2x body weight" },
    { name: "Nutrition Master", icon: "🥗", description: "7 days of perfect nutrition" },
    { name: "Goal Crusher", icon: "🎯", description: "Achieved 3 fitness goals" }
  ];

  const stats = {
    totalWorkouts: 89,
    totalHours: 57,
    currentStreak: 12,
    personalRecords: 8,
    goalsAchieved: 3,
    memberSince: "January 2024"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Profile</h1>
        <Button variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/api/placeholder/80/80" />
                    <AvatarFallback className="text-lg">AJ</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3>{userInfo.name}</h3>
                    <p className="text-muted-foreground">{userInfo.email}</p>
                    <div className="flex gap-2">
                      <Badge>{userInfo.fitnessLevel}</Badge>
                      <Badge variant="secondary">{userInfo.experience} experience</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={userInfo.name} onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} className="font-[Abhaya_Libre_ExtraBold]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" value={userInfo.age} onChange={(e) => setUserInfo({...userInfo, age: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={userInfo.gender} onValueChange={(value) => setUserInfo({...userInfo, gender: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Height</Label>
                    <Input value={userInfo.height} onChange={(e) => setUserInfo({...userInfo, height: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Weight (lbs)</Label>
                    <Input type="number" value={userInfo.weight} onChange={(e) => setUserInfo({...userInfo, weight: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Weight (lbs)</Label>
                    <Input type="number" value={userInfo.targetWeight} onChange={(e) => setUserInfo({...userInfo, targetWeight: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Body Fat % (optional)</Label>
                    <Input type="number" value={userInfo.bodyFatPercentage} onChange={(e) => setUserInfo({...userInfo, bodyFatPercentage: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Occupation</Label>
                    <Input value={userInfo.occupation} onChange={(e) => setUserInfo({...userInfo, occupation: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={userInfo.location} onChange={(e) => setUserInfo({...userInfo, location: e.target.value})} />
                  </div>
                </div>

                <Separator />

                {/* Fitness Information */}
                <h4 className="text-lg">Fitness Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fitness Level</Label>
                    <Select value={userInfo.fitnessLevel} onValueChange={(value) => setUserInfo({...userInfo, fitnessLevel: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner (0-6 months)</SelectItem>
                        <SelectItem value="Intermediate">Intermediate (6 months - 2 years)</SelectItem>
                        <SelectItem value="Advanced">Advanced (2-5 years)</SelectItem>
                        <SelectItem value="Expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <Input value={userInfo.experience} onChange={(e) => setUserInfo({...userInfo, experience: e.target.value})} placeholder="e.g., 2 years" />
                  </div>
                  <div className="space-y-2">
                    <Label>Workout Days per Week</Label>
                    <Select value={userInfo.workoutDays.toString()} onValueChange={(value) => setUserInfo({...userInfo, workoutDays: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="4">4 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="6">6 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Workout Time</Label>
                    <Select value={userInfo.preferredTime} onValueChange={(value) => setUserInfo({...userInfo, preferredTime: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning (6-10 AM)</SelectItem>
                        <SelectItem value="Afternoon">Afternoon (12-4 PM)</SelectItem>
                        <SelectItem value="Evening">Evening (5-8 PM)</SelectItem>
                        <SelectItem value="Night">Night (8+ PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Health & Safety */}
                <h4 className="text-lg">Health & Safety Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Emergency Contact</Label>
                    <Input value={userInfo.emergencyContact} onChange={(e) => setUserInfo({...userInfo, emergencyContact: e.target.value})} placeholder="Name and phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Medical Conditions</Label>
                    <Input value={userInfo.medicalConditions} onChange={(e) => setUserInfo({...userInfo, medicalConditions: e.target.value})} placeholder="Any relevant conditions" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Allergies</Label>
                    <Input value={userInfo.allergies} onChange={(e) => setUserInfo({...userInfo, allergies: e.target.value})} placeholder="Food or other allergies" />
                  </div>
                </div>

                <Separator />

                {/* Motivation */}
                <div className="space-y-2">
                  <Label>Personal Motivational Quote</Label>
                  <Textarea 
                    value={userInfo.motivationalQuote} 
                    onChange={(e) => setUserInfo({...userInfo, motivationalQuote: e.target.value})} 
                    placeholder="What keeps you motivated?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fitness Goals</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Muscle Building", "Weight Loss", "Strength", "Endurance", "Flexibility", "General Health"].map((goal) => (
                      <Badge 
                        key={goal}
                        variant={userInfo.goals.includes(goal) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          if (userInfo.goals.includes(goal)) {
                            setUserInfo({...userInfo, goals: userInfo.goals.filter(g => g !== goal)});
                          } else {
                            setUserInfo({...userInfo, goals: [...userInfo.goals, goal]});
                          }
                        }}
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Your Fitness Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl">{stats.totalWorkouts}</p>
                  <p className="text-sm text-muted-foreground">Total Workouts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">{stats.totalHours}</p>
                  <p className="text-sm text-muted-foreground">Hours Trained</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">{stats.currentStreak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">{stats.personalRecords}</p>
                  <p className="text-sm text-muted-foreground">Personal Records</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">{stats.goalsAchieved}</p>
                  <p className="text-sm text-muted-foreground">Goals Achieved</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-lg">{stats.memberSince}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                AI Algorithm Configuration
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Customize how our hybrid RL + GA algorithm learns and adapts to your preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Recommendation Aggressiveness</Label>
                  <Select value={aiSettings.aggressiveness} onValueChange={(value) => setAiSettings({...aiSettings, aggressiveness: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conservative">Conservative - Gradual changes</SelectItem>
                      <SelectItem value="Moderate">Moderate - Balanced approach</SelectItem>
                      <SelectItem value="Aggressive">Aggressive - Rapid optimization</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How quickly the AI adapts your workout and nutrition plans
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Adaptation Speed</Label>
                  <Select value={aiSettings.adaptationSpeed} onValueChange={(value) => setAiSettings({...aiSettings, adaptationSpeed: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Slow">Slow - Weekly adjustments</SelectItem>
                      <SelectItem value="Fast">Fast - Daily adjustments</SelectItem>
                      <SelectItem value="Real-time">Real-time - Immediate adaptation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>AI Recommendation Types</Label>
                  <div className="space-y-2">
                    {["Workouts", "Nutrition", "Recovery", "Motivation", "Form Corrections"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Switch 
                          checked={aiSettings.recommendationTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAiSettings({...aiSettings, recommendationTypes: [...aiSettings.recommendationTypes, type]});
                            } else {
                              setAiSettings({...aiSettings, recommendationTypes: aiSettings.recommendationTypes.filter(t => t !== type)});
                            }
                          }}
                        />
                        <Label>{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={aiSettings.learningFromFeedback}
                    onCheckedChange={(checked) => setAiSettings({...aiSettings, learningFromFeedback: checked})}
                  />
                  <Label>Allow AI to learn from my feedback</Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4>Algorithm Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5>Reinforcement Learning</h5>
                    <p className="text-sm text-muted-foreground">Learning from your workout completion patterns</p>
                    <p className="text-lg mt-2">87% optimized</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5>Genetic Algorithm</h5>
                    <p className="text-sm text-muted-foreground">Evolving optimal workout combinations</p>
                    <p className="text-lg mt-2">94% converged</p>
                  </div>
                </div>
              </div>

              <Button className="w-full">Save AI Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get reminders for workouts and meals</p>
                  </div>
                  <Switch 
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => setPreferences({...preferences, notifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Updates</Label>
                    <p className="text-sm text-muted-foreground">Weekly progress reports and tips</p>
                  </div>
                  <Switch 
                    checked={preferences.emailUpdates}
                    onCheckedChange={(checked) => setPreferences({...preferences, emailUpdates: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Coaching Messages</Label>
                    <p className="text-sm text-muted-foreground">Receive motivational and guidance messages</p>
                  </div>
                  <Switch 
                    checked={preferences.aiCoaching}
                    onCheckedChange={(checked) => setPreferences({...preferences, aiCoaching: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Collection for AI</Label>
                    <p className="text-sm text-muted-foreground">Allow data collection to improve recommendations</p>
                  </div>
                  <Switch 
                    checked={preferences.dataCollection}
                    onCheckedChange={(checked) => setPreferences({...preferences, dataCollection: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your achievements visible to others</p>
                  </div>
                  <Switch 
                    checked={preferences.publicProfile}
                    onCheckedChange={(checked) => setPreferences({...preferences, publicProfile: checked})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy & Security
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Data Export
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>

              <Button className="w-full">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Badges</CardTitle>
              <p className="text-sm text-muted-foreground">
                Unlock badges as you reach new milestones in your fitness journey
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievementBadges.map((badge, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                    <div className="text-center space-y-2">
                      <div className="text-3xl">{badge.icon}</div>
                      <h4>{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <Badge className="bg-yellow-100 text-yellow-800">Unlocked</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Century Club", description: "Complete 100 workouts", progress: 89, target: 100, icon: "💯" },
                  { name: "Marathon Month", description: "Exercise every day for 30 days", progress: 12, target: 30, icon: "🏃" },
                  { name: "Strength Master", description: "Achieve 5 personal records in one month", progress: 3, target: 5, icon: "🏋️" }
                ].map((achievement, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4>{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{achievement.progress} / {achievement.target}</span>
                        <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}