import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    // Mode démo - données simulées
    if (demoMode || token === 'demo-token') {
      setUser({
        id: 1,
        first_name: "Jean",
        last_name: "Dupont",
        name: "Jean Dupont",
        email: "demo@demo.com",
        phone: "+33 6 12 34 56 78",
        rib: "FR76 3000 1000 0100 1234 5678 901"
      });
      setLoading(false);
      return;
    }

    try {
      const userData = await authAPI.verifyToken(token);
      if (userData) {
        // Formatage des données utilisateur
        const formattedUser = {
          id: userData.id,
          first_name: userData.first_name || userData.firstName,
          last_name: userData.last_name || userData.lastName,
          name: userData.name || `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          phone: userData.phone,
          rib: userData.rib
        };
        setUser(formattedUser);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    // Mode démo
    if (email === "demo@demo.com" && password === "demo") {
      setDemoMode(true);
      const demoUser = {
        id: 1,
        first_name: "Jean",
        last_name: "Dupont",
        name: "Jean Dupont",
        email: "demo@demo.com",
        phone: "+33 6 12 34 56 78",
        rib: "FR76 3000 1000 0100 1234 5678 901"
      };
      setUser(demoUser);
      setToken("demo-token");
      localStorage.setItem('token', "demo-token");
      return { success: true };
    }

    try {
      const response = await authAPI.login(email, password);
      
      if (response.access) {
        // Django JWT retourne généralement un objet avec 'access' (token) et 'refresh'
        const accessToken = response.access;
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        
        // Récupérer les infos utilisateur
        const userData = response.user || await authAPI.verifyToken(accessToken);
        if (userData) {
          const formattedUser = {
            id: userData.id,
            first_name: userData.first_name || userData.firstName,
            last_name: userData.last_name || userData.lastName,
            name: userData.name || `${userData.first_name} ${userData.last_name}`,
            email: userData.email,
            phone: userData.phone,
            rib: userData.rib
          };
          setUser(formattedUser);
        }
        
        setDemoMode(false);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.detail || 'Email ou mot de passe incorrect' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erreur de connexion au serveur' 
      };
    }
  };

  const signup = async (name, email, phone, password) => {
    // Mode démo - email réservé
    if (email === "demo@demo.com") {
      return { 
        success: false, 
        error: 'Cet email est réservé pour le mode démo. Utilisez un autre email.' 
      };
    }

    try {
      // Préparer les données pour Django
      const userData = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        password2: password // Django attend souvent password et password2 pour confirmation
      };

      const response = await authAPI.register(userData);
      
      if (response.access) {
        const accessToken = response.access;
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        
        if (response.user) {
          const formattedUser = {
            id: response.user.id,
            first_name: response.user.first_name || response.user.firstName,
            last_name: response.user.last_name || response.user.lastName,
            name: response.user.name || name,
            email: response.user.email,
            phone: response.user.phone,
            rib: response.user.rib
          };
          setUser(formattedUser);
        }
        
        setDemoMode(false);
        return { success: true };
      } else {
        // Gérer les erreurs de validation Django
        const errors = response;
        const errorMessage = 
          errors.email?.[0] || 
          errors.password?.[0] || 
          errors.non_field_errors?.[0] || 
          'Erreur lors de l\'inscription';
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erreur de connexion au serveur' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setDemoMode(false);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    token,
    loading,
    demoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};