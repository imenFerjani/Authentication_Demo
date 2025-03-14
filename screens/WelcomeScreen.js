// screens/WelcomeScreen.js
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const WelcomeScreen = ({ navigation }) => {
  const { styles, colors } = useTheme();
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={localStyles.successContainer}>
  <ActivityIndicator size="large" color="#6200EE" />
  <Ionicons name="mail-outline" size={60} color="#6200EE" style={{ marginTop: 20 }} />
  <Ionicons name="checkmark-circle" size={30} color="#4CAF50" style={{ position: 'absolute', top: 50, right: 140 }} />
</View>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#6A11CB', '#2575FC']}
      style={localStyles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={localStyles.safeArea}>
        <View style={localStyles.contentContainer}>
          <View style={localStyles.logoContainer}>
            <View style={localStyles.logoContainer}>
  <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
</View>
            <Text style={localStyles.appName}>Authentication Demo</Text>
            <Text style={localStyles.tagline}>
              Explore multiple authentication methods
            </Text>
          </View>

          <View style={localStyles.featureContainer}>
            <View style={localStyles.featureItem}>
              <View style={localStyles.featureIconContainer}>
  <Ionicons name="mail" size={24} color="#2196F3" />
</View>
              <Text style={localStyles.featureText}>Email & Password</Text>
            </View>
            
            <View style={localStyles.featureItem}>
              <View style={localStyles.featureIconContainer}>
  <Ionicons name="keypad" size={24} color="#4CAF50" />
</View>
              <Text style={localStyles.featureText}>PIN Authentication</Text>
            </View>
            
            <View style={localStyles.featureItem}>
              <View style={localStyles.featureIconContainer}>
  <Ionicons name="finger-print" size={24} color="#6200EE" />
</View>
              <Text style={localStyles.featureText}>Biometric Login</Text>
            </View>
            
            <View style={localStyles.featureItem}>
              <View style={localStyles.featureIconContainer}>
  <Ionicons name="key" size={24} color="#FF9800" />
</View>
              <Text style={localStyles.featureText}>Two-Factor Auth</Text>
            </View>
          </View>

          <View style={localStyles.buttonContainer}>
            <TouchableOpacity
              style={localStyles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={localStyles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={localStyles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={localStyles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('About')}
              style={localStyles.learnMoreButton}
            >
              <Text style={localStyles.learnMoreText}>
                Learn more about authentication methods
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  featureContainer: {
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 10,
  },
  featureIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#6A11CB',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  learnMoreButton: {
    alignItems: 'center',
  },
  learnMoreText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;