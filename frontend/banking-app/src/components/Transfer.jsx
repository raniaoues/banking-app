import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import '../styles/components.css';

const Transfer = () => {
  const [recipientRIB, setRecipientRIB] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'
  const { token, demoMode, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    // Validation
    if (!recipientRIB.trim()) {
      setMessage('Veuillez entrer le RIB du bénéficiaire');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Veuillez entrer un montant valide');
      setMessageType('error');
      setLoading(false);
      return;
    }

    // Simulation en mode démo
    if (demoMode) {
      setTimeout(() => {
        setMessage(`Virement de ${amount}€ vers le RIB ${recipientRIB} effectué avec succès! (Mode démo)`);
        setMessageType('success');
        setRecipientRIB('');
        setAmount('');
        setDescription('');
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const result = await apiService.post('/transfer', {
        recipient_rib: recipientRIB,
        amount: parseFloat(amount),
        description: description || 'Virement bancaire'
      }, token);

      if (result.success || result.status === 'success') {
        setMessage(`Virement de ${amount}€ effectué avec succès!`);
        setMessageType('success');
        setRecipientRIB('');
        setAmount('');
        setDescription('');
      } else {
        setMessage(result.error || result.message || 'Erreur lors du virement');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const formatRIB = (value) => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    if (cleaned.startsWith('FR') && cleaned.length >= 27) {
      const parts = cleaned.match(/.{1,4}/g);
      return parts ? parts.join(' ') : cleaned;
    }
    return value;
  };

  const copyRIB = () => {
    const ribToCopy = user?.rib || "FR76 3000 1000 0100 1234 5678 901";
    navigator.clipboard.writeText(ribToCopy)
      .then(() => {
        alert('RIB copié dans le presse-papier !');
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
  };

  return (
    <div className="transfer-card">
      <h3>Effectuer un virement</h3>
      {demoMode && <div className="demo-notice">Mode démo - Les virements sont simulés</div>}
      
      {/* Section RIB personnel */}
      <div className="my-rib-section">
        <h4>Votre RIB :</h4>
        <div className="my-rib-display">
          <span className="my-rib-number">{user?.rib || "FR76 3000 1000 0100 1234 5678 901"}</span>
          <button className="my-rib-copy" onClick={copyRIB}>
            📋
          </button>
        </div>
        <p className="my-rib-hint">Donnez ce RIB pour recevoir des virements</p>
      </div>
      
      <form onSubmit={handleSubmit} className="transfer-form">
        {message && (
          <div className={messageType === 'success' ? 'success' : 'error'}>
            {message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="recipientRIB">RIB du bénéficiaire *</label>
          <input
            type="text"
            id="recipientRIB"
            value={recipientRIB}
            onChange={(e) => setRecipientRIB(formatRIB(e.target.value))}
            required
            placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
            pattern="FR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{3}"
          />
          <small className="form-hint">Format: FR76 XXXX XXXX XXXX XXXX XXXX XXX</small>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Montant *</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
          />
          <small className="form-hint">Minimum: 0.01 €</small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optionnel)</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Motif du virement"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="transfer-button"
        >
          {loading ? 'Traitement...' : 'Effectuer le virement'}
        </button>
      </form>
    </div>
  );
};

export default Transfer;