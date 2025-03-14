// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';
import { generateSecureRandom } from 'expo-crypto';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMethods, setAuthMethods] = useState({
    pin: false,
    biometric: false,
    twoFactor: false,
  });

  useEffect(() => {
    // Check for saved authentication state
    loadUser();
    checkAvailableAuthMethods();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const authMethodsData = await AsyncStorage.getItem('authMethods');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      if (authMethodsData) {
        setAuthMethods(JSON.parse(authMethodsData));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailableAuthMethods = async () => {
    // Check if biometric authentication is available
    const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const hasBiometrics = biometricTypes.length > 0;
    
    setAuthMethods(prev => ({
      ...prev,
      biometric: hasBiometrics,
    }));
  };

  // Mock user database
  const users = {
    'student@example.com': {
      id: '1',
      email: 'student@example.com',
      password: 'password123', // In a real app, this would be hashed
      name: 'Student User',
      role: 'student',
    },
    'teacher@example.com': {
      id: '2',
      email: 'teacher@example.com',
      password: 'teacher123', // In a real app, this would be hashed
      name: 'Teacher User',
      role: 'teacher',
    },
  };

  // Register new user
  const register = async (email, password, name) => {
    try {
      // Email validation
      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Password validation (at least 8 characters, 1 uppercase, 1 number)
      if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
        throw new Error('Password must be at least 8 characters with 1 uppercase letter and 1 number');
      }
      
      // Check if user already exists
      if (users[email]) {
        throw new Error('User with this email already exists');
      }
      
      // In a real app, you would hash the password here
      // In a real app, you would make an API call to create the user
      
      const newUser = {
        id: generateSecureRandom(8).toString(),
        email,
        password, // In a real app, this would be hashed
        name,
        role: 'student', // Default role
      };
      
      // Add to mock database
      users[email] = newUser;
      
      // Save user to AsyncStorage (remove sensitive info)
      const userToSave = { ...newUser };
      delete userToSave.password;
      
      await AsyncStorage.setItem('user', JSON.stringify(userToSave));
      setUser(userToSave);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      // For demo purposes, we're using the mock database
      const user = users[email];
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Remove sensitive information
      const userToSave = { ...user };
      delete userToSave.password;
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userToSave));
      setUser(userToSave);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Setup PIN authentication
  const setupPin = async (pin) => {
    try {
      if (pin.length < 4) {
        throw new Error('PIN must be at least 4 digits');
      }
      
      // In a real app, you would hash the PIN
      await AsyncStorage.setItem('userPin', pin);
      
      // Update auth methods
      const updatedMethods = { ...authMethods, pin: true };
      await AsyncStorage.setItem('authMethods', JSON.stringify(updatedMethods));
      setAuthMethods(updatedMethods);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Verify PIN
  const verifyPin = async (pin) => {
    try {
      const savedPin = await AsyncStorage.getItem('userPin');
      
      if (pin !== savedPin) {
        throw new Error('Incorrect PIN');
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Setup biometric authentication
  const setupBiometric = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      
      if (!compatible) {
        throw new Error('This device does not support biometric authentication');
      }
      
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!enrolled) {
        throw new Error('No biometrics enrolled on this device');
      }
      
      // Update auth methods
      const updatedMethods = { ...authMethods, biometric: true };
      await AsyncStorage.setItem('authMethods', JSON.stringify(updatedMethods));
      setAuthMethods(updatedMethods);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Authenticate with biometrics
  const authenticateBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use PIN instead',
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Authentication failed');
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Setup two-factor authentication
  const setupTwoFactor = async () => {
    try {
      // In a real app, you would generate a secret key and QR code
      // For this demo, we'll just enable it without the actual implementation
      
      // Update auth methods
      const updatedMethods = { ...authMethods, twoFactor: true };
      await AsyncStorage.setItem('authMethods', JSON.stringify(updatedMethods));
      setAuthMethods(updatedMethods);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Verify two-factor code
  const verifyTwoFactor = async (code) => {
    try {
      // In a real app, you would verify the code against the generated secret
      // For this demo, we'll just accept '123456' as valid
      if (code !== '123456') {
        throw new Error('Invalid authentication code');
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const user = users[email];
      
      if (!user) {
        throw new Error('No account found with this email');
      }
      
      // In a real app, you would send a password reset email
      // For this demo, we'll just return success
      
      return { success: true, message: 'Password reset instructions sent to your email' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const updatedUser = { ...user, ...updatedData };
      
      // Update in mock database
      users[user.email] = { ...users[user.email], ...updatedData };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    authMethods,
    register,
    login,
    logout,
    setupPin,
    verifyPin,
    setupBiometric,
    authenticateBiometric,
    setupTwoFactor,
    verifyTwoFactor,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};