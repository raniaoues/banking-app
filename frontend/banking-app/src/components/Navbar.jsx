import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const Navbar = () => {
  const { user, logout, demoMode } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-welcome">
          <h1>Bonjour, {user?.firstName || user?.name || 'Utilisateur'} 👋</h1>
          <p>Bienvenue sur votre espace bancaire sécurisé</p>
          {user?.phone && (
            <div className="user-phone">
              <span>📱 {user.phone}</span>
            </div>
          )}
        </div>
        
        <div className="navbar-actions">
          {demoMode && (
            <div className="demo-tag">
              <span className="demo-pulse"></span>
              Mode Démo
            </div>
          )}
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span>Déconnexion</span>
            <span className="logout-icon">→</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;