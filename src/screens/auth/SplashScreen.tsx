import React from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import PulseDot from '../../components/common/PulseDot';
import Typewriter from '../../components/common/Typewriter';
import useSplashAnimation from '../../hooks/useSplashAnimation';
import Colors from '../../theme/colors';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const anim = useSplashAnimation(onFinish);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: anim.screenOpacity, transform: [{ scale: anim.screenScale }] },
      ]}>

      <Animated.View
        style={[
          styles.logoCard,
          { opacity: anim.cardOpacity, transform: [{ scale: anim.cardScale }] },
        ]}>
        <Image
          source={require('../../../assets/images/protikar_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.accentLine, { width: anim.lineWidth }]} />

      <Animated.Text
        style={[
          styles.title,
          { opacity: anim.titleOpacity, transform: [{ translateX: anim.titleTranslateX }] },
        ]}>
        Protikar AI
      </Animated.Text>

      <Typewriter
        text="Your healthcare, in hand"
        startDelay={620}
        charSpeed={38}
        style={styles.tagline}
      />

      <View style={styles.dotsRow}>
        <PulseDot delay={700} />
        <PulseDot delay={900} />
        <PulseDot delay={1100} />
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCard: {
    width: 136,
    height: 136,
    borderRadius: 38,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
  },
  logo: {
    width: 92,
    height: 92,
  },
  accentLine: {
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 99,
    marginTop: 22,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.main,
    letterSpacing: 0.4,
    marginTop: 16,
  },
  tagline: {
    fontSize: 15,
    color: Colors.secondary,
    marginTop: 8,
    letterSpacing: 0.2,
    minHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 48,
  },
});