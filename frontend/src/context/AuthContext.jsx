import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken } from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res?.user) {
            setUser(res.user);
          }
        } catch (err) {
          console.warn('Could not restore auth session:', err);
        }
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    return { success: false, error: 'Demo account is disabled' };
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.register({ name, email, password });
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.updateProfile(profileData);
      if (res?.user) {
        setUser(res.user);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        demoLogin,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
