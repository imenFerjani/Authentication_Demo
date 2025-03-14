// screens/ForgotPasswordScreen.js
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
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotPasswordScreen = ({ navigation }) => {
  const { styles, colors } = useTheme();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setSuccessMessage(result.message || 'Reset instructions sent!');
        setSuccess(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />

      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        <View style={localStyles.header}>
          <TouchableOpacity
            style={localStyles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={localStyles.logoContainer}>
            <Ionicons name="shield-checkmark" size={24} color="#6200EE" />
          </View>
        </View>

        {success ? (
          <View style={localStyles.successContainer}>
            <View style={localStyles.successContainer}>
  <ActivityIndicator size="large" color="#6200EE" />
  <Ionicons name="mail-outline" size={60} color="#6200EE" style={{ marginTop: 20 }} />
  <Ionicons name="checkmark-circle" size={30} color="#4CAF50" style={{ position: 'absolute', top: 50, right: 140 }} />
</View>
            <Text style={localStyles.successTitle}>Check Your Email</Text>
            <Text style={localStyles.successText}>{successMessage}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={localStyles.title}>Forgot Password</Text>
            <Text style={localStyles.subtitle}>
              Enter your email address and we'll send you instructions to reset
              your password
            </Text>

            {error ? (
              <View style={localStyles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={localStyles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={localStyles.formContainer}>
              <View style={localStyles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color={colors.textSecondary}
                  style={localStyles.inputIcon}
                />
                <TextInput
                  style={[styles.input, localStyles.input]}
                  placeholder="Email Address"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
                disabled={loading}>
                {loading ? (
                  <Text style={styles.buttonText}>Sending...</Text>
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={localStyles.backToLoginButton}
                onPress={() => navigation.navigate('Login')}>
                <Text style={localStyles.backToLoginText}>Back to Login</Text>
              </TouchableOpacity>
            </View>

            <View style={localStyles.infoContainer}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={localStyles.infoText}>
                If you don't receive an email within a few minutes, check your
                spam folder or try again.
              </Text>
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
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  backToLoginButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  backToLoginText: {
    color: '#6200EE',
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#757575',
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
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default ForgotPasswordScreen;
