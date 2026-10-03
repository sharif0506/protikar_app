import { apiFetch } from './api';

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}

export type UserRole =
  | 'DIAGNOSTIC_CENTER_OWNER'
  | 'PATIENT'
  | 'DOCTOR';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    isPhoneNumberVerified: boolean;
  };
  patient: null | { id: string };
  diagnosticCenter: null | { id: string; centerName: string };
}

export interface DiagnosticRegisterPayload {
  centerName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    phoneNumber: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    isPhoneNumberVerified: boolean;
  };
  diagnosticCenter: { id: string; centerName: string };
}

export function login(payload: LoginPayload) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function sendOtp(phoneNumber: string) {
  return apiFetch<SendOtpResponse>('/auth/otp/send', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  });
}

export function registerDiagnosticCenter(payload: DiagnosticRegisterPayload) {
  return apiFetch<RegisterResponse>('/auth/register/diagnostic-center', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
