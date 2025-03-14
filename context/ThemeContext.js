// context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme(deviceTheme || 'light');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };
  loadTheme();
}, []); // Add loadTheme as a dependency

  

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    try {
      await AsyncStorage.setItem('userTheme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setThemeMode = async (mode) => {
    try {
      await AsyncStorage.setItem('userTheme', mode);
      setTheme(mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Theme colors
  const colors = {
    light: {
      primary: '#6200EE',
      primaryDark: '#3700B3',
      secondary: '#03DAC6',
      secondaryDark: '#018786',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      error: '#B00020',
      text: '#000000',
      textSecondary: '#757575',
      border: '#E0E0E0',
      disabled: '#BDBDBD',
      icon: '#616161',
      statusBar: 'dark-content',
    },
    dark: {
      primary: '#BB86FC',
      primaryDark: '#3700B3',
      secondary: '#03DAC6',
      secondaryDark: '#018786',
      background: '#121212',
      surface: '#1E1E1E',
      error: '#CF6679',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      border: '#2C2C2C',
      disabled: '#757575',
      icon: '#B0B0B0',
      statusBar: 'light-content',
    },
  };

  // Common styles
  const styles = {
    shadow: {
      shadowColor: theme === 'dark' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === 'dark' ? 0.8 : 0.1,
      shadowRadius: 3,
      elevation: 4,
    },
    container: {
      flex: 1,
      backgroundColor: colors[theme].background,
    },
    authContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: colors[theme].background,
    },
    card: {
      backgroundColor: colors[theme].surface,
      borderRadius: 10,
      padding: 16,
      marginVertical: 8,
      ...{
        shadowColor: theme === 'dark' ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme === 'dark' ? 0.8 : 0.1,
        shadowRadius: 3,
        elevation: 4,
      },
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors[theme].text,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors[theme].text,
      marginBottom: 8,
    },
    text: {
      fontSize: 16,
      color: colors[theme].text,
    },
    textSecondary: {
      fontSize: 14,
      color: colors[theme].textSecondary,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: colors[theme].border,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginVertical: 8,
      color: colors[theme].text,
      backgroundColor: theme === 'dark' ? '#2C2C2C' : '#F5F5F5',
    },
    button: {
      backgroundColor: colors[theme].primary,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginVertical: 8,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors[theme].primary,
    },
    buttonTextSecondary: {
      color: colors[theme].primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    errorText: {
      color: colors[theme].error,
      fontSize: 14,
      marginTop: 4,
    },
  };

  const value = {
    theme,
    colors: colors[theme],
    styles,
    toggleTheme,
    setThemeMode,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};