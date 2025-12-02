import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const Navbar = () => {
  const { user, logout, demoMode } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="user-greeting">
          <h1>Bonjour, {user?.name || 'Utilisateur'} 👋</h1>
          <p>Bienvenue sur votre espace bancaire sécurisé</p>
        </div>
        
        <div className="navbar-right">
          {demoMode && (
            <div className="demo-badge">
              <span className="demo-pulse"></span>
              Mode Démo
            </div>
          )}
          
          <div className="user-email">
            <span>{user?.email}</span>
          </div>
          
          <button onClick={handleLogout} className="logout-button">
            <span>Déconnexion</span>
            <span className="logout-arrow">↪</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;