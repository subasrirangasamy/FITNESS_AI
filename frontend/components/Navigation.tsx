import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { useTranslation } from "./TranslationContext";
import { useSoundFeedback } from "./SoundFeedback";
import { 
  Home, 
  Dumbbell, 
  Apple, 
  MessageSquare, 
  TrendingUp, 
  Settings, 
  User,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userData: { name: string; email: string } | null;
}

export function Navigation({ activeTab, onTabChange, userData }: NavigationProps) {
  const { t } = useTranslation();
  const { playClick } = useSoundFeedback();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const navigationItems = [
    { id: "dashboard", label: t('dashboard'), icon: Home },
    { id: "workouts", label: t('workouts'), icon: Dumbbell },
    { id: "nutrition", label: t('nutrition'), icon: Apple },
    { id: "ai-chat", label: t('ai-chat'), icon: MessageSquare, badge: "AI" },
    { id: "progress", label: t('progress'), icon: TrendingUp },
    { id: "profile", label: t('profile'), icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    playClick(); // 🎵 Play click sound
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    window.location.reload();
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`hidden md:flex md:flex-col ${isCollapsed ? 'md:w-16' : 'md:w-64'} md:bg-gradient-to-b md:from-sidebar/95 md:via-sidebar/90 md:to-sidebar/95 md:border-r md:border-sidebar-border md:backdrop-blur-xl relative transition-all duration-500 ease-in-out glass-strong`}>
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            {!isCollapsed && (
              <div className="animate-fadeIn">
                <h2 className="text-lg text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Fitness AI</h2>
                <p className="text-xs text-gray-400">Smart Coaching</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-1.5 transition-all duration-300 hover:scale-110 button-interactive"
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-3">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'} h-auto p-3 text-left transition-all duration-300 transform hover:scale-105 button-interactive ${
                    activeTab === item.id 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-purple-500/50" 
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                  onClick={() => handleTabClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={`w-4 h-4 ${!isCollapsed ? 'mr-3' : ''}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs px-1.5 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </nav>

          {/* Settings and Logout */}
          <div className="p-3 border-t border-gray-700/50 space-y-2">
            <Button 
              variant="ghost" 
              className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'} h-auto p-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 button-interactive`}
              onClick={() => handleTabClick("settings")}
              title={isCollapsed ? "Settings" : undefined}
            >
              <Settings className={`w-4 h-4 ${!isCollapsed ? 'mr-3' : ''} transition-transform hover:rotate-90 duration-300`} />
              {!isCollapsed && "Settings"}
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'} h-auto p-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-105 button-interactive`}
              onClick={handleLogout}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className={`w-4 h-4 ${!isCollapsed ? 'mr-3' : ''}`} />
              {!isCollapsed && "Sign Out"}
            </Button>
          </div>
        </div>

        {/* User Profile Avatar - Top Right */}
        {userData && (
          <div className="absolute top-4 right-4 z-10">
            <Popover open={showUserDetails} onOpenChange={setShowUserDetails}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="p-1 hover:bg-gray-800/50 rounded-full"
                >
                  <Avatar className="w-10 h-10 border-2 border-purple-500/50">
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                      {userData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-purple-500/30 backdrop-blur-xl" align="end">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12 border-2 border-purple-500/50">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                        {userData.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white text-sm font-medium">{userData.name}</p>
                      <p className="text-gray-400 text-xs">{userData.email}</p>
                      <p className="text-purple-300 text-xs">Pro Member</p>
                    </div>
                  </div>
                  <Separator className="mb-3 bg-gray-700/50" />
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50"
                      onClick={() => {
                        handleTabClick("profile");
                        setShowUserDetails(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50"
                      onClick={() => {
                        handleTabClick("settings");
                        setShowUserDetails(false);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Separator className="my-2 bg-gray-700/50" />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900/95 via-gray-800/90 to-gray-900/95 border-b border-gray-700/50 backdrop-blur-xl glass-strong">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-white">Fitness AI</h2>
              {userData && <p className="text-xs text-gray-400">{userData.name}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {userData && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="p-1 hover:bg-gray-800/50 rounded-full">
                    <Avatar className="w-8 h-8 border-2 border-purple-500/50">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm">
                        {userData.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0 bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-purple-500/30 backdrop-blur-xl" align="end">
                  <div className="p-3">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-10 h-10 border-2 border-purple-500/50">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                          {userData.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white text-sm">{userData.name}</p>
                        <p className="text-gray-400 text-xs">{userData.email}</p>
                      </div>
                    </div>
                    <Separator className="mb-2 bg-gray-700/50" />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50 text-sm"
                      onClick={() => handleTabClick("profile")}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-red-500/10 text-sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-gray-900/95 w-64 h-full p-4 backdrop-blur-xl border-r border-gray-700/50 glass-strong animate-slideInLeft">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-white">Fitness AI</h2>
                    <p className="text-xs text-gray-400">Smart Coaching</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-3 ${
                      activeTab === item.id 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => handleTabClick(item.id)}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs px-1.5 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
                
                <div className="pt-4 border-t border-gray-700/50 mt-4 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-auto p-3 text-gray-300 hover:text-white hover:bg-gray-800/50"
                    onClick={() => handleTabClick("settings")}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-auto p-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900/95 via-gray-800/90 to-gray-900/95 border-t border-gray-700/50 backdrop-blur-xl glass-strong">
        <div className="flex">
          {navigationItems.slice(0, 4).map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="flex-1 flex-col h-16 px-2 transition-all duration-300 hover:scale-110 button-interactive"
              onClick={() => handleTabClick(item.id)}
            >
              <item.icon className={`w-5 h-5 transition-all duration-300 ${activeTab === item.id ? 'text-blue-400 scale-110' : 'text-gray-400'}`} />
              <span className={`text-xs mt-1 transition-all duration-300 ${activeTab === item.id ? 'text-blue-400 font-medium' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {item.badge && activeTab === item.id && (
                <Badge variant="secondary" className="absolute top-1 right-1 bg-blue-500/20 text-blue-400 text-xs px-1 border-blue-500/30">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}