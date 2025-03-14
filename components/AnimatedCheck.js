// components/AnimatedCheck.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const AnimatedCheck = ({ size = 100, color = '#4CAF50' }) => {
  // Animation values
  const circleScale = useRef(new Animated.Value(0)).current;
  const checkStroke1 = useRef(new Animated.Value(0)).current;
  const checkStroke2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // First animate the circle scaling up
      Animated.timing(circleScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      },[circleScale, checkStroke1, checkStroke2]),
      // Then animate the first check stroke
      Animated.timing(checkStroke1, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Finally animate the second check stroke
      Animated.timing(checkStroke2, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate dimensions based on size
  const circleSize = size;
  const strokeWidth = size * 0.08;
  const checkWidth = size * 0.5;
  const checkHeight = size * 0.25;

  // Calculate check mark positions
  const checkX = size * 0.25;
  const checkY = size * 0.5;

  // Interpolated values for animations
  const circleOpacity = circleScale.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 0.2],
  });

  const checkStroke1Width = checkStroke1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, checkHeight],
  });

  const checkStroke2Width = checkStroke2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, checkWidth],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Animated circle background */}
      <Animated.View
        style={[
          styles.circle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: color,
            opacity: circleOpacity,
            transform: [{ scale: circleScale }],
          },
        ]}
      />

      {/* Animated check mark */}
      <View style={styles.checkContainer}>
        {/* First stroke (the small part of the check) */}
        <Animated.View
          style={[
            styles.checkStroke,
            {
              width: checkStroke1Width,
              height: strokeWidth,
              backgroundColor: color,
              left: checkX,
              top: checkY + checkHeight - strokeWidth,
              transform: [
                { translateY: -checkHeight / 2 },
                { rotate: '45deg' },
                { translateY: checkHeight / 2 },
              ],
            },
          ]}
        />

        {/* Second stroke (the long part of the check) */}
        <Animated.View
          style={[
            styles.checkStroke,
            {
              width: checkStroke2Width,
              height: strokeWidth,
              backgroundColor: color,
              left: checkX,
              top: checkY,
              transform: [
                { translateY: -strokeWidth / 2 },
                { rotate: '-45deg' },
                { translateY: strokeWidth / 2 },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  checkContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  checkStroke: {
    position: 'absolute',
    borderRadius: 10,
  },
});

export default AnimatedCheck;