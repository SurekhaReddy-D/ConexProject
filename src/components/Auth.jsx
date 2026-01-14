import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  const handleAuthSuccess = (user) => {
    onAuthSuccess(user);
  };

  return (
    <div>
      {isLogin ? (
        <Login 
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleAuthSuccess}
        />
      ) : (
        <Register 
          onSwitchToLogin={handleSwitchToLogin}
          onRegisterSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default Auth; 