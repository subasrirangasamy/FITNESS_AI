import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useTranslation } from "./TranslationContext";
import { Send, Bot, User, Zap, Target, TrendingUp, Sparkles, Brain, MessageSquare } from "lucide-react";
import { useSoundFeedback } from "./SoundFeedback";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuickQuestion {
  id: string;
  question: string;
  category: "workout" | "nutrition" | "recovery" | "motivation";
}

interface AIChatProps {
  userData: { name: string; email: string } | null;
}

export function AIChat({ userData }: AIChatProps) {
  const { t } = useTranslation();
  const { playClick } = useSoundFeedback();
  const firstName = userData?.name.split(' ')[0] || 'Champion';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Hi ${firstName}! I'm your AI fitness coach powered by advanced machine learning algorithms. I've been analyzing your workout patterns and nutrition data. How can I help you optimize your fitness journey today?`,
      timestamp: new Date(),
      suggestions: [
        "Suggest today's workout",
        "Review my nutrition",
        "Analyze my progress",
        "Motivate me!"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickQuestions: QuickQuestion[] = [
    { id: "1", question: "Should I do cardio today?", category: "workout" },
    { id: "2", question: "What should I eat pre-workout?", category: "nutrition" },
    { id: "3", question: "How much protein do I need?", category: "nutrition" },
    { id: "4", question: "Why am I plateauing?", category: "workout" },
    { id: "5", question: "How to improve recovery?", category: "recovery" },
    { id: "6", question: "I'm feeling unmotivated", category: "motivation" },
    { id: "7", question: "Best time to workout?", category: "workout" },
    { id: "8", question: "How to track macros?", category: "nutrition" },
  ];

  const getAIResponse = useCallback((userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("workout") || message.includes("exercise")) {
      return `Based on your recent training data and AI analysis, I recommend an upper body strength session today, ${firstName}. Your last upper body workout was 3 days ago, and your recovery metrics show you're ready for intensity. The algorithm suggests focusing on compound movements: bench press, pull-ups, and overhead press. Your optimal training window is 7-9 AM based on your performance patterns. Would you like me to generate a specific workout plan?`;
    }
    
    if (message.includes("nutrition") || message.includes("eat") || message.includes("food")) {
      return `Your current nutrition is 65% on track, ${firstName}! The AI analysis shows you're consistently low on protein (averaging 85g vs 150g target). I recommend adding a protein shake post-workout and incorporating more lean meats. Your carb timing is good, but consider having 20-30g carbs 30 minutes before workouts for optimal performance. The algorithm suggests meal prep on Sundays has increased your adherence by 40%. Want a personalized meal plan?`;
    }
    
    if (message.includes("progress") || message.includes("plateau")) {
      return `Your progress data shows excellent consistency, ${firstName}! You've completed 87% of planned workouts this month. However, I detected a strength plateau in your bench press. The AI algorithm suggests increasing training frequency to 2x/week for chest, and optimizing rep ranges (6-8, 8-12, 12-15). Your body weight has been stable, but muscle mass increased 2.3% based on your logged measurements. Let's adjust your program!`;
    }
    
    if (message.includes("cardio")) {
      return `Great question! Based on your current training load and recovery metrics, I recommend 20 minutes of moderate cardio today, ${firstName}. Your heart rate variability suggests good recovery, and adding cardio won't interfere with tomorrow's leg day. The optimal time for you is post-workout or evening based on your performance data. Zone 2 cardio (140-150 BPM) would complement your strength goals best.`;
    }
    
    if (message.includes("motivat") || message.includes("tired") || message.includes("lazy")) {
      return `I understand those feelings, ${firstName}! Your consistency has been incredible - 4 workouts completed this week! Remember why you started: you wanted to build strength and confidence. The data shows you're 23% stronger than when you began, and your endurance has improved by 31%. Small wins lead to big victories. Even a 15-minute workout today is better than none. You've got this! What's one small step you can take right now?`;
    }
    
    if (message.includes("recovery") || message.includes("sore") || message.includes("rest")) {
      return `Recovery is crucial for progress, ${firstName}! Your training load has been high lately. I recommend focusing on sleep quality (aim for 7-9 hours), proper hydration, and light stretching. Your muscle soreness patterns suggest you might benefit from a deload week soon. The AI analysis shows your best recovery happens when you get 8+ hours of sleep and eat protein within 2 hours post-workout. Consider a rest day or active recovery with yoga/walking.`;
    }
    
    return `That's a great question, ${firstName}! I'm constantly learning from your data to provide better recommendations. Based on your training history, nutrition patterns, and progress metrics, I can help you optimize your workouts, nutrition timing, recovery strategies, and motivation. My advanced AI algorithms adapt to your preferences and results. What specific aspect of your fitness journey would you like to explore together?`;
  }, [firstName]);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(content),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      playClick();
      sendMessage(inputMessage);
    }
  };

  const handleQuickQuestion = (question: string) => {
    playClick();
    sendMessage(question);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "workout": return "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30";
      case "nutrition": return "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30";
      case "recovery": return "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30";
      case "motivation": return "bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "workout": return Target;
      case "nutrition": return Zap;
      case "recovery": return TrendingUp;
      case "motivation": return Sparkles;
      default: return Bot;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">{t('aiCoach')}</h1>
          <p className="text-gray-300">
            {t('aiCoachSubtitle')}
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 px-3 py-1.5">
          <Bot className="w-4 h-4" />
          {t('aiOnline')}
        </Badge>
      </div>

      {/* Quick Questions - Now at the top */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            {t('quickQuestions')}
          </CardTitle>
          <p className="text-sm text-gray-300">
            {t('quickQuestionsSubtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickQuestions.map((q) => {
              const IconComponent = getCategoryIcon(q.category);
              return (
                <Button
                  key={q.id}
                  variant="outline"
                  className={`h-auto p-2.5 text-left flex flex-col items-start gap-1.5 bg-gray-800/40 border-gray-600/50 text-gray-200 transition-all duration-300 hover:scale-105 cursor-pointer ${getCategoryColor(q.category)} w-full min-h-[70px] max-w-full`}
                  onClick={() => handleQuickQuestion(q.question)}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
                    <Badge variant="secondary" className={`text-xs ${getCategoryColor(q.category)} border-0 flex-shrink-0 px-1.5 py-0.5`}>
                      {q.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-left leading-tight word-break w-full">{q.question}</p>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Interface - Fixed Height */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-4 h-4 text-blue-400" />
            {t('chatWithCoach')}
          </CardTitle>
          <p className="text-sm text-gray-300">
            {t('chatSubtitle')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages Container with Fixed Height and Proper Overflow */}
          <div className="h-[400px] flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 pr-3">
              <div className="space-y-3 pb-4 overflow-x-hidden">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2.5 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    } w-full`}
                  >
                    {message.type === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[calc(100%-3rem)] min-w-0 rounded-lg px-3 py-2.5 shadow-lg overflow-hidden ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gradient-to-br from-gray-700/80 to-gray-800/80 text-gray-100 border border-gray-600/50"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere hyphens-auto">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1.5 break-all">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-2.5 justify-start w-full">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-lg px-3 py-2.5 border border-gray-600/50">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Enhanced Send Box - Always at bottom */}
          <div className="pt-4 border-t border-purple-500/30">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('askAnything')}
                disabled={isLoading}
                className="flex-1 bg-gray-700/60 border-2 border-purple-500/50 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 h-11 px-4"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-11 px-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Recent Insights */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              {t('recentInsights')}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                playClick();
                setShowInsights(!showInsights);
              }}
              className="text-purple-300 border-purple-500/30 hover:bg-purple-500/20 h-8"
            >
              {showInsights ? t('hide') : t('show')}
            </Button>
          </div>
        </CardHeader>
        {showInsights && (
          <CardContent>
            <div className="space-y-2.5">
              <div className="p-2.5 bg-gradient-to-r from-blue-500/20 to-blue-600/10 rounded-lg text-sm border border-blue-500/30">
                <p className="text-blue-200 break-words word-wrap overflow-wrap-anywhere">🎯 Detected optimal training time: 7-9 AM</p>
              </div>
              <div className="p-2.5 bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-lg text-sm border border-green-500/30">
                <p className="text-green-200 break-words word-wrap overflow-wrap-anywhere">🥗 Nutrition adherence improved 23% this week</p>
              </div>
              <div className="p-2.5 bg-gradient-to-r from-purple-500/20 to-purple-600/10 rounded-lg text-sm border border-purple-500/30">
                <p className="text-purple-200 break-words word-wrap overflow-wrap-anywhere">💪 Strength gains accelerating in upper body</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}