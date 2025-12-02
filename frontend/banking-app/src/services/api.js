// Configuration de base pour communiquer avec Django
const API_BASE_URL = 'http://localhost:8000/api'; // Port par défaut de Django

// Fonction utilitaire pour gérer les tokens
const getAuthHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const apiService = {
  // GET request
  async get(url, token = null) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  },

  // POST request
  async post(url, data, token = null) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  },

  // PUT request
  async put(url, data, token) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  },

  // DELETE request
  async delete(url, token) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      
      return await response.json();
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  },
};

// Fonctions spécifiques pour l'API Django
export const authAPI = {
  // Connexion
  async login(email, password) {
    return await apiService.post('/auth/login/', { email, password });
  },

  // Inscription
  async register(userData) {
    return await apiService.post('/auth/register/', userData);
  },

  // Vérification du token
  async verifyToken(token) {
    return await apiService.get('/auth/user/', token);
  },
};

export const accountAPI = {
  // Récupérer le solde
  async getBalance(token) {
    return await apiService.get('/account/balance/', token);
  },

  // Récupérer les transactions
  async getTransactions(token) {
    return await apiService.get('/account/transactions/', token);
  },

  // Effectuer un virement
  async makeTransfer(transferData, token) {
    return await apiService.post('/transfer/', transferData, token);
  },

  // Récupérer les détails du compte
  async getAccountDetails(token) {
    return await apiService.get('/account/details/', token);
  },
};