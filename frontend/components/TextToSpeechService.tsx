import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from './TranslationContext';
import { toast } from 'sonner@2.0.3';

interface TextToSpeechContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  speak: (text: string, options?: { priority?: 'high' | 'normal'; interrupt?: boolean }) => void;
  speakWorkoutInstruction: (instruction: string, type: 'exercise' | 'rest' | 'set' | 'complete') => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const TextToSpeechContext = createContext<TextToSpeechContextType | undefined>(undefined);

interface TextToSpeechProviderProps {
  children: React.ReactNode;
}

export function TextToSpeechProvider({ children }: TextToSpeechProviderProps) {
  const { t, language } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(0.8);
  const [speechQueue, setSpeechQueue] = useState<Array<{ text: string; priority: 'high' | 'normal' }>>([]);

  // Check if Speech Synthesis is supported
  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);
    
    if (!supported) {
      console.warn('Speech Synthesis not supported in this browser');
    }
  }, []);

  // Load settings from localStorage (only once on mount)
  const hasLoadedSettings = useRef(false);
  
  useEffect(() => {
    if (hasLoadedSettings.current) return;
    hasLoadedSettings.current = true;
    
    const savedSettings = localStorage.getItem('fitness-ai-tts-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsEnabled(settings.isEnabled || false);
        setRate(settings.rate || 1.0);
        setPitch(settings.pitch || 1.0);
        setVolume(settings.volume || 0.8);
      } catch (error) {
        console.error('Error loading TTS settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    const settings = { isEnabled, rate, pitch, volume };
    localStorage.setItem('fitness-ai-tts-settings', JSON.stringify(settings));
  }, [isEnabled, rate, pitch, volume]);

  // Get appropriate voice for current language
  const getVoiceForLanguage = useCallback(() => {
    if (!isSupported) return null;
    
    const voices = speechSynthesis.getVoices();
    
    // Language mapping for more specific voice selection
    const languageMapping: Record<string, string[]> = {
      en: ['en-US', 'en-GB', 'en'],
      es: ['es-ES', 'es-MX', 'es'],
      fr: ['fr-FR', 'fr-CA', 'fr'],
      de: ['de-DE', 'de'],
      it: ['it-IT', 'it'],
      pt: ['pt-BR', 'pt-PT', 'pt'],
    };

    const preferredLanguages = languageMapping[language] || ['en-US'];
    
    // Find the best matching voice
    for (const langCode of preferredLanguages) {
      const voice = voices.find(v => v.lang.startsWith(langCode));
      if (voice) return voice;
    }
    
    // Fallback to default voice
    return voices[0] || null;
  }, [language, isSupported]);

  const stop = useCallback(() => {
    if (isSupported && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechQueue([]);
    }
  }, [isSupported]);

  const speak = useCallback((text: string, options: { priority?: 'high' | 'normal'; interrupt?: boolean } = {}) => {
    if (!isEnabled || !isSupported || !text.trim()) return;

    const { priority = 'normal', interrupt = false } = options;

    // If interrupt is true, stop current speech
    if (interrupt) {
      stop();
    }

    // Add to queue if priority is normal and currently speaking
    if (priority === 'normal' && speechSynthesis.speaking) {
      setSpeechQueue(prev => [...prev, { text, priority }]);
      return;
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoiceForLanguage();
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      
      // Process next item in queue
      setSpeechQueue(prev => {
        if (prev.length > 0) {
          const [next, ...rest] = prev;
          setTimeout(() => speak(next.text, { priority: next.priority }), 100);
          return rest;
        }
        return prev;
      });
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setSpeechQueue([]);
    };

    // Speak immediately
    speechSynthesis.speak(utterance);
  }, [isEnabled, isSupported, rate, pitch, volume, getVoiceForLanguage, stop]);

  const speakWorkoutInstruction = useCallback((instruction: string, type: 'exercise' | 'rest' | 'set' | 'complete') => {
    if (!isEnabled || !isSupported) return;

    let message = '';
    const priority: 'high' | 'normal' = type === 'rest' ? 'high' : 'normal';

    switch (type) {
      case 'exercise':
        message = `${t('next')}: ${instruction}`;
        break;
      case 'rest':
        message = `${t('restTime')}: ${instruction}`;
        break;
      case 'set':
        message = `${t('setComplete')}. ${instruction}`;
        break;
      case 'complete':
        message = `${t('exerciseComplete')}. ${instruction}`;
        break;
      default:
        message = instruction;
    }

    speak(message, { priority, interrupt: type === 'rest' });
  }, [isEnabled, isSupported, speak, t]);

  // Handle enable/disable state changes (with ref to avoid initial toast)
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Skip toast on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (isEnabled && isSupported) {
      toast.success(t('ttsEnabled'));
    } else if (!isEnabled && isSupported) {
      stop();
      // Don't show disabled notification
    }
  }, [isEnabled, isSupported, stop, t]);

  const contextValue: TextToSpeechContextType = {
    isEnabled,
    setIsEnabled,
    speak,
    speakWorkoutInstruction,
    stop,
    isSpeaking,
    isSupported,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
  };

  return (
    <TextToSpeechContext.Provider value={contextValue}>
      {children}
    </TextToSpeechContext.Provider>
  );
}

export function useTextToSpeech() {
  const context = useContext(TextToSpeechContext);
  if (context === undefined) {
    throw new Error('useTextToSpeech must be used within a TextToSpeechProvider');
  }
  return context;
}