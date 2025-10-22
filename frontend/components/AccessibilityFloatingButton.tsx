import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Accessibility, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  X,
  Settings
} from 'lucide-react';
import { useTextToSpeech } from './TextToSpeechService';
import { useTranslation } from './TranslationContext';
import { motion, AnimatePresence } from 'motion/react';

interface AccessibilityFloatingButtonProps {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  onFontSizeChange: (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => void;
  highContrast: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  onOpenSettings: () => void;
}

export function AccessibilityFloatingButton({
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastChange,
  onOpenSettings
}: AccessibilityFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { 
    isEnabled: ttsEnabled, 
    setIsEnabled: setTtsEnabled, 
    isSupported: ttsSupported 
  } = useTextToSpeech();

  const changeFontSize = (direction: 'up' | 'down') => {
    const sizes: Array<'small' | 'medium' | 'large' | 'extra-large'> = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    
    if (direction === 'up' && currentIndex < sizes.length - 1) {
      onFontSizeChange(sizes[currentIndex + 1]);
    } else if (direction === 'down' && currentIndex > 0) {
      onFontSizeChange(sizes[currentIndex - 1]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="p-4 w-64 bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Quick Access</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {/* Font Size Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changeFontSize('down')}
                    disabled={fontSize === 'small'}
                    className="flex-1 h-8"
                  >
                    <Type className="w-3 h-3 mr-1" />
                    A-
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changeFontSize('up')}
                    disabled={fontSize === 'extra-large'}
                    className="flex-1 h-8"
                  >
                    <Type className="w-3 h-3 mr-1" />
                    A+
                  </Button>
                </div>

                {/* High Contrast */}
                <Button
                  variant={highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={() => onHighContrastChange(!highContrast)}
                  className="w-full h-8"
                >
                  <Contrast className="w-3 h-3 mr-2" />
                  {highContrast ? 'Disable' : 'Enable'} Contrast
                </Button>

                {/* Text-to-Speech */}
                {ttsSupported && (
                  <Button
                    variant={ttsEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTtsEnabled(!ttsEnabled)}
                    className="w-full h-8"
                  >
                    {ttsEnabled ? <Volume2 className="w-3 h-3 mr-2" /> : <VolumeX className="w-3 h-3 mr-2" />}
                    {ttsEnabled ? 'Disable' : 'Enable'} TTS
                  </Button>
                )}

                {/* Full Settings */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenSettings();
                    setIsOpen(false);
                  }}
                  className="w-full h-8"
                >
                  <Settings className="w-3 h-3 mr-2" />
                  Full Settings
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Accessibility Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-12 w-12 rounded-full shadow-lg transition-all duration-200 ${
            isOpen 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          }`}
          aria-label="Accessibility options"
        >
          <Accessibility className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Active Status Indicators */}
      {(ttsEnabled || highContrast) && (
        <div className="absolute -top-2 -right-2 flex flex-col gap-1">
          {ttsEnabled && (
            <Badge variant="default" className="h-4 w-4 p-0 rounded-full">
              <Volume2 className="w-2 h-2" />
            </Badge>
          )}
          {highContrast && (
            <Badge variant="default" className="h-4 w-4 p-0 rounded-full">
              <Contrast className="w-2 h-2" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}