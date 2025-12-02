import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '+33 $1 $2 $3 $4 $5');
    }
    return phone;
  };

  const validateForm = () => {
    if (formData.firstName.trim().length < 2) {
      setError('Le prénom doit contenir au moins 2 caractères');
      return false;
    }

    if (formData.lastName.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer un email valide');
      return false;
    }

    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Veuillez entrer un numéro de téléphone valide (ex: +33 6 12 34 56 78)');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Concaténer prénom et nom
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const formattedPhone = formatPhone(formData.phone);
    
    const result = await signup(fullName, formData.email, formattedPhone, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Erreur lors de la création du compte');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">🏦</div>
              <h1>NEO Bank</h1>
            </div>
            <p className="login-subtitle">Créer votre compte bancaire</p>
          </div>

          <div className="signup-notice">
            <h4>📋 Informations requises</h4>
            <p>Tous les champs sont obligatoires pour créer votre compte</p>
            <p>Un RIB unique sera généré automatiquement</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                />
              </div>


            </div>
                         <div className="form-row"> <div className="form-group">
                <label htmlFor="lastName">Nom *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                  autoComplete="family-name"
                />
              </div>  </div>

            <div className="form-group">
              <label htmlFor="email">Adresse email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Numéro de téléphone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+33 6 12 34 56 78"
                autoComplete="tel"
              />
              <small className="form-hint">Format: +33 6 12 34 56 78 ou 06 12 34 56 78</small>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 6 caractères"
                minLength="6"
                autoComplete="new-password"
              />
              <small className="form-hint">Au moins 6 caractères</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Retapez votre mot de passe"
                autoComplete="new-password"
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
                  Création en cours...
                </>
              ) : 'Créer mon compte'}
            </button>
          </form>

          <div className="login-footer">
            <p className="signup-link">
              Vous avez déjà un compte ? 
              <Link to="/login" className="signup-button">Se connecter</Link>
            </p>
            <p className="security-note">
              🔒 Vos données sont sécurisées avec chiffrement TLS/SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;