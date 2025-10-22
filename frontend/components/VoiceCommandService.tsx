import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from './TranslationContext';
import { toast } from 'sonner@2.0.3';

interface VoiceCommand {
  command: string;
  action: string;
  description: string;
  patterns: string[];
}

interface VoiceCommandContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  isSupported: boolean;
  commands: VoiceCommand[];
  onCommand: (action: string, params?: any) => void;
  setOnCommand: (callback: (action: string, params?: any) => void) => void;
  lastCommand: string;
  confidence: number;
}

const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(undefined);

interface VoiceCommandProviderProps {
  children: React.ReactNode;
}

export function VoiceCommandProvider({ children }: VoiceCommandProviderProps) {
  const { t, language } = useTranslation();
  // Load saved voice command preference or default to false
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('fitness-ai-voice-commands');
    return saved === 'true' ? true : false;
  });
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [onCommand, setOnCommand] = useState<(action: string, params?: any) => void>(() => {});

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const permissionDenied = useRef(false); // Track if permission was denied
  const hasShownPermissionError = useRef(false); // Track if we've shown the error once

  // Define voice commands for different languages
  const commands: VoiceCommand[] = React.useMemo(() => {
    const baseCommands = {
      en: [
        {
          command: 'start workout',
          action: 'START_WORKOUT',
          description: 'Start a new workout',
          patterns: ['start workout', 'begin workout', 'start training', 'begin training']
        },
        {
          command: 'pause workout',
          action: 'PAUSE_WORKOUT',
          description: 'Pause current workout',
          patterns: ['pause workout', 'stop workout', 'pause training', 'take a break']
        },
        {
          command: 'resume workout',
          action: 'RESUME_WORKOUT',
          description: 'Resume paused workout',
          patterns: ['resume workout', 'continue workout', 'resume training', 'continue training']
        },
        {
          command: 'complete set',
          action: 'COMPLETE_SET',
          description: 'Mark current set as complete',
          patterns: ['complete set', 'finish set', 'done set', 'set complete', 'next set']
        },
        {
          command: 'start rest',
          action: 'START_REST',
          description: 'Start rest timer',
          patterns: ['start rest', 'begin rest', 'rest time', 'take rest']
        },
        {
          command: 'go to dashboard',
          action: 'NAVIGATE_DASHBOARD',
          description: 'Navigate to dashboard',
          patterns: ['go to dashboard', 'show dashboard', 'open dashboard', 'dashboard']
        },
        {
          command: 'go to workouts',
          action: 'NAVIGATE_WORKOUTS',
          description: 'Navigate to workouts',
          patterns: ['go to workouts', 'show workouts', 'open workouts', 'workouts']
        },
        {
          command: 'go to nutrition',
          action: 'NAVIGATE_NUTRITION',
          description: 'Navigate to nutrition',
          patterns: ['go to nutrition', 'show nutrition', 'open nutrition', 'nutrition']
        },
        {
          command: 'log meal',
          action: 'LOG_MEAL',
          description: 'Start logging a meal',
          patterns: ['log meal', 'add meal', 'record meal', 'track food']
        },
        {
          command: 'increase volume',
          action: 'INCREASE_VOLUME',
          description: 'Increase app volume',
          patterns: ['increase volume', 'volume up', 'louder', 'turn up']
        },
        {
          command: 'decrease volume',
          action: 'DECREASE_VOLUME',
          description: 'Decrease app volume',
          patterns: ['decrease volume', 'volume down', 'quieter', 'turn down']
        },
        {
          command: 'help',
          action: 'SHOW_HELP',
          description: 'Show voice commands help',
          patterns: ['help', 'commands', 'what can I say', 'voice help']
        }
      ],
      es: [
        {
          command: 'iniciar entrenamiento',
          action: 'START_WORKOUT',
          description: 'Iniciar un nuevo entrenamiento',
          patterns: ['iniciar entrenamiento', 'empezar entrenamiento', 'comenzar entrenamiento']
        },
        {
          command: 'pausar entrenamiento',
          action: 'PAUSE_WORKOUT',
          description: 'Pausar entrenamiento actual',
          patterns: ['pausar entrenamiento', 'parar entrenamiento', 'descanso']
        },
        // Add more Spanish commands...
      ],
      fr: [
        {
          command: 'commencer entraînement',
          action: 'START_WORKOUT',
          description: "Commencer un nouvel entraînement",
          patterns: ['commencer entraînement', 'débuter entraînement', 'start workout']
        },
        // Add more French commands...
      ],
      de: [
        {
          command: 'training starten',
          action: 'START_WORKOUT',
          description: 'Ein neues Training starten',
          patterns: ['training starten', 'workout beginnen', 'training beginnen']
        },
        // Add more German commands...
      ],
      it: [
        {
          command: 'inizia allenamento',
          action: 'START_WORKOUT',
          description: 'Inizia un nuovo allenamento',
          patterns: ['inizia allenamento', 'comincia allenamento', 'start workout']
        },
        // Add more Italian commands...
      ],
      pt: [
        {
          command: 'iniciar treino',
          action: 'START_WORKOUT',
          description: 'Iniciar um novo treino',
          patterns: ['iniciar treino', 'começar treino', 'start workout']
        },
        // Add more Portuguese commands...
      ]
    };

    return baseCommands[language] || baseCommands.en;
  }, [language]);

  // Check if Speech Recognition is supported
  useEffect(() => {
    // Check if running in secure context (HTTPS or localhost)
    const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    
    if (!isSecureContext) {
      console.warn('Speech Recognition requires a secure context (HTTPS)');
      setIsSupported(false);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = !!SpeechRecognition;
    setIsSupported(supported);
    
    if (supported) {
      recognitionRef.current = new SpeechRecognition();
      setupRecognition();
    } else {
      console.warn('Speech Recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('fitness-ai-voice-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsEnabled(settings.isEnabled || false);
      } catch (error) {
        console.error('Error loading voice settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    const settings = { isEnabled };
    localStorage.setItem('fitness-ai-voice-settings', JSON.stringify(settings));
  }, [isEnabled]);

  const setupRecognition = useCallback(() => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    
    // Set language based on current app language
    const languageMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-BR'
    };
    recognition.lang = languageMap[language] || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started');
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Voice recognition ended');
      
      // Don't auto-restart if permission was denied
      if (permissionDenied.current) {
        console.log('Voice recognition stopped: Permission denied');
        return;
      }
      
      // Auto-restart if enabled (for continuous listening)
      if (isEnabled) {
        timeoutRef.current = setTimeout(() => {
          if (isEnabled && recognitionRef.current && !permissionDenied.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              // Handle already started error
              console.log('Recognition already running or failed to start');
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const lastResult = results[results.length - 1];
      
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.toLowerCase().trim();
        const confidence = lastResult[0].confidence;
        
        setLastCommand(transcript);
        setConfidence(confidence);
        
        console.log('Voice command:', transcript, 'Confidence:', confidence);
        
        // Process the command
        processCommand(transcript, confidence);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        // Mark permission as denied to prevent restart loops
        permissionDenied.current = true;
        setIsEnabled(false);
        
        // Only show the error once
        if (!hasShownPermissionError.current) {
          hasShownPermissionError.current = true;
          console.warn('Microphone access denied');
          toast.error('Microphone access denied', {
            description: 'Voice commands require microphone permission. You can enable it in Settings > Accessibility.',
            duration: 5000
          });
        }
        
        // Stop the recognition completely
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else if (event.error === 'no-speech') {
        // Silently ignore no-speech errors for continuous listening
        console.log('No speech detected, continuing to listen...');
      } else if (event.error === 'network') {
        console.warn('Network error in speech recognition');
        // Don't show toast for network errors, just log them
      } else if (event.error === 'aborted') {
        // Normal abort, don't show error
        console.log('Speech recognition aborted');
      } else {
        console.error('Speech recognition error:', event.error);
      }
    };
  }, [language, isEnabled]);

  const processCommand = useCallback((transcript: string, confidence: number) => {
    // Minimum confidence threshold
    if (confidence < 0.7) {
      console.log('Command confidence too low:', confidence);
      return;
    }

    // Find matching command
    const matchedCommand = commands.find(cmd => 
      cmd.patterns.some(pattern => 
        transcript.includes(pattern) || pattern.includes(transcript)
      )
    );

    if (matchedCommand) {
      console.log('Matched command:', matchedCommand.action);
      toast.success(`Voice Command: "${matchedCommand.command}"`, {
        description: matchedCommand.description
      });
      
      // Execute the command
      onCommand(matchedCommand.action, { transcript, confidence });
    } else {
      console.log('No matching command found for:', transcript);
      // Optionally show available commands
      if (transcript.includes('help') || transcript.includes('commands')) {
        showHelpCommands();
      }
    }
  }, [commands, onCommand, t]);

  const showHelpCommands = useCallback(() => {
    const commandsList = commands.slice(0, 6).map(cmd => `"${cmd.command}"`).join(' • ');
    toast.info(`Try these commands:`, { 
      duration: 6000,
      description: commandsList
    });
  }, [commands]);

  const startListening = useCallback(() => {
    if (!isSupported || !isEnabled || !recognitionRef.current) return;
    
    // Don't try to start if permission was denied
    if (permissionDenied.current) {
      console.log('Cannot start listening: Microphone permission denied');
      if (!hasShownPermissionError.current) {
        hasShownPermissionError.current = true;
        toast.error('Microphone permission required', {
          description: 'Please enable microphone access in your browser settings.',
          duration: 4000
        });
      }
      return;
    }

    try {
      recognitionRef.current.start();
      console.log('Started listening for voice commands');
    } catch (error: any) {
      console.error('Error starting recognition:', error);
      if (error.message && error.message.includes('already started')) {
        // Recognition is already running, ignore
        console.log('Recognition already running');
      }
    }
  }, [isSupported, isEnabled, t]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsListening(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Handle enable/disable state changes
  useEffect(() => {
    // Skip toast on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (isEnabled && isSupported) {
      // Reset permission denied flag when user tries to enable
      if (permissionDenied.current) {
        permissionDenied.current = false;
        hasShownPermissionError.current = false;
      }
      setupRecognition();
      toast.success(t('voiceCommandsEnabled'));
    } else if (!isEnabled && isSupported) {
      stopListening();
      toast.info(t('voiceCommandsDisabled'));
    }
  }, [isEnabled, isSupported, setupRecognition, stopListening, t]);

  // Update recognition settings when language changes
  useEffect(() => {
    if (recognitionRef.current && isEnabled && !permissionDenied.current) {
      stopListening();
      setupRecognition();
      if (isEnabled) {
        setTimeout(startListening, 500);
      }
    }
  }, [language, setupRecognition, startListening, stopListening, isEnabled]);

  const contextValue: VoiceCommandContextType = {
    isEnabled,
    setIsEnabled,
    isListening,
    startListening,
    stopListening,
    toggleListening,
    isSupported,
    commands,
    onCommand,
    setOnCommand,
    lastCommand,
    confidence,
  };

  return (
    <VoiceCommandContext.Provider value={contextValue}>
      {children}
    </VoiceCommandContext.Provider>
  );
}

export function useVoiceCommands() {
  const context = useContext(VoiceCommandContext);
  if (context === undefined) {
    throw new Error('useVoiceCommands must be used within a VoiceCommandProvider');
  }
  return context;
}

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}