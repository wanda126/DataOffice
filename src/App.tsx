import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginForm } from './components/LoginForm';
import { OnboardingWizard } from './components/OnboardingWizard';
import { Layout } from './components/Layout';
import { KanbanBoard } from './components/KanbanBoard';
import { ConsultationForm } from './components/ConsultationForm';
import { ChatInterface } from './components/ChatInterface';
import { CalendarView } from './components/CalendarView';
import { ProfileImageUpload } from './components/ProfileImageUpload';
import { ServiceRecommendations } from './components/ServiceRecommendations';
import { ReviewForm } from './components/ReviewForm';
import { Plus } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'chat' | 'profile'>('home');
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);

  // Show login if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Show onboarding for new users (simulated)
  if (showOnboarding) {
    return (
      <OnboardingWizard 
        onComplete={() => setShowOnboarding(false)} 
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <KanbanBoard />
            {user.role === 'client' && (
              <div className="fixed bottom-20 right-4 md:bottom-4">
                <button
                  onClick={() => setShowConsultationForm(true)}
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        );
      case 'calendar':
        return <CalendarView />;
      case 'chat':
        return <ChatInterface />;
      case 'profile':
        return (
          <div className="p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfil de Usuario</h2>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <ProfileImageUpload
                      currentImage={user.avatar_url}
                      onImageChange={(file) => {
                        // Handle avatar upload
                        console.log('Avatar upload:', file);
                      }}
                      type="avatar"
                    />
                    <ProfileImageUpload
                      currentImage={user.company_logo_url}
                      onImageChange={(file) => {
                        // Handle logo upload
                        console.log('Logo upload:', file);
                      }}
                      type="logo"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.company}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <p className="text-gray-900 capitalize">{user.role}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultas Gratuitas Restantes
                    </label>
                    <p className="text-gray-900">
                      {2 - user.free_consultations_used} de 2
                    </p>
                  </div>

                  {user.maturity_level && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nivel de Madurez Digital
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(user.maturity_level / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {user.maturity_level.toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowOnboarding(true)}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Repetir Evaluación de Madurez
                  </button>
                </div>
              </div>

              {user.maturity_level && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <ServiceRecommendations 
                    maturityLevel={user.maturity_level}
                    freeConsultationsUsed={user.free_consultations_used}
                  />
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="md:ml-64">
        {renderContent()}
      </div>
      
      {showConsultationForm && (
        <ConsultationForm onClose={() => setShowConsultationForm(false)} />
      )}
      
      {showReviewForm && (
        <ReviewForm
          consultationId={showReviewForm}
          onSubmit={(rating, comment) => {
            // Handle review submission
            console.log('Review submitted:', { rating, comment });
          }}
          onClose={() => setShowReviewForm(null)}
        />
      )}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;