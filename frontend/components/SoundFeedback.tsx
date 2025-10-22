import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

interface SoundFeedbackContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  playClick: () => void;
  playSuccess: () => void;
  playError: () => void;
  playNotification: () => void;
}

const SoundFeedbackContext = createContext<SoundFeedbackContextType | undefined>(undefined);

export function useSoundFeedback() {
  const context = useContext(SoundFeedbackContext);
  if (!context) {
    throw new Error('useSoundFeedback must be used within SoundFeedbackProvider');
  }
  return context;
}

interface SoundFeedbackProviderProps {
  children: React.ReactNode;
}

export function SoundFeedbackProvider({ children }: SoundFeedbackProviderProps) {
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('fitness-ai-sound-feedback');
    return saved !== 'false'; // Default to true
  });

  // Create audio context on first interaction
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('fitness-ai-sound-feedback', isEnabled.toString());
  }, [isEnabled]);

  // Initialize audio context on first user interaction
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // 🎵 Play Click Sound (subtle pop)
  const playClick = useCallback(() => {
    if (!isEnabled) return;
    
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (error) {
      console.log('Sound feedback not available');
    }
  }, [isEnabled, getAudioContext]);

  // ✅ Play Success Sound (ascending notes)
  const playSuccess = useCallback(() => {
    if (!isEnabled) return;
    
    try {
      const audioContext = getAudioContext();
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime + (index * 0.08);
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
      });
    } catch (error) {
      console.log('Sound feedback not available');
    }
  }, [isEnabled, getAudioContext]);

  // ❌ Play Error Sound (descending notes)
  const playError = useCallback(() => {
    if (!isEnabled) return;
    
    try {
      const audioContext = getAudioContext();
      const frequencies = [392, 349.23]; // G4, F4
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime + (index * 0.1);
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
      });
    } catch (error) {
      console.log('Sound feedback not available');
    }
  }, [isEnabled, getAudioContext]);

  // 🔔 Play Notification Sound
  const playNotification = useCallback(() => {
    if (!isEnabled) return;
    
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 880;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Sound feedback not available');
    }
  }, [isEnabled, getAudioContext]);

  const value = {
    isEnabled,
    setIsEnabled,
    playClick,
    playSuccess,
    playError,
    playNotification,
  };

  return (
    <SoundFeedbackContext.Provider value={value}>
      {children}
    </SoundFeedbackContext.Provider>
  );
}
