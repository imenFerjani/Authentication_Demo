// screens/BiometricSetupScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,ActivityIndicator,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';

const BiometricSetupScreen = ({ navigation }) => {
  const { styles, colors } = useTheme();
  const { setupBiometric, user } = useAuth();
  
  const [biometricType, setBiometricType] = useState('');
  const [isCompatible, setIsCompatible] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
   checkBiometricSupport();
  }, []);
  
  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsCompatible(compatible);
      
      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);
        
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('face');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType('iris');
        }
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setError('Failed to check biometric support.');
    }
  };
  
  const handleBiometricSetup = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!isCompatible) {
        setError('Your device does not support biometric authentication.');
        return;
      }
      
      if (!isEnrolled) {
        setError('No biometrics enrolled on this device. Please set up biometrics in your device settings first.');
        return;
      }
      
      // Authenticate to confirm user's biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
        fallbackLabel: 'Use device passcode',
        disableDeviceFallback: false,
      });
      
      if (result.success) {
        // Enable biometric authentication in our app
        const setupResult = await setupBiometric();
        
        if (setupResult.success) {
          setSuccess(true);
          
          // Navigate to PIN setup after a short delay
          setTimeout(() => {
            navigation.navigate('PinSetup');
          }, 1500);
        } else {
          setError(setupResult.error);
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Error setting up biometrics:', error);
      setError('Failed to set up biometric authentication.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkip = () => {
    navigation.navigate('PinSetup');
  };
  
  const renderBiometricIcon = () => {
    switch (biometricType) {
      case 'face':
        return <Ionicons name="scan-outline" size={80} color={colors.primary} />;
      case 'iris':
        return <Ionicons name="eye-outline" size={80} color={colors.primary} />;
      case 'fingerprint':
      default:
        return <Ionicons name="finger-print-outline" size={80} color={colors.primary} />;
    }
  };
  
  const getBiometricTypeName = () => {
    switch (biometricType) {
      case 'face':
        return 'Face ID';
      case 'iris':
        return 'Iris Scan';
      case 'fingerprint':
      default:
        return 'Fingerprint';
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />
      
      <View style={localStyles.header}>
        <TouchableOpacity
          style={localStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={localStyles.logoContainer}>
  <Ionicons name="shield-checkmark" size={24} color="#6200EE" />
</View>
      </View>
      
      <View style={localStyles.content}>
        {success ? (
          <View style={localStyles.successContainer}>
            <View style={localStyles.successContainer}>
  <ActivityIndicator size="large" color="#6200EE" />
  <Ionicons name="mail-outline" size={60} color="#6200EE" style={{ marginTop: 20 }} />
  <Ionicons name="checkmark-circle" size={30} color="#4CAF50" style={{ position: 'absolute', top: 50, right: 140 }} />
</View>
            <Text style={localStyles.successText}>Biometric Setup Complete!</Text>
            <Text style={localStyles.successSubtext}>Moving to PIN setup...</Text>
          </View>
        ) : (
          <>
            <Text style={localStyles.title}>Biometric Authentication</Text>
            <Text style={localStyles.subtitle}>
              Set up biometric login for quicker access to your account
            </Text>
            
            {error ? (
              <View style={localStyles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={localStyles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <View style={localStyles.biometricContainer}>
              {isCompatible && isEnrolled ? (
                <>
                  {renderBiometricIcon()}
                  <Text style={localStyles.biometricType}>
                    {getBiometricTypeName()} Authentication
                  </Text>
                  <Text style={localStyles.biometricText}>
                    Use your {getBiometricTypeName().toLowerCase()} to quickly and securely access your account
                  </Text>
                  
                  <TouchableOpacity
                    style={[styles.button, localStyles.setupButton]}
                    onPress={handleBiometricSetup}
                    disabled={loading}
                  >
                    {loading ? (
                      <Text style={styles.buttonText}>Setting up...</Text>
                    ) : (
                      <Text style={styles.buttonText}>Enable {getBiometricTypeName()}</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Ionicons name="warning-outline" size={80} color={colors.error} />
                  <Text style={localStyles.notSupportedText}>
                    {!isCompatible
                      ? 'Biometric authentication is not supported on this device.'
                      : 'No biometrics enrolled on this device.'}
                  </Text>
                  <Text style={localStyles.biometricText}>
                    {!isCompatible
                      ? 'Your device does not have the hardware needed for biometric authentication.'
                      : 'Please set up biometrics in your device settings first.'}
                  </Text>
                </>
              )}
              
              <TouchableOpacity
                style={[styles.buttonSecondary, localStyles.skipButton]}
                onPress={handleSkip}
              >
                <Text style={styles.buttonTextSecondary}>Skip for now</Text>
              </TouchableOpacity>
            </View>
            
            <View style={localStyles.infoContainer}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={localStyles.infoText}>
                You can always enable or disable biometric authentication later in the security settings.
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
  biometricContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  biometricType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  biometricText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  notSupportedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginTop: 20,
    marginBottom: 10,
  },
  setupButton: {
    width: '100%',
    marginBottom: 16,
  },
  skipButton: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 8,
  },
  infoText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  successSubtext: {
    color: '#888',
    marginTop: 8,
  },
});

export default BiometricSetupScreen;