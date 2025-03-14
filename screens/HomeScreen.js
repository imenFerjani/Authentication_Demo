// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const { styles, colors, theme, toggleTheme } = useTheme();
  const { user, authMethods, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getAuthMethodsEnabled = () => {
    const methods = [];
    if (authMethods.biometric) methods.push('Biometric');
    if (authMethods.pin) methods.push('PIN');
    if (authMethods.twoFactor) methods.push('2FA');

    return methods.length > 0 ? methods.join(', ') : 'None';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />

      <View style={localStyles.header}>
        <View style={localStyles.headerLeft}>
          <View style={localStyles.logoContainer}>
  <Ionicons name="shield-checkmark" size={24} color="#6200EE" />
</View>
          <Text style={localStyles.headerTitle}>Auth Demo</Text>
        </View>

        <View style={localStyles.headerRight}>
          <TouchableOpacity style={localStyles.themeToggle} onPress={toggleTheme}>
            <Ionicons
              name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        <View style={localStyles.welcomeSection}>
          <Text style={localStyles.welcomeText}>
            Welcome, <Text style={localStyles.nameText}>{user?.name || 'User'}</Text>
          </Text>
          <Text style={localStyles.subtitle}>
            Your authentication demo dashboard
          </Text>
        </View>

        <View style={localStyles.infoCard}>
          <View style={localStyles.infoCardHeader}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            <Text style={localStyles.infoCardTitle}>Authentication Status</Text>
          </View>

          <View style={localStyles.infoCardContent}>
            <View style={localStyles.infoRow}>
              <Text style={localStyles.infoLabel}>Email:</Text>
              <Text style={localStyles.infoValue}>{user?.email || 'Not set'}</Text>
            </View>
            
            <View style={localStyles.infoRow}>
              <Text style={localStyles.infoLabel}>Auth Methods:</Text>
              <Text style={localStyles.infoValue}>{getAuthMethodsEnabled()}</Text>
            </View>
            
            <View style={localStyles.infoRow}>
              <Text style={localStyles.infoLabel}>Account Type:</Text>
              <Text style={localStyles.infoValue}>{user?.role || 'Standard'}</Text>
            </View>
          </View>
        </View>

        <View style={localStyles.actionsSection}>
          <Text style={localStyles.sectionTitle}>Security Settings</Text>

          <View style={localStyles.actionCards}>
            <TouchableOpacity
              style={localStyles.actionCard}
              onPress={() => navigation.navigate('SecuritySettings')}
            >
              <View style={localStyles.actionIconContainer}>
                <Ionicons name="finger-print" size={28} color="#FFFFFF" />
              </View>
              <Text style={localStyles.actionTitle}>Biometric Settings</Text>
              <Text style={localStyles.actionSubtitle}>
                {authMethods.biometric ? 'Enabled' : 'Disabled'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={localStyles.actionCard}
              onPress={() => navigation.navigate('SecuritySettings')}
            >
              <View style={[localStyles.actionIconContainer, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="keypad" size={28} color="#FFFFFF" />
              </View>
              <Text style={localStyles.actionTitle}>PIN Settings</Text>
              <Text style={localStyles.actionSubtitle}>
                {authMethods.pin ? 'Enabled' : 'Disabled'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={localStyles.actionCard}
              onPress={() => navigation.navigate('SecuritySettings')}
            >
              <View style={[localStyles.actionIconContainer, { backgroundColor: '#FF9800' }]}>
                <Ionicons name="key" size={28} color="#FFFFFF" />
              </View>
              <Text style={localStyles.actionTitle}>Two-Factor Auth</Text>
              <Text style={localStyles.actionSubtitle}>
                {authMethods.twoFactor ? 'Enabled' : 'Disabled'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={localStyles.actionCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={[localStyles.actionIconContainer, { backgroundColor: '#9C27B0' }]}>
                <Ionicons name="person" size={28} color="#FFFFFF" />
              </View>
              <Text style={localStyles.actionTitle}>Profile Settings</Text>
              <Text style={localStyles.actionSubtitle}>Update your info</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={localStyles.educationSection}>
          <Text style={localStyles.sectionTitle}>Learn About Authentication</Text>

          <View style={localStyles.educationCard}>
            <View style={localStyles.educationCardHeader}>
              <Ionicons name="school" size={24} color={colors.primary} />
              <Text style={localStyles.educationCardTitle}>Authentication Methods</Text>
            </View>
            
            <Text style={localStyles.educationCardText}>
              Strong authentication typically relies on multiple factors:
            </Text>
            
            <View style={localStyles.educationItem}>
              <Text style={localStyles.educationItemTitle}>• Something you know</Text>
              <Text style={localStyles.educationItemText}>
                Passwords, PINs, security questions
              </Text>
            </View>
            
            <View style={localStyles.educationItem}>
              <Text style={localStyles.educationItemTitle}>• Something you have</Text>
              <Text style={localStyles.educationItemText}>
                Mobile device, hardware token, authenticator app
              </Text>
            </View>
            
            <View style={localStyles.educationItem}>
              <Text style={localStyles.educationItemTitle}>• Something you are</Text>
              <Text style={localStyles.educationItemText}>
                Fingerprint, facial recognition, voice
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={localStyles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={localStyles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginRight: 16,
  },
  profileButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nameText: {
    color: '#6200EE',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  infoCardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 16,
    color: '#757575',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  educationSection: {
    marginBottom: 30,
  },
  educationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  educationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  educationCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  educationCardText: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 16,
  },
  educationItem: {
    marginBottom: 12,
  },
  educationItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  educationItemText: {
    fontSize: 14,
    color: '#757575',
    paddingLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default HomeScreen;