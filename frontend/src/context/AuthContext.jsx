import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { axiosClient } from '../api/axios.client';
import { CONSTANTS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'user' | 'advocate' | 'admin'
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem(CONSTANTS.TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosClient.get('/auth/me');
      setUser(response.data.user);
      setUserType(response.data.type);
      localStorage.setItem(CONSTANTS.USER_TYPE_KEY, response.data.type);
    } catch (error) {
      console.error("Auth init failed", error);
      localStorage.removeItem(CONSTANTS.TOKEN_KEY);
      localStorage.removeItem(CONSTANTS.USER_TYPE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    localStorage.setItem(CONSTANTS.TOKEN_KEY, response.token);
    localStorage.setItem(CONSTANTS.USER_TYPE_KEY, response.data.type);
    setUser(response.data.user);
    setUserType(response.data.type);
    return response.data;
  };
  
  const registerUser = async (data) => {
    const response = await axiosClient.post('/auth/register/user', data);
    localStorage.setItem(CONSTANTS.TOKEN_KEY, response.token);
    localStorage.setItem(CONSTANTS.USER_TYPE_KEY, 'user');
    setUser(response.data.user);
    setUserType('user');
    return response.data;
  };

  const registerAdvocate = async (data) => {
    const response = await axiosClient.post('/auth/register/advocate', data);
    localStorage.setItem(CONSTANTS.TOKEN_KEY, response.token);
    localStorage.setItem(CONSTANTS.USER_TYPE_KEY, 'advocate');
    setUser(response.data.user);
    setUserType('advocate');
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem(CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(CONSTANTS.USER_TYPE_KEY);
    setUser(null);
    setUserType(null);
  };

  const value = {
    user,
    userType,
    isLoading,
    login,
    registerUser,
    registerAdvocate,
    logout,
    isAuthenticated: !!user
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading Application...</h2>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
