import React, { createContext, useContext, useState, useEffect } from 'react';

// Translation dictionary
const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    workouts: 'Workouts',
    nutrition: 'Nutrition',
    'ai-chat': 'AI Chat',
    progress: 'Progress',
    profile: 'Profile',
    settings: 'Settings',
    
    // Common UI
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Dashboard
    welcome: 'Welcome back',
    todayWorkout: "Today's Workout",
    weeklyGoal: 'Weekly Goal',
    caloriesBurned: 'Calories Burned',
    workoutsCompleted: 'Workouts Completed',
    currentStreak: 'Current Streak',
    
    // Workouts
    startWorkout: 'Start Workout',
    pauseWorkout: 'Pause Workout',
    resumeWorkout: 'Resume Workout',
    completeWorkout: 'Complete Workout',
    restTime: 'Rest Time',
    setComplete: 'Set Complete',
    exerciseComplete: 'Exercise Complete',
    workoutComplete: 'Workout Complete',
    
    // Nutrition
    logMeal: 'Log Meal',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks',
    calories: 'Calories',
    protein: 'Protein',
    carbs: 'Carbs',
    fat: 'Fat',
    
    // Settings
    appearance: 'Appearance',
    accessibility: 'Accessibility',
    language: 'Language',
    theme: 'Theme',
    fontSize: 'Font Size',
    highContrast: 'High Contrast',
    textToSpeech: 'Text-to-Speech',
    voiceCommands: 'Voice Commands',
    screenReader: 'Screen Reader Support',
    
    // Voice Commands
    voiceCommandsEnabled: 'Voice commands enabled',
    voiceCommandsDisabled: 'Voice commands disabled',
    listening: 'Listening...',
    voiceNotSupported: 'Voice recognition not supported',
    
    // Text-to-Speech
    ttsEnabled: 'Text-to-speech enabled',
    ttsDisabled: 'Text-to-speech disabled',
    speakingWorkoutInstructions: 'Speaking workout instructions',
    
    // Accessibility
    increaseTextSize: 'Increase text size',
    decreaseTextSize: 'Decrease text size',
    toggleHighContrast: 'Toggle high contrast',
    skipToMainContent: 'Skip to main content',
    navigationMenu: 'Navigation menu',
    
    // AI Chat
    aiCoach: 'AI Fitness Coach',
    aiCoachSubtitle: 'Powered by Advanced Machine Learning Technology',
    aiOnline: 'AI Online',
    quickQuestions: 'Quick Questions',
    quickQuestionsSubtitle: 'Tap any question to ask your AI coach instantly',
    chatWithCoach: 'Chat with Your AI Coach',
    chatSubtitle: 'Get personalized fitness advice based on your data and goals',
    askAnything: 'Ask your AI coach anything...',
    recentInsights: 'Recent Insights',
    show: 'Show',
    hide: 'Hide',
  },
  es: {
    // Navigation
    dashboard: 'Panel Principal',
    workouts: 'Entrenamientos',
    nutrition: 'Nutrición',
    'ai-chat': 'Chat IA',
    progress: 'Progreso',
    profile: 'Perfil',
    settings: 'Configuración',
    
    // Common UI
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    
    // Dashboard
    welcome: 'Bienvenido de nuevo',
    todayWorkout: 'Entrenamiento de Hoy',
    weeklyGoal: 'Meta Semanal',
    caloriesBurned: 'Calorías Quemadas',
    workoutsCompleted: 'Entrenamientos Completados',
    currentStreak: 'Racha Actual',
    
    // Workouts
    startWorkout: 'Iniciar Entrenamiento',
    pauseWorkout: 'Pausar Entrenamiento',
    resumeWorkout: 'Reanudar Entrenamiento',
    completeWorkout: 'Completar Entrenamiento',
    restTime: 'Tiempo de Descanso',
    setComplete: 'Serie Completa',
    exerciseComplete: 'Ejercicio Completo',
    workoutComplete: 'Entrenamiento Completo',
    
    // Nutrition
    logMeal: 'Registrar Comida',
    breakfast: 'Desayuno',
    lunch: 'Almuerzo',
    dinner: 'Cena',
    snacks: 'Snacks',
    calories: 'Calorías',
    protein: 'Proteína',
    carbs: 'Carbohidratos',
    fat: 'Grasa',
    
    // Settings
    appearance: 'Apariencia',
    accessibility: 'Accesibilidad',
    language: 'Idioma',
    theme: 'Tema',
    fontSize: 'Tamaño de Fuente',
    highContrast: 'Alto Contraste',
    textToSpeech: 'Texto a Voz',
    voiceCommands: 'Comandos de Voz',
    screenReader: 'Soporte de Lector de Pantalla',
    
    // Voice Commands
    voiceCommandsEnabled: 'Comandos de voz habilitados',
    voiceCommandsDisabled: 'Comandos de voz deshabilitados',
    listening: 'Escuchando...',
    voiceNotSupported: 'Reconocimiento de voz no compatible',
    
    // Text-to-Speech
    ttsEnabled: 'Texto a voz habilitado',
    ttsDisabled: 'Texto a voz deshabilitado',
    speakingWorkoutInstructions: 'Hablando instrucciones de entrenamiento',
    
    // Accessibility
    increaseTextSize: 'Aumentar tamaño de texto',
    decreaseTextSize: 'Disminuir tamaño de texto',
    toggleHighContrast: 'Alternar alto contraste',
    skipToMainContent: 'Ir al contenido principal',
    navigationMenu: 'Menú de navegación',
    
    // AI Chat
    aiCoach: 'Entrenador de IA',
    aiCoachSubtitle: 'Impulsado por Tecnología Avanzada de Aprendizaje Automático',
    aiOnline: 'IA en Línea',
    quickQuestions: 'Preguntas Rápidas',
    quickQuestionsSubtitle: 'Toca cualquier pregunta para consultar a tu entrenador de IA',
    chatWithCoach: 'Chatea con Tu Entrenador de IA',
    chatSubtitle: 'Obtén consejos de fitness personalizados basados en tus datos y objetivos',
    askAnything: 'Pregunta lo que quieras a tu entrenador de IA...',
    recentInsights: 'Perspectivas Recientes',
    show: 'Mostrar',
    hide: 'Ocultar',
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de Bord',
    workouts: 'Entraînements',
    nutrition: 'Nutrition',
    'ai-chat': 'Chat IA',
    progress: 'Progrès',
    profile: 'Profil',
    settings: 'Paramètres',
    
    // Common UI
    save: 'Sauvegarder',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    
    // Dashboard
    welcome: 'Bon retour',
    todayWorkout: "Entraînement d'Aujourd'hui",
    weeklyGoal: 'Objectif Hebdomadaire',
    caloriesBurned: 'Calories Brûlées',
    workoutsCompleted: 'Entraînements Terminés',
    currentStreak: 'Série Actuelle',
    
    // Workouts
    startWorkout: 'Commencer Entraînement',
    pauseWorkout: 'Pause Entraînement',
    resumeWorkout: 'Reprendre Entraînement',
    completeWorkout: 'Terminer Entraînement',
    restTime: 'Temps de Repos',
    setComplete: 'Série Terminée',
    exerciseComplete: 'Exercice Terminé',
    workoutComplete: 'Entraînement Terminé',
    
    // Nutrition
    logMeal: 'Enregistrer Repas',
    breakfast: 'Petit-déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    snacks: 'Collations',
    calories: 'Calories',
    protein: 'Protéine',
    carbs: 'Glucides',
    fat: 'Graisse',
    
    // Settings
    appearance: 'Apparence',
    accessibility: 'Accessibilité',
    language: 'Langue',
    theme: 'Thème',
    fontSize: 'Taille de Police',
    highContrast: 'Contraste Élevé',
    textToSpeech: 'Synthèse Vocale',
    voiceCommands: 'Commandes Vocales',
    screenReader: 'Support Lecteur Écran',
    
    // Voice Commands
    voiceCommandsEnabled: 'Commandes vocales activées',
    voiceCommandsDisabled: 'Commandes vocales désactivées',
    listening: 'Écoute...',
    voiceNotSupported: 'Reconnaissance vocale non supportée',
    
    // Text-to-Speech
    ttsEnabled: 'Synthèse vocale activée',
    ttsDisabled: 'Synthèse vocale désactivée',
    speakingWorkoutInstructions: "Énonce les instructions d'entraînement",
    
    // Accessibility
    increaseTextSize: 'Augmenter la taille du texte',
    decreaseTextSize: 'Diminuer la taille du texte',
    toggleHighContrast: 'Basculer le contraste élevé',
    skipToMainContent: 'Aller au contenu principal',
    navigationMenu: 'Menu de navigation',
    
    // AI Chat
    aiCoach: 'Coach IA de Fitness',
    aiCoachSubtitle: 'Propulsé par une Technologie d\'Apprentissage Automatique Avancée',
    aiOnline: 'IA en Ligne',
    quickQuestions: 'Questions Rapides',
    quickQuestionsSubtitle: 'Touchez n\'importe quelle question pour demander à votre coach IA',
    chatWithCoach: 'Discutez avec Votre Coach IA',
    chatSubtitle: 'Obtenez des conseils de fitness personnalisés basés sur vos données et objectifs',
    askAnything: 'Demandez n\'importe quoi à votre coach IA...',
    recentInsights: 'Perspectives Récentes',
    show: 'Afficher',
    hide: 'Masquer',
  },
  de: {
    // Navigation
    dashboard: 'Dashboard',
    workouts: 'Workouts',
    nutrition: 'Ernährung',
    'ai-chat': 'KI-Chat',
    progress: 'Fortschritt',
    profile: 'Profil',
    settings: 'Einstellungen',
    
    // Common UI
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    close: 'Schließen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Vorherige',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    
    // Dashboard
    welcome: 'Willkommen zurück',
    todayWorkout: 'Heutiges Training',
    weeklyGoal: 'Wochenziel',
    caloriesBurned: 'Kalorien Verbrannt',
    workoutsCompleted: 'Trainings Abgeschlossen',
    currentStreak: 'Aktuelle Serie',
    
    // Workouts
    startWorkout: 'Training Starten',
    pauseWorkout: 'Training Pausieren',
    resumeWorkout: 'Training Fortsetzen',
    completeWorkout: 'Training Beenden',
    restTime: 'Pausenzeit',
    setComplete: 'Satz Beendet',
    exerciseComplete: 'Übung Beendet',
    workoutComplete: 'Training Beendet',
    
    // Nutrition
    logMeal: 'Mahlzeit Erfassen',
    breakfast: 'Frühstück',
    lunch: 'Mittagessen',
    dinner: 'Abendessen',
    snacks: 'Snacks',
    calories: 'Kalorien',
    protein: 'Protein',
    carbs: 'Kohlenhydrate',
    fat: 'Fett',
    
    // Settings
    appearance: 'Erscheinungsbild',
    accessibility: 'Barrierefreiheit',
    language: 'Sprache',
    theme: 'Thema',
    fontSize: 'Schriftgröße',
    highContrast: 'Hoher Kontrast',
    textToSpeech: 'Sprachausgabe',
    voiceCommands: 'Sprachbefehle',
    screenReader: 'Bildschirmleser-Unterstützung',
    
    // Voice Commands
    voiceCommandsEnabled: 'Sprachbefehle aktiviert',
    voiceCommandsDisabled: 'Sprachbefehle deaktiviert',
    listening: 'Höre zu...',
    voiceNotSupported: 'Spracherkennung nicht unterstützt',
    
    // Text-to-Speech
    ttsEnabled: 'Sprachausgabe aktiviert',
    ttsDisabled: 'Sprachausgabe deaktiviert',
    speakingWorkoutInstructions: 'Trainingsanweisungen sprechen',
    
    // Accessibility
    increaseTextSize: 'Schriftgröße erhöhen',
    decreaseTextSize: 'Schriftgröße verringern',
    toggleHighContrast: 'Hohen Kontrast umschalten',
    skipToMainContent: 'Zum Hauptinhalt springen',
    navigationMenu: 'Navigationsmenü',
    
    // AI Chat
    aiCoach: 'KI-Fitness-Coach',
    aiCoachSubtitle: 'Angetrieben von Fortschrittlicher Maschinellen Lerntechnologie',
    aiOnline: 'KI Online',
    quickQuestions: 'Schnelle Fragen',
    quickQuestionsSubtitle: 'Tippen Sie auf eine Frage, um Ihren KI-Coach zu fragen',
    chatWithCoach: 'Chatten Sie mit Ihrem KI-Coach',
    chatSubtitle: 'Erhalten Sie personalisierte Fitnessberatung basierend auf Ihren Daten und Zielen',
    askAnything: 'Fragen Sie Ihren KI-Coach alles...',
    recentInsights: 'Aktuelle Erkenntnisse',
    show: 'Anzeigen',
    hide: 'Verbergen',
  },
  it: {
    // Navigation
    dashboard: 'Dashboard',
    workouts: 'Allenamenti',
    nutrition: 'Nutrizione',
    'ai-chat': 'Chat IA',
    progress: 'Progresso',
    profile: 'Profilo',
    settings: 'Impostazioni',
    
    // Common UI
    save: 'Salva',
    cancel: 'Annulla',
    edit: 'Modifica',
    delete: 'Elimina',
    close: 'Chiudi',
    back: 'Indietro',
    next: 'Avanti',
    previous: 'Precedente',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',
    
    // Dashboard
    welcome: 'Bentornato',
    todayWorkout: 'Allenamento di Oggi',
    weeklyGoal: 'Obiettivo Settimanale',
    caloriesBurned: 'Calorie Bruciate',
    workoutsCompleted: 'Allenamenti Completati',
    currentStreak: 'Serie Attuale',
    
    // Workouts
    startWorkout: 'Inizia Allenamento',
    pauseWorkout: 'Pausa Allenamento',
    resumeWorkout: 'Riprendi Allenamento',
    completeWorkout: 'Completa Allenamento',
    restTime: 'Tempo di Riposo',
    setComplete: 'Serie Completata',
    exerciseComplete: 'Esercizio Completato',
    workoutComplete: 'Allenamento Completato',
    
    // Nutrition
    logMeal: 'Registra Pasto',
    breakfast: 'Colazione',
    lunch: 'Pranzo',
    dinner: 'Cena',
    snacks: 'Spuntini',
    calories: 'Calorie',
    protein: 'Proteine',
    carbs: 'Carboidrati',
    fat: 'Grassi',
    
    // Settings
    appearance: 'Aspetto',
    accessibility: 'Accessibilità',
    language: 'Lingua',
    theme: 'Tema',
    fontSize: 'Dimensione Font',
    highContrast: 'Alto Contrasto',
    textToSpeech: 'Sintesi Vocale',
    voiceCommands: 'Comandi Vocali',
    screenReader: 'Supporto Screen Reader',
    
    // Voice Commands
    voiceCommandsEnabled: 'Comandi vocali abilitati',
    voiceCommandsDisabled: 'Comandi vocali disabilitati',
    listening: 'In ascolto...',
    voiceNotSupported: 'Riconoscimento vocale non supportato',
    
    // Text-to-Speech
    ttsEnabled: 'Sintesi vocale abilitata',
    ttsDisabled: 'Sintesi vocale disabilitata',
    speakingWorkoutInstructions: 'Pronuncia istruzioni allenamento',
    
    // Accessibility
    increaseTextSize: 'Aumenta dimensione testo',
    decreaseTextSize: 'Diminuisci dimensione testo',
    toggleHighContrast: 'Attiva/disattiva alto contrasto',
    skipToMainContent: 'Vai al contenuto principale',
    navigationMenu: 'Menu di navigazione',
    
    // AI Chat
    aiCoach: 'Coach AI di Fitness',
    aiCoachSubtitle: 'Alimentato da Tecnologia Avanzata di Apprendimento Automatico',
    aiOnline: 'IA Online',
    quickQuestions: 'Domande Rapide',
    quickQuestionsSubtitle: 'Tocca qualsiasi domanda per chiedere al tuo coach IA',
    chatWithCoach: 'Chatta con il Tuo Coach IA',
    chatSubtitle: 'Ottieni consigli fitness personalizzati basati sui tuoi dati e obiettivi',
    askAnything: 'Chiedi qualsiasi cosa al tuo coach IA...',
    recentInsights: 'Intuizioni Recenti',
    show: 'Mostra',
    hide: 'Nascondi',
  },
  pt: {
    // Navigation
    dashboard: 'Painel',
    workouts: 'Treinos',
    nutrition: 'Nutrição',
    'ai-chat': 'Chat IA',
    progress: 'Progresso',
    profile: 'Perfil',
    settings: 'Configurações',
    
    // Common UI
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    close: 'Fechar',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    
    // Dashboard
    welcome: 'Bem-vindo de volta',
    todayWorkout: 'Treino de Hoje',
    weeklyGoal: 'Meta Semanal',
    caloriesBurned: 'Calorias Queimadas',
    workoutsCompleted: 'Treinos Completados',
    currentStreak: 'Sequência Atual',
    
    // Workouts
    startWorkout: 'Iniciar Treino',
    pauseWorkout: 'Pausar Treino',
    resumeWorkout: 'Retomar Treino',
    completeWorkout: 'Completar Treino',
    restTime: 'Tempo de Descanso',
    setComplete: 'Série Completa',
    exerciseComplete: 'Exercício Completo',
    workoutComplete: 'Treino Completo',
    
    // Nutrition
    logMeal: 'Registrar Refeição',
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snacks: 'Lanches',
    calories: 'Calorias',
    protein: 'Proteína',
    carbs: 'Carboidratos',
    fat: 'Gordura',
    
    // Settings
    appearance: 'Aparência',
    accessibility: 'Acessibilidade',
    language: 'Idioma',
    theme: 'Tema',
    fontSize: 'Tamanho da Fonte',
    highContrast: 'Alto Contraste',
    textToSpeech: 'Texto para Fala',
    voiceCommands: 'Comandos de Voz',
    screenReader: 'Suporte a Leitor de Tela',
    
    // Voice Commands
    voiceCommandsEnabled: 'Comandos de voz habilitados',
    voiceCommandsDisabled: 'Comandos de voz desabilitados',
    listening: 'Ouvindo...',
    voiceNotSupported: 'Reconhecimento de voz não suportado',
    
    // Text-to-Speech
    ttsEnabled: 'Texto para fala habilitado',
    ttsDisabled: 'Texto para fala desabilitado',
    speakingWorkoutInstructions: 'Falando instruções do treino',
    
    // Accessibility
    increaseTextSize: 'Aumentar tamanho do texto',
    decreaseTextSize: 'Diminuir tamanho do texto',
    toggleHighContrast: 'Alternar alto contraste',
    skipToMainContent: 'Pular para o conteúdo principal',
    navigationMenu: 'Menu de navegação',
    
    // AI Chat
    aiCoach: 'Treinador de IA de Fitness',
    aiCoachSubtitle: 'Alimentado por Tecnologia Avançada de Aprendizado de Máquina',
    aiOnline: 'IA Online',
    quickQuestions: 'Perguntas Rápidas',
    quickQuestionsSubtitle: 'Toque em qualquer pergunta para perguntar ao seu treinador de IA',
    chatWithCoach: 'Converse com Seu Treinador de IA',
    chatSubtitle: 'Obtenha conselhos de fitness personalizados com base em seus dados e objetivos',
    askAnything: 'Pergunte qualquer coisa ao seu treinador de IA...',
    recentInsights: 'Insights Recentes',
    show: 'Mostrar',
    hide: 'Ocultar',
  }
};

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations.en;

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  availableLanguages: { code: Language; name: string; nativeName: string }[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const availableLanguages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'es' as Language, name: 'Spanish', nativeName: 'Español' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français' },
  { code: 'de' as Language, name: 'German', nativeName: 'Deutsch' },
  { code: 'it' as Language, name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt' as Language, name: 'Portuguese', nativeName: 'Português' },
];

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('fitness-ai-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('fitness-ai-language', language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const contextValue: TranslationContextType = {
    language,
    setLanguage,
    t,
    availableLanguages,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}