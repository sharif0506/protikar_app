export type UserRole = 'user' | 'doctor' | 'diagnostic';

export interface RegisterFormData {
  fullName: string;
  centerName: string;
  mobile: string;
  email: string;
  license: string;
  password: string;
  confirm: string;
}