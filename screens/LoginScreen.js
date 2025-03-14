// screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,ActivityIndicator,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import AnimatedCheck from '../components/AnimatedCheck';

const LoginScreen = ({ navigation }) => {
  const { styles, colors } = useTheme();
  const { login, authMethods, authenticateBiometric, verifyPin, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'pin', or 'biometric'
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const checkBiometricAvailability = async () => {
    if (authMethods.biometric) {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (compatible && enrolled) {
        // This is a demo app, so we'll prompt for biometric auth right away
        // In a real app, you might want to ask the user first
        handleBiometricLogin();
      }
    }
  };
  // Check if biometric login is available
  checkBiometricAvailability();
}, []); // Add checkBiometricAvailability as a dependency

  

  const handleEmailLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        setLoginSuccess(true);
        // Successful login animation
        setTimeout(() => {
          // Navigation happens from auth context
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePinLogin = async () => {
    setError('');
    
    if (!pin || pin.length < 4) {
      setError('Please enter a valid PIN');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await verifyPin(pin);
      
      if (result.success) {
        setLoginSuccess(true);
        // Successful login animation
        setTimeout(() => {
          // Navigation happens from auth context
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      const result = await authenticateBiometric();
      
      if (result.success) {
        setLoginSuccess(true);
        // Successful login animation
        setTimeout(() => {
          // Navigation happens from auth context
        }, 1500);
      } else {
        setError(result.error || 'Biometric authentication failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderLoginMethod = () => {
    switch (loginMethod) {
      case 'email':
        return (
          <>
            <View style={localStyles.inputContainer}>
              <Ionicons name="mail-outline" size={22} color={colors.textSecondary} style={localStyles.inputIcon} />
              <TextInput
                style={[styles.input, localStyles.input]}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            
            <View style={localStyles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color={colors.textSecondary} style={localStyles.inputIcon} />
              <TextInput
                style={[styles.input, localStyles.input]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={localStyles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleEmailLogin} disabled={loading}>
              {loading ? (
                <Text style={styles.buttonText}>Logging in...</Text>
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </>
        );
        
      case 'pin':
        return (
          <>
            <Text style={localStyles.pinInstructions}>Enter your 4-digit PIN</Text>
            
            <View style={localStyles.pinContainer}>
              <TextInput
                style={localStyles.pinInput}
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                autoFocus
              />
              
              <View style={localStyles.pinDots}>
                {[...Array(4)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      localStyles.pinDot,
                      i < pin.length && localStyles.pinDotFilled,
                    ]}
                  />
                ))}
              </View>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handlePinLogin} disabled={loading || pin.length < 4}>
              {loading ? (
                <Text style={styles.buttonText}>Verifying...</Text>
              ) : (
                <Text style={styles.buttonText}>Verify PIN</Text>
              )}
            </TouchableOpacity>
          </>
        );
        
      case 'biometric':
        return (
          <View style={localStyles.biometricContainer}>
            <Ionicons name="finger-print" size={80} color={colors.primary} />
            <Text style={localStyles.biometricText}>Touch the fingerprint sensor</Text>
            
            <TouchableOpacity style={styles.button} onPress={handleBiometricLogin} disabled={loading}>
              {loading ? (
                <Text style={styles.buttonText}>Authenticating...</Text>
              ) : (
                <Text style={styles.buttonText}>Authenticate</Text>
              )}
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  const handleToggleLoginMethod = (method) => {
    setError('');
    setLoginMethod(method);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={localStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {loginSuccess ? (
            <View style={localStyles.successContainer}>
              <AnimatedCheck />
              <Text style={localStyles.successText}>Login Successful!</Text>
            </View>
          ) : (
            <>
              <View style={localStyles.header}>
                <TouchableOpacity
                  style={localStyles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={localStyles.logoContainer}>
  <Ionicons name="shield-checkmark" size={32} color="#6200EE" />
</View>
              </View>
              
              <Text style={localStyles.title}>Welcome Back</Text>
              <Text style={localStyles.subtitle}>
                Please log in to your account
              </Text>
              
              {error ? (
                <View style={localStyles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color={colors.error} />
                  <Text style={localStyles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              <View style={localStyles.methodToggle}>
                <TouchableOpacity
                  style={[
                    localStyles.methodButton,
                    loginMethod === 'email' && localStyles.methodButtonActive,
                  ]}
                  onPress={() => handleToggleLoginMethod('email')}
                >
                  <Ionicons
                    name="mail"
                    size={22}
                    color={loginMethod === 'email' ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      localStyles.methodButtonText,
                      loginMethod === 'email' && localStyles.methodButtonTextActive,
                    ]}
                  >
                    Email
                  </Text>
                </TouchableOpacity>
                
                {authMethods.pin && (
                  <TouchableOpacity
                    style={[
                      localStyles.methodButton,
                      loginMethod === 'pin' && localStyles.methodButtonActive,
                    ]}
                    onPress={() => handleToggleLoginMethod('pin')}
                  >
                    <Ionicons
                      name="keypad"
                      size={22}
                      color={loginMethod === 'pin' ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        localStyles.methodButtonText,
                        loginMethod === 'pin' && localStyles.methodButtonTextActive,
                      ]}
                    >
                      PIN
                    </Text>
                  </TouchableOpacity>
                )}
                
                {authMethods.biometric && (
                  <TouchableOpacity
                    style={[
                      localStyles.methodButton,
                      loginMethod === 'biometric' && localStyles.methodButtonActive,
                    ]}
                    onPress={() => handleToggleLoginMethod('biometric')}
                  >
                    <Ionicons
                      name="finger-print"
                      size={22}
                      color={
                        loginMethod === 'biometric' ? colors.primary : colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        localStyles.methodButtonText,
                        loginMethod === 'biometric' && localStyles.methodButtonTextActive,
                      ]}
                    >
                      Biometric
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {renderLoginMethod()}
              
              {loginMethod === 'email' && (
                <TouchableOpacity
                  style={localStyles.forgotPassword}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={localStyles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}
              
              <View style={localStyles.footer}>
                <Text style={localStyles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={localStyles.footerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  eyeIcon: {
    padding: 12,
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
  methodToggle: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    padding: 4,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
  },
  methodButtonActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  methodButtonText: {
    marginLeft: 8,
    color: '#888',
    fontWeight: '500',
  },
  methodButtonTextActive: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6200EE',
    fontSize: 14,
    fontWeight: '500',
  },
  pinInstructions: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pinInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 30,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  pinDotFilled: {
    backgroundColor: '#6200EE',
  },
  biometricContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  biometricText: {
    marginTop: 16,
    marginBottom: 30,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#888',
  },
  footerLink: {
    color: '#6200EE',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default LoginScreen;