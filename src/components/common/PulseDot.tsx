import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

interface Props {
  delay: number;
}

export default function PulseDot({ delay }: Props) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.5, duration: 350, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.6, duration: 350, useNativeDriver: true }),
          Animated.delay(400),
        ]),
      ).start();
    }, delay);

    return () => clearTimeout(t);
  }, [delay, opacity, scale]);

  return <Animated.View style={[styles.dot, { opacity, transform: [{ scale }] }]} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});