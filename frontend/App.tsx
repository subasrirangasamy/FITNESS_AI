import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  lazy,
  Suspense,
  startTransition,
} from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Login } from "./components/Login";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { TranslationProvider } from "./components/TranslationContext";
import { TextToSpeechProvider } from "./components/TextToSpeechService";
import { SoundFeedbackProvider } from "./components/SoundFeedback";
import { AccessibilityFloatingButton } from "./components/AccessibilityFloatingButton";
import { Toaster } from "./components/ui/sonner";
import { Skeleton } from "./components/ui/skeleton";

// 🚀 Lazy load heavy components for better performance
const WorkoutTracker = lazy(() => import("./components/WorkoutTracker").then(m => ({ default: m.WorkoutTracker })));
const NutritionPlanner = lazy(() => import("./components/NutritionPlanner").then(m => ({ default: m.NutritionPlanner })));
const AIChat = lazy(() => import("./components/AIChat").then(m => ({ default: m.AIChat })));
const ProgressTracker = lazy(() => import("./components/ProgressTracker").then(m => ({ default: m.ProgressTracker })));
const UserProfile = lazy(() => import("./components/UserProfile").then(m => ({ default: m.UserProfile })));
const Settings = lazy(() => import("./components/Settings").then(m => ({ default: m.Settings })));

interface UserData {
  name: string;
  email: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large" | "extra-large">("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Load theme, font size, and accessibility settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("fitness-ai-theme") as "light" | "dark" | null;
    const savedFontSize = localStorage.getItem("fitness-ai-font-size") as "small" | "medium" | "large" | "extra-large" | null;
    const savedHighContrast = localStorage.getItem("fitness-ai-high-contrast") === "true";
    const savedReduceMotion = localStorage.getItem("fitness-ai-reduce-motion") === "true";

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);
    setReduceMotion(savedReduceMotion);
  }, []);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("fitness-ai-theme", theme);
  }, [theme]);

  // Apply font size to document and save to localStorage
  useEffect(() => {
    document.documentElement.classList.remove("font-small", "font-medium", "font-large", "font-extra-large");
    document.documentElement.classList.add(`font-${fontSize}`);
    localStorage.setItem("fitness-ai-font-size", fontSize);
  }, [fontSize]);

  // Apply high contrast mode and save to localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
    localStorage.setItem("fitness-ai-high-contrast", highContrast.toString());
  }, [highContrast]);

  // Apply reduce motion preference and save to localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
    localStorage.setItem("fitness-ai-reduce-motion", reduceMotion.toString());
  }, [reduceMotion]);

  const handleLogin = useCallback((userData: UserData) => {
    setUserData(userData);
    setIsLoggedIn(true);
  }, []);

  // Wrap tab changes with startTransition for lazy-loaded components
  const handleTabChange = useCallback((tab: string) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  }, []);

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="space-y-6 p-6 animate-fadeIn">
      <Skeleton className="h-12 w-64 skeleton" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 w-full rounded-xl skeleton" />
        <Skeleton className="h-64 w-full rounded-xl skeleton" />
        <Skeleton className="h-64 w-full rounded-xl skeleton" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl skeleton" />
    </div>
  );

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard userData={userData} onTabChange={handleTabChange} />;
      case "workouts":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <WorkoutTracker />
          </Suspense>
        );
      case "nutrition":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <NutritionPlanner />
          </Suspense>
        );
      case "ai-chat":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AIChat userData={userData} />
          </Suspense>
        );
      case "progress":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ProgressTracker />
          </Suspense>
        );
      case "profile":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserProfile userData={userData} />
          </Suspense>
        );
      case "settings":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Settings
              userData={userData}
              theme={theme}
              onThemeChange={setTheme}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
            />
          </Suspense>
        );
      default:
        return <Dashboard userData={userData} onTabChange={handleTabChange} />;
    }
  }, [activeTab, userData, theme, fontSize, handleTabChange]);

  if (!isLoggedIn) {
    return (
      <TranslationProvider>
        <ErrorBoundary>
          <Login onLogin={handleLogin} />
        </ErrorBoundary>
      </TranslationProvider>
    );
  }

  return (
    <TranslationProvider>
      <TextToSpeechProvider>
        <SoundFeedbackProvider>
          <ErrorBoundary>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            <div className={`min-h-screen transition-theme ${theme === "dark" ? "bg-gradient-to-br from-black via-gray-900 to-black" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"}`}>
              <div className="flex">
                <Navigation activeTab={activeTab} onTabChange={handleTabChange} userData={userData} />

                <div className="flex-1 md:ml-0">
                  <main id="main-content" className="p-4 md:p-6 pb-20 md:pb-6 md:pr-16" role="main" aria-label="Main content">
                    {renderContent}
                  </main>
                </div>
              </div>

              <AccessibilityFloatingButton
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                highContrast={highContrast}
                onHighContrastChange={setHighContrast}
                onOpenSettings={() => handleTabChange("settings")}
              />
            </div>
            <Toaster position="top-right" richColors closeButton theme={theme} className="animate-slideInRight" />
          </ErrorBoundary>
        </SoundFeedbackProvider>
      </TextToSpeechProvider>
    </TranslationProvider>
  );
}
