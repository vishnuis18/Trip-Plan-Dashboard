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
    setLoading(true);
    try {
      const demoEmail = 'alex.morgan@tripplan.com';
      const demoPassword = 'password123';
      let res;
      try {
        res = await api.login({ email: demoEmail, password: demoPassword });
      } catch (loginErr) {
        // If not registered yet, auto-create the demo user
        res = await api.register({
          name: 'Alex Morgan',
          email: demoEmail,
          password: demoPassword
        });
      }
      if (res?.token) {
        setAuthToken(res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, error: 'Could not log in to demo account' };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
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
