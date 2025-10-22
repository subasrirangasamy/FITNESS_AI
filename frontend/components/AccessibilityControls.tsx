import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  Accessibility, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Eye, 
  EyeOff, 
  Type, 
  Contrast, 
  Moon, 
  Sun, 
  Settings,
  Palette,
  Headphones,
  Monitor,
  Keyboard,
  Music
} from 'lucide-react';
import { useTranslation } from './TranslationContext';
import { useTextToSpeech } from './TextToSpeechService';
import { useVoiceCommands } from './VoiceCommandService';
import { useSoundFeedback } from './SoundFeedback';
import { toast } from 'sonner@2.0.3';

interface AccessibilityControlsProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  onFontSizeChange: (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => void;
  highContrast: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  reduceMotion: boolean;
  onReduceMotionChange: (enabled: boolean) => void;
}

export function AccessibilityControls({
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastChange,
  reduceMotion,
  onReduceMotionChange
}: AccessibilityControlsProps) {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const {
    isEnabled: ttsEnabled,
    setIsEnabled: setTtsEnabled,
    rate: ttsRate,
    setRate: setTtsRate,
    pitch: ttsPitch,
    setPitch: setTtsPitch,
    volume: ttsVolume,
    setVolume: setTtsVolume,
    isSupported: ttsSupported,
    speak
  } = useTextToSpeech();

  const {
    isEnabled: voiceEnabled,
    setIsEnabled: setVoiceEnabled,
    isListening,
    toggleListening,
    isSupported: voiceSupported,
    commands
  } = useVoiceCommands();

  const { isEnabled: soundEnabled, setIsEnabled: setSoundEnabled } = useSoundFeedback();

  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);
  const [focusIndicators, setFocusIndicators] = useState(true);

  // Load accessibility settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('fitness-ai-accessibility');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setScreenReaderMode(settings.screenReaderMode || false);
        setKeyboardNavigation(settings.keyboardNavigation !== false); // default true
        setFocusIndicators(settings.focusIndicators !== false); // default true
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // Save accessibility settings
  useEffect(() => {
    const settings = {
      screenReaderMode,
      keyboardNavigation,
      focusIndicators
    };
    localStorage.setItem('fitness-ai-accessibility', JSON.stringify(settings));
  }, [screenReaderMode, keyboardNavigation, focusIndicators]);

  // Apply focus indicators CSS
  useEffect(() => {
    const style = document.getElementById('focus-indicators-style') || document.createElement('style');
    style.id = 'focus-indicators-style';
    
    if (focusIndicators) {
      style.textContent = `
        *:focus {
          outline: 2px solid var(--color-primary) !important;
          outline-offset: 2px !important;
        }
        button:focus, [role="button"]:focus {
          box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-primary) !important;
        }
      `;
    } else {
      style.textContent = '';
    }
    
    if (!document.head.contains(style)) {
      document.head.appendChild(style);
    }
  }, [focusIndicators]);

  // Apply reduce motion CSS
  useEffect(() => {
    const style = document.getElementById('reduce-motion-style') || document.createElement('style');
    style.id = 'reduce-motion-style';
    
    if (reduceMotion) {
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
    } else {
      style.textContent = '';
    }
    
    if (!document.head.contains(style)) {
      document.head.appendChild(style);
    }
  }, [reduceMotion]);

  const testTextToSpeech = () => {
    const testMessage = t('speakingWorkoutInstructions');
    speak(testMessage, { interrupt: true });
  };

  const showVoiceCommands = () => {
    const commandsList = commands.slice(0, 3).map(cmd => `"${cmd.command}"`).join(', ');
    toast.info(`Try saying: ${commandsList}...`);
  };

  const quickFontSizeChange = (direction: 'up' | 'down') => {
    const sizes: Array<'small' | 'medium' | 'large' | 'extra-large'> = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    
    if (direction === 'up' && currentIndex < sizes.length - 1) {
      onFontSizeChange(sizes[currentIndex + 1]);
      toast.success(t('increaseTextSize'));
    } else if (direction === 'down' && currentIndex > 0) {
      onFontSizeChange(sizes[currentIndex - 1]);
      toast.success(t('decreaseTextSize'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-medium">
            <Accessibility className="w-5 h-5" />
            {t('accessibility')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize accessibility features for better usability
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          Enhanced
        </Badge>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Quick Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickFontSizeChange('up')}
              className="flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              A+
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickFontSizeChange('down')}
              className="flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              A-
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onHighContrastChange(!highContrast);
                toast.success(t('toggleHighContrast'));
              }}
              className="flex items-center gap-2"
            >
              <Contrast className="w-4 h-4" />
              Contrast
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              Theme
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visual Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Visual Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>{t('theme')}</Label>
              <p className="text-sm text-muted-foreground">Choose light or dark theme</p>
            </div>
            <Select value={theme} onValueChange={onThemeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Dark
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>{t('fontSize')}</Label>
              <p className="text-sm text-muted-foreground">Adjust text size for better readability</p>
            </div>
            <Select value={fontSize} onValueChange={onFontSizeChange}>
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
                <Contrast className="w-4 h-4" />
                {t('highContrast')}
              </Label>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch checked={highContrast} onCheckedChange={onHighContrastChange} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Switch checked={reduceMotion} onCheckedChange={onReduceMotionChange} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Focus Indicators</Label>
              <p className="text-sm text-muted-foreground">Enhanced visual focus indicators</p>
            </div>
            <Switch checked={focusIndicators} onCheckedChange={setFocusIndicators} />
          </div>
        </CardContent>
      </Card>

      {/* Text-to-Speech Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            {t('textToSpeech')}
            {!ttsSupported && <Badge variant="destructive">Not Supported</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Text-to-Speech</Label>
              <p className="text-sm text-muted-foreground">Speak workout instructions and notifications</p>
            </div>
            <Switch 
              checked={ttsEnabled && ttsSupported} 
              onCheckedChange={setTtsEnabled}
              disabled={!ttsSupported}
            />
          </div>

          {ttsEnabled && ttsSupported && (
            <>
              <Separator />
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Speech Rate: {ttsRate}x</Label>
                  <Slider
                    value={[ttsRate]}
                    onValueChange={([value]) => setTtsRate(value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pitch: {ttsPitch}x</Label>
                  <Slider
                    value={[ttsPitch]}
                    onValueChange={([value]) => setTtsPitch(value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Volume: {Math.round(ttsVolume * 100)}%</Label>
                  <Slider
                    value={[ttsVolume]}
                    onValueChange={([value]) => setTtsVolume(value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <Button onClick={testTextToSpeech} variant="outline" size="sm">
                  <Headphones className="w-4 h-4 mr-2" />
                  Test Speech
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sound Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Sound Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Play subtle sounds for button clicks and interactions</p>
            </div>
            <Switch 
              checked={soundEnabled} 
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            {t('voiceCommands')}
            {!voiceSupported && <Badge variant="destructive">Not Supported</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Voice Commands</Label>
              <p className="text-sm text-muted-foreground">Control the app with voice commands</p>
            </div>
            <Switch 
              checked={voiceEnabled && voiceSupported} 
              onCheckedChange={setVoiceEnabled}
              disabled={!voiceSupported}
            />
          </div>

          {voiceEnabled && voiceSupported && (
            <>
              <Separator />
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "destructive" : "default"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? t('listening') : 'Start Listening'}
                </Button>
                
                <Button onClick={showVoiceCommands} variant="outline" size="sm">
                  Show Commands
                </Button>
              </div>

              <div className="text-sm space-y-2">
                <p className="text-muted-foreground font-medium">Available Commands:</p>
                <div className="grid grid-cols-1 gap-1">
                  {commands.slice(0, 8).map((cmd, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                      <Badge variant="outline" className="text-xs">{cmd.command}</Badge>
                      <span className="text-xs text-muted-foreground">{cmd.description}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic mt-2">
                  💡 Tip: Speak clearly and wait for confirmation. Say "help" anytime to see commands.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Language & Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Language & Localization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>{t('language')}</Label>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Navigation & Interaction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            Navigation & Interaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>{t('screenReader')} Mode</Label>
              <p className="text-sm text-muted-foreground">Optimize for screen readers</p>
            </div>
            <Switch checked={screenReaderMode} onCheckedChange={setScreenReaderMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Keyboard Navigation</Label>
              <p className="text-sm text-muted-foreground">Enhanced keyboard navigation support</p>
            </div>
            <Switch checked={keyboardNavigation} onCheckedChange={setKeyboardNavigation} />
          </div>

          {screenReaderMode && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                Screen reader mode is enabled. This optimizes the app for screen reader users with:
              </p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li>Enhanced ARIA labels and descriptions</li>
                <li>Improved navigation landmarks</li>
                <li>Skip links for main content areas</li>
                <li>Descriptive button and link text</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}