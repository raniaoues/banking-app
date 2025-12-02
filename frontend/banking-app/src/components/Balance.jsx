import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountAPI } from '../services/api';
import '../styles/components.css';

const Balance = () => {
  const [balance, setBalance] = useState(0);
  const [rib, setRib] = useState('');
  const [loading, setLoading] = useState(true);
  const { token, demoMode, user } = useAuth();

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    if (demoMode) {
      setBalance(2450.75);
      setRib("FR76 3000 1000 0100 1234 5678 901");
      setLoading(false);
      return;
    }

    try {
      const data = await accountAPI.getBalance(token);
      // Django peut retourner les données dans différents formats
      setBalance(data.balance || data.amount || 0);
      setRib(data.rib || user?.rib || '');
    } catch (error) {
      console.error('Erreur lors du chargement du solde:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... reste du code inchangé ...

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('RIB copié dans le presse-papier !');
    });
  };

  if (loading) {
    return (
      <div className="balance-card balance-loading">
        <div className="loading-spinner" style={{margin: '0 auto 16px'}}></div>
        <p>Chargement du solde...</p>
      </div>
    );
  }

  const getBalanceClass = () => {
    if (balance > 0) return 'positive';
    if (balance < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className={`balance-card ${getBalanceClass()}`}>
      <div className="balance-header">
        <h3>Solde actuel</h3>
        {demoMode && <span className="demo-tag">Mode Démo</span>}
      </div>
      
      <div className="balance-amount">
        {balance.toFixed(2)} €
      </div>
      
      <div className="balance-trend">
        {balance > 0 && (
          <>
            <span className="trend-up">↗</span>
            <span>Solde positif</span>
          </>
        )}
        {balance < 0 && (
          <>
            <span className="trend-down">↘</span>
            <span>Solde négatif</span>
          </>
        )}
        {balance === 0 && (
          <>
            <span className="trend-neutral">→</span>
            <span>Solde neutre</span>
          </>
        )}
      </div>

      {/* Section RIB */}
      <div className="rib-section">
        <div className="rib-label">Votre RIB</div>
        <div className="rib-display">
          <span className="rib-number">{rib}</span>
          <button 
            className="rib-copy-btn"
            onClick={() => copyToClipboard(rib)}
            title="Copier le RIB"
          >
            📋 Copier
          </button>
        </div>
        <div className="rib-hint">Utilisez ce RIB pour recevoir des virements</div>
      </div>

      <p className="balance-info">
        {demoMode ? "Mode démo - Données simulées" : "Solde actualisé en temps réel"}
      </p>
    </div>
  );
};

export default Balance;