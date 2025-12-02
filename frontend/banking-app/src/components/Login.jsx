import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    
    setLoading(false);
  };

  const handleDemoLogin = () => {
    setEmail('demo@demo.com');
    setPassword('demo');
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">🏦</div>
              <h1>NEO Bank</h1>
            </div>
            <p className="login-subtitle">Connexion sécurisée à votre compte</p>
          </div>

          <div className="demo-section">
            <h3>🚀 Mode Démo</h3>
            <p>Testez l'application avec des données simulées :</p>
            <div className="demo-credentials">
              <div className="credential-item">
                <strong>Email:</strong> demo@demo.com
              </div>
              <div className="credential-item">
                <strong>Mot de passe:</strong> demo
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleDemoLogin} 
              className="demo-button"
            >
              Remplir automatiquement
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Votre mot de passe sécurisé"
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Connexion en cours...
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          <div className="login-footer">
            <p className="signup-link">
              Vous n'avez pas de compte ? 
              <Link to="/signup" className="signup-button">Créer un compte</Link>
            </p>
            <p className="security-note">
              🔒 Connexion sécurisée avec chiffrement TLS/SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;