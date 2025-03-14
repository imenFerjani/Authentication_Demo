// screens/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,ActivityIndicator,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const { styles, colors } = useTheme();
  const { user, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await updateProfile({ name });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setEditing(false);
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setError('');
    setEditing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={localStyles.scrollContent}>
          <View style={localStyles.header}>
            <TouchableOpacity
              style={localStyles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={localStyles.headerTitle}>Profile</Text>
            {!editing && (
              <TouchableOpacity
                style={localStyles.editButton}
                onPress={() => setEditing(true)}
              >
                <Ionicons name="create-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {success ? (
            <View style={localStyles.successContainer}>
              <View style={localStyles.successContainer}>
  <ActivityIndicator size="large" color="#6200EE" />
  <Ionicons name="mail-outline" size={60} color="#6200EE" style={{ marginTop: 20 }} />
  <Ionicons name="checkmark-circle" size={30} color="#4CAF50" style={{ position: 'absolute', top: 50, right: 140 }} />
</View>
              <Text style={localStyles.successText}>Profile Updated!</Text>
            </View>
          ) : (
            <>
              <View style={localStyles.profileHeader}>
                <View style={localStyles.avatarContainer}>
                  <View style={localStyles.avatar}>
                    <Text style={localStyles.avatarText}>
                      {name.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  {editing && (
                    <TouchableOpacity style={localStyles.changeAvatarButton}>
                      <Ionicons name="camera" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
                {!editing && <Text style={localStyles.nameText}>{user?.name}</Text>}
              </View>

              {error ? (
                <View style={localStyles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color={colors.error} />
                  <Text style={localStyles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={localStyles.formContainer}>
                <View style={localStyles.inputGroup}>
                  <Text style={localStyles.inputLabel}>Full Name</Text>
                  {editing ? (
                    <View style={localStyles.inputContainer}>
                      <Ionicons name="person-outline" size={22} color={colors.textSecondary} style={localStyles.inputIcon} />
                      <TextInput
                        style={[styles.input, localStyles.input]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                  ) : (
                    <View style={localStyles.infoContainer}>
                      <Ionicons name="person" size={22} color={colors.primary} style={localStyles.infoIcon} />
                      <Text style={localStyles.infoText}>{user?.name}</Text>
                    </View>
                  )}
                </View>

                <View style={localStyles.inputGroup}>
                  <Text style={localStyles.inputLabel}>Email Address</Text>
                  <View style={localStyles.infoContainer}>
                    <Ionicons name="mail" size={22} color={colors.primary} style={localStyles.infoIcon} />
                    <Text style={localStyles.infoText}>{user?.email}</Text>
                  </View>
                  {!editing && (
                    <Text style={localStyles.emailNote}>
                      Email address cannot be changed
                    </Text>
                  )}
                </View>

                <View style={localStyles.inputGroup}>
                  <Text style={localStyles.inputLabel}>Account Type</Text>
                  <View style={localStyles.infoContainer}>
                    <Ionicons name="shield" size={22} color={colors.primary} style={localStyles.infoIcon} />
                    <Text style={localStyles.infoText}>{user?.role || 'Standard'}</Text>
                  </View>
                </View>

                {editing && (
                  <View style={localStyles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.buttonSecondary, localStyles.cancelButton]}
                      onPress={handleCancel}
                    >
                      <Text style={styles.buttonTextSecondary}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, localStyles.saveButton]}
                      onPress={handleSave}
                      disabled={loading}
                    >
                      {loading ? (
                        <Text style={styles.buttonText}>Saving...</Text>
                      ) : (
                        <Text style={styles.buttonText}>Save Changes</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={localStyles.securitySection}>
                <Text style={localStyles.sectionTitle}>Security Settings</Text>
                <TouchableOpacity
                  style={localStyles.securityItem}
                  onPress={() => navigation.navigate('SecuritySettings')}
                >
                  <Ionicons name="lock-closed" size={22} color={colors.primary} style={localStyles.securityIcon} />
                  <View style={localStyles.securityItemContent}>
                    <Text style={localStyles.securityItemTitle}>Authentication Methods</Text>
                    <Text style={localStyles.securityItemSubtitle}>
                      Manage biometric, PIN, and two-factor authentication
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
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
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200EE',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    flex: 1,
  },
  emailNote: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  securitySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
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
  securityIcon: {
    marginRight: 16,
  },
  securityItemContent: {
    flex: 1,
  },
  securityItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  securityItemSubtitle: {
    fontSize: 14,
    color: '#757575',
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
});

export default ProfileScreen;