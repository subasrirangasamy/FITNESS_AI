import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AccessibilityControls } from "./AccessibilityControls";
import { useTranslation } from "./TranslationContext";
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Globe, 
  Smartphone, 
  Monitor,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Database,
  Cloud,
  Wifi,
  Battery,
  HardDrive,
  RefreshCw,
  LogOut,
  User,
  Mail,
  Lock,
  AlertTriangle,
  CheckCircle,
  Info,
  Heart,
  Brain,
  Accessibility
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SettingsProps {
  userData: { name: string; email: string } | null;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  onFontSizeChange: (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => void;
}

export function Settings({ userData, theme, onThemeChange, fontSize, onFontSizeChange }: SettingsProps) {
  const { language, setLanguage } = useTranslation();
  
  const [settings, setSettings] = useState({
    // Appearance
    theme: theme,
    fontSize: fontSize,
    
    // Accessibility
    highContrast: false,
    reduceMotion: false,
    
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: true,
    aiCoachMessages: true,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Privacy & Security
    biometricAuth: false,
    autoLock: true,
    autoLockTime: '15',
    shareData: true,
    analytics: true,
    crashReports: true,
    
    // Sync & Storage
    autoSync: true,
    syncFrequency: 'real-time',
    dataBackup: true,
    offlineMode: true,
    
    // Workout Preferences
    autoStartTimer: true,
    restTimerSound: true,
    formReminders: true,
    metricUnits: false, // false = Imperial, true = Metric
    
    // AI Settings
    aiPersonalization: true,
    voiceCommands: false,
    smartSuggestions: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Handle theme change specifically
    if (key === 'theme') {
      onThemeChange(value);
    }
    
    // Handle font size change specifically
    if (key === 'fontSize') {
      onFontSizeChange(value);
    }
    
    // Handle language change specifically
    if (key === 'language') {
      setLanguage(value);
      toast.success(`Language changed to ${value.toUpperCase()}`);
    }
    
    // Show confirmation for important changes
    if (['autoSync', 'dataBackup', 'biometricAuth'].includes(key)) {
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} ${value ? 'enabled' : 'disabled'}`);
    }
  };

  const handleClearCache = () => {
    toast.success("Cache cleared successfully");
  };

  const handleDataExport = () => {
    toast.success("Data export started. You'll receive an email when ready.");
  };

  const handleResetSettings = () => {
    toast.success("Settings reset to defaults");
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
  ];

  const getCurrentThemeIcon = () => {
    const currentTheme = themeOptions.find(t => t.value === theme);
    return currentTheme ? currentTheme.icon : Sun;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">Customize your Fitness AI experience</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">v2.1.0</Badge>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-card border">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="accessibility">
            <Accessibility className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Accessibility</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    {React.createElement(getCurrentThemeIcon(), { className: "w-4 h-4" })}
                    Theme
                  </Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
                <Select 
                  value={theme} 
                  onValueChange={(value: 'light' | 'dark') => handleSettingChange('theme', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Font Size</Label>
                  <p className="text-sm text-muted-foreground">Adjust text size for better readability</p>
                </div>
                <Select 
                  value={settings.fontSize} 
                  onValueChange={(value) => handleSettingChange('fontSize', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Language
                  </Label>
                  <p className="text-sm text-muted-foreground">Select your preferred language</p>
                </div>
                <Select 
                  value={language} 
                  onValueChange={(value) => {
                    setLanguage(value);
                    toast.success(`Language changed to ${value.toUpperCase()}`);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-lg">
                    {userData?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium">{userData?.name || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">{userData?.email || 'user@example.com'}</p>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">Pro Member</Badge>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Settings */}
        <TabsContent value="accessibility" className="space-y-6">
          <AccessibilityControls
            theme={theme}
            onThemeChange={onThemeChange}
            fontSize={fontSize}
            onFontSizeChange={onFontSizeChange}
            highContrast={settings.highContrast}
            onHighContrastChange={(enabled) => handleSettingChange('highContrast', enabled)}
            reduceMotion={settings.reduceMotion}
            onReduceMotionChange={(enabled) => handleSettingChange('reduceMotion', enabled)}
          />
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch 
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Weekly progress reports and updates</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Workout Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded about scheduled workouts</p>
                </div>
                <Switch 
                  checked={settings.workoutReminders}
                  onCheckedChange={(checked) => handleSettingChange('workoutReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Meal Reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminders to log meals and nutrition</p>
                </div>
                <Switch 
                  checked={settings.mealReminders}
                  onCheckedChange={(checked) => handleSettingChange('mealReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>AI Coach Messages</Label>
                  <p className="text-sm text-muted-foreground">Motivational and guidance messages</p>
                </div>
                <Switch 
                  checked={settings.aiCoachMessages}
                  onCheckedChange={(checked) => handleSettingChange('aiCoachMessages', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    Sound Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">Play sounds for timers and notifications</p>
                </div>
                <Switch 
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Vibration
                  </Label>
                  <p className="text-sm text-muted-foreground">Vibrate for important notifications</p>
                </div>
                <Switch 
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(checked) => handleSettingChange('vibrationEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Security Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Biometric Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face unlock</p>
                </div>
                <Switch 
                  checked={settings.biometricAuth}
                  onCheckedChange={(checked) => handleSettingChange('biometricAuth', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Lock</Label>
                  <p className="text-sm text-muted-foreground">Lock app when inactive</p>
                </div>
                <Switch 
                  checked={settings.autoLock}
                  onCheckedChange={(checked) => handleSettingChange('autoLock', checked)}
                />
              </div>

              {settings.autoLock && (
                <div className="flex items-center justify-between pl-4">
                  <div className="space-y-1">
                    <Label>Auto-Lock Time</Label>
                    <p className="text-sm text-muted-foreground">Minutes of inactivity</p>
                  </div>
                  <Select 
                    value={settings.autoLockTime} 
                    onValueChange={(value) => handleSettingChange('autoLockTime', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 min</SelectItem>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Share Anonymous Data</Label>
                  <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
                </div>
                <Switch 
                  checked={settings.shareData}
                  onCheckedChange={(checked) => handleSettingChange('shareData', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">Allow usage analytics collection</p>
                </div>
                <Switch 
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Crash Reports</Label>
                  <p className="text-sm text-muted-foreground">Send crash reports to help fix bugs</p>
                </div>
                <Switch 
                  checked={settings.crashReports}
                  onCheckedChange={(checked) => handleSettingChange('crashReports', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Export Data</Label>
                  <p className="text-sm text-muted-foreground">Download your workout and nutrition data</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleDataExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-destructive">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workout Settings */}
        <TabsContent value="workout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Workout Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Units</Label>
                  <p className="text-sm text-muted-foreground">Choose measurement system</p>
                </div>
                <Select 
                  value={settings.metricUnits ? 'metric' : 'imperial'} 
                  onValueChange={(value) => handleSettingChange('metricUnits', value === 'metric')}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imperial">Imperial</SelectItem>
                    <SelectItem value="metric">Metric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Start Timer</Label>
                  <p className="text-sm text-muted-foreground">Automatically start rest timers</p>
                </div>
                <Switch 
                  checked={settings.autoStartTimer}
                  onCheckedChange={(checked) => handleSettingChange('autoStartTimer', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Rest Timer Sound</Label>
                  <p className="text-sm text-muted-foreground">Play sound when rest time is over</p>
                </div>
                <Switch 
                  checked={settings.restTimerSound}
                  onCheckedChange={(checked) => handleSettingChange('restTimerSound', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Form Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminders about proper form</p>
                </div>
                <Switch 
                  checked={settings.formReminders}
                  onCheckedChange={(checked) => handleSettingChange('formReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Assistance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>AI Personalization</Label>
                  <p className="text-sm text-muted-foreground">Allow AI to learn from your behavior</p>
                </div>
                <Switch 
                  checked={settings.aiPersonalization}
                  onCheckedChange={(checked) => handleSettingChange('aiPersonalization', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Voice Commands</Label>
                  <p className="text-sm text-muted-foreground">Control app with voice commands</p>
                </div>
                <Switch 
                  checked={settings.voiceCommands}
                  onCheckedChange={(checked) => handleSettingChange('voiceCommands', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Smart Suggestions</Label>
                  <p className="text-sm text-muted-foreground">Get AI-powered workout suggestions</p>
                </div>
                <Switch 
                  checked={settings.smartSuggestions}
                  onCheckedChange={(checked) => handleSettingChange('smartSuggestions', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Sync & Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">Automatically sync data across devices</p>
                </div>
                <Switch 
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => handleSettingChange('autoSync', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sync Frequency</Label>
                  <p className="text-sm text-muted-foreground">How often to sync data</p>
                </div>
                <Select 
                  value={settings.syncFrequency} 
                  onValueChange={(value) => handleSettingChange('syncFrequency', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Data Backup</Label>
                  <p className="text-sm text-muted-foreground">Backup data to cloud storage</p>
                </div>
                <Switch 
                  checked={settings.dataBackup}
                  onCheckedChange={(checked) => handleSettingChange('dataBackup', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Offline Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow app to work without internet</p>
                </div>
                <Switch 
                  checked={settings.offlineMode}
                  onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Storage & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cache Size</span>
                  <span className="text-muted-foreground">42.3 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Data Size</span>
                  <span className="text-muted-foreground">128.7 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Storage</span>
                  <span className="text-muted-foreground">171.0 MB</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleClearCache}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetSettings}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                App Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Version</span>
                <span className="text-muted-foreground">2.1.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Build</span>
                <span className="text-muted-foreground">2024.01.15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated</span>
                <span className="text-muted-foreground">Jan 15, 2024</span>
              </div>
              <Separator />
              <div className="pt-2">
                <Button variant="link" className="text-xs p-0 h-auto text-muted-foreground">
                  Privacy Policy
                </Button>
                <span className="text-xs text-muted-foreground mx-2">•</span>
                <Button variant="link" className="text-xs p-0 h-auto text-muted-foreground">
                  Terms of Service
                </Button>
                <span className="text-xs text-muted-foreground mx-2">•</span>
                <Button variant="link" className="text-xs p-0 h-auto text-muted-foreground">
                  Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <SampleDataGenerator />
          
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>About Database</CardTitle>
              <CardDescription>
                Your data is stored locally in your browser using localStorage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p>✅ All data stays on your device (100% private)</p>
                <p>✅ No external servers or tracking</p>
                <p>✅ Works offline</p>
                <p>⚠️ Data is device-specific (not synced between devices)</p>
                <p>⚠️ Clearing browser data will delete your progress</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="mb-2">Future: MongoDB Backend</h4>
                <p className="text-sm text-muted-foreground">
                  Check <code>/MONGODB_SCHEMA.md</code> for the complete database structure 
                  when you're ready to implement a real backend with Node.js and MongoDB.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}