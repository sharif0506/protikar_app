import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginResponse, login } from '../../services/authService';
import Colors from '../../theme/colors';

const T = Colors;

interface Props {
  onRegister?: () => void;
  onLoginSuccess?: (data: LoginResponse) => void;
}

export default function LoginScreen({ onRegister, onLoginSuccess }: Props) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const phoneValid = phone.replace(/\D/g, '').length >= 9;

  const handleLogin = async () => {
    if (!phoneValid || !password) return;
    setError('');
    setLoading(true);
    try {
      const data = await login({ phoneNumber: `+880${phone}`, password });
      onLoginSuccess?.(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Brand */}
          <View style={styles.brand}>
            <Image
              source={require('../../../assets/images/protikar_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Protikar AI</Text>
            <Text style={styles.tagline}>Your healthcare, in hand</Text>
          </View>

          {/* Sign-in card */}
          <View style={styles.card}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.subText}>
                Sign in with your mobile number to continue.
              </Text>
            </View>

            <View style={styles.fields}>
              {/* Phone field */}
              <View style={styles.field}>
                <Text style={styles.fieldIcon}>✆</Text>
                <Text style={styles.prefix}>+880</Text>
                <Text style={styles.separator}>|</Text>
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="171-000-0000"
                  placeholderTextColor={T.disable}
                />
                <View style={[styles.checkCircle, phoneValid && styles.checkCircleValid]}>
                  {phoneValid && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </View>

              {/* Password field */}
              <View style={styles.field}>
                <Text style={styles.fieldIcon}>⚿</Text>
                <TextInput
                  style={styles.textInputFlex}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                  placeholder="Password"
                  placeholderTextColor={T.disable}
                />
                <TouchableOpacity onPress={() => setShowPw(v => !v)}>
                  <Text style={styles.eyeIcon}>
                    {showPw ? '◎' : '⊙'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Remember / Forgot */}
              <View style={styles.rememberRow}>
                <TouchableOpacity
                  style={styles.rememberLeft}
                  onPress={() => setRemember(v => !v)}>
                  <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                    {remember && <Text style={styles.checkboxTick}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>Remember Password</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Login button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}>
              <Text style={styles.loginBtnText}>{loading ? 'Signing in…' : 'Login in'}</Text>
              {!loading && <Text style={styles.arrowText}>→</Text>}
            </TouchableOpacity>
          </View>

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>haven't any account? </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </KeyboardAvoidingView>

      {/* Secure & Trusted footer — outside KAV so keyboard never moves it */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.shieldIcon}>⛨</Text>
          <Text style={styles.footerSecure}>Secure &amp; Trusted</Text>
        </View>
        <Text style={styles.footerUrl}>www.protikar.ai</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  brand: {
    alignItems: 'center',
    paddingTop: 36,
    marginBottom: 24,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: T.main,
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 13,
    color: T.secondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: T.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: T.border,
    padding: 24,
    gap: 24,
    shadowColor: T.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.11,
    shadowRadius: 16,
    elevation: 6,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: T.main,
    lineHeight: 28,
  },
  subText: {
    fontSize: 14,
    color: T.secondary,
    lineHeight: 22,
    marginTop: 4,
  },
  fields: {
    gap: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.field,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 4,
  },
  fieldIcon: {
    fontSize: 20,
    color: T.secondary,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '500',
    color: T.primary,
  },
  separator: {
    fontSize: 16,
    color: T.secondary,
    opacity: 0.5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: T.secondary,
    padding: 0,
  },
  textInputFlex: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: T.secondary,
    padding: 0,
  },
  eyeIcon: {
    fontSize: 20,
    color: T.secondary,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleValid: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  checkMark: {
    color: T.white,
    fontSize: 14,
    fontWeight: '700',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  checkboxTick: {
    color: T.white,
    fontSize: 13,
    fontWeight: '700',
  },
  rememberText: {
    fontSize: 15,
    color: T.primary,
  },
  forgotText: {
    fontSize: 15,
    color: T.primary,
  },
  errorText: {
    fontSize: 13,
    color: '#E53935',
    textAlign: 'center',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
  },
  loginBtnDisabled: {
    opacity: 0.75,
  },
  loginBtnText: {
    fontSize: 17,
    fontWeight: '500',
    color: T.white,
  },
  arrowText: {
    fontSize: 20,
    color: T.white,
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 15,
    color: T.secondary,
  },
  signupLink: {
    fontSize: 15,
    fontWeight: '600',
    color: T.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.light,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shieldIcon: {
    fontSize: 24,
  },
  footerSecure: {
    fontSize: 15,
    color: T.main,
  },
  footerUrl: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.5)',
  },
});