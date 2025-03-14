// components/PasswordStrengthIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PasswordStrengthIndicator = ({ strength }) => {
  // Determine the color and text based on strength
  const getColor = () => {
    if (strength < 25) return '#F44336'; // Red
    if (strength < 50) return '#FF9800'; // Orange
    if (strength < 75) return '#FFC107'; // Yellow
    return '#4CAF50'; // Green
  };

  const getStrengthText = () => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  const strengthBarWidth = `${strength}%`;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.strengthBar,
            { width: strengthBarWidth, backgroundColor: getColor() },
          ]}
        />
      </View>
      <Text style={[styles.strengthText, { color: getColor() }]}>
        {getStrengthText()} Password
      </Text>
      
      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Password must contain:</Text>
        <View style={styles.requirementItem}>
          <View
            style={[
              styles.bullet,
              { backgroundColor: strength >= 25 ? '#4CAF50' : '#CCCCCC' },
            ]}
          />
          <Text style={styles.requirementText}>At least 8 characters</Text>
        </View>
        <View style={styles.requirementItem}>
          <View
            style={[
              styles.bullet,
              { backgroundColor: strength >= 50 ? '#4CAF50' : '#CCCCCC' },
            ]}
          />
          <Text style={styles.requirementText}>At least one uppercase letter</Text>
        </View>
        <View style={styles.requirementItem}>
          <View
            style={[
              styles.bullet,
              { backgroundColor: strength >= 75 ? '#4CAF50' : '#CCCCCC' },
            ]}
          />
          <Text style={styles.requirementText}>At least one number</Text>
        </View>
        <View style={styles.requirementItem}>
          <View
            style={[
              styles.bullet,
              { backgroundColor: strength >= 100 ? '#4CAF50' : '#CCCCCC' },
            ]}
          />
          <Text style={styles.requirementText}>At least one special character</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  barContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  requirementsContainer: {
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  requirementText: {
    fontSize: 12,
    color: '#757575',
  },
});

export default PasswordStrengthIndicator;