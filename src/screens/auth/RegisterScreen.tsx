import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';
import { registerDiagnosticCenter, sendOtp } from '../../services/authService';
import { RegisterFormData, UserRole } from '../../types/auth';
import DiagnosticForm from './forms/DiagnosticForm';
import DoctorForm from './forms/DoctorForm';
import UserForm from './forms/UserForm';
import OtpVerificationScreen from './OtpVerificationScreen';

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'user', label: 'Patient' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'diagnostic', label: 'Diagnostic' },
];

const INITIAL_FORM: RegisterFormData = {
  fullName: '',
  centerName: '',
  mobile: '',
  email: '',
  license: '',
  password: '',
  confirm: '',
};

interface Props {
  onLogin: () => void;
}

export default function RegisterScreen({ onLogin }: Props) {
  const [role, setRole] = useState<UserRole>('user');
  const [form, setForm] = useState<RegisterFormData>(INITIAL_FORM);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const setField = (key: keyof RegisterFormData, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setForm(INITIAL_FORM);
    setOtpSent(false);
    setError('');
  };

  const handleSendOtp = async () => {
    if (!form.centerName) { setError('Enter the center name'); return; }
    if (!form.mobile) { setError('Enter your mobile number'); return; }
    if (!form.email) { setError('Enter your email address'); return; }
    if (!form.password) { setError('Enter a password'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (!agree) { setError('Please accept the Terms and Privacy Policy'); return; }
    setError('');
    setOtpLoading(true);
    try {
      await sendOtp(`+880${form.mobile}`);
      setOtpSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      // non-diagnostic roles (future)
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const isDiagnostic = role === 'diagnostic';

  // Show the OTP screen as a full replacement when OTP has been sent
  if (isDiagnostic && otpSent) {
    return (
      <OtpVerificationScreen
        phoneNumber={`+880${form.mobile}`}
        onResend={async () => { await sendOtp(`+880${form.mobile}`); }}
        onVerify={async (otp: string) => {
          await registerDiagnosticCenter({
            centerName: form.centerName,
            phoneNumber: `+880${form.mobile}`,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirm,
            otp,
          });
          onLogin();
        }}
        onBack={() => setOtpSent(false)}
      />
    );
  }

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

          {/* Card */}
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>Sign up</Text>
              <Text style={styles.cardSubtitle}>Welcome to your account</Text>
            </View>

            {/* Role selector */}
            <View style={styles.roleRow}>
              {ROLES.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.roleOption}
                  onPress={() => handleRoleChange(r.id)}>
                  <View style={[styles.radio, role === r.id && styles.radioActive]}>
                    {role === r.id && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.roleLabel}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Dynamic form per role */}
            {role === 'user' && <UserForm form={form} setField={setField} />}
            {role === 'doctor' && <DoctorForm form={form} setField={setField} />}
            {isDiagnostic && <DiagnosticForm form={form} setField={setField} />}

            {/* Terms */}
            <TouchableOpacity style={styles.termsRow} onPress={() => setAgree(v => !v)}>
              <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
                {agree && <Text style={styles.checkTick}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Send OTP button for diagnostic */}
            {isDiagnostic && (
              <TouchableOpacity
                style={[styles.submitBtn, otpLoading && styles.submitBtnLoading]}
                onPress={handleSendOtp}
                activeOpacity={0.85}
                disabled={otpLoading}>
                <Text style={styles.submitText}>
                  {otpLoading ? 'Sending OTP…' : 'Send OTP'}
                </Text>
                {!otpLoading && <Text style={styles.arrow}>→</Text>}
              </TouchableOpacity>
            )}

            {/* Register button for other roles */}
            {!isDiagnostic && (
              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnLoading]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={loading}>
                <Text style={styles.submitText}>
                  {loading ? 'Registering…' : 'Register'}
                </Text>
                {!loading && <Text style={styles.arrow}>→</Text>}
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  brand: {
    alignItems: 'center',
    paddingTop: 28,
    marginBottom: 20,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 8,
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
    marginTop: 2,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.main,
    lineHeight: 28,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 2,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.field,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    gap: 24,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.disable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  roleLabel: {
    fontSize: 15,
    color: Colors.main,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.disable,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkTick: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    fontSize: 15,
    color: Colors.main,
    lineHeight: 22,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '500',
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
  submitBtnLoading: {
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
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
    color: Colors.secondary,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
});