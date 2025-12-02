import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import '../styles/components.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, demoMode } = useAuth();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    if (demoMode) {
      const demoTransactions = [
        {
          id: 1,
          amount: -150.00,
          description: "Achat en ligne",
          created_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          amount: 2000.00,
          description: "Salaire",
          created_at: "2024-01-10T08:00:00Z"
        },
        {
          id: 3,
          amount: -45.50,
          description: "Courses supermarché",
          created_at: "2024-01-08T16:45:00Z"
        },
        {
          id: 4,
          amount: -29.99,
          description: "Abonnement streaming",
          created_at: "2024-01-05T12:00:00Z"
        },
        {
          id: 5,
          amount: 300.00,
          description: "Remboursement",
          created_at: "2024-01-02T14:20:00Z"
        }
      ];
      setTransactions(demoTransactions);
      setLoading(false);
      return;
    }

    try {
      const data = await apiService.get('/account/transactions', token);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="transactions-card loading">Chargement des transactions...</div>;
  }

  return (
    <div className="transactions-card">
      <h3>Dernières transactions</h3>
      {demoMode && <div className="demo-notice">Mode démo - Données simulées</div>}
      
      {transactions.length === 0 ? (
        <div className="no-transactions">
          Aucune transaction pour le moment
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-main">
                <span className="transaction-description">
                  {transaction.description || 'Transaction'}
                </span>
                <span className={`transaction-amount ${transaction.amount >= 0 ? 'credit' : 'debit'}`}>
                  {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)} €
                </span>
              </div>
              <div className="transaction-date">
                {formatDate(transaction.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;