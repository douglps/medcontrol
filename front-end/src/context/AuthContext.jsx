import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('medcontrol_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('medcontrol_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
          localStorage.setItem('medcontrol_user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Sessão expirada ou token inválido:', error);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token: newToken, usuario } = response.data;

    localStorage.setItem('medcontrol_token', newToken);
    localStorage.setItem('medcontrol_user', JSON.stringify(usuario));

    setToken(newToken);
    setUser(usuario);
    return usuario;
  };

  const register = async (nome, email, senha, cargo) => {
    const response = await api.post('/auth/register', { nome, email, senha, cargo });
    const { token: newToken, usuario } = response.data;

    localStorage.setItem('medcontrol_token', newToken);
    localStorage.setItem('medcontrol_user', JSON.stringify(usuario));

    setToken(newToken);
    setUser(usuario);
    return usuario;
  };

  const logout = () => {
    localStorage.removeItem('medcontrol_token');
    localStorage.removeItem('medcontrol_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
