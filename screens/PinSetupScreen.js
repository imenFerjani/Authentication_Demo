// screens/PinSetupScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,ActivityIndicator,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const PinSetupScreen = ({ navigation }) => {
  const { styles, colors } = useTheme();
  const { setupPin } = useAuth();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1); // 1: Set PIN, 2: Confirm PIN
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Animation
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  const handlePinChange = (value) => {
    if (step === 1) {
      if (value.length <= 4) {
        setPin(value);
      }
    } else {
      if (value.length <= 4) {
        setConfirmPin(value);
      }
    }
  };

  const handleNext = () => {
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      shakeError();
      return;
    }

    setStep(2);
    setError('');
  };

  const handleConfirm = async () => {
    if (confirmPin.length !== 4) {
      setError('PIN must be 4 digits');
      shakeError();
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      setConfirmPin('');
      shakeError();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await setupPin(pin);

      if (result.success) {
        setSuccess(true);
        animateSuccess();

        // Navigate to 2FA setup after a short delay
        setTimeout(() => {
          navigation.navigate('TwoFactorAuth');
        }, 1500);
      } else {
        setError(result.error);
        shakeError();
      }
    } catch (error) {
      setError('Failed to set up PIN');
      console.error(error);
      shakeError();
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('TwoFactorAuth');
  };

  const shakeError = () => {
    Vibration.vibrate(400);
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const animateSuccess = () => {
    Animated.sequence([
      Animated.timing(successScale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(successScale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const renderPinDots = () => {
    const currentPin = step === 1 ? pin : confirmPin;
    return (
      <Animated.View
        style={[
          localStyles.dotsContainer,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
      >
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            style={[
              localStyles.pinDot,
              index < currentPin.length && localStyles.pinDotFilled,
              error && localStyles.pinDotError,
            ]}
          />
        ))}
      </Animated.View>
    );
  };

  const renderNumpad = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'backspace', 0, 'skip'];
    return (
      <View style={localStyles.numpadContainer}>
        {numbers.map((num, index) => {
          if (num === 'backspace') {
            return (
              <TouchableOpacity
                key={index}
                style={localStyles.numpadButton}
                onPress={() => {
                  if (step === 1) {
                    setPin(pin.slice(0, -1));
                  } else {
                    setConfirmPin(confirmPin.slice(0, -1));
                  }
                }}
              >
                <Ionicons name="backspace" size={24} color={colors.text} />
              </TouchableOpacity>
            );
          } else if (num === 'skip') {
            return (
              <TouchableOpacity
                key={index}
                style={localStyles.numpadButton}
                onPress={handleSkip}
              >
                <Text style={localStyles.skipText}>Skip</Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                style={localStyles.numpadButton}
                onPress={() => {
                  const currentPin = step === 1 ? pin : confirmPin;
                  if (currentPin.length < 4) {
                    handlePinChange(currentPin + num);
                  }
                }}
              >
                <Text style={localStyles.numpadText}>{num}</Text>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />

      <View style={localStyles.header}>
        <TouchableOpacity
          style={localStyles.backButton}
          onPress={() => {
            if (step === 1) {
              navigation.goBack();
            } else {
              setStep(1);
              setError('');
              setConfirmPin('');
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={localStyles.logoContainer}>
  <Ionicons name="shield-checkmark" size={32} color="#6200EE" />
</View>
      </View>

      <View style={localStyles.content}>
        {success ? (
          <Animated.View
            style={[
              localStyles.successContainer,
              { transform: [{ scale: successScale }] },
            ]}
          >
            <View style={localStyles.successContainer}>
  <ActivityIndicator size="large" color="#6200EE" />
  <Ionicons name="mail-outline" size={60} color="#6200EE" style={{ marginTop: 20 }} />
  <Ionicons name="checkmark-circle" size={30} color="#4CAF50" style={{ position: 'absolute', top: 50, right: 140 }} />
</View>
            <Text style={localStyles.successText}>PIN Set Successfully!</Text>
            <Text style={localStyles.successSubtext}>Setting up two-factor authentication...</Text>
          </Animated.View>
        ) : (
          <>
            <Text style={localStyles.title}>
              {step === 1 ? 'Create PIN' : 'Confirm PIN'}
            </Text>
            <Text style={localStyles.subtitle}>
              {step === 1
                ? 'Set a 4-digit PIN to secure your account'
                : 'Enter the same PIN again to confirm'}
            </Text>

            {error ? (
              <View style={localStyles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={localStyles.errorText}>{error}</Text>
              </View>
            ) : null}

            {renderPinDots()}

            <TextInput
              style={localStyles.hiddenInput}
              keyboardType="number-pad"
              maxLength={4}
              autoFocus={true}
              value={step === 1 ? pin : confirmPin}
              onChangeText={handlePinChange}
            />

            {step === 1 ? (
              <TouchableOpacity
                style={[
                  styles.button,
                  localStyles.nextButton,
                  pin.length !== 4 && localStyles.buttonDisabled,
                ]}
                onPress={handleNext}
                disabled={pin.length !== 4}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.button,
                  localStyles.nextButton,
                  confirmPin.length !== 4 && localStyles.buttonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={confirmPin.length !== 4 || loading}
              >
                {loading ? (
                  <Text style={styles.buttonText}>Setting up...</Text>
                ) : (
                  <Text style={styles.buttonText}>Confirm PIN</Text>
                )}
              </TouchableOpacity>
            )}

            {renderNumpad()}

            <TouchableOpacity
              style={localStyles.skipContainer}
              onPress={handleSkip}
            >
              <Text style={localStyles.skipButtonText}>Skip PIN Setup</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
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
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6200EE',
    marginHorizontal: 10,
  },
  pinDotFilled: {
    backgroundColor: '#6200EE',
  },
  pinDotError: {
    borderColor: '#D32F2F',
    backgroundColor: 'transparent',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  nextButton: {
    width: '80%',
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  numpadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
  },
  numpadButton: {
    width: '33.33%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  numpadText: {
    fontSize: 28,
    fontWeight: '500',
  },
  skipText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '500',
  },
  skipContainer: {
    marginTop: 20,
  },
  skipButtonText: {
    color: '#6200EE',
    fontSize: 16,
    textDecorationLine: 'underline',
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

export default PinSetupScreen;