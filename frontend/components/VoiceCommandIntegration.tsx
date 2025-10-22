import React, { useEffect } from 'react';
import { useVoiceCommands } from './VoiceCommandService';
import { useTextToSpeech } from './TextToSpeechService';
import { useTranslation } from './TranslationContext';

interface VoiceCommandIntegrationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onWorkoutAction?: (action: string) => void;
  onNutritionAction?: (action: string) => void;
}

export function VoiceCommandIntegration({
  activeTab,
  onTabChange,
  onWorkoutAction,
  onNutritionAction
}: VoiceCommandIntegrationProps) {
  const { setOnCommand } = useVoiceCommands();
  const { speak } = useTextToSpeech();
  const { t } = useTranslation();

  useEffect(() => {
    const handleVoiceCommand = (action: string, params?: any) => {
      console.log('Voice command received:', action, params);

      switch (action) {
        // Navigation commands
        case 'NAVIGATE_DASHBOARD':
          onTabChange('dashboard');
          speak(t('dashboard'));
          break;
        case 'NAVIGATE_WORKOUTS':
          onTabChange('workouts');
          speak(t('workouts'));
          break;
        case 'NAVIGATE_NUTRITION':
          onTabChange('nutrition');
          speak(t('nutrition'));
          break;
        case 'NAVIGATE_PROGRESS':
          onTabChange('progress');
          speak(t('progress'));
          break;
        case 'NAVIGATE_PROFILE':
          onTabChange('profile');
          speak(t('profile'));
          break;
        case 'NAVIGATE_SETTINGS':
          onTabChange('settings');
          speak(t('settings'));
          break;

        // Workout commands
        case 'START_WORKOUT':
          if (activeTab !== 'workouts') {
            onTabChange('workouts');
          }
          if (onWorkoutAction) {
            onWorkoutAction('start');
            speak(t('startWorkout'));
          }
          break;
        case 'PAUSE_WORKOUT':
          if (onWorkoutAction) {
            onWorkoutAction('pause');
            speak(t('pauseWorkout'));
          }
          break;
        case 'RESUME_WORKOUT':
          if (onWorkoutAction) {
            onWorkoutAction('resume');
            speak(t('resumeWorkout'));
          }
          break;
        case 'COMPLETE_SET':
          if (onWorkoutAction) {
            onWorkoutAction('completeSet');
            speak(t('setComplete'));
          }
          break;
        case 'START_REST':
          if (onWorkoutAction) {
            onWorkoutAction('startRest');
            speak(t('restTime'));
          }
          break;

        // Nutrition commands
        case 'LOG_MEAL':
          if (activeTab !== 'nutrition') {
            onTabChange('nutrition');
          }
          if (onNutritionAction) {
            onNutritionAction('logMeal');
            speak(t('logMeal'));
          }
          break;

        // System commands
        case 'INCREASE_VOLUME':
          // This could control TTS volume or system volume
          speak('Volume increased');
          break;
        case 'DECREASE_VOLUME':
          speak('Volume decreased');
          break;
        case 'SHOW_HELP':
          speak('Voice commands help: You can say start workout, go to nutrition, log meal, or pause workout.');
          break;

        default:
          console.log('Unknown voice command:', action);
          speak('Command not recognized. Say help for available commands.');
      }
    };

    setOnCommand(handleVoiceCommand);
  }, [activeTab, onTabChange, onWorkoutAction, onNutritionAction, setOnCommand, speak, t]);

  // This component doesn't render anything, it's just for handling voice commands
  return null;
}

export default VoiceCommandIntegration;