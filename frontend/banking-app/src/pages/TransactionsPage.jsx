import React from 'react';
import Transactions from '../components/Transactions';
import { useAuth } from '../context/AuthContext';
import '../styles/pages.css';

const TransactionsPage = () => {
  const { demoMode } = useAuth();

  return (
    <div className="page transactions-page">
      <div className="page-header">
        <h1>Historique des transactions</h1>
        <p className="page-subtitle">
          Consultez toutes vos opérations financières
        </p>
        
        {demoMode && (
          <div className="demo-banner">
            <span className="demo-pulse"></span>
            <strong>Mode Démo</strong> - Données de transaction simulées
          </div>
        )}
      </div>

      <div className="page-content">
        <Transactions />
        
        <div className="transactions-info">
          <div className="info-box">
            <h3>💡 Comment fonctionne l'historique ?</h3>
            <ul>
              <li>Les transactions sont affichées par ordre chronologique</li>
              <li>Les montants en <span className="credit-text">vert</span> sont des crédits</li>
              <li>Les montants en <span className="debit-text">rouge</span> sont des débits</li>
              <li>L'historique est mis à jour en temps réel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;