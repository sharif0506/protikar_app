import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 25;

interface Props {
  phoneNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

export default function OtpVerificationScreen({ phoneNumber, onVerify, onResend, onBack }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [timerKey, setTimerKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef<Array<React.ElementRef<typeof TextInput> | null>>(Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    setSeconds(RESEND_SECONDS);
    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerKey]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleChange = (index: number, value: string) => {
    const newDigits = [...digits];
    if (value === '') {
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }
    const digit = value.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    newDigits[index] = digit;
    setDigits(newDigits);
    if (index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      refs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resendLoading) return;
    setError('');
    setResendLoading(true);
    try {
      await onResend();
      setDigits(Array(OTP_LENGTH).fill(''));
      setTimerKey(k => k + 1);
      refs.current[0]?.focus();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async () => {
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) { setError('Enter the complete OTP'); return; }
    setError('');
    setLoading(true);
    try {
      await onVerify(otp);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Brand */}
      <View style={styles.brand}>
        <View style={styles.logoBox}>
          <Image
            source={require('../../../assets/images/protikar_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Protikar AI</Text>
        <Text style={styles.tagline}>Your healthcare, in hand</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>

        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>OTP Verification</Text>
          <Text style={styles.cardSubtitle}>
            Enter the {OTP_LENGTH}-digit OTP sent to {phoneNumber}
          </Text>
        </View>

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={el => { refs.current[i] = el; }}
              style={[styles.otpBox, !!digit && styles.otpBoxFilled]}
              value={digit}
              onChangeText={val => handleChange(i, val)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Timer + Resend */}
        <View style={styles.timerRow}>
          <Text style={styles.timer}>{formatTime(seconds)}</Text>
          <View style={styles.resendRow}>
            <Text style={styles.resendPrompt}>Didn't receive the OTP? </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={seconds > 0 || resendLoading}
              activeOpacity={0.7}>
              <Text style={[styles.resendLink, seconds > 0 && styles.resendLinkDisabled]}>
                {resendLoading ? 'Sending…' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}>
          <Text style={styles.submitText}>{loading ? 'Verifying…' : 'Submit OTP'}</Text>
          {!loading && <Text style={styles.arrow}>→</Text>}
        </TouchableOpacity>

      </View>

      {/* Back */}
      <TouchableOpacity style={styles.backRow} onPress={onBack}>
        <Text style={styles.backText}>← Back to Registration</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 20,
  },
  brand: {
    alignItems: 'center',
    paddingTop: 36,
    marginBottom: 28,
    gap: 6,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 56,
    height: 56,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.main,
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 13,
    color: Colors.secondary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.11,
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeader: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.main,
    lineHeight: 26,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.secondary,
    lineHeight: 20,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  otpBox: {
    width: 46,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.field,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.main,
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  timer: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    minWidth: 36,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  resendPrompt: {
    fontSize: 13,
    color: Colors.secondary,
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '500',
    color: '#EF5D6E',
  },
  resendLinkDisabled: {
    color: Colors.disable,
  },
  errorText: {
    fontSize: 13,
    color: '#E53935',
    textAlign: 'center',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
  },
  submitBtnDisabled: {
    opacity: 0.75,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.white,
  },
  arrow: {
    fontSize: 20,
    color: Colors.white,
  },
  backRow: {
    alignItems: 'center',
    marginTop: 24,
  },
  backText: {
    fontSize: 14,
    color: Colors.secondary,
  },
});
