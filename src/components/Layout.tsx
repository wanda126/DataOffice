import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Home, Calendar, MessageCircle, User, LogOut, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab?: 'home' | 'calendar' | 'chat' | 'profile';
  onTabChange?: (tab: 'home' | 'calendar' | 'chat' | 'profile') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab = 'home', onTabChange }) => {
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Perfil', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">DataConsult</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="flex items-center space-x-3">
                    {user.avatar && (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.company}</p>
                    </div>
                  </div>
                  
                  {user.role === 'admin' && (
                    <button className="p-2 text-gray-400 hover:text-gray-500">
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                  
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id as any)}
                className={`flex flex-col items-center justify-center py-2 px-1 ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id as any)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 flex-shrink-0 h-6 w-6" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </div>
  );
};