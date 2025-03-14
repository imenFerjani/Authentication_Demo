// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Auth Screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import BiometricSetupScreen from './screens/BiometricSetupScreen';
import PinSetupScreen from './screens/PinSetupScreen';
import TwoFactorAuthScreen from './screens/TwoFactorAuthScreen';

// App Screens
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SecuritySettingsScreen from './screens/SecuritySettingsScreen';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Theme
import { ThemeProvider } from './context/ThemeContext';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
    <Stack.Screen name="PinSetup" component={PinSetupScreen} />
    <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuthScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    // You could show a splash screen here
    return null;
  }
  
  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}