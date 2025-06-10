import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setUserProfile(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Sign up with email and password
  async function signup(email, password, name) {
    try {
      const response = await authApi.register({ email, password, name });
      const { token, ...userData } = response;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setCurrentUser(userData);
      setUserProfile(userData);
      
      toast.success('Account created successfully!');
      return userData;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  // Sign in with email and password
  async function login(email, password) {
    try {
      const response = await authApi.login({ email, password });
      const { token, ...userData } = response;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setCurrentUser(userData);
      setUserProfile(userData);
      
      toast.success('Logged in successfully!');
      return userData;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  // Sign out
  async function logout() {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setCurrentUser(null);
      setUserProfile(null);
      
      toast.success('Successfully logged out!');
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  // Reset password
  async function resetPassword(email) {
    try {
      await authApi.forgotPassword(email);
      toast.success('Password reset email sent!');
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  // Update user profile
  async function updateUserProfile(profile) {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const response = await authApi.updateProfile(profile);
      const { token, ...userData } = response;
      
      // Update stored data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setCurrentUser(userData);
      setUserProfile(userData);
      
      toast.success('Profile updated successfully!');
      return userData;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  // Handle auth errors
  function handleAuthError(error) {
    console.error('Auth error:', error);
    
    let errorMessage = 'An error occurred during authentication';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server';
    }
    
    toast.error(errorMessage);
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 