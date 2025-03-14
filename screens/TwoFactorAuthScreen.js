// screens/TwoFactorAuthScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,ActivityIndicator,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  Clipboard,
  ToastAndroid,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

const TwoFactorAuthScreen = ({ navigation }) => {
  const { styles, colors } = useTheme();
  const { setupTwoFactor, verifyTwoFactor } = useAuth();

  const [step, setStep] = useState(1); // 1: Intro, 2: QR Code, 3: Verify Code
  const [secretKey, setSecretKey] = useState('EXAMPLEKEY123456'); // In a real app, this would be generated
  const [verificationCode, setVerificationCode] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Refs for the code inputs
  const inputRefs = useRef([]);
  
  const handleSetupTwoFactor = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await setupTwoFactor();
      
      if (result.success) {
        setStep(2);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to set up two-factor authentication');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await verifyTwoFactor(verificationCode);
      
      if (result.success) {
        setSuccess(true);
        
        // Navigate to home screen after a short delay
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }, 2000);
      } else {
        setError(result.error);
        setVerificationCode('');
        setCode(['', '', '', '', '', '']);
      }
    } catch (error) {
      setError('Failed to verify code');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };
  
  const copySecretKey = () => {
    Clipboard.setString(secretKey);
    
    if (Platform.OS === 'android') {
      ToastAndroid.show('Secret key copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Secret key copied to clipboard');
    }
  };
  const renderIntroStep = () => (
    <>
      <View style={localStyles.introImageContainer}>
        <View style={localStyles.introImageContainer}>
  <Ionicons name="shield-checkmark" size={100} color="#6200EE" />
</View>
      </View>
      
      <Text style={localStyles.title}>Two-Factor Authentication</Text>
      <Text style={localStyles.subtitle}>
        Add an extra layer of security to your account
      </Text>
      
      <View style={localStyles.infoContainer}>
        <View style={localStyles.infoItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
          <View style={localStyles.infoTextContainer}>
            <Text style={localStyles.infoTitle}>Enhanced Security</Text>
            <Text style={localStyles.infoSubtitle}>
              Protect your account even if your password is compromised
            </Text>
          </View>
        </View>
        
        <View style={localStyles.infoItem}>
          <Ionicons name="phone-portrait-outline" size={24} color={colors.primary} />
          <View style={localStyles.infoTextContainer}>
            <Text style={localStyles.infoTitle}>Authenticator App</Text>
            <Text style={localStyles.infoSubtitle}>
              Use an app like Google Authenticator or Authy
            </Text>
          </View>
        </View>
        
        <View style={localStyles.infoItem}>
          <Ionicons name="key-outline" size={24} color={colors.primary} />
          <View style={localStyles.infoTextContainer}>
            <Text style={localStyles.infoTitle}>One-Time Codes</Text>
            <Text style={localStyles.infoSubtitle}>
              Generate unique codes that expire after use
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleSetupTwoFactor}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.buttonText}>Setting up...</Text>
        ) : (
          <Text style={styles.buttonText}>Set Up Two-Factor Authentication</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.buttonSecondary, localStyles.skipButton]}
        onPress={handleSkip}
      >
        <Text style={styles.buttonTextSecondary}>Skip for now</Text>
      </TouchableOpacity>
    </>
  );
  
  const renderQRCodeStep = () => (
    <>
      <Text style={localStyles.title}>Scan QR Code</Text>
      <Text style={localStyles.subtitle}>
        Scan this QR code with your authenticator app
      </Text>
      
      <View style={localStyles.qrCodeContainer}>
        <QRCode
          value={`otpauth://totp/AuthDemo:user@example.com?secret=${secretKey}&issuer=AuthDemo`}
          size={200}
          color="#000000"
          backgroundColor="#FFFFFF"
        />
      </View>
      
      <View style={localStyles.secretKeyContainer}>
        <Text style={localStyles.secretKeyLabel}>Or enter this key manually:</Text>
        <View style={localStyles.secretKeyRow}>
          <Text style={localStyles.secretKey}>{secretKey}</Text>
          <TouchableOpacity onPress={copySecretKey} style={localStyles.copyButton}>
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => setStep(3)}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
  
  const handleCodeChange = (text, index) => {
    // Update code array
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    // Combine for verification code
    setVerificationCode(newCode.join(''));
    
    // Auto advance to next input
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  const renderVerifyCodeStep = () => (
    <>
      <Text style={localStyles.title}>Verify</Text>
      <Text style={localStyles.subtitle}>
        Enter the 6-digit code from your authenticator app
      </Text>
      
      {error ? (
        <View style={localStyles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <Text style={localStyles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <View style={localStyles.codeInputsContainer}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={localStyles.codeInput}
            maxLength={1}
            keyboardType="number-pad"
            value={code[index]}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && index > 0 && !code[index]) {
                inputRefs.current[index - 1].focus();
              }
            }}
          />
        ))}
      </View>
      
      <TouchableOpacity
        style={[
          styles.button,
          verificationCode.length !== 6 && localStyles.buttonDisabled,
        ]}
        onPress={handleVerifyCode}
        disabled={verificationCode.length !== 6 || loading}
      >
        {loading ? (
          <Text style={styles.buttonText}>Verifying...</Text>
        ) : (
          <Text style={styles.buttonText}>Verify Code</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.buttonSecondary, localStyles.skipButton]}
        onPress={handleSkip}
      >
        <Text style={styles.buttonTextSecondary}>Skip for now</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />
      
      <ScrollView
        contentContainerStyle={localStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {success ? (
          <View style={localStyles.successContainer}>
            <View style={localStyles.successContainer}>
  <ActivityIndicator size="large" color="#6200EE" />
  <Ionicons name="mail-outline" size={60} color="#6200EE" style={{ marginTop: 20 }} />
  <Ionicons name="checkmark-circle" size={30} color="#4CAF50" style={{ position: 'absolute', top: 50, right: 140 }} />
</View>
            <Text style={localStyles.successText}>Setup Complete!</Text>
            <Text style={localStyles.successSubtext}>
              Your account is now protected with two-factor authentication
            </Text>
          </View>
        ) : (
          <>
            <View style={localStyles.header}>
              <TouchableOpacity
                style={localStyles.backButton}
                onPress={() => {
                  if (step === 1) {
                    navigation.goBack();
                  } else {
                    setStep(step - 1);
                  }
                }}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <View style={localStyles.logoContainer}>
  <Ionicons name="shield-checkmark" size={24} color="#6200EE" />
</View>
            </View>
            
            <View style={localStyles.stepIndicator}>
              <View
                style={[
                  localStyles.stepDot,
                  step >= 1 && localStyles.stepDotActive,
                ]}
              />
              <View
                style={[
                  localStyles.stepLine,
                  step >= 2 && localStyles.stepLineActive,
                ]}
              />
              <View
                style={[
                  localStyles.stepDot,
                  step >= 2 && localStyles.stepDotActive,
                ]}
              />
              <View
                style={[
                  localStyles.stepLine,
                  step >= 3 && localStyles.stepLineActive,
                ]}
              />
              <View
                style={[
                  localStyles.stepDot,
                  step >= 3 && localStyles.stepDotActive,
                ]}
              />
            </View>
            
            <View style={localStyles.content}>
              {step === 1 && renderIntroStep()}
              {step === 2 && renderQRCodeStep()}
              {step === 3 && renderVerifyCodeStep()}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const localStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
    marginBottom: 20,
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
  stepLineActive: {
    backgroundColor: '#6200EE',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  introImageContainer: {
    marginBottom: 30,
  },
  introImage: {
    width: 200,
    height: 200,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: 'rgba(98, 0, 238, 0.05)',
    borderRadius: 10,
    padding: 16,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  skipButton: {
    marginTop: 12,
  },
  qrCodeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  secretKeyContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  secretKeyLabel: {
    marginBottom: 8,
    color: '#888',
  },
  secretKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 0, 238, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secretKey: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 16,
    letterSpacing: 2,
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  codeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#6200EE',
    borderRadius: 8,
    marginHorizontal: 5,
    fontSize: 24,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    textAlign: 'center',
  },
});

export default TwoFactorAuthScreen;