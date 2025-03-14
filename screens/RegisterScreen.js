// screens/RegisterScreen.js
import React, { useState } from 'react';
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
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import AnimatedCheck from '../components/AnimatedCheck';

const RegisterScreen = ({ navigation }) => {
  const { styles, colors } = useTheme();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // For form validation
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);

  const validateStep1 = () => {
    let isValid = true;
    
    // Name validation
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleRegister = async () => {
    if (!validateStep2()) {
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const result = await register(email, password, name);
      
      if (result.success) {
        setRegisterSuccess(true);
        
        // Navigate to biometric setup after successful registration
        setTimeout(() => {
          navigation.navigate('BiometricSetup');
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
          {registerSuccess ? (
            <View style={localStyles.successContainer}>
              <AnimatedCheck />
              <Text style={localStyles.successText}>Registration Successful!</Text>
              <Text style={localStyles.successSubtext}>Setting up your account...</Text>
            </View>
          ) : (
            <>
              <View style={localStyles.header}>
                <TouchableOpacity
                  style={localStyles.backButton}
                  onPress={() => {
                    if (currentStep === 1) {
                      navigation.goBack();
                    } else {
                      handlePreviousStep();
                    }
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={localStyles.logoContainer}>
  <Ionicons name="shield-checkmark" size={32} color="#6200EE" />
</View>
              </View>
              
              <Text style={localStyles.title}>Create Account</Text>
              <Text style={localStyles.subtitle}>
                Step {currentStep} of 2 - {currentStep === 1 ? 'Personal Information' : 'Set Password'}
              </Text>
              
              {error ? (
                <View style={localStyles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color={colors.error} />
                  <Text style={localStyles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              <View style={localStyles.stepIndicator}>
                <View
                  style={[
                    localStyles.stepDot,
                    currentStep >= 1 && localStyles.stepDotActive,
                  ]}
                />
                <View style={localStyles.stepLine} />
                <View
                  style={[
                    localStyles.stepDot,
                    currentStep >= 2 && localStyles.stepDotActive,
                  ]}
                />
              </View>
              
              {currentStep === 1 ? (
                // Step 1: Personal Information
                <>
                  <View style={localStyles.inputContainer}>
                    <Ionicons name="person-outline" size={22} color={colors.textSecondary} style={localStyles.inputIcon} />
                    <TextInput
                      style={[styles.input, localStyles.input]}
                      placeholder="Full Name"
                      placeholderTextColor={colors.textSecondary}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                  {nameError ? (
                    <Text style={localStyles.inputError}>{nameError}</Text>
                  ) : null}
                  
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
                  {emailError ? (
                    <Text style={localStyles.inputError}>{emailError}</Text>
                  ) : null}
                  
                  <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                </>
              ) : (
                // Step 2: Set Password
                <>
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
                  
                  <PasswordStrengthIndicator strength={passwordStrength} />
                  
                  {passwordError ? (
                    <Text style={localStyles.inputError}>{passwordError}</Text>
                  ) : null}
                  
                  <View style={localStyles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={22} color={colors.textSecondary} style={localStyles.inputIcon} />
                    <TextInput
                      style={[styles.input, localStyles.input]}
                      placeholder="Confirm Password"
                      placeholderTextColor={colors.textSecondary}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={localStyles.eyeIcon}>
                      <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  {confirmPasswordError ? (
                    <Text style={localStyles.inputError}>{confirmPasswordError}</Text>
                  ) : null}
                  
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    {loading ? (
                      <Text style={styles.buttonText}>Registering...</Text>
                    ) : (
                      <Text style={styles.buttonText}>Create Account</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
              
              <View style={localStyles.footer}>
                <Text style={localStyles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={localStyles.footerLink}>Sign In</Text>
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
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  stepDotActive: {
    backgroundColor: '#6200EE',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
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
  inputError: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 12,
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
  successSubtext: {
    color: '#888',
    marginTop: 8,
  },
});

export default RegisterScreen;