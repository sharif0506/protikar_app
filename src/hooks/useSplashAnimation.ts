import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const HOLD_MS = 2200;

export default function useSplashAnimation(onFinish: () => void) {
  const screenOpacity   = useRef(new Animated.Value(0)).current;
  const screenScale     = useRef(new Animated.Value(1)).current;
  const cardOpacity     = useRef(new Animated.Value(0)).current;
  const cardScale       = useRef(new Animated.Value(0.82)).current;
  const lineWidth       = useRef(new Animated.Value(0)).current;
  const titleOpacity    = useRef(new Animated.Value(0)).current;
  const titleTranslateX = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(cardScale,   { toValue: 1, duration: 420, useNativeDriver: true }),
    ]).start();

    const lineTimer = setTimeout(() => {
      Animated.timing(lineWidth, { toValue: 80, duration: 380, useNativeDriver: false }).start();
    }, 320);

    const titleTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity,    { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(titleTranslateX, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }, 420);

    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(screenOpacity, { toValue: 0, duration: 480, useNativeDriver: true }),
        Animated.timing(screenScale,   { toValue: 1.06, duration: 480, useNativeDriver: true }),
      ]).start(() => onFinish());
    }, HOLD_MS);

    return () => {
      clearTimeout(lineTimer);
      clearTimeout(titleTimer);
      clearTimeout(exitTimer);
    };
  }, [
    cardOpacity, cardScale, lineWidth, onFinish,
    screenOpacity, screenScale, titleOpacity, titleTranslateX,
  ]);

  return { screenOpacity, screenScale, cardOpacity, cardScale, lineWidth, titleOpacity, titleTranslateX };
}