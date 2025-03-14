// screens/SecuritySettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,ActivityIndicator,
  StyleSheet,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';

const SecuritySettingsScreen = ({ navigation }) => {
  const { styles, colors } = useTheme();
  const { 
    authMethods, 
    setupBiometric, 
    setupPin, 
    setupTwoFactor,
    user 
  } = useAuth();

  const [biometricEnabled, setBiometricEnabled] = useState(authMethods.biometric);
  const [pinEnabled, setPinEnabled] = useState(authMethods.pin);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(authMethods.twoFactor);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [loading, setLoading] = useState({
    biometric: false,
    pin: false,
    twoFactor: false
  });

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      
      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricAvailable(enrolled);
        
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('face');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType('iris');
        }
      } else {
        setBiometricAvailable(false);
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setBiometricAvailable(false);
    }
  };

  const getBiometricName = () => {
    switch (biometricType) {
      case 'face':
        return 'Face ID';
      case 'iris':
        return 'Iris Authentication';
      case 'fingerprint':
      default:
        return 'Fingerprint Authentication';
    }
  };
  const handleToggleBiometric = async (value) => {
    if (!biometricAvailable && value) {
      Alert.alert(
        'Biometric Not Available',
        'Please set up biometrics on your device first.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(prev => ({ ...prev, biometric: true }));
    
    try {
      if (value) {
        // Enable biometric
        const result = await setupBiometric();
        
        if (result.success) {
          setBiometricEnabled(true);
        } else {
          Alert.alert('Error', result.error || 'Failed to enable biometric authentication');
        }
      } else {
        // Disable biometric (in a real app, you'd verify identity before disabling)
        Alert.alert(
          'Disable Biometric Authentication',
          'Are you sure you want to disable biometric authentication?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Disable', 
              style: 'destructive',
              onPress: () => {
                // In a real app, this would call an API to disable biometric
                setBiometricEnabled(false);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error toggling biometric:', error);
      Alert.alert('Error', 'Failed to update biometric settings');
    } finally {
      setLoading(prev => ({ ...prev, biometric: false }));
    }
  };

  const handleTogglePin = async (value) => {
    if (value) {
      // Navigate to PIN setup
      navigation.navigate('PinSetup');
    } else {
      // Disable PIN (in a real app, you'd verify identity before disabling)
      Alert.alert(
        'Disable PIN Authentication',
        'Are you sure you want to disable PIN authentication?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive',
            onPress: () => {
              // In a real app, this would call an API to disable PIN
              setPinEnabled(false);
            }
          }
        ]
      );
    }
  };

  const handleToggleTwoFactor = async (value) => {
    if (value) {
      // Navigate to 2FA setup
      navigation.navigate('TwoFactorAuth');
    } else {
      // Disable 2FA (in a real app, you'd verify identity before disabling)
      Alert.alert(
        'Disable Two-Factor Authentication',
        'Are you sure you want to disable two-factor authentication? This will reduce the security of your account.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive',
            onPress: () => {
              // In a real app, this would call an API to disable 2FA
              setTwoFactorEnabled(false);
            }
          }
        ]
      );
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
        <Text style={localStyles.headerTitle}>Security Settings</Text>
      </View>
      
      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        <View style={localStyles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
          <View style={localStyles.infoCardContent}>
            <Text style={localStyles.infoCardTitle}>Account Security</Text>
            <Text style={localStyles.infoCardText}>
              Enable multiple authentication methods to enhance the security of your account.
            </Text>
          </View>
        </View>
        
        <Text style={localStyles.sectionTitle}>Authentication Methods</Text>
        
        <View style={localStyles.settingsContainer}>
          {/* Biometric Authentication */}
          <View style={localStyles.settingItem}>
            <View style={localStyles.settingLeftContent}>
              <View style={[localStyles.iconContainer, { backgroundColor: '#6200EE' }]}>
                <Ionicons 
                  name={
                    biometricType === 'face' 
                      ? 'scan-outline' 
                      : biometricType === 'iris' 
                        ? 'eye-outline' 
                        : 'finger-print-outline'
                  } 
                  size={22} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={localStyles.settingTextContainer}>
                <Text style={localStyles.settingTitle}>{getBiometricName()}</Text>
                <Text style={localStyles.settingDescription}>
                  {biometricEnabled 
                    ? `${getBiometricName()} is enabled for quick login` 
                    : biometricAvailable 
                      ? `Use ${getBiometricName().toLowerCase()} for quicker access` 
                      : `${getBiometricName()} is not available on this device`
                  }
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D1', true: '#B893F5' }}
              thumbColor={biometricEnabled ? '#6200EE' : '#F5F5F5'}
              ios_backgroundColor="#D1D1D1"
              onValueChange={handleToggleBiometric}
              value={biometricEnabled}
              disabled={!biometricAvailable || loading.biometric}
            />
          </View>
          
          {/* PIN Authentication */}
          <View style={localStyles.settingItem}>
            <View style={localStyles.settingLeftContent}>
              <View style={[localStyles.iconContainer, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="keypad-outline" size={22} color="#FFFFFF" />
              </View>
              <View style={localStyles.settingTextContainer}>
                <Text style={localStyles.settingTitle}>PIN Authentication</Text>
                <Text style={localStyles.settingDescription}>
                  {pinEnabled 
                    ? 'Use your PIN to secure and access your account' 
                    : 'Set up a PIN for an additional layer of security'
                  }
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D1', true: '#A8E0AA' }}
              thumbColor={pinEnabled ? '#4CAF50' : '#F5F5F5'}
              ios_backgroundColor="#D1D1D1"
              onValueChange={handleTogglePin}
              value={pinEnabled}
            />
          </View>
          
          {/* Two-Factor Authentication */}
          <View style={localStyles.settingItem}>
            <View style={localStyles.settingLeftContent}>
              <View style={[localStyles.iconContainer, { backgroundColor: '#FF9800' }]}>
                <Ionicons name="key-outline" size={22} color="#FFFFFF" />
              </View>
              <View style={localStyles.settingTextContainer}>
                <Text style={localStyles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={localStyles.settingDescription}>
                  {twoFactorEnabled 
                    ? 'Your account is protected with 2FA' 
                    : 'Add an extra layer of security with authenticator app'
                  }
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D1', true: '#FFCC80' }}
              thumbColor={twoFactorEnabled ? '#FF9800' : '#F5F5F5'}
              ios_backgroundColor="#D1D1D1"
              onValueChange={handleToggleTwoFactor}
              value={twoFactorEnabled}
            />
          </View>
        </View>
        <Text style={localStyles.sectionTitle}>Security Recommendations</Text>
        
        <View style={localStyles.recommendationsContainer}>
          <View style={localStyles.recommendationItem}>
            <Ionicons name="finger-print" size={24} color={colors.primary} style={localStyles.recommendationIcon} />
            <View style={localStyles.recommendationContent}>
              <Text style={localStyles.recommendationTitle}>Use Multiple Auth Methods</Text>
              <Text style={localStyles.recommendationText}>
                Enable at least two different authentication methods for the best security.
              </Text>
            </View>
          </View>
          
          <View style={localStyles.recommendationItem}>
            <Ionicons name="key" size={24} color={colors.primary} style={localStyles.recommendationIcon} />
            <View style={localStyles.recommendationContent}>
              <Text style={localStyles.recommendationTitle}>Strong PIN</Text>
              <Text style={localStyles.recommendationText}>
                Use a unique PIN that's different from other services you use.
              </Text>
            </View>
          </View>
          
          <View style={localStyles.recommendationItem}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} style={localStyles.recommendationIcon} />
            <View style={localStyles.recommendationContent}>
              <Text style={localStyles.recommendationTitle}>Keep Authenticator App Safe</Text>
              <Text style={localStyles.recommendationText}>
                If using 2FA, ensure the device with your authenticator app is secure.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={localStyles.educationSection}>
          <Text style={localStyles.educationTitle}>What is Multi-Factor Authentication?</Text>
          <Text style={localStyles.educationText}>
            Multi-factor authentication (MFA) adds additional security by requiring you to verify your identity in multiple ways before accessing your account. This demo shows how combining something you know (password, PIN), something you have (mobile device with authenticator app), and something you are (biometrics) creates a robust security system.
          </Text>
          <TouchableOpacity style={localStyles.learnMoreButton}>
            <Text style={localStyles.learnMoreText}>Learn more about authentication security</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoCardContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 14,
    color: '#757575',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#757575',
  },
  recommendationsContainer: {
    marginBottom: 24,
  },
  recommendationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  recommendationIcon: {
    marginRight: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: '#757575',
  },
  educationSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  educationText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
    lineHeight: 20,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '500',
    marginRight: 8,
  },
});

export default SecuritySettingsScreen;