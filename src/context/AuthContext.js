'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { api } from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'fan' or 'player'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('authToken', idToken);
          
          // Get user data from backend
          const response = await api.auth.getMe();
          setUser(response.data.user);
          setUserType(response.data.userType);
          
          // Connect socket
          connectSocket(idToken);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserType(null);
        localStorage.removeItem('authToken');
        disconnectSocket();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Send to backend
      const response = await api.auth.googleLogin(idToken);
      setUser(response.data.user);
      setUserType('fan');
      
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginAsPlayer = async (playerId, password) => {
    try {
      const response = await api.auth.playerLogin(playerId, password);
      const { token, player } = response.data;
      
      localStorage.setItem('authToken', token);
      setUser(player);
      setUserType('player');
      
      // Connect socket
      connectSocket(token);
      
      return response.data;
    } catch (error) {
      console.error('Player login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await api.auth.logout();
      setUser(null);
      setUserType(null);
      localStorage.removeItem('authToken');
      disconnectSocket();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    userType,
    loading,
    loginWithGoogle,
    loginAsPlayer,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
