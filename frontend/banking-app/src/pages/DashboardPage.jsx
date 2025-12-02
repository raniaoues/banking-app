import React from 'react';
import Balance from '../components/Balance';
import Transactions from '../components/Transactions';
import Transfer from '../components/Transfer';
import { useAuth } from '../context/AuthContext';
import '../styles/pages.css';

const DashboardPage = () => {
  const { user, demoMode } = useAuth();

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <h2>Bonjour, {user?.firstName || user?.name} 👋</h2>
        <p>Bienvenue sur votre espace bancaire sécurisé</p>
        {demoMode && (
          <div className="demo-banner" style={{maxWidth: '400px', margin: '20px auto'}}>
            <strong>Mode Démo Actif</strong> - Données simulées
          </div>
        )}
      </div>
      <div className="page-content">
        <div className="dashboard-grid">
          <div className="grid-column">
            <Balance />
            <Transfer />
          </div>
          <div className="grid-column">
            <Transactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;