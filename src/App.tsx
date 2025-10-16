import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { useAuth } from './hooks/useAuth';
import { RoleBasedAccess } from './components/auth/RoleBasedAccess';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UserProfile } from './components/user/profile/UserProfile';
import { HomePage } from './components/pages/HomePage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { OrphanApplicationsView } from './components/orphan/OrphanApplicationsView';
import { OrphanApplicationView } from './components/orphan/OrphanApplicationView';
import { CreateOrphanApplication } from './components/orphan/CreateOrphanApplication';
import { UpdateOrphanApplication } from './components/orphan/UpdateOrphanApplication';
import { UserCreation } from './components/user/creation/UserCreation';

function App() {
  const { loading, user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'orphan-application' | 'orphan-application-view' | 'orphan-applications-view' | 'user-creation'>('home');
  const [applicationId, setApplicationId] = useState<string | undefined>();
  
  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <ThemeProvider>
        <LoadingSpinner message="Initializing Qatar Charity Bangladesh..." />
      </ThemeProvider>
    );
  }

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigateToProfile = () => {
    setCurrentPage('profile');
    setIsMobileMenuOpen(false);
  };

  const handleNavigateToOrphanApplication = (id?: string) => {
    setApplicationId(id);
    setCurrentPage('orphan-application');
    setIsMobileMenuOpen(false);
  };

  const handleNavigateToOrphanApplicationsView = () => {
    setCurrentPage('orphan-applications-view');
    setIsMobileMenuOpen(false);
  };

  const handleNavigateToOrphanApplicationView = (id: string) => {
    setApplicationId(id);
    setCurrentPage('orphan-application-view');
    setIsMobileMenuOpen(false);
  };

  const handleNavigateToUserCreation = () => {
    setCurrentPage('user-creation');
    setIsMobileMenuOpen(false);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setApplicationId(undefined);
  };
  const renderContent = () => {
    if (!isAuthenticated) {
      return <HomePage />;
    }

    switch (currentPage) {
      case 'profile':
        return (
          <ProtectedRoute>
            <UserProfile userId={user?.id || user?.username || ''} />
          </ProtectedRoute>
        );
      case 'orphan-application':
        return (
            applicationId ? (
              <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                <UpdateOrphanApplication
                  applicationId={applicationId}
                  onCancel={handleBackToHome}
                  onSave={() => {
                    // Handle successful save
                    handleBackToHome();
                  }}
                />
              </ProtectedRoute>
            ) : (
              <ProtectedRoute requiredRoles={['app-admin', 'app-agent']}>
                <CreateOrphanApplication
                  onCancel={handleBackToHome}
                  onSave={() => {
                    // Handle successful save
                    handleBackToHome();
                  }}
                />
              </ProtectedRoute>
            ));
      case 'orphan-application-view':
        return (
          <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
            {applicationId ? (
              <OrphanApplicationView
                applicationId={applicationId}
                onBack={() => setCurrentPage('orphan-applications-view')}
              />
            ) : null}
          </ProtectedRoute>
        );
      case 'orphan-applications-view':
        return (
          <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
            <OrphanApplicationsView
              onViewApplication={handleNavigateToOrphanApplicationView}
              onEditApplication={(appId) => {
                setApplicationId(appId);
                setCurrentPage('orphan-application');
              }}
              onCreateNew={() => {
                setApplicationId(undefined);
                setCurrentPage('orphan-application');
              }}
            />
          </ProtectedRoute>
        );
      case 'user-creation':
        return (
          <RoleBasedAccess requiredRoles={['app-admin', 'app-agent']}>
            <UserCreation
              onComplete={() => {
                // Handle successful user creation
                handleBackToHome();
              }}
              onCancel={handleBackToHome}
            />
          </RoleBasedAccess>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Header 
            onMenuToggle={handleMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToOrphanApplication={handleNavigateToOrphanApplication}
            onNavigateToOrphanApplicationsView={handleNavigateToOrphanApplicationsView}
            onNavigateToUserCreation={handleNavigateToUserCreation}
          />
          <main>
            {renderContent()}
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;