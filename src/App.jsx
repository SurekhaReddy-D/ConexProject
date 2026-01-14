import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import { authService } from './services/authService';
import Home from './views/Home';
import Work from './views/Work';
import Meetings from './views/Meetings';
import Actions from './views/Actions';
import Members from './views/Members';
import Tasks from './views/Tasks';
import Timeline from './views/Timeline';

function App() {
  const [currentView, setCurrentView] = useState('Home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setIsAuthenticated(true);
            setUser(currentUser);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'Home':
        return <Home />;
      case 'Work':
        return <Work />;
      case 'Meetings':
        return <Meetings />;
      case 'Actions':
        return <Actions />;
      case 'Members':
        return <Members />;
      case 'Tasks':
        return <Tasks />;
      case 'Timeline':
        return <Timeline />;
      default:
        return <Home />;
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Show main app if authenticated
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Fixed TopBar */}
      <TopBar user={user} onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        
        {/* Scrollable Center Panel */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="p-6">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App; 